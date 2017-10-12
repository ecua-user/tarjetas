//Dependencias necesarias______________________________________________________________________________
express = require('express')
router = express.Router()
passport = require('passport')
bcrypt = require('bcryptjs')
LocalStrategy = require('passport-local').Strategy

//Confirma la autenticación del usuario________________________________________________________________
function ensureAuthenticated(req, res, next) { 
	if (req.isAuthenticated())
		return next(); 
	else
		res.redirect('/login'); 
}

//Passport_____________________________________________________________________________________________________________________________________________
passport.use(new LocalStrategy(
	(username, password, done)=> {
		User.getUserByUsername(username, (err, user)=> {
			if (err) throw err;
			if (!user) { return done(null, false, { message: 'Usuario desconocido' }); }
			if (user.confirmado) {
				User.comparePassword(password, user.password, (err, isMatch) =>{
					if (err) throw err;
					if (isMatch) {return done(null, user);} 
					else { return done(null, false, { message: 'Contraseña incorrecta' }); }
				});
			} else {return done(null, false, { message: 'Cuenta no confirmada' });}
		});
}));

//Serializa al usuario_____________________________________________________________________________________________________________________
passport.serializeUser((user, done)=> { done(null, user.id); });

//Deserializa al usuario____________________________________________________________________________________________________________________
passport.deserializeUser((id, done)=> { User.getUserById(id,(err, user) =>{ done(err, user); }); });


//########################################  Se establecen las rutas ###################################
router.get('/login',(req,res)=>{
	res.render('login')
})

router.get('/registro',(req,res)=>{
	res.render('registro')
})
//#####################################################################################################

//Permite el enrutamiento______________________________________________________________________________
module.exports = router;
