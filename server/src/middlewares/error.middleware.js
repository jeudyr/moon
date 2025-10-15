function notFound(_req, res, _next) {
  res.status(404).json({ error: 'Not Found' });
}
function errorHandler(err, _req, res, _next) {
  console.error(err);
  res.status(500).json({ error: err.message || 'Server error' });
}
module.exports = { notFound, errorHandler };

