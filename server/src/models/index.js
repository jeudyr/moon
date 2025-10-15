const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.PG_URI, { dialect: 'postgres', logging: false });

const Categoria    = require('./Categoria')(sequelize, DataTypes);
const Subcategoria = require('./Subcategoria')(sequelize, DataTypes);
const Producto     = require('./Producto')(sequelize, DataTypes);

// Categoria (id_categoria) 1—N Subcategoria (fk_categoria)
Categoria.hasMany(Subcategoria, {
  as: 'subcategorias',
  foreignKey: 'fk_categoria',
  sourceKey:  'id_categoria'
});
Subcategoria.belongsTo(Categoria, {
  as: 'categoria',
  foreignKey: 'fk_categoria',
  targetKey:  'id_categoria'
});

// Subcategoria (id_subcategoria) 1—N Producto (fk_subcategoria)
Subcategoria.hasMany(Producto, {
  as: 'productos',
  foreignKey: 'fk_subcategoria',
  sourceKey:  'id_subcategoria'
});
Producto.belongsTo(Subcategoria, {
  as: 'subcategoria',
  foreignKey: 'fk_subcategoria',
  targetKey:  'id_subcategoria'
});

module.exports = { sequelize, Categoria, Subcategoria, Producto };

