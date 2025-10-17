const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

module.exports = async function auth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token requerido' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token inválido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    const user = await Usuario.findByPk(decoded.id_usuario);
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

    req.user = {
      id_usuario: user.id_usuarios,
      nombre: user.nombre,
      correo: user.correo,
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
