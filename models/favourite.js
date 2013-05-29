
// Definicion del modelo Favourite:

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Favourite',
      { UserId: {
            type: DataTypes.INTEGER,
            validate: {
                notEmpty: { msg: "El campo userId no puede estar vacío" }
            }
        },
        PostId: {
            type: DataTypes.INTEGER,
            validate: {
                notEmpty: { msg: "El campo postId no puede estar vacío" }
            }
        }
      });
}