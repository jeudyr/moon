const express = require('express');
const cors = require('cors');
const { notFound, errorHandler } = require('./middlewares/error.middleware');

const catalogRoutes = require('./routes/catalog.routes');
const authRoutes    = require('./routes/auth.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', catalogRoutes);
app.use('/api/auth', authRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
