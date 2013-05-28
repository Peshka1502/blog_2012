exports.expired = function(){
	return function(req, res, next){
		if(req.session && req.session.user){

			var time = (new Date()).getTime();
			if((time - req.session.user.time) > 60000){
				delete req.session.user;
				req.flash('info', 'La sesión ha expirado.');
				res.redirect('/login?redir=' + req.url);
			}
			else{
				req.session.user.time = time;
			}
		}
		next();
	}
}