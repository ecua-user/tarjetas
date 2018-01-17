//Dependencias necesarias______________________________
    express = require('express')
    router = express.Router()
//Confirma la autenticación del usuario________________
    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated() && req.user.esadministrador)
            return next();
        else
            res.redirect('/neutral');
    }
router.get('/eliminar-usuario', ensureAuthenticated, (req, res) => {
    User.find().where({ escliente: true }).exec((error, usuarios) => {
        if (error)
            res.render('errores/500', { error: error })
        else {
            User.find().where({ esvendedor: true }).exec((error, vendedores) => {
                res.render('administrador/cliente/eliminar', { usuarios: usuarios, vendedores: vendedores })
            })
        }
    })
})
router.post('/eliminar-cliente', ensureAuthenticated, (req, res) => {
    User.findOneAndRemove({ codigo: req.body.codigo }, (error, respuesta) => {
        if (error)
            res.send('Error al eliminar el cliente')
        else
            res.send('Cliente eliminado con éxito')
    })
})
    
router.get('/vendedores', ensureAuthenticated, (req, res) => {
    User.find().where({ esvendedor: true }).exec((error, vendedores) => {
        if (error)
            res.render('errores/500', { error: error })
        else
            res.render('administrador/cliente/vendedores', { vendedores, vendedores })
    })
})
router.post('/editar-cliente', ensureAuthenticated, (req, res) => {
    User.findOne().where({ codigo: req.body.codigo }).exec((error, usuario) => {
        if (error)
            res.send('Error')
        else
            res.send(usuario)
    })
})
router.post('/actualizar-cliente', ensureAuthenticated, (req, res) => {
    User.findOneAndUpdate({ username: req.body.username }, {
        nombre: req.body.nombre,
        edad: req.body.edad,
        sector: req.body.sector,
        cedula: req.body.cedula,
        telefono: req.body.telefono,
        direccion: req.body.direccion,
        referido: req.body.referido
    }, (error, respuesta) => {
        if (error)
            res.send('Error')
        else
            res.send('ok')
    })
})
module.exports = router;