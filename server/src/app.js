const express = require('express');
const cors = require('cors');
const path = require('path');
const { notFound, errorHandler } = require('./middlewares/error.middleware');
const taskRoutes = require('./routes/task.routes');

const app = express();
app.use(cors());
app.use(express.json());

// Healthcheck
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// API routes
app.use('/api/tasks', taskRoutes);

// (Opcional) servir estáticos del cliente en producción
// const clientDist = path.join(__dirname, '../../client/dist');
// app.use(express.static(clientDist));
// app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));

// Errors
app.use(notFound);
app.use(errorHandler);

module.exports = app;
