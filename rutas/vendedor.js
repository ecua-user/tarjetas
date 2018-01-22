//Dependencias necesarias______________________________________________________________________________
express = require('express')
router = express.Router()
User = require('../modelos/usuarios')
Tarjeta = require('../modelos/tarjetas')
Repotarjeta = require('../modelos/reporte-tarjeta')
User = require('../modelos/usuarios')
//Confirma la autenticación del usuario______________________________
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated())
		return next();
	else
		res.redirect('/neutral');
}
//Genera los Token___________________________________________________
function cadenaAleatoria() {
	longitud = 16
	caracteres = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	cadena = ""
	max = caracteres.length - 1
	for (var i = 0; i < longitud; i++) {
		cadena += caracteres[Math.floor(Math.random() * (max + 1))];
	}
	return cadena;
}



router.get('/', ensureAuthenticated, (req, res) => {
	var imagenes_tarjetas = new Array()
	var tarjetas_para_vender = new Array()
	var todasTarjetas = new Array()
	Tarjeta.find().select('imagen titulo tarjetas codigo').exec((error, tarjetas) => {
		if (tarjetas != null) {
			for (var i = 0; i < tarjetas.length; i++) {
				if (i == 0)
					todasTarjetas = tarjetas[i].tarjetas
				else
					todasTarjetas.concat(tarjetas[i].tarjetas)
				imagenes_tarjetas.push({ imagen: tarjetas[i].imagen, titulo: tarjetas[i].titulo })
			}
			for (var i = 0; i < todasTarjetas.length; i++) {
				if (todasTarjetas[i].vendedor == req.user.codigo && todasTarjetas[i].cliente == '') {
					tarjetas_para_vender.push({ numero: todasTarjetas[i].numero })
				}
			}
		}
		res.render('vendedor/vendedor', { tarjetas: tarjetas_para_vender.sort(function(a, b){return a-b}), id_trj: imagenes_tarjetas })
	})
})
router.post('/vender', ensureAuthenticated, (req, res) => {
	var encontrado
	Tarjeta.find().exec((error, tarjetas) => {
		if (error)
			res.send('Error 0')
		else {
			if (tarjetas != null) {
				try {
					for (var l = 0; l < tarjetas.length; l++) {
						for (var m = 0; m < tarjetas[l].tarjetas.length; m++) {
							if (tarjetas[l].tarjetas[m].numero == req.body.numero) {
								encontrado = tarjetas[l]
								m = tarjetas[l].tarjetas.length
								l = tarjetas.length
							}
						}
					}
				} catch (error) {
					console.log(error)
				}				
				User.findOne().where({ username: req.body.correo }).select('cedula nombre referido').exec((e, usuario) => {
					if (e)
						res.send('Error')
					else {
						var cedula = "", nombre = "", referido = ""
						var activacion = cadenaAleatoria()
						if (usuario != null) {
							cedula = usuario.cedula;
							nombre = usuario.nombre
							referido = usuario.referido
						}
						var nuevoReporte = new Repotarjeta({
							codigo: Date.now(),
							referido: referido,
							vendedor: req.user.nombre,
							cliente: req.body.correo,
							nombre: nombre,
							cedula: cedula,
							fecha: new Date(req.body.fecha),
							tarjeta: req.body.tarjeta,
							numero: req.body.numero,
							pagado_cabeza: false,
							pagado_vendedor: false,
						})
						var env = new Array()
						env.push(activacion)
						env.push(nombre)
						nuevoReporte.save((error, correcto) => {
							if (error)
								res.send('Error')
							else { 
								var nuevaVenta = new Tarjeta_uso({
									cabeza: encontrado.codigo,
									numero: req.body.numero,
									fechainicial: new Date(encontrado.fechainicial),
									fechafinal: new Date(encontrado.fechafinal),
									titulo: encontrado.titulo,
									imagen: encontrado.imagen,
									linkface: encontrado.linkface,
									linkInst: encontrado.linkInst,
									locales: encontrado.locales,
									activacion: activacion,
									activo: false,
									vendedor: req.user.codigo,
									fechaasignacion: new Date(encontrado.fechainicial),
									fechaventa: new Date(),
									confirmar: false,
									vendida: true,
									cliente: req.body.correo
								})
								nuevaVenta.save((error, listo) => {
									if (error){
										res.send('Error')
									}										
									else {
										for (var i = 0; i < encontrado.tarjetas.length; i++) {
											if (encontrado.tarjetas[i].numero == req.body.numero) {
												encontrado.tarjetas[i].cliente = req.body.correo
												i = encontrado.tarjetas.length
											}
										}
										Tarjeta.findOneAndUpdate({ codigo: encontrado.codigo }, { tarjetas: encontrado.tarjetas }, (error, listo) => {
											if (error)
												res.send('Error')
											else {
												res.send(env)
											}
										})
									}
								})
							}
						})
					}
				})
			}else{
				res.send('Error')
			}
		}
	})
})

router.get('/asociar', ensureAuthenticated, (req, res) => {
	var codigos= new Array()
	User.find().where({$and:[{referido: req.user.nombre},{esvendedor:true}]}).exec((error, usuarios)=>{
		if(error)
			res.render('errores/500', {error:error})
		else{
			codigos.push(req.user.codigo)
			for(var i=0;i < usuarios.length; i++){
				codigos.push(usuarios.codigo)
			}
			Tarjeta.find((error, tarjetas)=>{
				if(error)
					res.render('errores/500', {error:error})
				else{
					if(tarjetas!=null){
						var tarjetas_para_vender = new Array()
						var todasTarjetas = new Array()
						for (var i = 0; i < tarjetas.length; i++) {
							if (i == 0)
								todasTarjetas = tarjetas[i].tarjetas
							else
								todasTarjetas.concat(tarjetas[i].tarjetas)
						}
						for (var i = 0; i < todasTarjetas.length; i++) {
							if ( codigos.includes(todasTarjetas[i].vendedor) && todasTarjetas[i].cliente == '') {
								tarjetas_para_vender.push(todasTarjetas[i].numero)
							}
						}
						res.render('vendedor/asociar',{tarjetas: tarjetas_para_vender.sort((a, b)=>{return a-b}), vendedores:usuarios})
					}else
						res.render('errores/500', {error:error})
				}
			})
		}
	})
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
	var tarjetas_asignar = new Array()
	if(!Array.isArray(req.body.todas_tarjetas))
		tarjetas_asignar.push(req.body.todas_tarjetas)
	else
		tarjetas_asignar=req.body.todas_tarjetas
	Tarjeta.find().exec((error, tarjetas)=>{
		if(error)
			res.render('errores/500', { error: e })
		else{
			var para_vender= new Array()
			if(tarjetas!=null){
				for(var i=0; i< tarjetas.length; i++){
					for(var j=0; j< tarjetas[i].tarjetas.length; j++){
						if(tarjetas_asignar.includes(tarjetas[i].tarjetas[j].numero+'') && tarjetas[i].tarjetas[j].cliente=='')
							tarjetas[i].tarjetas[j].vendedor=req.body.todos_vendedores							
						if(tarjetas[i].tarjetas[j].vendedor==req.user.codigo &&  tarjetas[i].tarjetas[j].cliente=='')
							para_vender.push(tarjetas[i].tarjetas[j].numero)			
					}
					Tarjeta.findOneAndUpdate({codigo: tarjetas[i].codigo},{tarjetas: tarjetas[i].tarjetas},(error , listo)=>{
					})
				}
				User.find().where({$and:[{referido: req.user.nombre},{esvendedor:true}]}).exec((error, usuarios)=>{
					res.render('vendedor/asociar',{tarjetas: para_vender.sort((a, b)=>{return a-b}), vendedores:usuarios, success_msg: 'Su asignación de tarjeta ha ido un éxito, buena venta continua vendiendo'})
				})	
			}else{
				res.render('errores/500', { error: 'No hay tarjetas' })
			}
		}
	})
})
router.get('/repo-ventas', ensureAuthenticated, (req,res)=>{
	var users=new Array()
	User.find().where({$and:[{esvendedor:true},{referido: req.user.nombre}]}).exec((error, vendedores)=>{
		if(error)
			res.render('errore/500')
		else{
			if(vendedores!=null){
				for(var i=0; i < vendedores.length; i++){
					users.push({referido: vendedores[i].nombre})
				}
				users.push({referido: req.user.nombre})
				users.push({nombre: req.user.nombre})
				User.find().where({$and:[{esvendedor:true},{$or:users}]}).exec((error, todos_vendedores)=>{
					if(todos_vendedores!=null){
						var lared=new Array()
						for(var i=0; i < todos_vendedores.length; i++){
							lared.push({vendedor:todos_vendedores[i].nombre})
						}
						Repotarjeta.find().where({$or: lared}).exec((error, ventas)=>{
							res.render('vendedor/reporte',{ventas: ventas})
						})
					}else
						res.render('vendedor/reporte')
				})
			}else
				res.render('vendedor/reporte')			
		}
	})
})
//Permite el enrutamiento____________________________________________
module.exports = router;