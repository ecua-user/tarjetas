//Dependencias necesarias______________________________________________________________________________
express = require('express')
router = express.Router()

Tarjeta = require('../modelos/tarjetas')
ImgTarjeta = require('../modelos/img_tarjetas')
User = require('../modelos/usuarios')
Notificacion = require('../modelos/notificaciones')

//Confirma la autenticación del usuario________________________________________________________________
function ensureAuthenticated(req, res, next) { 
	if (req.isAuthenticated() && !req.user.esadministrador && !req.user.eslocal)		
		return next(); 
	else
		res.redirect('/neutral'); 
}

function cadenaAleatoria() {
	longitud = 16
	caracteres = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	cadena = ""
	max = caracteres.length - 1
	for (var i = 0; i < longitud; i++) { cadena += caracteres[Math.floor(Math.random() * (max + 1))];}
	return cadena;
}
//########################################  Se establecen las rutas ###################################
router.get('/',(req,res)=>{
	res.redirect('/cliente/comprado')
})

router.get('/comprado',ensureAuthenticated,(req,res)=>{ res.render('cliente-comprado') })

router.get('/perfil',ensureAuthenticated,(req,res)=>{
	Notificacion.find().where({cliente:req.user.codigo}).exec((error,notificaciones)=>{
		if(error)
			res.render('500',{error:error})
		else{
			Tarjeta.find().where({cliente: req.user.codigo}).exec((error, tarjetas)=>{
				if(error)
					res.render('500',{error:error})
				else{
					var activas=new Array()
					var finalizadas=new Array()
					var caducadas=new Array()
					if(tarjetas!=null){
						for(var i=0;i<tarjetas.length;i++){
							if(tarjetas[i].activo)
								activas.push(tarjetas[i])
							else{
								var fec=new Date(tarjetas[i].fechafinal)
								fec=fec.setDate(fec.getDate()+1)
								resta=fec-new Date()
								if(resta>=0)
									finalizadas.push(tarjetas[i])
								else
									caducadas.push(tarjetas[i])
							}
						}						
					}
					res.render('cliente-perfil',{activas:activas,finalizadas:finalizadas,caducadas:caducadas,notificaciones:extraerdDatos(notificaciones)})
				}
			})			
		}
	})
})

function extraerdDatos(notificaciones){
	notificaciones=notificaciones.reverse()
	var notific=new Array()
	for(var i=0;i < notificaciones.length;i++){
		var fecha= new Date(notificaciones[i].fecha)
		var nFecha=fecha.getDate()+'/'+ (fecha.getMonth()+1)+'/'+ fecha.getFullYear()
		var hora =fecha.getHours()+':'+ fecha.getMinutes()
		notific.push({
			fecha: nFecha,
			hora: hora,
			numero: notificaciones[i].numero,
			local:notificaciones[i].local_nombre
		})
	}
	return notific
}

router.post('/activar', ensureAuthenticated, (req,res)=>{
	Tarjeta.findOne().where({$and:[{numero:req.body.numero},{vendida:true}, {activo:false}]}).exec((error,tarjeta)=>{
		if(error)
			res.send('Error')
		else{
			if(tarjeta!=null){
				Tarjeta.findOne().where({$and:[{numero:req.body.numero},{activacion:req.body.codigo}]}).exec((error, tarjeta)=>{
					if(error)
						res.send('Error')
					else{
						var respuesta=new Array()
						if(tarjeta==null)
							res.send('incorrecto')
						else{
							ImgTarjeta.findOne().where({codigo:tarjeta.imagen}).select('imagen').exec((error,imagen)=>{
								if(error)
									res.send('Error')
								else{
									losLocales=new Array()
									for(var i=0;i<(tarjeta.locales).length;i++){
										losLocales.push({'codigo':tarjeta.locales[i].local})
									}
									User.find().where({$or:losLocales}).select('nombre logotipo').exec((e,locales)=>{
										if(e)
											res.send('Error')
										else{
											respuesta.push(tarjeta)
											respuesta.push(imagen)
											respuesta.push(locales)
											res.send(respuesta)
										}										
									})									
								}
							})
						}					
					}						
				})
			}else
				res.send('vacio')			
		}
	})
})

router.post('/activacion',ensureAuthenticated,(req,res)=>{
	Tarjeta.findOneAndUpdate(
		{$and:[{numero:req.body.numero},{activacion: req.body.codigo}]},
		{activacion:cadenaAleatoria(), cliente:req.user.codigo, activo:true},
		(error, respuesta)=>{
			if(error)
				res.render('500',{error: error})
			else{
				res.render('cliente-comprado',{success_msg:'Tarjeta activada con éxito'})
			}
		})
})

router.post('/detallar',ensureAuthenticated,(req,res)=>{
	var Resp=new Array()
	Tarjeta.findOne().where({numero:req.body.numero}).exec((error,tarjeta)=>{
		if(error)
			res.send(error)
		else{
			var locales=new Array()
			for(var i=0;i<tarjeta.locales.length;i++){
				locales.push({codigo:tarjeta.locales[i].local})
			}
			User.find().where({$or:locales}).exec((error, locales)=>{
				if(error)
					res.send('Error')
				else{
					Resp.push(tarjeta)
					Resp.push(locales)
					res.send(Resp)
				}
			})
		}	
	})
})

//#####################################################################################################

//Permite el enrutamiento______________________________________________________________________________
module.exports = router;
