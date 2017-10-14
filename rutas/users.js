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
		res.redirect('/neutral'); 
}

function cadenaAleatoria() {
    longitud =  16
    caracteres =  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    cadena = "" 
    max = caracteres.length - 1
	for (var i = 0; i < longitud; i++) {
        cadena += caracteres[Math.floor(Math.random() * (max + 1))]; 
    }
    return cadena;
}

//Passport_____________________________________________________________________________________________________________________________________________
passport.use(new LocalStrategy(
	(username, password, done)=> {
		User.getUserByUsername(username, (err, user)=> {
			if (err) throw err;
			if (!user) { return done(null, false, { message: 'Usuario desconocido' }); }
			if (user.activo) {
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

router.post('/login', passport.authenticate('local', { successRedirect: '/neutral/', failureRedirect: '/users/login', failureFlash: true }), (req, res)=> { res.redirect('/'); });


router.get('/registro',(req,res)=>{
	res.render('registro')
})

router.post('/registro',(req,res)=>{
	if(req.body.password != req.body.rpassword)
		res.send('Contraseñas no coinciden')
	else{
		if(Number(req.body.edad)<18)
			res.send('Debe ser mayor de edad para poder registrarse')
		else{
			User.findOne().where({ $or: [{cedula:req.body.cedula},{username:req.body.username}]}).exec((e,resp)=>{
				if(resp!=null){
					res.send('Ya existe una cuenta con esta cédula o correo')
				}
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
						token:req.body.token,
						activo:false,
						imagen:""
					})
					User.createUser(newUser,(e,user)=>{
						if(e)
							res.send('Error: '+e)
						else
							res.send('ok')
					}) 
				}
			})
		}
	} 
})

router.get('/confirmar',(req,res)=>{
	res.render('confirmar')
})
router.post('/confirmar',(req,res)=>{
	User.findOne().where({$and: [{username:req.body.username},{activo:false},{token:req.body.token}]}).exec((e,resp)=>{
		if(e)
			res.render('500',{error:e})
		else{
			if(resp!=null){
				User.findOneAndUpdate({username:req.body.username},{activo:true, token:cadenaAleatoria()}).exec((e,resp)=>{
					if(e)
						res.render('500',{error:e})
					else
						res.render('login',{success_msg:'Ahora ya puedes iniciar sesión'})
				})
			}else{
				res.render('confirmar',{error:'Este usuario no existe, el token es incorrecto o su cuenta ya estaba confirmada'})
			}
		}
	})
})

//Cierra sesión________________________________________________________________________________________________________________________________________
router.get('/logout',  (req, res)=> { req.logout(); res.redirect('/users/login'); });

router.get('/olvido',(req,res)=>{
	res.render('olvido')
})

router.post('/olvido-mail',(req,res)=>{
	User.findOne().where({username:req.body.username}).select('token').exec((e,resp)=>{
		if(e){
			res.send('Error: '+e)
		}
		else{
			if(resp !=null){
				res.send(resp.token+'')
			}else{
				res.send('Error: No existe este usuario')
			}
		}
		
	})
})

router.get('/recuperar',(req,res)=>{
	res.render('recuperar')
})
router.post('/recuperar',(req,res)=>{
	if(req.body.password!=req.body.rpassword){
		res.render('recuperar',{error:'Las contraseñas no coinciden'})
	}else{
		User.findOne().where({$and:[{username:req.body.username},{token:req.body.token}]}).select('token').exec((e,resp)=>{
			if(e)
				res.render('500',{error:e})
			else{
				if(resp!=null){
					bcrypt.genSalt(10, function (err, salt) {
						bcrypt.hash(req.body.password, salt, function (err, hash) {
							User.findOneAndUpdate({ username: req.body.username }, {password: hash,	token: cadenaAleatoria()
							}, (err)=> {
								if (err)
									res.render('500',{error:err})
								else
									res.render('login', { success_msg: 'Contraseña cambiada con éxito' });
							});
						});
					});

				}
			}
		})
	}
})
//#####################################################################################################

//Permite el enrutamiento______________________________________________________________________________
module.exports = router;
