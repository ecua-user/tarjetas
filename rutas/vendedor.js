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
	Tarjeta.find().where({$and:[{vendedor:req.user.codigo},{activo:false},{vendida:false}]}).select('numero').exec((err,tarjetas)=>{
		if(err)
			res.render('500',{error: err})
		else{
			User.find().where({$and:[{esadministrador:false},{esvendedor:false},{eslocal:false}]}).exec((error,clientes)=>{
				if(error)
					res.render('500',{error:error})
				else{
					Tarjeta.find().where({$and:[{vendedor:req.user.codigo},{vendida:true}]}).exec((err,vendidos)=>{
						if(err)
							re.render('500',{error:err})
						else
							res.render('vendedor',{clientes:clientes, tarjetas: tarjetas.sort(), vendidos: vendidos.reverse()})
					})					
				}					
			})	
		}
	})
})

router.post('/vender',ensureAuthenticated,(req,res)=>{
	Tarjeta.findOneAndUpdate({numero: req.body.numero},{fechaventa: new Date(req.body.fecha), vendida:true}, (error,respuesta)=>{
		if(error)
			res.send('Error')
		else{
			res.send(''+ respuesta.activacion)
		}
	})	
})

//#####################################################################################################

//Permite el enrutamiento______________________________________________________________________________
module.exports = router;
