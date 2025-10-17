const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function sign(user) {
  return jwt.sign(
    { sub: user.id_usuarios, correo: user.correo },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '7d' }
  );
}

// Registro
exports.register = async (req, res) => {
  try {
    const { nombre, apellidos, correo, telefono, contrasena } = req.body;

    const existe = await User.findOne({ where: { correo } });
    if (existe) return res.status(409).json({ message: 'El correo ya existe.' });

    const hash = await bcrypt.hash(contrasena, 10);
    const nuevo = await User.create({
      nombre, apellidos, correo, telefono, contrasena: hash
    });

    const token = sign(nuevo);
    res.json({
      token,
      user: {
        id: nuevo.id_usuarios,
        nombre: nuevo.nombre,
        apellidos: nuevo.apellidos,
        correo: nuevo.correo,
        telefono: nuevo.telefono
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al registrar.' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    const user = await User.findOne({ where: { correo } });
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    const ok = await bcrypt.compare(contrasena, user.contrasena);
    if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' });

    const token = sign(user);
    res.json({
      token,
      user: {
        id: user.id_usuarios,
        nombre: user.nombre,
        apellidos: user.apellidos,
        correo: user.correo,
        telefono: user.telefono
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al iniciar sesión.' });
  }
};
