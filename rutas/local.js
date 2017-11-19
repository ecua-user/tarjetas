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
	res.render('local/vender')
})

router.post ('/activar', ensureAuthenticated, (req,res)=>{
    Tarjeta.findOne().where({$and:[{numero: req.body.numero},{vendida:true, activo:true}]}).exec((error, tarjeta)=>{
        if(error)
            res.send('Error')
        else{
            if(tarjeta==null)
                res.send('Esta tarjeta no esta actíva')
            else{
                detalles= new Array()
                for(var i=0;i < tarjeta.locales.length;i++){
                    if(req.user.codigo==tarjeta.locales[i].local){
                        detalles.push(tarjeta)
                        detalles.push(tarjeta.locales[i])
                    }
                }
                if(detalles.length==0)
                    res.send('Esta tarjeta no es válida para este local')
                else
                    res.send(detalles)
            }
        }
            
    })
})


router.post('/usar-beneficio', ensureAuthenticated, (req,res)=>{
    Tarjeta.findOne().where({numero: req.body.numero}).exec((error, tarjeta)=>{
        var sumatoria=0;
        var comprobante=0;
        for(var i=0; i < tarjeta.locales.length;i++){
            for(var j=0;j< tarjeta.locales[i].beneficio.length;j++){
                sumatoria++
                if(tarjeta.locales[i].beneficio[j].activo==false){
                    comprobante++
                }
            }
        }
        if(sumatoria==comprobante){
            Tarjeta.findOneAndUpdate({numero: req.body.numero},{activo:false},(error, respuesta)=>{

            })
        }
    })
    Tarjeta.findOne().where({numero: req.body.numero}).exec((error, tarjeta)=>{
        if(error)
            res.send('Error')
        else{
            if((new Date(tarjeta.fechafinal))>= (new Date(req.body.fecha))){
                for(var i=0; i < tarjeta.locales.length;i++){
                    if(tarjeta.locales[i].local==req.user.codigo){
                        for(var j=0;j< tarjeta.locales[i].beneficio.length;j++){
                            if(req.body.codigo== tarjeta.locales[i].beneficio[j].codigo){
                                if(tarjeta.locales[i].beneficio[j].activo==true){
                                    tarjeta.locales[i].beneficio[j].activo=false
                                    Tarjeta.findOneAndUpdate({numero: req.body.numero},{locales:tarjeta.locales},(error, respuesta)=>{
                                        var notifica=new Notificacion({
                                            fecha: new Date(req.body.fecha),
                                            cliente:req.body.cliente,
                                            local:req.user.codigo,
                                            local_nombre:req.user.nombre,
                                            numero: req.body.numero, 
                                            beneficio: tarjeta.locales[i].beneficio[j].beneficio
                                        })
                                        notifica.save((error, respuesta)=>{
                                            res.send('Beneficio aplicado con éxito')
                                        })
                                    }) 
                                }else{
                                    res.send('No puede activarse, Ya se ha ocupado ese beneficio')
                                }                                
                            }
                        }
                    }
                }
            }else{
                Tarjeta.findOneAndUpdate({numero: req.body.numero},{activo:false},(error, respuesta)=>{
                    res.send('Tarjeta caducada')
                })               
            }
        }
    })
})
//Permite el enrutamiento______________________________________________________________________________
module.exports = router;
