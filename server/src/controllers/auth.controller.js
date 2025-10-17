const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

// Firma del JWT con los campos reales de tu tabla usuarios
function sign(user) {
  return jwt.sign(
    {
      id_usuario: user.id_usuarios,   // PK en tu tabla
      nombre: user.nombre,
      correo: user.correo,
    },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: '7d' }
  );
}

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const nombre    = req.body.nombre;
    const apellidos = req.body.apellidos || '';
    const correo    = req.body.correo || req.body.email;
    const telefono  = req.body.telefono || null;
    const rawPass   = req.body.password || req.body.contrasena;

    if (!nombre || !correo || !rawPass) {
      return res.status(400).json({ error: 'faltan campos' });
    }

    const exists = await Usuario.findOne({ where: { correo } });
    if (exists) return res.status(409).json({ error: 'email ya registrado' });

    // Guardamos como hash en la columna 'contrasena'
    const contrasena = await bcrypt.hash(rawPass, 10);

    const user = await Usuario.create({
      nombre,
      apellidos,
      correo,
      telefono,
      contrasena, // <= hash bcrypt
    });

    const token = sign(user);
    res.json({
      token,
      user: {
        id_usuario: user.id_usuarios,
        nombre: user.nombre,
        correo: user.correo,
      },
    });
  } catch (e) {
    console.error('[auth.register]', e);
    next(e);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const correo  = req.body.correo || req.body.email;
    const passInp = req.body.password || req.body.contrasena;

    if (!correo || !passInp) {
      return res.status(400).json({ error: 'Faltan credenciales.' });
    }

    const user = await Usuario.findOne({ where: { correo } });
    if (!user) return res.status(401).json({ error: 'credenciales inválidas' });

    const stored = user.contrasena; // puede estar hasheada o en texto

    if (!stored) {
      return res.status(500).json({ error: 'Usuario sin contraseña configurada.' });
    }

    let ok = false;
    if (/^\$2[aby]\$/.test(stored)) {
      // bcrypt
      ok = await bcrypt.compare(passInp, stored);
    } else {
      // texto plano (temporal) + migración a bcrypt
      ok = passInp === String(stored);
      if (ok) {
        try {
          user.contrasena = await bcrypt.hash(passInp, 10);
          await user.save();
        } catch (mErr) {
          console.warn('[auth.login] No se pudo migrar a bcrypt:', mErr.message);
        }
      }
    }

    if (!ok) return res.status(401).json({ error: 'credenciales inválidas' });

    const token = sign(user);
    res.json({
      token,
      user: {
        id_usuario: user.id_usuarios,
        nombre: user.nombre,
        correo: user.correo,
      },
    });
  } catch (e) {
    console.error('[auth.login]', e);
    next(e);
  }
};

// GET /api/auth/me
exports.me = async (req, res) => {
  // lo setea el middleware
  res.json(req.user);
};

// POST /api/auth/logout
exports.logout = async (_req, res) => {
  res.status(204).send();
};
