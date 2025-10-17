const express = require('express');
const cors = require('cors');
const { notFound, errorHandler } = require('./middlewares/error.middleware');

const catalogRoutes = require('./routes/catalog.routes'); // incluye catálogo + carrito

const app = express();
app.use(cors());
app.use(express.json());

// Monta TODO en /api
app.use('/api', catalogRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
