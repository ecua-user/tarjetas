//Dependencias necesarias__________________________
express = require('express')
router = express.Router()

//Modelos de datos a usar
ImgTarjeta = require('../modelos/img_tarjetas')
User = require('../modelos/usuarios')
Video= require('../modelos/videos')
Imagen=require('../modelos/imagenes') 

router.get('/',(req,res)=>{ 
    ImgTarjeta.find((err,tarjetas)=>{     
        User.find().where({esvendedor:true}).select('codigo nombre').exec((error, referido)=>{       
            Imagen.find().exec((err, imagenes)=>{
                Video.find().exec((error, videos)=>{
                    res.render('home/index',{tarjetas:tarjetas,referido:referido, imagenes:imagenes,video: videos}) 
                })               
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

//Detalle de la tarjeta____________________________
router.get('/tarjetas:codigo',(req,res)=>{
    var codigoE=(req.params.codigo).substr(1,req.params.codigo.length)
    ImgTarjeta.findOne().where({codigo:codigoE}).exec((error,respuesta)=>{
        if(error)
            res.render('errores/500',{error:error})
        else{
            query = new Array()
            if(respuesta!=null){
                for (var i = 0; i < respuesta.locales.length; i++) {
                    query.push({ codigo: respuesta.locales[i].local })
                }
                User.find().where({ $and: [{ $or: query }, { eslocal: true }] }).exec((err, resp) => {
                    res.render('home/locales', { locales: resp, tarjeta: respuesta, inicial:respuesta.inicial, final:respuesta.final})
                })
            }else
                res.render('errores/500',{error: 'No existe'})
        }           
    })
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

router.get('/nosotros', (req,res)=>{
    res.render('home/nosotros')
})
router.get('/contactos', (req,res)=>{
    res.render('home/contacto')
})
//Permite el enrutamiento__________________________
module.exports = router;