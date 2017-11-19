//Dependencias necesarias______________________________________________________________________________
express = require('express')
router = express.Router()
User = require('../modelos/usuarios')
Tarjeta = require('../modelos/tarjetas')
//Confirma la autenticación del usuario________________________________________________________________
function ensureAuthenticated(req, res, next) { 
	if (req.isAuthenticated() && req.user.esvendedor)
		return next(); 
	else
		res.redirect('/neutral'); 
}

//########################################  Se establecen las rutas ###################################
router.get('/',ensureAuthenticated,(req,res)=>{
	Tarjeta.find().where({$and:[{vendedor:req.user.codigo},{vendida:false}]}).select('numero').exec((err,tarjetas)=>{
		if(err)
			res.render('errores/500',{error: err})
		else{
			User.find().where({$and:[{esadministrador:false},{esvendedor:false},{eslocal:false}]}).exec((error,clientes)=>{
				if(error)
					res.render('errores/500',{error:error})
				else{
					res.render('vendedor/vendedor',{clientes:clientes, tarjetas: tarjetas.sort()})				
				}					
			})	
		}
	})
})

router.post('/vender',ensureAuthenticated,(req,res)=>{
	Tarjeta.findOneAndUpdate({numero: req.body.numero},{fechaventa: new Date(req.body.fecha), vendida:true,cliente:req.body.correo}, (error,respuesta)=>{
		if(error)
			res.send('Error')
		else
			res.send(''+ respuesta.activacion)		
	})	
})

router.get('/ventas', ensureAuthenticated, (req,res)=>{
	Tarjeta.find().where({$and:[{vendedor:req.user.codigo},{vendida:true}]}).exec((err,vendidos)=>{
		res.render('vendedor/reportes-ventas',{vendidos:vendidos.sort()})
	})
})

//#####################################################################################################

//Permite el enrutamiento______________________________________________________________________________
module.exports = router;
