require('dotenv').config();

const common = {
  dialect: 'postgres',
  logging: false,
  define: {
    underscored: true,
    freezeTableName: true
  },
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
};

module.exports = {
  development: { ...common, url: process.env.DATABASE_URL },
  test:         { ...common, url: process.env.DATABASE_URL },
  production:   { ...common, url: process.env.DATABASE_URL }
};
