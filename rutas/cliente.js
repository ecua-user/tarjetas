//Dependencias necesarias__________________________
express = require('express')
router = express.Router()
Video = require('../modelos/videos')
Imagen=require('../modelos/imagenes')
User = require('../modelos/usuarios')
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next();
    else
        res.redirect('/neutral');
}
function cadenaAleatoria() {
    longitud = 16
    caracteres = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    cadena = ""
    max = caracteres.length - 1
    for (var i = 0; i < longitud; i++) { cadena += caracteres[Math.floor(Math.random() * (max + 1))]; }
    return cadena;
}

router.get('/activar', ensureAuthenticated, (req,res)=>{
    Video.find().exec((error, videos)=>{
        ImgTarjeta.find().exec((error, imgs) => {
            if(videos.length==0){
                res.render('cliente/activar',{id_trj: imgs })
            }else{
                res.render('cliente/activar',{video: videos,id_trj: imgs })
            }
        })
    })
    
})
router.post('/finalizar-activacion', ensureAuthenticated, (req,res)=>{
	Tarjeta.findOne().where({$and:[{numero:req.body.numero},{cliente: req.user.username},{activo:false},{activacion: (req.body.token).trim()}]}).exec((error, respuesta)=>{
		if(error)
			res.send('Ha ocurrido un error inesperado')
		else{
			if(respuesta==null)
				res.send('No existe esta tarjeta para este usuario')
			else{
				Tarjeta.findOneAndUpdate({$and:[{numero:req.body.numero},{cliente: req.user.username},{activo:false}]},{activo:true, activacion: cadenaAleatoria()}, (error, respuesta)=>{
					if(error)	
						res.send('Ha ocurrido un error inesperado')
					else
						res.send('Activado con éxito')
				})
			}
		}
	})
})

router.get('/perfil', ensureAuthenticated,(req,res)=>{
    Imagen.find().exec((err, imagenes)=>{
        Tarjeta.find().where({$and:[{cliente: req.user.username},{vendida:true}, {activo:true}]}).exec((error, tarjetas)=>{
            if(error)
                resizeBy.render('errores/500', {error:error})
            else{
                if(tarjetas.length==0){
                    res.redirect('/cliente/activar')
                }else{
                    res.render('cliente/perfil',{imagenes:imagenes, tarjetas: tarjetas})
                }     
            }
        })      
    })
})

router.post('/tarjeta', ensureAuthenticated, (req,res)=>{
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
            Tarjeta.findOneAndUpdate({numero: req.body.numero},{confirmar:true},(error, respuesta)=>{

            })
        } 
    })
    Tarjeta.findOne().where({numero:req.body.numero}).exec((error, tarjeta)=>{
        if (error)
            res.send(error)
        else{
            if(tarjeta==null){
                res.send('Error')
            }else{
                var locales=new Array()
                for(var i=0; i< tarjeta.locales.length; i++){
                    locales.push({codigo: tarjeta.locales[i].local})
                }
                User.find().where({$or:locales}).select('logotipo codigo').exec((error, locales)=>{
                    if(error)
                        res.send('Error')
                    else{
                        var respuesta = new Array()
                        respuesta.push(tarjeta)
                        respuesta.push(locales)
                        res.send(respuesta)
                    }
                })
            }
        }
    })
})

router.post('/local-trj',(req,res)=>{
    var respuesta_total= new Array()
    User.findOne().where({codigo:req.body.codigo}).exec((e,local)=>{
        var respuesta=new Array()
        if(!Array.isArray(local))
            respuesta.push(local)
        else
            respuesta=local
        Tarjeta.findOne().where({numero:req.body.numero}).select('locales').exec((error, tarjeta)=>{
            for(var i=0; i< tarjeta.locales.length;i++){
                if(tarjeta.locales[i].local==req.body.codigo){
                   respuesta[0].beneficio=tarjeta.locales[i].beneficio
                }
            }
            res.send(respuesta)
        })
    })
})
router.post('/reeviar', ensureAuthenticated, (req,res)=>{
    Tarjeta.findOne().where({$and:[{numero: req.body.numero},{vendida:true}, {cliente:req.user.username}]}).exec((error, respuesta)=>{
        if(respuesta==null){
            res.send({mensaje:'Lo sentimos, usetd no ha comprado la tarjeta número '+req.body.numero})
        }else{
            res.send({username: req.user.username, mensaje: respuesta.activacion})
        }
    })
})

//Permite el enrutamiento__________________________
module.exports = router;