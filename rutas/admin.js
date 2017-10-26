//Dependencias necesarias___________________________________________________________________________________
    express = require('express')
    router = express.Router()
    multer = require('multer')
    fs = require('fs')
    passport = require('passport')
    LocalStrategy = require('passport-local').Strategy
    cloudinary = require('cloudinary')

//Modelos de datos a usar___________________________________________________________________________________
    User = require('../modelos/usuarios')
    Tarjeta = require('../modelos/tarjetas')
    ImgTarjeta = require('../modelos/img_tarjetas')

//Confirma la autenticación del usuario_____________________________________________________________________
    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated() && req.user.esadministrador)
            return next();
        else
            res.redirect('/neutral');
    }
//Crea los token____________________________________________________________________________________________
    function cadenaAleatoria() {
        longitud = 16
        caracteres = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        cadena = ""
        max = caracteres.length - 1
        for (var i = 0; i < longitud; i++) { cadena += caracteres[Math.floor(Math.random() * (max + 1))];}
        return cadena;
    }
//Se comunica con el servicio de imágenes___________________________________________________________________
    cloudinary.config({ cloud_name: 'tarjetas', api_key: '637393518342711', api_secret: '9sqZw-T6kWzHpqWmirFWBR0WHmg' });

//Vista principal___________________________________________________________________________________________
    router.get('/', ensureAuthenticated, (req, res) => { res.render('admin') })

//Vendedor__________________________________________________________________________________________________

    /*Ingreso-get*/
    router.get('/ingresar-vendedor', ensureAuthenticated, (req, res) => { res.render('admin-ingresar-vendedor') })
    
    /*Ingreso-post*/
    router.post('/ingresar-vendedor', ensureAuthenticated, (req, res) => {
        if (req.body.password != req.body.rpassword)
            res.render('admin-ingresar-vendedor', { error: 'Contraseñas no coinciden' })
        else {
            if (Number(req.body.edad) < 18)
                res.render('admin-ingresar-vendedor', { error: 'Debe ser mayor de edad para poder registrarse' })
            else {
                User.findOne().where({ username: req.body.username }).exec((e, resp) => {
                    if (resp != null) 
                        res.render('admin-ingresar-vendedor', { error: 'Ya existe un usuario con este correo' })
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
                                res.render('500', { error: e })
                            else
                                res.render('admin-ingresar-vendedor', { success_msg: 'Registrado con éxito' })
                        })
                    }
                })
            }
        }
    })
    
    /*Modificación y eliminación get*/
    router.get('/modificar-vendedor', ensureAuthenticated, (req, res) => {
        User.find().where({ esvendedor: true }).exec((error, vendedor) => {
            if (error)
                res.render('500', { error: error })
            else
                res.render('admin-modificar-vendedor', { vendedor: vendedor })
        })
    })
    
    /*Obtiene la información del vendedor */
    router.post('/modificar-vendedor-obtener', ensureAuthenticated, (req, res) => {
        User.findOne().where({ codigo: req.body.codigo }).exec((error, vendedor) => {
            if (error)
                res.send('Error: ' + error)
            else
                res.send(vendedor)
        })
    })
    
    /*Modifica al vendedor */
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
                res.render('500', { error: err })
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
    
    /*Asignación de tarjetas*/
    router.get('/asignar-vendedor', ensureAuthenticated, (req, res) => {
        res.render('admin-asignar-vendedor')
    })

//Local_____________________________________________________________________________________________________

    /*Ingreso-get*/
    router.get('/ingresar-local', ensureAuthenticated,(req, res) => { res.render('admin-ingresar-local') })
    
    /*Ingreso-post */
    var upload = multer({ dest: 'recursos/especifico/imagenes/locales' })
    var cpUpload = upload.fields([{ name: 'image_beneficio', maxCount: 1 }, { name: 'image_logotipo', maxCount: 8 }])
    router.post('/ingresar-local',cpUpload,ensureAuthenticated, (req, res) => {
        destino='recursos/especifico/imagenes/locales/'
        codigo=Date.now();
        var imagenes=[{imagen:req.files.image_logotipo[0].filename},{imagen:req.files.image_beneficio[0].filename}]
        cloudinary.uploader.upload(destino + imagenes[0].imagen, (result_logo) => {
            cloudinary.uploader.upload(destino + imagenes[1].imagen, (result_bene) => {
                newUser = new User({
                    codigo: codigo,
                    nombre: req.body.nombre,
                    username: req.body.username,
                    password: req.body.password,
                    eslocal: true,
                    esadministrador: false,
                    token: cadenaAleatoria(),
                    activo: true,
                    direccion:req.body.direccion,
                    logotipo: result_logo.url,
                    tarjeta:codigo,
                    telefono:req.body.telefono,
                    beneficio:req.body.beneficio,
                    beneficio_img:result_bene.url,
                    adicional:req.body.adicional
                })
                User.createUser(newUser, (e, user) => {
                    if (e)
                        res.render('500', { error: e })
                    else{
                        res.render('admin-ingresar-local', { success_msg: 'Local ingresado con éxito' })
                    }      
                })
             }, { public_id: 'tarjetas/bene' + codigo })
        }, { public_id: 'locales/logo' + codigo })
    })
    
    /*Modificar y eliminar get*/
    router.get('/modificar-local', ensureAuthenticated, (req, res) => {
        User.find().where({ eslocal: true }).exec((err, local) => {
            res.render('admin-modificar-local', { local: local });
        })
    })
    
    /*Modificación y eliminación post*/
    cpUpload = upload.fields([{ name: 'image_beneficio', maxCount: 1 }, { name: 'image_logotipo', maxCount: 8 }])
    router.post('/modificar-local', cpUpload,ensureAuthenticated, (req, res) => {
        destino='recursos/especifico/imagenes/locales/'
        logo='',bene=''
        if(req.files.image_logotipo==undefined && req.files.image_beneficio==undefined){
            query = { 
                username: req.body.username, 
                nombre: req.body.nombre, 
                beneficio:req.body.beneficio, 
                direccion:req.body.direccion,
                telefono:req.body.telefono 
            }
            User.findOneAndUpdate({ codigo: req.body.codigo }, query, (err, resp) => {
                if (err)
                    res.send('500', { error: err })
                else
                    res.redirect('/admin/modificar-local')
            })
        }else{
            if(req.files.image_logotipo!=undefined && req.files.image_beneficio==undefined){
                cloudinary.uploader.upload(destino + req.files.image_logotipo[0].filename, (result_logo) => {
                    query = { 
                        username: req.body.username, 
                        nombre: req.body.nombre, 
                        beneficio:req.body.beneficio, 
                        direccion:req.body.direccion,
                        telefono:req.body.telefono,
                        logotipo:result_logo.url
                    }
                    User.findOneAndUpdate({ codigo: req.body.codigo }, query, (err, resp) => {
                        if (err)
                            res.send('500', { error: err })
                        else
                            res.redirect('/admin/modificar-local')
                    })
                },{public_id: 'tarjetas/logo' + req.body.codigo })
            }else{
                if(req.files.image_logotipo==undefined && req.files.image_beneficio!=undefined){
                    cloudinary.uploader.upload(destino + req.files.image_beneficio[0].filename, (result_bene) => {
                        query = { 
                            username: req.body.username, 
                            nombre: req.body.nombre, 
                            beneficio:req.body.beneficio, 
                            direccion:req.body.direccion,
                            telefono:req.body.telefono,
                            beneficio_img:result_bene.url
                        }
                        User.findOneAndUpdate({ codigo: req.body.codigo }, query, (err, resp) => {
                            if (err)
                                res.send('500', { error: err })
                            else
                                res.redirect('/admin/modificar-local')
                        })
                    },{public_id: 'tarjetas/bene' + req.body.codigo })
                }else{
                    var imagenes=[{imagen:req.files.image_logotipo[0].filename},{imagen:req.files.image_beneficio[0].filename}]
                    cloudinary.uploader.upload(destino + imagenes[0].imagen, (result_logo) => {
                        cloudinary.uploader.upload(destino + imagenes[1].imagen, (result_bene) => {
                            query = { 
                                username: req.body.username, 
                                nombre: req.body.nombre, 
                                beneficio:req.body.beneficio, 
                                direccion:req.body.direccion,
                                telefono:req.body.telefono,
                                beneficio_img:result_bene.url,
                                logotipo:result_logo.url
                            }
                            User.findOneAndUpdate({ codigo: req.body.codigo }, query, (err, resp) => {
                                if (err)
                                    res.send('500', { error: err })
                                else
                                    res.redirect('/admin/modificar-local')
                            })
                         }, { public_id: 'tarjetas/bene' + req.body.codigo })
                    }, { public_id: 'locales/logo' + req.body.codigo })
                }
            }
        }
    })
    
    /*Eliminar local*/
    router.post('/eliminar-local', ensureAuthenticated, (req, res) => {
        User.findOneAndRemove({ codigo: req.body.codigo }, (error, respuesta) => {
            if (error)
                res.send('Error: ' + error)
            else
                res.send('Elimiando con éxito')
        })
    })
    
    /*Obtener datos del local */
    router.post('/modificar-local-obtener', ensureAuthenticated, (req, res) => {
        User.findOne().where({ codigo: req.body.codigo }).exec((error, local) => {
            if (error)
                res.send('Error: ' + error)
            else
                res.send(local)
        })
    })

//Tarjeta___________________________________________________________________________________________________

    /*Ingreso-get*/
    router.get('/reg-tarj', ensureAuthenticated, (req, res) => {
        User.find().where({ eslocal: true }).exec((error, locales) => {
            res.render('admin-reg-tarj', { locales: locales })
        })
    })

    /*Ingreso -post*/
    router.post('/ing-tarjeta', ensureAuthenticated, (req, res) => {
        codigo=Date.now()+'.png'
        storage = multer.diskStorage({
            destination: (req, file, cb) => { cb(null, 'recursos/especifico/imagenes/tarjetas') },
            filename: (req, file, cb) => { cb(null, codigo) }
        });
        upload = multer({
            storage: storage, fileFilter: (req, file, cb) => {
                if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') { cb(null, true); } else { cb(null, false); }
            }
        }).single('image_producto');
        upload(req, res, (err) => {
            if (err)
                res.render('500', { error: err })
            else{
                query = new Array()
                locales = req.body.locales
                elegidos = new Array()
                numeroinicial = req.body.inicial
                numerofinal = req.body.final
                if (!(Array.isArray(locales)))
                    locales = [locales]
                for (var i = numeroinicial; i <= numerofinal; i++) { query.push({ 'numero': i }) }
                for(var i=0;i<locales.length;i++){
                    elegidos.push({local:locales[i],activo:true})
                }
                Tarjeta.find().where({ $or: query }).exec((err, tarjetas) => {
                    if (err)
                    res.render('500', { error: err })
                    else {
                        if (tarjetas.length != 0) {
                            errores = ``
                            for (var i = 0; i < tarjetas.length; i++) {
                                errores += `${tarjetas[i].numero}, `
                            }
                            res.render('500', { error: `No se ha podido registrar, Estas tarjetas ya se encuentran registradas: ${errores}` })
                        }else{
                            newCodigo='img'+Date.now()
                            cloudinary.uploader.upload("recursos/especifico/imagenes/tarjetas/" + codigo, (result) => {
                                for (var i = numeroinicial; i <= numerofinal; i++) {
                                    var nuevaTarjeta = new Tarjeta({
                                        numero: i,
                                        fechainicial: new Date(req.body.fini),
                                        fechafinal: new Date(req.body.ffin),
                                        locales: elegidos,
                                        imagen: newCodigo,
                                        activo: false,
                                        activacion: cadenaAleatoria()
                                    })
                                    nuevaTarjeta.save((error, respuesta) => {
                                        if (error)
                                            console.log(error)
                                    })
                                }
                                User.find().where({ eslocal: true }).exec((error, locales) => {
                                    newImagen=new ImgTarjeta({
                                        codigo:newCodigo,
                                        imagen:result.url,
                                        locales: elegidos,
                                        inicial:new Date(req.body.fini),
                                        final:new Date(req.body.ffin)
                                    })
                                    newImagen.save((err,guardado)=>{
                                        if(err)
                                            res.render('500',{error:err})
                                        else
                                            res.render('admin-reg-tarj', { locales: locales, success_msg: 'Registrado con éxito' })
                                    })
                                })
                            },{public_id: 'tarjetas/' + newCodigo})
                        }
                    }
                })
            }
        })
    })

    /*Modificación y eliminación*/
    router.get('/mod-tarj', ensureAuthenticated, (req, res) => {
        res.render('admin-mod-tarj')
    })

//Usuario___________________________________________________________________________________________________
    /*Eliminación*/
    router.get('/eliminar-usuario', ensureAuthenticated, (req, res) => {res.render('admin-eliminar-usuario')})

//Reportes__________________________________________________________________________________________________
    /*Reportes por usuario*/
    router.get('/reporte-usuario', ensureAuthenticated, (req, res) => {
        res.render('admin-reporte-usuario')
    })

    /*Reportes por local*/
    router.get('/reporte-local', ensureAuthenticated, (req, res) => {
        res.render('admin-reporte-local')
    })

    /*Reportes por tarjeta*/
    router.get('/reporte-tarjeta', ensureAuthenticated, (req, res) => {
        res.render('admin-reporte-tarjeta')
    })

    /*Reportes por vendedores*/
    router.get('/reporte-vendedor', ensureAuthenticated, (req, res) => {
        res.render('admin-reporte-vendedor')
    })
//Slider____________________________________________________________________________________________________

    /*Ingresar imagenes:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    router.get('/slider', ensureAuthenticated, (req, res) => { res.render('admin-slider') })

    /*Modificar imagenes::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    router.get('/modificar-slider', (req, res) => {
        res.render('admin-modificar-slider')
    })


//Permite el enrutamiento___________________________________________________________________________________
    module.exports = router;
