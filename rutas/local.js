//Dependencias necesarias______________________________________________________________________________
express = require('express')
router = express.Router()

User = require('../modelos/usuarios')
Tarjeta = require('../modelos/tarjetas')
Notificacion = require('../modelos/notificaciones')

//Confirma la autenticación del usuario________________________________________________________________
function ensureAuthenticated(req, res, next) { 
	if (req.isAuthenticated() && req.user.eslocal)
		return next(); 
	else
		res.redirect('/neutral'); 
}

//########################################  Se establecen las rutas ###################################
router.get('/',ensureAuthenticated,(req,res)=>{
	res.render('local')
})

router.post('/activar', ensureAuthenticated, (req,res)=>{
	Tarjeta.findOne().where({$and:[{numero: req.body.numero},{vendida:true}]}).exec((error, tarjeta)=>{
		if(error)
			res.render('500', {error: error})
		else{
			if(tarjeta==null)
				res.render('local',{error:'Esa tarjeta no esta disponible, no se puede concretar la transacción'})
			else{		
				var controlador=false
				for(var j=0;j<tarjeta.locales.length;j++){
					if(tarjeta.locales[j].activo==true)
						controlador=true
				}
				if(!controlador){
					Tarjeta.findOneAndUpdate({numero:req.body.numero},{activo:false},(error,respuesta)=>{
						if(error)
							res.render('500',{error:error})
						else
							res.render('local',{error: 'No hay descuentos disponibles en esta tarjeta'})
					})					
				}				
				else{
					var reconoce=false;
					for(var i=0;i<tarjeta.locales.length;i++){
						if(req.user.codigo==tarjeta.locales[i].local && tarjeta.locales[i].activo==true)
							reconoce=true
					}
					if(reconoce){
						var fecha=new Date(tarjeta.fechafinal)
						fecha=fecha.setDate(fecha.getDate()+1)
						actual=new Date()
						resta=fecha-actual
						if(resta<0)
							res.render('local',{error: 'Tarjeta expirada'})
						else{
							Tarjeta.update({numero:req.body.numero, "locales.local":req.user.codigo},{
								$set: { "locales.$.activo" : false }
							},(error,respuesta)=>{
								if(error)
									res.render('500',{error: error})
								else{
									var notific=new Notificacion({
										fecha:new Date(),
										cliente: tarjeta.cliente,
										local:req.user.codigo,
										local_nombre:req.user.nombre,										
										numero:req.body.numero
									})
									notific.save((error,respuesta)=>{
										if(error)
											res.render('500',{error:error})
										else{
											Tarjeta.findOne().where({numero:req.body.numero}).exec((error, tarjeta)=>{
												if(error)
													res.render('500',{error:error})
												else{
													var estado=false;
													for(var i=0; i< tarjeta.locales.length;i++){
														if(tarjeta.locales[i].activo)
															estado=true
													}
													if(estado){
														var exp=new Date(tarjeta.fechafinal)
														var resta= exp-new Date()
														if(resta>=0){
															res.render('local',{success_msg:'Descuento aplicado con éxito'})
														}else{
															Tarjeta.findOneAndUpdate({numero: req.body.numero},{activo:false},(e,respuesta)=>{
																res.render('local',{success_msg:'Descuento aplicado con éxito'})
															})
														}
													}									
													else{
														Tarjeta.findOneAndUpdate({numero: req.body.numero},{activo:false},(e,respuesta)=>{
															res.render('local',{success_msg:'Descuento aplicado con éxito'})
														})
													}
												}
											})
											
										}											
									})									
								}									
							})
						}					
					}else{
						res.render('local',{error:'No tiene permisos para esta tarjeta o la tarjeta ya hs sido usada'})
					}			
				}				
			}
		}
	})
})

//#####################################################################################################

//Permite el enrutamiento______________________________________________________________________________
module.exports = router;
