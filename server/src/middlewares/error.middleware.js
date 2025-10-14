function notFound(_req, res, _next) {
  res.status(404).json({ error: 'Recurso no encontrado' });
}
function errorHandler(err, _req, res, _next) {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Error interno' });
}
module.exports = { notFound, errorHandler };
