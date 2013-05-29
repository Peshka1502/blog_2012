
var models = require('../models/models.js');

var userController = require('./user_controller');

/*
*  Auto-loading con app.param
*/
exports.load = function(req, res, next, id) {

   models.Favourite
        .find({where: {id: Number(id)}})
        .success(function(favourite) {
            if (favourite) {
                req.favourite = favourite;
                next();
            } else {
                req.flash('error', 'No existe el favourite con id='+id+'.');
                next('No existe el favourite con id='+id+'.');
            }
        })
        .error(function(error) {
            next(error);
        });
};

/*
* Comprueba que el usuario logeado es el usuario alque se refiere esta ruta.
*/
exports.loggedUserIsUser = function(req, res, next) {
    
   if (req.session.user && req.session.user.id == req.user.id) {
      next();
   } else {
      console.log('Ruta prohibida: no soy el usuario logeado.');
      res.send(403);
   }
};

// GET /users/25/favourites
exports.index = function(req, res, next) {

  var format = req.params.format || 'html';
  format = format.toLowerCase();

// Busqueda del array de posts favoritos de un usuario
  models.Favourite.findAll({where: {UserId: req.user.id}})
     .success(function(favourites) {

         // generar array con postIds de los post favoritos
         var postIds = favourites.map( 
                            function(favourite) 
                              {return favourite.PostId;}
                           );

        // busca los posts identificados por array postIds
        var patch;
        if (postIds.length == 0) {
            patch= '"Posts"."id" in (NULL)';
        } else {
            patch='"Posts"."id" in ('+postIds.join(',')+')';
        } 
        // busca los posts identificados por array postIds
        models.Post.findAll({order: 'updatedAt DESC',
                    where: patch, 
                    include:[{model:models.User,as:'Author'},
                    models.Favourite ]
                 })
                 .success(function(posts) {
                    switch (format) { 
                      case 'html':
                      case 'htm':
                          res.render('posts/favourites', {
                            posts: posts
                          });
                          break;
                      case 'json':
                          res.send(posts);
                          break;
                      case 'xml':
                          res.send(posts_to_xml(posts));
                          break;
                      case 'txt':
                          res.send(posts.map(function(post) {
                              return post.title+' ('+post.body+')';
                          }).join('\n'));
                          break;
                      default:
                          console.log('No se soporta el formato \".'+format+'\" pedido para \"'+req.url+'\".');
                          res.send(406);
                    }
                })
                .error(function(error) {
                    next(error);
                });
   });
}

exports.update = function(req, res , next){

    var redir = req.query.redir || ('/posts');

    var favourite = models.Favourite.build(
            { UserId: req.session.user.id,
              PostId: req.post.id
            });
    favourite.save()
        .success(function() {
            req.flash('success', 'Favorito marcado con éxito.');
            res.redirect(redir);
        })
        .error(function(error) {
            next(error);
        });
}

exports.destroy = function(req, res, next){
    
    var redir = req.query.redir || ('/posts');

    req.post.getFavourites()
      .success(function(favourites) {
          for(var i in favourites){
              if(favourites[i].UserId == req.session.user.id){
                    favourites[i].destroy();
                    req.flash('success', 'Favorito eliminado con éxito');
                    next();
              }
          }
          res.redirect(redir);
      })
      .error(function(error) {
           next(error);
      });
}