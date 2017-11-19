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

router.get('/perfil',ensureAuthenticated,(req,res)=>{ res.render('cliente/perfil') })

router.get('/comprado', ensureAuthenticated, (req,res)=>{
    res.render('cliente/activar')
})

router.post('/comprobar',ensureAuthenticated ,(req,res)=>{
	console.log(req.body)
	Tarjeta.findOne().where({$and:[
		{numero:req.body.numero},
		{cliente: req.user.username},
		{activo:false},{vendida:true},
		{activacion: req.body.activacion}
	]}).exec((error, tarjeta)=>{
		if(error)
			res.send('Error')
		else{
			if(tarjeta==null)
				res.send('No se puede activar')
			else
				res.send(tarjeta)
		}
	})
})

//Permite el enrutamiento______________________________________________________________________________
module.exports = router;
