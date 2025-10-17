require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

// Crea UNA sola instancia para todos los modelos
const sequelize = new Sequelize(process.env.PG_URI, {
  logging: false, // pon true si quieres ver las SQL
});

// ===== Carga de modelos =====
const Categoria      = require('./Categoria')(sequelize, DataTypes);
const Subcategoria   = require('./Subcategoria')(sequelize, DataTypes);
const Producto       = require('./Producto')(sequelize, DataTypes);
const Carrito        = require('./Carrito')(sequelize, DataTypes);
const DetalleCarrito = require('./DetalleCarrito')(sequelize, DataTypes);
const Usuario        = require('./User')(sequelize, DataTypes);

// ================== ASOCIACIONES ==================
// ----- Catálogo -----
Subcategoria.belongsTo(Categoria,   { as: 'categoria',     foreignKey: 'fk_categoria' });
Categoria.hasMany(Subcategoria,     { as: 'subcategorias', foreignKey: 'fk_categoria' });

Producto.belongsTo(Subcategoria,    { as: 'subcategoria',  foreignKey: 'fk_subcategoria' });
Subcategoria.hasMany(Producto,      { as: 'productos',     foreignKey: 'fk_subcategoria' });

// ----- Carritos -----
Carrito.belongsTo(Usuario,          { as: 'usuario',       foreignKey: 'fk_usuario' });
Usuario.hasMany(Carrito,            { as: 'carritos',      foreignKey: 'fk_usuario' });

DetalleCarrito.belongsTo(Carrito,   { as: 'carrito',       foreignKey: 'fk_carrito' });
Carrito.hasMany(DetalleCarrito,     { as: 'items',         foreignKey: 'fk_carrito' });

DetalleCarrito.belongsTo(Producto,  { as: 'producto',      foreignKey: 'fk_producto' });
Producto.hasMany(DetalleCarrito,    { as: 'detalles',      foreignKey: 'fk_producto' });

// ================== EXPORTS ==================
module.exports = {
  sequelize,
  Sequelize, // por si necesitas tipos/Op
  Categoria,
  Subcategoria,
  Producto,
  Carrito,
  DetalleCarrito,
  Usuario,
};