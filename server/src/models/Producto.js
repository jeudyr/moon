module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Producto', {
    id_producto: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, field: 'id_producto' },
    nombre: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    cantidad: DataTypes.INTEGER,
    precio: DataTypes.NUMERIC,
    url: DataTypes.STRING,
    color: DataTypes.STRING,
    fk_subcategoria: { type: DataTypes.INTEGER, field: 'fk_subcategoria' },
    marca: DataTypes.STRING
  }, {
    tableName: 'productos',
    schema: 'public',
    timestamps: false
  });
};

