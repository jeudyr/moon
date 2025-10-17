require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL OK');
    console.log('JWT_SECRET set?', !!process.env.JWT_SECRET);
    app.listen(PORT, () => console.log(`🚀 API en http://localhost:${PORT}`));
  } catch (e) {
    console.error('❌ No se pudo conectar a PostgreSQL', e.message);
    process.exit(1);
  }
})();
