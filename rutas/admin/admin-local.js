//Dependencias necesarias______________________________
    express = require('express')
    router = express.Router()
    multer = require('multer')
    fs = require('fs')
    passport = require('passport')
    LocalStrategy = require('passport-local').Strategy
    cloudinary = require('cloudinary')
    extend = require('extend');

//Modelos de datos a usar______________________________
    User = require('../../modelos/usuarios')
    Tarjeta = require('../../modelos/tarjetas')
    Tarjeta_uso=require('../../modelos//tarjeta_uso')

//Codifica los textos formateados
    function texto_ascii(texto) {
        var cadena = ''
        for (var i = 0; i < texto.length; i++) {
            var codigo = texto.charCodeAt(i);
            if (codigo < 100)
                codigo = '0' + codigo + ' '
            else
                codigo = codigo + ' '
            cadena += codigo
        }
        return cadena.substr(0, cadena.length - 1)
    }
    function ascii_texto(ascii) {
        codigos = ascii.split(' '), cadena = ''
        for (var i = 0; i < (codigos.length - 1); i++) {
            cadena += String.fromCharCode(codigos[i]) || ''
        }
        return cadena
    }

//Confirma la autenticación del usuario________________
    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated() && req.user.esadministrador)
            return next();
        else
            res.redirect('/neutral');
    }

//Crea los token_______________________________________
    function cadenaAleatoria() {
        longitud = 16
        caracteres = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        cadena = ""
        max = caracteres.length - 1
        for (var i = 0; i < longitud; i++) { cadena += caracteres[Math.floor(Math.random() * (max + 1))]; }
        return cadena;
    }

//Sube las imagenes____________________________________
    function carga_img(ruta, nombre, tipo, carpeta) {
        cloudinary.uploader.upload(ruta + nombre, (error, resultados) => {
            return resultados
        }, { public_id: carpeta + '/' + tipo + nombre })
    }

//Se comunica con el servicio de imágenes______________
    cloudinary.config({ cloud_name: 'tarjetas', api_key: '637393518342711', api_secret: '9sqZw-T6kWzHpqWmirFWBR0WHmg' });

router.get('/ingresar-local', ensureAuthenticated, (req, res) => {
    res.render('administrador/local/ingresar')
})

var upload = multer({ dest: 'recursos/modular/imagenes/locales' })
var cpUpload = upload.fields([{ name: 'logotipo', maxCount: 1 }, { name: 'beneficios', maxCount: 3 }])

router.post('/ingresar-local', ensureAuthenticated, cpUpload, (req, res) => {
    destino = 'recursos/modular/imagenes/locales/'
    img_bene_rest = new Array()
    var imagenes = new Array()
    logotipo = req.files.logotipo[0].filename
    imagenes.push({ logo: logotipo })
    var imgben = new Array()
    carga_img(destino, req.files.logotipo[0].filename, 'logo', 'locales')
    for (var i = 0; i < req.files.beneficios.length; i++) {
        imgben.push(req.files.beneficios[i].filename)
        carga_img(destino, req.files.beneficios[i].filename, 'bene', 'locales')
        if (Array.isArray(req.body.beneficio) || Array.isArray(req.body.restricciones)) {
            img_bene_rest.push({
                codigo: Date.now(),
                activo: true,
                imagen: 'http://res.cloudinary.com/tarjetas/image/upload/v1/locales/bene' + req.files.beneficios[i].filename,
                beneficio: texto_ascii(req.body.beneficio[i]),
                restriccion: texto_ascii(req.body.restricciones[i]),
                fecha_activacion: ''
            })
        } else {
            img_bene_rest.push({
                codigo: Date.now(),
                activo: true,
                imagen: 'http://res.cloudinary.com/tarjetas/image/upload/v1/locales/bene' + req.files.beneficios[i].filename,
                beneficio: texto_ascii(req.body.beneficio),
                restriccion: texto_ascii(req.body.restricciones),
                fecha_activacion: ''
            })
        }
    }
    imagenes.push({ benefic: imgben })
    nuevoLocal = new User({
        codigo: Date.now(),
        nombre: req.body.nombre,
        username: req.body.username,
        password: req.body.password,
        esadministrador: false,
        token: cadenaAleatoria(),
        escliente: false,
        activo: true,
        esvendedor: false,
        eslocal: true,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        logotipo: 'http://res.cloudinary.com/tarjetas/image/upload/v1/locales/logo' + logotipo,
        beneficio: img_bene_rest,
        facebook: req.body.linkface,
        instagram: req.body.linkInst,
        horario: req.body.horario,
        web: req.body.website,
        mapa: req.body.mapa
    })
    User.createUser(nuevoLocal, (e, user) => {
        if (e)
            res.render('errores/500', { error: e })
        else
            res.render('administrador/local/ingresar', { success_msg: 'Local ingresado con éxito' })
    })
})

router.get('/modificar-local', ensureAuthenticated, (req, res) => {
    User.find().where({ eslocal: true }).exec((err, local) => {
        res.render('administrador/local/modificar-eliminar', { local: local });
    })
})
    
router.post('/obtener-local', ensureAuthenticated, (req, res) => {
    User.findOne().where({ codigo: req.body.codigo }).exec((error, local) => {
        if (error)
            res.send('Error: ' + error)
        else
            res.send(local)
    })
})

cpUpload = upload.fields([{ name: 'logotipo', maxCount: 1 }, { name: 'beneficios', maxCount: 3 }])
router.post('/modificar-local', ensureAuthenticated, cpUpload, (req, res) => {
    destino = 'recursos/modular/imagenes/locales/'
    var bandera=true
    var local_para_tarjeta= new Array()
    var logo = '', benef = new Array()
    User.findOne().where({ codigo: req.body.codigo }).exec((error, local) => {
        if (error)
            res.render('errores/500')
        else {
            try {
                carga_img(destino, req.files.logotipo[0].filename, 'logo', 'locales')
                logo = 'http://res.cloudinary.com/tarjetas/image/upload/v1/locales/logo' + req.files.logotipo[0].filename
            }
            catch (error) {
                logo = local.logotipo
            }
            try {
                for (var i = 0; i < req.files.beneficios.length; i++) {
                    carga_img(destino, req.files.beneficios[i].filename, 'bene', 'locales')
                    if (Array.isArray(req.body.beneficio) || Array.isArray(req.body.restricciones)) {
                        benef.push({
                            codigo: Date.now(),
                            activo: true,
                            imagen: 'http://res.cloudinary.com/tarjetas/image/upload/v1/locales/bene' + req.files.beneficios[i].filename,
                            beneficio: texto_ascii(req.body.beneficio[i]),
                            restriccion: texto_ascii(req.body.restricciones[i])
                        })
                    } else {
                        benef.push({
                            codigo: Date.now(),
                            activo: true,
                            imagen: 'http://res.cloudinary.com/tarjetas/image/upload/v1/locales/bene' + req.files.beneficios[i].filename,
                            beneficio: texto_ascii(req.body.beneficio),
                            restriccion: texto_ascii(req.body.restricciones)
                        })
                    }
                }
                bandera=false
                for (var i = 0; i < benef.length; i++) {
                    local_para_tarjeta.push({
                        imagen:benef[i].imagen,
                        activo:true,
                        codigo:benef[i].codigo,
                        fecha_activacion:""
                    })
                }

            } catch (error) {
                benef = local.beneficio
                for (var i = 0; i < benef.length; i++) {
                    if (Array.isArray(req.body.restricciones) || Array.isArray(req.body.beneficio)) {
                        benef[i].restriccion = texto_ascii(req.body.restricciones[i])
                        benef[i].beneficio = texto_ascii(req.body.beneficio[i])
                    } else {
                        benef[i].restriccion = texto_ascii(req.body.restricciones)
                        benef[i].beneficio = texto_ascii(req.body.beneficio)
                    }
                }
            }
            var query = {
                nombre: req.body.nombre,
                direccion: req.body.direccion,
                telefono: req.body.telefono,
                logotipo: logo,
                beneficio: benef,
                facebook: req.body.linkface,
                instagram: req.body.linkInst,
                apertura: req.body.abierto,
                cierre: req.body.cierre,
                web: req.body.website,
                mapa: req.body.mapa,
                username: req.body.username
            }
            User.findOneAndUpdate({ codigo: req.body.codigo }, query, (error, respuesta) => {
                if (error)
                    res.render('errores/500', { error: error })
                else {
                    User.find().where({ eslocal: true }).exec((err, local) => {
                        //IMPORTANTE ACTUALIZAR LOCALES EN LAS TARJETAS
                        if(!bandera){
                            Tarjeta.find().select('locales codigo').where({locales:{ $elemMatch:{local:req.body.codigo}}}).exec((error, grupo_trj)=>{
                                if(error)
                                    res.render('errores/500', { error: error })
                                else{
                                    for(var i=0; i < grupo_trj.length; i++){
                                        for(var j=0; j < grupo_trj[i].locales.length; j++){
                                            if(grupo_trj[i].locales[j].local==req.body.codigo){
                                                grupo_trj[i].locales[j].beneficio=local_para_tarjeta
                                                j=grupo_trj[i].locales.length
                                            }
                                        }
                                        Tarjeta.findOneAndUpdate({codigo:grupo_trj[i].codigo},{locales:grupo_trj[i].locales},(error, listo)=>{})
                                        Tarjeta_uso.find().where({cabeza:grupo_trj[i].codigo}).exec((error, usadas)=>{
                                            if(usadas!=null){
                                                for(var j=0; j< usadas.length; j++){
                                                    for(var k=0; k < usadas[j].locales.length;k++){
                                                        if(usadas[j].locales[k].local==req.body.codigo){
                                                            usadas[j].locales[k].beneficio=local_para_tarjeta
                                                        }
                                                    }
                                                }
                                            }                                          
                                        })
                                    }
                                    res.render('administrador/local/modificar-eliminar', { local: local, success_msg: 'Actualizado con éxito' });
                                 }
                            })
                        }else{
                            res.render('administrador/local/modificar-eliminar', { local: local, success_msg: 'Actualizado con éxito' });
                        }
                    })
                }
            })
        }
    })
})

router.post('/eliminar-local', ensureAuthenticated, (req, res) => {
    User.findOneAndRemove({ codigo: req.body.codigo }, (error, respuesta) => {
        if (error)
            res.send('Error: ' + error)
        else{           
            Tarjeta.find().select('locales codigo')
                .where({locales:{ $elemMatch:{local:req.body.codigo}}})
                    .exec((error, grupo_trj)=>{
                        if(grupo_trj!=null){                           
                            for(var i=0; i < grupo_trj.length; i++){
                                for(var j=0; j< grupo_trj[i].locales.length;j++){
                                    if(grupo_trj[i].locales[j].local==req.body.codigo){
                                       (grupo_trj[i].locales).splice(j,1)
                                       j=grupo_trj[i].locales.length
                                    }
                                }
                                Tarjeta.findOneAndUpdate({codigo:grupo_trj[i].codigo},{locales:grupo_trj[i].locales},(error, listo)=>{})
                                Tarjeta_uso.find().where({cabeza:grupo_trj[i].codigo}).exec((error, usadas)=>{
                                    if(usadas!=null){
                                        for(var j=0; j< usadas.length; j++){
                                            for(var k=0; k< usadas[j].locales.length; k++){
                                                if(usadas[j].locales[k].local==req.body.codigo){
                                                    (usadas[j].locales).splice(k,1)
                                                }
                                            }
                                            Tarjeta_uso.findOneAndUpdate({cabeza:grupo_trj[i].codigo},{locales:usadas[j].locales},(error, listo)=>{})
                                        }
                                    }
                                })
                            }
                        }
            })
            res.send('Elimiando con éxito')
        }       
    })
})

module.exports = router;