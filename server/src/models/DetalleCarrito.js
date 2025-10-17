module.exports = (sequelize, DataTypes) => {
  const DetalleCarrito = sequelize.define('DetalleCarrito', {
    id_detalle_carrito: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    fk_carrito:        { type: DataTypes.BIGINT, allowNull: false },
    fk_producto:       { type: DataTypes.BIGINT, allowNull: false },
    cantidad:          { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  }, {
    tableName: 'detalles_carrito',
    timestamps: false,
  });
  return DetalleCarrito;
};
