//Dependencias necesarias______________________________
express = require('express')
router = express.Router()
Repolocal = require('../../modelos/reporte-usuario')
RepoTarjeta = require('../../modelos/reporte-tarjeta')
User = require('../../modelos/usuarios')

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user.esadministrador)
        return next();
    else
        res.redirect('/neutral');
}
router.get('/reporte-local', ensureAuthenticated, (req, res) => {
    User.find().where({ eslocal: true }).exec((error, locales) => {
        if (error)
            res.render('errores/500')
        else
            res.render('administrador/reportes/local', { locales: locales })
    })
})
router.post('/ver-reporte-locales', ensureAuthenticated, (req, res) => {
    if (req.body.nombre == 'Todos') {
        Repolocal.find().exec((error, respuesta) => {
            res.send(respuesta)
        })
    } else {
        Repolocal.find().where({ local: req.body.nombre }).exec((error, respuesta) => {
            res.send(respuesta)
        })
    }
})

router.get('/reporte-referido', ensureAuthenticated, (req,res)=>{
    User.find().where({esvendedor:true}).exec((error, referidos)=>{
        res.render('administrador/reportes/referido',{referido: referidos})
    })
})

router.post('/ver-reporte-referidos', ensureAuthenticated, (req,res)=>{
    if(req.body.nombre =='Todos'){
        RepoTarjeta.find().exec((error, respuesta) => {
            res.send(respuesta)
        })
    }else{
        RepoTarjeta.find().where({$or:[{vendedor: req.body.nombre},{referido:req.body.nombre}] }).exec((error, respuesta) => {
            res.send(respuesta)
        })
    }
})

router.get('/reporte-vendedor', ensureAuthenticated, (req, res) => {
    User.find().where({ esvendedor: true }).exec((error, vendedores) => {
        res.render('administrador/reportes/vendedor', { vendedores: vendedores })
    })
})

router.post('/ver-reporte-vendedor', ensureAuthenticated, (req, res) => {
    if (req.body.nombre == 'Todos') {
        RepoTarjeta.find().exec((error, respuesta) => {
            res.send(respuesta)
        })
    } else {
        RepoTarjeta.find().where({ vendedor: req.body.nombre }).exec((error, respuesta) => {
            res.send(respuesta)
        })
    }
})
router.post('/nombre-vendedor', ensureAuthenticated, (req,res)=>{
    User.findOne().where({codigo: req.body.codigo}).select('nombre codigo').exec((error, nombre)=>{
        res.send(nombre)
    })
})
router.post('/paga_cabeza', ensureAuthenticated, (req,res)=>{
    RepoTarjeta.findOneAndUpdate({codigo:req.body.codigo},{pagado_cabeza:true},(error, respuesta)=>{
        if(error)
            res.send('error')
        else
            res.send('ok')
    })
})
router.post('/paga_sub', ensureAuthenticated, (req,res)=>{
    RepoTarjeta.findOneAndUpdate({codigo:req.body.codigo},{pagado_vendedor:true},(error, respuesta)=>{
        if(error)
            res.send('error')
        else
            res.send('ok')
    })
})
router.post('/cabeza_principal', ensureAuthenticated, (req, res)=>{
    User.findOne().where({nombre: req.body.nombre}).select('referido').exec((error, cabeza)=>{
        if(cabeza==null)
            res.send({numero: req.body.numero, referido:'Ninguno'})
        else
            res.send({numero: req.body.numero, referido:cabeza.referido})
    })
})

module.exports = router;