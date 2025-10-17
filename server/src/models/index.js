const { Sequelize, DataTypes } = require('sequelize');

// Usa tu cadena PG_URI del .env
const sequelize = new Sequelize(process.env.PG_URI, {
  dialect: 'postgres',
  logging: false
});

// Modelos
const Categoria      = require('./Categoria')(sequelize, DataTypes);
const Subcategoria   = require('./Subcategoria')(sequelize, DataTypes);
const Producto       = require('./Producto')(sequelize, DataTypes);
const Carrito        = require('./Carrito')(sequelize, DataTypes);
const DetalleCarrito = require('./DetalleCarrito')(sequelize, DataTypes);
const User           = require('./User')(sequelize, DataTypes);   // ✅

// ===== Asociaciones de catálogo =====
Subcategoria.belongsTo(Categoria, { as: 'categoria', foreignKey: 'fk_categoria' });
Producto.belongsTo(Subcategoria,  { as: 'subcategoria', foreignKey: 'fk_subcategoria' });
// Subcategoria.hasMany(Producto, { as: 'productos', foreignKey: 'fk_subcategoria' }); // opcional

// ===== Asociaciones de carrito =====
Carrito.hasMany(DetalleCarrito,   { as: 'items',    foreignKey: 'fk_carrito',   sourceKey: 'id_carrito' });
DetalleCarrito.belongsTo(Carrito, { as: 'carrito',  foreignKey: 'fk_carrito',   targetKey: 'id_carrito' });

DetalleCarrito.belongsTo(Producto,{ as: 'producto', foreignKey: 'fk_producto',  targetKey: 'id_producto' });
Producto.hasMany(DetalleCarrito,  { as: 'detalles', foreignKey: 'fk_producto',  sourceKey: 'id_producto' });

module.exports = {
  sequelize,
  Categoria,
  Subcategoria,
  Producto,
  Carrito,
  DetalleCarrito,
  User
};
