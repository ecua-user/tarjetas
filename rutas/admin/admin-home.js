//Dependencias necesarias______________________________
    express = require('express')
    router = express.Router()
    multer = require('multer')
    fs = require('fs')
    passport = require('passport')
    LocalStrategy = require('passport-local').Strategy
    cloudinary = require('cloudinary')
    extend = require('extend');

    Imagen_ben = require('../../modelos/imagenes')
    Video = require('../../modelos/videos')

//Confirma la autenticación del usuario________________
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user.esadministrador)
        return next();
    else
        res.redirect('/neutral');
}

router.get('/slider', ensureAuthenticated, (req, res) => {
    Video.find().exec((err, videos) => {
        Imagen_ben.find().exec((err, imagenes) => {
            res.render('administrador/home/slider', { videos: videos, imagenes: imagenes })
        })
    })
})

router.post('/home-video', ensureAuthenticated, (req, res) => {
    var nuevoVideo = new Video({
        codigo: Date.now(),
        titulo: req.body.titulo,
        url: req.body.link
    })
    nuevoVideo.save((error, respuesta) => {
        if (error)
            res.render('errores/500', { error: error })
        else
            res.redirect('/admin-home/slider')
    })
})
router.post('/eliminar-video', ensureAuthenticated, (req, res) => {
    Video.findOneAndRemove({ codigo: req.body.codigo }, (error, respuesta) => {
        if (error)
            res.send('Error')
        else 
            res.send('Elimiando con éxito')
    })
})
router.post('/home-imagenes', (req, res) => {
    codigoIM = Date.now()
    codigoIMG = codigoIM + '.png'
    storage = multer.diskStorage({
        destination: (req, file, cb) => { cb(null, 'recursos/modular/imagenes/beneficios') },
        filename: (req, file, cb) => { cb(null, codigoIMG) }
    });
    upload = multer({
        storage: storage, fileFilter: (req, file, cb) => {
            if (file.mimetype == 'image/png' || file.mimetype == 'image/gif' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') { cb(null, true); } else { cb(null, false); }
        }
    }).single('imagen_bene');
    upload(req, res, (err) => {
        if (err)
            res.render('errores/500', { error: err })
        else {
            cloudinary.uploader.upload("recursos/modular/imagenes/beneficios/" + codigoIMG, (result) => {
                if (!result.url) 
                    res.render('errores/500', { error: result.error })
                else {
                    var nuevoSlider = new Imagen_ben({
                        codigo: 'IMG' + codigoIM,
                        imagen: result.url
                    })
                    nuevoSlider.save((e, resp) => {
                        if (e)
                            res.render('errores/500', { error: e })
                        else 
                            res.redirect('/admin-home/slider')
                    })
                }
            }, { public_id: 'slider/' + codigoIM })
        }
    })
})

router.post('/eliminar-imagen', ensureAuthenticated, (req, res) => {
    Imagen_ben.findOneAndRemove({ codigo: req.body.codigo }, (error, respuesta) => {
        if (error)
            res.send('Error')
        else
            res.send('OK')
    })
})
module.exports = router;
