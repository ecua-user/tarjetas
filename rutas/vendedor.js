//Dependencias necesarias______________________________________________________________________________
express = require('express')
router = express.Router()
User = require('../modelos/usuarios')
Tarjeta = require('../modelos/tarjetas')
ImgTarjeta = require('../modelos/img_tarjetas')
Repotarjeta = require('../modelos/reporte-tarjeta')
User = require('../modelos/usuarios')
//Confirma la autenticación del usuario________________________________________________________________
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated() && req.user.esvendedor)
		return next();
	else
		res.redirect('/neutral');
}


router.get('/', ensureAuthenticated, (req, res) => {
	Tarjeta.find().where({ $and: [{ vendedor: req.user.codigo }, { vendida: false }, { confirmar: false }] }).select('numero').exec((err, tarjetas) => {
		if (err)
			res.render('errores/500', { error: err })
		else {
			User.find().where({ escliente: true }).exec((error, clientes) => {
				if (error)
					res.render('errores/500', { error: error })
				else {
					ImgTarjeta.find().exec((error, imgs) => {
						res.render('vendedor/vendedor', { clientes: clientes, tarjetas: tarjetas.sort(), id_trj: imgs })
					})

				}
			})
		}
	})
})
router.post('/vender', ensureAuthenticated, (req, res) => {
	Tarjeta.findOneAndUpdate({ numero: req.body.numero }, { fechaventa: new Date(req.body.fecha), vendida: true, cliente: req.body.correo }, (error, respuesta) => {
		if (error)
			res.send('Error')
		else {
			User.findOne().where({ username: req.body.correo }).select('cedula nombre').exec((e, usuario) => {
				cedula = ''
				nombre = ''
				if (usuario != null) {
					cedula = usuario.cedula;
					nombre = usuario.nombre
				}

				var nuevoReporte = new Repotarjeta({
					codigo: Date.now(),
					referido: req.user.referido,
					vendedor: req.user.nombre,
					cliente: req.body.correo,
					nombre: nombre,
					cedula: cedula,
					fecha: new Date(req.body.fecha),
					tarjeta: req.body.tarjeta,
					numero: req.body.numero,
					pagado_cabeza: false,
					pagado_vendedor: false
				})
				var env = new Array()
				env.push(respuesta.activacion)
				env.push(nombre)
				nuevoReporte.save((error, correcto) => {
					res.send(env)
				})
			})
		}
	})
})

router.get('/asociar', ensureAuthenticated, (req, res) => {
	var codigos= new Array()
		User.find().where({$and:[{referido: req.user.nombre},{esvendedor:true}]}).exec((error, usuarios)=>{
			if(error)
				res.render('errores/500', {error:error})
			else{
				codigos.push({vendedor:req.user.codigo})
				for(var i=0;i < usuarios.length; i++){
					codigos.push({vendedor: usuarios.codigo})
				}
				Tarjeta.find().where({$and:[{vendida:false},{$or:codigos}]}).select('numero').exec((error, tarjetas)=>{
					var todas_tarjetas= new Array()
					for(var i=0; i< tarjetas.length; i++){
						todas_tarjetas.push(tarjetas[i].numero)
					}
					res.render('vendedor/asociar',{tarjetas: todas_tarjetas.sort((a, b)=>{return a-b}), vendedores:usuarios})
				})
			}
		})
		//Tarjeta.find().where({$or:[{vendedor:req.user.codigo},{}]})
})


router.post('/asociar-vendedor', ensureAuthenticated, (req, res) => {
		if (req.body.password != req.body.rpassword) {
			res.render('vendedor/asociar', { error: 'Contraseñas no coinciden' })
			return
		}
		if (Number(req.body.edad) < 18) {
			res.render('vendedor/asociar', { error: 'Debe ser mayor de edad para poder registrarse' })
			return
		}
		User.findOne().where({ username: req.body.username }).exec((e, resp) => {
			if (resp != null)
				res.render('vendedor/asociar', { error: 'Ya existe un usuario con este correo' })
			else {
				newUser = new User({
					codigo: Date.now(),
					nombre: req.body.nombre,
					cedula: req.body.cedula,
					telefono: req.body.telefono,
					sector: req.body.sector,
					direccion: req.body.direccion,
					edad: req.body.edad,
					genero: req.body.genero,
					username: req.body.username,
					password: req.body.password,
					eslocal: false,
					esadministrador: false,
					token: req.body.token,
					activo: true,
					esvendedor: true,
					imagen: "",
					referido: req.body.superior
				})
				User.createUser(newUser, (e, user) => {
					if (e)
						res.render('errores/500', { error: e })
					else
						res.render('vendedor/asociar', { success_msg: 'Registrado con éxito' })
				})
			}
		})
})

router.post('/reasignar', ensureAuthenticated, (req,res)=>{
	var tarjetas = new Array()
	if(!Array.isArray(req.body.todas_tarjetas))
		tarjetas.push(req.body.todas_tarjetas)
	else
		tarjetas=req.body.todas_tarjetas
	for(var i=0; i < tarjetas.length; i++){
		Tarjeta.findOneAndUpdate({numero:tarjetas[i]},{vendedor:req.body.todos_vendedores},(err,resp)=>{

		})
	}
	var codigos= new Array()
	User.find().where({$and:[{referido: req.user.nombre},{esvendedor:true}]}).exec((error, usuarios)=>{
		if(error)
			res.render('errores/500', {error:error})
		else{
			codigos.push({vendedor:req.user.codigo})
			for(var i=0;i < usuarios.length; i++){
				codigos.push({vendedor: usuarios.codigo})
			}
			Tarjeta.find().where({$and:[{vendida:false},{$or:codigos}]}).select('numero').exec((error, tarjetas)=>{
				var todas_tarjetas= new Array()
				for(var i=0; i< tarjetas.length; i++){
					todas_tarjetas.push(tarjetas[i].numero)
				}
				res.render('vendedor/asociar',{tarjetas: todas_tarjetas.sort((a, b)=>{return a-b}), vendedores:usuarios, success_msg: 'Su asignación de tarjeta ha ido un éxito, buena venta continua vendiendo'})
			})
		}
	})
})

router.get('/repo-ventas', ensureAuthenticated, (req,res)=>{
	var users=new Array()
	User.find().where({$and:[{esvendedor:true},{referido: req.user.nombre}]}).exec((error, vendedores)=>{
		for(var i=0; i< vendedores.length;i++){
			users.push({vendedor: vendedores[i].nombre})
		}
		users.push({vendedor: req.user.nombre})
		Repotarjeta.find().where({$or: users}).exec((error, ventas)=>{
			res.render('vendedor/reporte',{ventas: ventas})
		})
	})
})
//Permite el enrutamiento____________________________________________
module.exports = router;