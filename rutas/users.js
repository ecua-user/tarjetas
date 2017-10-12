//Dependencias necesarias______________________________________________________________________________
express = require('express')
router = express.Router()
passport = require('passport')
bcrypt = require('bcryptjs')
LocalStrategy = require('passport-local').Strategy

//Modelos de datos a usar
User=require('../modelos/usuarios')

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

//#region serializacion
//Serializa al usuario_____________________________________________________________________________________________________________________
passport.serializeUser((user, done)=> { done(null, user.id); });

//Deserializa al usuario____________________________________________________________________________________________________________________
passport.deserializeUser((id, done)=> { User.getUserById(id,(err, user) =>{ done(err, user); }); });

//#endregion serialziacion

//########################################  Se establecen las rutas ###################################
router.get('/login',(req,res)=>{
	res.render('login')
})

router.get('/registro',(req,res)=>{
	res.render('registro')
})

router.post('/registro',(req,res)=>{
	/*
	if(req.body.password != req.body.rpassword)
		res.render('registro',{error: 'Las contraseñas no coinciden'})
	else{
		if(Number(req.body.edad)<18)
			res.render('registro',{error:'Debe ser mayor de edad para poder registrarse'})
		else{
			newUser= new User({
				nombre: req.body.nombre,
				cedula:req.body.cedula,
				telefono:req.body.telefono,
				sector:req.body.sector,
				direccion:req.body.direccion,
				edad:req.body.edad,
				genero: req.body.genero,
				username:req.body.username,
				password: req.body.password,
				eslocal:false,
				esadministrador:false,
				token:String
			})
			User.createUser(newUser,(e,user)=>{
				if(e)
					res.render('500',{error:'Ha ocurrido un error al registrarse'})
				else
					res.render('registro',{success_msg:'Registrado con éxito, confirme su cuenta por favor'})
			}) 
		}
	} 
	*/
	res.send('ok')
})
//#####################################################################################################

//Permite el enrutamiento______________________________________________________________________________
module.exports = router;
