module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Subcategoria', {
    id_subcategoria: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_subcategoria'
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'nombre'
    },
    fk_categoria: {                       // <<--- este es tu FK real
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'fk_categoria'
    }
  }, {
    tableName: 'subcategoria',
    schema: 'public',
    timestamps: false
  });
};
