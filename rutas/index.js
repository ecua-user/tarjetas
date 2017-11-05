//Dependencias necesarias______________________________________________________________________________
express = require('express')
router = express.Router()
ImgTarjeta = require('../modelos/img_tarjetas')
User = require('../modelos/usuarios')
//########################################  Se establecen las rutas ###################################
router.get('/',(req,res)=>{ 
    ImgTarjeta.find((err,tarjetas)=>{
        res.render('index',{tarjetas:tarjetas})
    })
})

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
                    res.redirect('/cliente/comprado')
            }     
        }
    }catch(e){
        res.redirect('/users/login')
    }
})

router.get('/tarjetas:codigo',(req,res)=>{
    var codigoE=(req.params.codigo).substr(1,req.params.codigo.length)
    ImgTarjeta.findOne().where({codigo:codigoE}).exec((error,respuesta)=>{
        if(error)
            res.render('500',{error:error})
        else{
            query = new Array()
            if(respuesta!=null){
                for (var i = 0; i < respuesta.locales.length; i++) {
                    query.push({ codigo: respuesta.locales[i].local })
                }
                User.find().where({ $and: [{ $or: query }, { eslocal: true }] }).exec((err, resp) => {
                    res.render('locales', { locales: resp, tarjeta: respuesta.imagen, inicial:respuesta.inicial, final:respuesta.final})
                })
            }else{
                res.render('500',{error: 'No existe'})
            }
        }           
    })
})
//#####################################################################################################

//Permite el enrutamiento______________________________________________________________________________
module.exports = router;
