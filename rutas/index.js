//Dependencias necesarias__________________________
express = require('express')
router = express.Router()

//Modelos de datos a usar
User = require('../modelos/usuarios')
Video= require('../modelos/videos')
Imagen=require('../modelos/imagenes') 
Tarjetas= require('../modelos/tarjetas')

router.get('/',(req,res)=>{ 
    User.find().where({esvendedor:true}).select('codigo nombre').exec((error, referido)=>{       
        Tarjetas.find().exec((err, tarjetas)=>{
            Video.find().exec((error, videos)=>{
                res.render('home/index',{referido:referido, tarjetas:tarjetas,video: videos}) 
            })               
        })                   
    })   
})

router.get('/neutral',(req,res)=>{
    try {
        if (req.user.esadministrador)
            res.redirect('/admin')
        else {
            if (req.user.eslocal)
                res.redirect('/local')
            else {
                if (req.user.esvendedor)
                    res.redirect('/vendedor')
                else
                    res.redirect('/cliente/perfil')
            }
        }
    } catch (e) { res.redirect('/'); }
})


//Detalle del local_______________________________
router.post('/local',(req,res)=>{
    User.findOne().where({codigo:req.body.codigo}).exec((e,local)=>{
        var respuesta=new Array()
        if(!Array.isArray(local))
            respuesta.push(local)
        else
            respuesta=local
        res.send(respuesta)
    })
})

router.get('/detalle_tarjeta:codigo',(req,res)=>{
    var codigoE=(req.params.codigo).substr(1,req.params.codigo.length)
    Tarjetas.findOne().where({codigo:codigoE}).exec((error, respuesta)=>{
        Imagen.find().exec((error, imagenes)=>{
            var loc_array=new Array();
            for(var i=0; i< respuesta.locales.length; i++){
                loc_array.push({codigo:respuesta.locales[i].local})
            }
            User.find().where({$or:loc_array}).select('codigo logotipo nombre').exec((error,logos)=>{
                res.render('home/tarjetas',{imagenes:imagenes, locales:logos})
            })
        })
    })
})

router.post('/detalles_trj', (req,res)=>{
    Tarjetas.findOne().where({codigo:req.body.codigo}).select('titulo descripcion').exec((error, respuesta)=>{
        res.send(respuesta.locales)
    })
})

router.get('/nosotros', (req,res)=>{
    res.render('home/nosotros')
})
router.get('/contactos', (req,res)=>{
    res.render('home/contacto')
})
//Permite el enrutamiento__________________________
module.exports = router;