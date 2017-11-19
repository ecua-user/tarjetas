//Dependencias necesarias____________________________________________
	express = require('express')
	router = express.Router()
	passport = require('passport')
	bcrypt = require('bcryptjs')
	LocalStrategy = require('passport-local').Strategy
	Error_500='errores/500'

//Modelos de datos a usar____________________________________________
	User=require('../modelos/usuarios')

//Confirma la autenticación del usuario______________________________
	function ensureAuthenticated(req, res, next) { 
		if (req.isAuthenticated())
			return next(); 
		else
			res.redirect('/neutral'); 
	}
//Genera los Token___________________________________________________
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

//Passport___________________________________________________________
	passport.use(new LocalStrategy(
		(username, password, done)=> {
			username=username.toLowerCase();
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

//Serializa al usuario_______________________________________________
	passport.serializeUser((user, done)=> { done(null, user.id); });

//Deserializa al usuario_____________________________________________
	passport.deserializeUser((id, done)=> { User.getUserById(id,(err, user) =>{ done(err, user); }); });



//Login______________________________________________________________
	router.get('/login',(req,res)=>{
		res.render('usuario/login')
	})

	router.post('/login', passport.authenticate('local', { 
		successRedirect: '/neutral/', failureRedirect: '/users/login', failureFlash: true }), 
		(req, res)=> { res.redirect('/'); 
	});

//Registro___________________________________________________________
	router.get('/registro',(req,res)=>{ 
		User.find().where({esvendedor:true}).select('codigo nombre').exec((error, referido)=>{
			res.render('usuario/registro',{referido:referido}) 
		})
	})

	router.post('/registro',(req,res)=>{
		if(req.body.password != req.body.rpassword){
			res.send('Contraseñas no coinciden')
			return
		}
		if(Number(req.body.edad)<18){
			res.send('Debe ser mayor de edad para poder registrarse')
			return
		}
		User.findOne().where({ $or: [{cedula:req.body.cedula},{username:req.body.username}]}).exec((e,resp)=>{
			if(resp!=null)
				res.send('Ya existe una cuenta con esta cédula o correo')					
			else{
				newUser= new User({
					codigo:Date.now(),
					nombre: req.body.nombre,
					cedula:req.body.cedula,
					telefono:req.body.telefono,
					sector:req.body.sector,
					direccion:req.body.direccion,
					edad:req.body.edad,
					genero: req.body.genero,
					username:(req.body.username).toLowerCase(),
					password: req.body.password,
					eslocal:false,
					esadministrador:false,
					token:req.body.token,
					activo:false,
					esvendedor:false,
					escliente:true,
					referido:req.body.referido
				})
				User.createUser(newUser,(e,user)=>{
					if(e)
						res.send('Error: '+e)
					else
						res.send('ok')
				}) 
			}
		})
	})

//Confirmar la cuenta________________________________________________
	router.get('/confirmar',(req,res)=>{
		res.render('usuario/confirmar')
	})

	router.post('/confirmar',(req,res)=>{
		User.findOne().where({$and: [{username:req.body.username},{activo:false},{token:req.body.token}]}).exec((e,resp)=>{
			if(e)
				res.render(Error_500,{error:e})
			else{
				if(resp!=null){
					User.findOneAndUpdate({username:req.body.username},{activo:true, token:cadenaAleatoria()}).exec((e,resp)=>{
						if(e)
							res.render(Error_500,{error:e})
						else
							res.render('usuario/login',{success_msg:'Ahora ya puedes iniciar sesión'})
					})
				}else
					res.render('usuario/confirmar',{error:'Este usuario no existe, el token es incorrecto o su cuenta ya estaba confirmada'})				
			}
		})
	})

//Cerrar sesión______________________________________________________
	router.get('/logout',  (req, res)=> { req.logout(); res.redirect('/users/login'); });

//Olvido_____________________________________________________________
	router.get('/olvido',(req,res)=>{
		res.render('usuario/olvido')
	})

	router.post('/olvido-mail',(req,res)=>{
		User.findOne().where({username:req.body.username}).select('token nombre').exec((e,resp)=>{
			respuesta=new Array()
			if(e)
				res.send('Error: '+e)
			else{
				if(resp !=null){
					respuesta.push(resp.token)
					respuesta.push(resp.nombre)
					res.send(respuesta)
				}
				else
					res.send('Error: No existe este usuario')
			}			
		})
	})

//Recuperar cuenta___________________________________________________
	router.get('/recuperar',(req,res)=>{
		res.render('usuario/recuperar')
	})
	router.post('/recuperar',(req,res)=>{
		if(req.body.password!=req.body.rpassword)
			res.render('usuario/recuperar',{error:'Las contraseñas no coinciden'})
		else{
			User.findOne().where({$and:[{username:req.body.username},{token:req.body.token}]}).select('token').exec((e,resp)=>{
				if(e)
					res.render(Error_500,{error:e})
				else{
					if(resp!=null){
						bcrypt.genSalt(10, function (err, salt) {
							bcrypt.hash(req.body.password, salt, function (err, hash) {
								User.findOneAndUpdate({ username: req.body.username }, {password: hash,	token: cadenaAleatoria()
								}, (err)=> {
									if (err)
										res.render(Error_500,{error:err})
									else
										res.render('usuario/login', { success_msg: 'Contraseña cambiada con éxito' });
								});
							});
						});
					}
				}
			})
		}
	})

//Cambiar contraseña_________________________________________________
	router.get('/password',ensureAuthenticated,(req,res)=>{
		renderizar='usuario/password-cliente'
		if(req.user.esadministrador)
			renderizar='usuario/password-admin'
		if(req.user.eslocal)
			renderizar='usuario/password-local'
		if(req.user.esvendedor)
			renderizar='usuario/password-vendedor'
		res.render(renderizar)
	})
	router.post('/cambiar',ensureAuthenticated,(req,res)=>{
		ruta='usuario/password-cliente'
		if(req.user.esadministrador)
			ruta='usuario/password-admin'
		if(req.user.eslocal)
			ruta='usuario/password-local'	
		if(req.user.esvendedor)
			ruta='usuario/password-vendedor'
		if(req.body.Npassword!=req.body.RNpassword)
			res.render(ruta,{error:'Contraseñas no coinciden'})
		else{
			bcrypt.compare(req.body.password, req.user.password, (err, respuesta) =>{
				if(err)
					res.render(Error_500,{error:err})
				else{
					if(!respuesta)
						res.render(ruta,{error:'La contraseña es incorrecta'})
					else{
						bcrypt.genSalt(10, (err, salt) =>{
							bcrypt.hash(req.body.Npassword, salt,  (err, hash)=> {
								User.findOneAndUpdate({ username: req.user.username }, {password: hash}, (err)=> {
									if (err){res.render(Error_500,{error:err})}else{
										req.logout()
										res.render('usuario/login',{success_msg:'Contraseña cambiada'});
									}
								});
							});
						});
					}	
				}
			});
		}
	})



//Permite el enrutamiento____________________________________________
	module.exports = router;