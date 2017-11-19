//Dependencias necesarias__________________________
    express = require('express')
    router = express.Router()

//Modelos de datos a usar
    ImgTarjeta = require('../modelos/img_tarjetas')
    User = require('../modelos/usuarios')
    Video= require('../modelos/videos')
//Home_____________________________________________
    router.get('/',(req,res)=>{ 
        ImgTarjeta.find((err,tarjetas)=>{
            Video.find((error, videos)=>{
                if(videos!=null)
                    res.render('home/index',{tarjetas:tarjetas, videos: videos, video: videos[0]})                    
                else
                    res.render('home/index',{tarjetas:tarjetas, videos: videos})
            })       
        })
    })
//Control de paneles_______________________________
    router.get('/neutral',(req,res)=>{
        try{
            if(req.user.esadministrador)
                res.redirect('/admin')
            else{
                if(req.user.eslocal)
                    res.redirect('/local')
                else{
                    if(req.user.esvendedor)
                        res.redirect('/vendedor')
                    else
                        res.redirect('/cliente/perfil')
                }     
            }
        }catch(e){
            res.redirect('/users/login')
        }
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
            if(e)
                res.send(e)
            else
                res.send(local)
        })
    })
//Permite el enrutamiento__________________________
    module.exports = router;