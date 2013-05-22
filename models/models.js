// Modelos ORM

var path = require('path');

var Sequelize = require('sequelize');

// Usar BBDD definida en variables de entorno:
var sequelize = new Sequelize(null,null,null,
								{dialect:"sqlite",
								storage:"blog.sqlite"});

// Importar la definicion de la clase Post desde post.js.
// Y que este modulo exporta la clase Post:

exports.Post = sequelize.import(path.join(__dirname,'post'));

