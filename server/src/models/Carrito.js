module.exports = (sequelize, DataTypes) => {
  const Carrito = sequelize.define('Carrito', {
    id_carrito: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    fk_usuario: { type: DataTypes.BIGINT, allowNull: false },
  }, {
    tableName: 'carrito',
    timestamps: false,
  });
  return Carrito;
};
