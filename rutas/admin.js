//Dependencias necesarias______________________________
    express = require('express')
    router = express.Router()
    multer = require('multer')
    fs = require('fs')
    passport = require('passport')
    LocalStrategy = require('passport-local').Strategy
    cloudinary = require('cloudinary')

//Modelos de datos a usar______________________________
    User = require('../modelos/usuarios')
    Tarjeta = require('../modelos/tarjetas')
    ImgTarjeta = require('../modelos/img_tarjetas')
    Configuracion = require('../modelos/configuracion')
    Video = require('../modelos/videos')

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

//Vista principal______________________________________
    router.get('/', ensureAuthenticated, (req, res) => { res.render('administrador/inicio') })

//Locales comerciales__________________________________
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
                    beneficio: req.body.beneficio[i],
                    restriccion: req.body.restricciones[i]
                })
            } else {
                img_bene_rest.push({
                    codigo: Date.now(),
                    activo: true,
                    imagen: 'http://res.cloudinary.com/tarjetas/image/upload/v1/locales/bene' + req.files.beneficios[i].filename,
                    beneficio: req.body.beneficio,
                    restriccion: req.body.restricciones
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
            apertura: req.body.abierto,
            cierre: req.body.cierre,
            web: req.body.website
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
                                beneficio: req.body.beneficio[i],
                                restriccion: req.body.restricciones[i]
                            })
                        } else {
                            benef.push({
                                codigo: Date.now(),
                                activo: true,
                                imagen: 'http://res.cloudinary.com/tarjetas/image/upload/v1/locales/bene' + req.files.beneficios[i].filename,
                                beneficio: req.body.beneficio,
                                restriccion: req.body.restricciones
                            })
                        }
                    }
                } catch (error) {
                    benef = local.beneficio
                    for (var i = 0; i < benef.length; i++) {
                        if (Array.isArray(req.body.restricciones) || Array.isArray(req.body.beneficio)) {
                            benef[i].restriccion = req.body.restricciones[i]
                            benef[i].beneficio = req.body.beneficio[i]
                        } else {
                            benef[i].restriccion = req.body.restricciones
                            benef[i].beneficio = req.body.beneficio
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
                    web: req.body.website
                }
                User.findOneAndUpdate({ codigo: req.body.codigo }, query, (error, respuesta) => {
                    if (error)
                        res.render('errores/500', { error: error })
                    else {
                        User.find().where({ eslocal: true }).exec((err, local) => {
                            res.render('administrador/local/modificar-eliminar', { local: local, success_msg: 'Actualizado con éxito' });
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
            else
                res.send('Elimiando con éxito')
        })
    })

//Vendedor_____________________________________________
    router.get('/ingresar-vendedor', ensureAuthenticated, (req, res) => { res.render('administrador/vendedor/ingresar') })

    router.post('/ingresar-vendedor', ensureAuthenticated, (req, res) => {
        if (req.body.password != req.body.rpassword) {
            res.render('administrador/vendedor/ingresar', { error: 'Contraseñas no coinciden' })
            return
        }
        if (Number(req.body.edad) < 18) {
            res.render('administrador/vendedor/ingresar', { error: 'Debe ser mayor de edad para poder registrarse' })
            return
        }
        User.findOne().where({ username: req.body.username }).exec((e, resp) => {
            if (resp != null)
                res.render('administrador/vendedor/ingresar', { error: 'Ya existe un usuario con este correo' })
            else {
                newUser = new User({
                    codigo: Date.now(),
                    nombre: req.body.nombre,
                    cedula: req.body.cedula,
                    telefono: req.body.telefono,
                    sector: req.body.sector,
                    direccion: req.body.direccion,
                    edad: req.body.edad,
                    genero: req.body.genero,
                    username: req.body.username,
                    password: req.body.password,
                    eslocal: false,
                    esadministrador: false,
                    token: req.body.token,
                    activo: true,
                    esvendedor: true,
                    imagen: ""
                })
                User.createUser(newUser, (e, user) => {
                    if (e)
                        res.render('errores/500', { error: e })
                    else
                        res.render('administrador/vendedor/ingresar', { success_msg: 'Registrado con éxito' })
                })
            }
        })
    })

    router.get('/modificar-vendedor', ensureAuthenticated, (req, res) => {
        User.find().where({ esvendedor: true }).exec((error, vendedor) => {
            if (error)
                res.render('errores/500', { error: error })
            else
                res.render('administrador/vendedor/modificar-eliminar', { vendedor: vendedor })
        })
    })
    router.post('/modificar-vendedor-obtener', ensureAuthenticated, (req, res) => {
        User.findOne().where({ codigo: req.body.codigo }).exec((error, vendedor) => {
            if (error)
                res.send('Error: ' + error)
            else
                res.send(vendedor)
        })
    })

    router.post('/modificar-vendedor', ensureAuthenticated, (req, res) => {
        User.findOneAndUpdate({ username: req.body.username }, {
            nombre: req.body.nombre,
            edad: req.body.edad,
            sector: req.body.sector,
            genero: req.body.genero,
            telefono: req.body.telefono,
            direccion: req.body.direccion
        }, (err) => {
            if (err)
                res.render('errores/500', { error: err })
            else
                res.redirect('/admin/modificar-vendedor')
        })
    })
    /*Elimina al vendedor */
    router.post('/eliminar-vendedor', ensureAuthenticated, (req, res) => {
        User.findOneAndRemove({ codigo: req.body.codigo }, (error, respuesta) => {
            if (error)
                res.send('Error: ' + error)
            else
                res.send('Elimiando con éxito')
        })
    })

    router.get('/asignar-vendedor', ensureAuthenticated, (req, res) => {
        User.find().where({esvendedor: true}).exec((err,vendedores)=>{
            if(err)
                res.render('errores/500',{error:err})
            else
                res.render('administrador/vendedor/asignar',{vendedor:vendedores})
        })  
    })

    router.post('/comprobacion',ensureAuthenticated,(req,res)=>{
        var query=new Array()
        for(var i=req.body.tarjeta_ini;i<=req.body.tarjeta_fin;i++){
            query.push({$and:[{'numero':i},{'vendedor':""}]})
        }
        Tarjeta.find().where({$or:query}).exec((err,respuesta)=>{
            res.send(''+respuesta.length)
        })
    })

    router.post('/asignar-vendedor',ensureAuthenticated,(req,res)=>{
        try {
            for(var i=req.body.tarjeta_ini;i<=req.body.tarjeta_fin;i++){
                Tarjeta.findOneAndUpdate({numero:i},{vendedor:req.body.vendedor, fechaasignacion: new Date(req.body.fecha)},(err,resp)=>{})
            }
            res.send('Tarjetas asignadas') 
        } catch (error) {
            res.send('Error')
        }                 
    })

//Tarjeta______________________________________________
    router.get('/reg-tarj', ensureAuthenticated, (req, res) => {
        User.find().where({ eslocal: true }).exec((error, locales) => {
            res.render('administrador/tarjeta/ingresar', { locales: locales })
        })
    })
    router.post('/ing-tarjeta', ensureAuthenticated, (req, res) => {
        codigo = Date.now() + '.png'
        storage = multer.diskStorage({
            destination: (req, file, cb) => { cb(null, 'recursos/modular/imagenes/tarjetas') },
            filename: (req, file, cb) => { cb(null, codigo) }
        });
        upload = multer({
            storage: storage, fileFilter: (req, file, cb) => {
                if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') { cb(null, true); } else { cb(null, false); }
            }
        }).single('image_producto');
        upload(req, res, (err) => {
            if (err)
                res.render('errores/500', { error: err })
            else {
                query = new Array()
                locales = req.body.locales
                elegidos = new Array()
                numeroinicial = req.body.inicial
                numerofinal = req.body.final
                if (!(Array.isArray(locales)))
                    locales = [locales]
                for (var i = numeroinicial; i <= numerofinal; i++) { query.push({ 'numero': i }) }

                var locales_escogidos_tarjeta = new Array()
                for (var i = 0; i < locales.length; i++) {
                    locales_escogidos_tarjeta.push({codigo:locales[i]})
                }
                User.find().where({ $or: locales_escogidos_tarjeta }).exec((error, locales_respuesta) => {
                    for (var i = 0; i < locales_respuesta.length; i++) {
                        elegidos.push({ local: locales_respuesta[i].codigo, beneficio: locales_respuesta[i].beneficio })
                    }
                    Tarjeta.find().where({ $or: query }).exec((err, tarjetas) => {
                        if (err)
                            res.render('errores/500', { error: err })
                        else {
                            if (tarjetas.length != 0) {
                                errores = ``
                                for (var i = 0; i < tarjetas.length; i++) {
                                    errores += `${tarjetas[i].numero}, `
                                }
                                res.render('errores/500', { error: `No se ha podido registrar, Estas tarjetas ya se encuentran registradas: ${errores}` })
                            } else {
                                newCodigo = 'img' + Date.now()
                                cloudinary.uploader.upload("recursos/modular/imagenes/tarjetas/" + codigo, (result) => {
                                    for (var i = numeroinicial; i <= numerofinal; i++) {
                                        var nuevaTarjeta = new Tarjeta({
                                            numero: i,
                                            fechainicial: new Date(req.body.fini),
                                            fechafinal: new Date(req.body.ffin),
                                            locales: elegidos,
                                            imagen: newCodigo,
                                            activo: false,
                                            vendedor: "",
                                            vendida: false,
                                            activacion: cadenaAleatoria(),
                                            cliente: ""
                                        })
                                        nuevaTarjeta.save((error, respuesta) => {
                                            if (error)
                                                console.log(error)
                                        })
                                    }
                                    User.find().where({ eslocal: true }).exec((error, locales) => {
                                        newImagen = new ImgTarjeta({
                                            codigo: newCodigo,
                                            imagen: result.url,
                                            locales: elegidos,
                                            inicial: new Date(req.body.fini),
                                            final: new Date(req.body.ffin),
                                            linkface:req.body.linkface,
                                            linkInst:req.body.linkInst,
                                            titulo: req.body.titulo
                                        })
                                        newImagen.save((err, guardado) => {
                                            if (err)
                                                res.render('errores/500', { error: err })
                                            else
                                                res.render('administrador/tarjeta/ingresar', { locales: locales, success_msg: 'Registrado con éxito' })
                                        })
                                    })
                                }, { public_id: 'tarjetas/' + newCodigo })
                            }
                        }
                    })
                })
            }
        })
    })
    router.get('/mod-tarj', ensureAuthenticated, (req, res) => {
        var todasTarjetas=new Array()
        ImgTarjeta.find().exec((error,imgs)=>{
            Tarjeta.find().exec((error, tarjetas)=>{
                for(var i=0;i<imgs.length;i++){
                    var tarjeta_por_grupo=new Array()
                    for(var j=0;j<tarjetas.length;j++){
                        if(imgs[i].codigo==tarjetas[j].imagen){
                            tarjeta_por_grupo.push(Number(tarjetas[j].numero))
                        }
                    }
                    tarjeta_por_grupo=tarjeta_por_grupo.sort(function(a, b){return a-b})
                    todasTarjetas.push({identificador:imgs[i].codigo, inicial:tarjeta_por_grupo[0], final:tarjeta_por_grupo[tarjeta_por_grupo.length-1]})
                }
                res.render('administrador/tarjeta/modificar-eliminar',{tarjetas:todasTarjetas})
            })
        })   
    })
    router.post('/consultar-numero',ensureAuthenticated,(req,res)=>{
        Tarjeta.findOne().where({numero:req.body.numero}).exec((error, tarjeta)=>{
            if(error)
                res.send(error)
            else{
                try {
                    var locales=new Array()
                    for(var i=0; i<tarjeta.locales.length;i++){
                        locales.push({codigo:tarjeta.locales[i].local})
                    }
                    var resultado=new Array()
                    User.find().where({$or:locales}).exec((e, loc)=>{
                        if(e)
                            res.send(e)
                        else{
                            resultado.push(tarjeta)
                            resultado.push(loc)
                            res.send(resultado)
                        }      
                    })
                } catch (error) {
                    res.send('Solo números')
                }
                
            }                
        })
    })
    router.post('/eliminar-numero',ensureAuthenticated,(req,res)=>{
        Tarjeta.findOne().where({numero:req.body.numero}).exec((e, tarj)=>{
            if(e)
                res.send('Ha ocurrido un error de internet')
            else{
                if(tarj==null)
                    res.send('Esta tarjeta no existe')
                else{
                    Tarjeta.findOneAndRemove({numero:req.body.numero},(error, respuesta)=>{
                        if(error)
                            res.send(error)
                        else{
                            res.send('Eliminado con éxito')
                        }      
                    })
                }
            }
        })
    })
    router.post('/detalles-masa', ensureAuthenticated, (req,res)=>{
        var resultados=new Array()
        ImgTarjeta.findOne().where({codigo:req.body.codigo}).exec((error, tarjeta)=>{
            if(error)
                res.send(error)
            else{
                try {
                    resultados.push(tarjeta)
                    User.find().where({eslocal:true}).select('codigo nombre').exec((e, loc_det)=>{
                        if(e)
                            res.send(e)
                        else{
                            resultados.push(loc_det)
                            res.send(resultados)
                        }
                    })
                } catch (error) {
                    res.send('Error, no existe información')
                }               
            }                
        })
    })
    router.post('/actualizar-numero', ensureAuthenticated, (req, res)=>{       
        Tarjeta.findOne().where({numero:req.body.numero}).exec((e,tarjeta)=>{
            if(e)
                res.send(e)
            else{
                var bene=tarjeta.locales
                try {
                    for(var i=0;i < bene.length;i++){
                        for(var j=0;j < req.body.cambios.length;j++){
                            if(bene[i].local==req.body.cambios[j].codigo){
                                for(var k=0;k<bene[i].beneficio.length;k++){
                                    bene[i].beneficio[k].activo=req.body.cambios[j].beneficios[k].estado
                                }
                            }
                        }
                    }
                    Tarjeta.findOneAndUpdate({numero:req.body.numero},{locales:bene, fechainicial: new Date(req.body.inicial), fechafinal:new Date(req.body.final)},(error, respuesta)=>{
                        if(error)
                            res.send('Error')
                        else
                            res.send('ok')
                    })
                } catch (error) {
                    res.send('Error')
                }
            }
        })
    })
    router.post('/modificar-masa', ensureAuthenticated, (req,res)=>{
        codigo = Date.now() + '.png'
        storage = multer.diskStorage({
            destination: (req, file, cb) => { cb(null, 'recursos/modular/imagenes/tarjetas') },
            filename: (req, file, cb) => { cb(null, codigo) }
        });
        upload = multer({
            storage: storage, fileFilter: (req, file, cb) => {
                if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') { cb(null, true); } else { cb(null, false); }
            }
        }).single('image_producto');
        upload(req, res, (err) => {
            if (err)
                res.render('errores/500', { error: err })
            else {
                elegidos = new Array()
                locales = req.body.locales
                var locales_escogidos_tarjeta = new Array()
                if (!(Array.isArray(locales)))
                    locales = [locales]
                for (var i = 0; i < locales.length; i++) {
                    locales_escogidos_tarjeta.push({codigo:locales[i]})
                }
                User.find().where({ $or: locales_escogidos_tarjeta }).exec((error, locales_respuesta) => {
                    for (var i = 0; i < locales_respuesta.length; i++) {
                        elegidos.push({ local: locales_respuesta[i].codigo, beneficio: locales_respuesta[i].beneficio })
                    }
                    cloudinary.uploader.upload("recursos/modular/imagenes/tarjetas/" + codigo, (result) => {
                        ImgTarjeta.findOne().where({codigo:req.body.codigo}).select('imagen').exec((error, respuesta_img)=>{
                            var img_tr=respuesta_img.imagen
                            if(result.url!=null){
                                img_tr=result.url
                            }
                                
                            query={
                                imagen: img_tr,
                                locales: elegidos,
                                inicial: new Date(req.body.fini),
                                final: new Date(req.body.ffin),
                                linkface:req.body.linkface,
                                linkInst:req.body.linkInst,
                                titulo: req.body.titulo
                            }
                            ImgTarjeta.findOneAndUpdate({codigo:req.body.codigo},query,(error, respuesta)=>{
                                Tarjeta.find().where({imagen:req.body.codigo}).select('numero').exec((error, respu)=>{
                                    try {
                                        for(var i=0;i<respu.length;i++){
                                            Tarjeta.findOneAndUpdate({numero: respu[i].numero},{fechainicial:new Date(req.body.fini), fechafinal:new Date(req.body.ffin), locales:elegidos},(error, resp)=>{
            
                                            })
                                        }
                                        res.redirect('/admin/mod-tarj')
                                    } catch (error) {
                                        res.render('errores/500',{error: 'No se ha podido concretar error: '+error})
                                    }
                                })
                            })                            
                        })
                    }, { public_id: 'tarjetas/' + req.body.codigo})
                })               
            }
        })
    })
    router.post('/eliminar-tarjetas', ensureAuthenticated, (req,res)=>{
        ImgTarjeta.findOneAndRemove({codigo:req.body.codigo},(error, respuesta)=>{
            Tarjeta.remove({imagen:req.body.codigo},(error, resultado)=>{
                if(error)
                    res.render('errores/500',{error:error})
                else{
                    res.redirect('/admin/mod-tarj')
                }
            })
        })
    })
//Permite el enrutamiento
module.exports = router;