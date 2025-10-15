module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Categoria', {
    id_categoria: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_categoria'
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'nombre'
    }
  }, {
    tableName: 'categorias',
    schema: 'public',
    timestamps: false
  });
};

