const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { notFound, errorHandler } = require('./middlewares/error.middleware');

const catalogRoutes = require('./routes/catalog.routes'); // incluye catálogo + carrito

const app = express();
app.use(cors());
app.use(express.json());

// Monta TODO en /api
// Healthcheck
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Rutas
app.use('/api/auth', require('./routes/auth.routes')); // primero auth
app.use('/api', catalogRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
