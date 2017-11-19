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
	res.redirect('/cliente/perfil')
})

router.get('/perfil',ensureAuthenticated,(req,res)=>{ 
	Tarjeta.find().where({cliente:req.user.username}).exec((error, tarjetas)=>{
		console.log(tarjetas)
		res.render('cliente/perfil') 
	})
})

router.get('/comprado', ensureAuthenticated, (req,res)=>{
    res.render('cliente/activar')
})

router.post('/comprobar',ensureAuthenticated ,(req,res)=>{
	Tarjeta.findOne().where({$and:[
		{numero:req.body.numero},
		{cliente: req.user.username},
		{activo:false},{vendida:true},
		{activacion: req.body.activacion}
	]}).exec((error, tarjeta)=>{
		var respuesta= new Array()
		if(error)
			res.send('Error')
		else{
			if(tarjeta==null)
				res.send('No se puede activar')
			else{
				var locales= new Array()
				for(var i=0; i< tarjeta.locales.length;i++){
					locales.push({codigo: tarjeta.locales[i].local})
				}
				User.find().where({$and:[{eslocal:true}, {$or:locales}]}).select('nombre logotipo').exec((error, loc)=>{
					if(error)
						res.send('Error')
					else{
						respuesta.push(tarjeta)
						respuesta.push(loc)
						res.send(respuesta)
					}
				})
			}	
		}
	})
})

router.post('/finalizar-activacion', ensureAuthenticated, (req,res)=>{
	Tarjeta.findOne().where({$and:[{numero:req.body.numero},{cliente: req.user.username},{activo:false}]}).exec((error, respuesta)=>{
		if(error)
			res.send('Error')
		else{
			if(respuesta==null)
				res.send('Error')
			else{
				Tarjeta.findOneAndUpdate({$and:[{numero:req.body.numero},{cliente: req.user.username},{activo:false}]},{activo:true, activacion: cadenaAleatoria()}, (error, respuesta)=>{
					if(error)	
						res.send('Error')
					else
						res.send('Activado con éxito')
				})
			}
		}
	})
})



//Permite el enrutamiento______________________________________________________________________________
module.exports = router;
