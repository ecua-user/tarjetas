//Dependencias necesarias______________________________________________________________________________
express = require('express')
router = express.Router()
multer = require('multer')
fs = require('fs')
passport = require('passport')
LocalStrategy = require('passport-local').Strategy
cloudinary = require('cloudinary')

//Modelos de datos a usar
User=require('../modelos/usuarios')
Tarjeta=require('../modelos/tarjetas')

//Confirma la autenticación del usuario________________________________________________________________
function ensureAuthenticated(req, res, next) { 
	if (req.isAuthenticated() && req.user.esadministrador)
		return next(); 
	else
		res.redirect('/neutral'); 
}

function cadenaAleatoria() {
    longitud =  16
    caracteres =  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    cadena = "" 
    max = caracteres.length - 1
	for (var i = 0; i < longitud; i++) {
        cadena += caracteres[Math.floor(Math.random() * (max + 1))]; 
    }
    return cadena;
}
//Se comunica con el servicio de imágenes______________________________________________________________
cloudinary.config({cloud_name: 'tarjetas',api_key: '637393518342711',api_secret: '9sqZw-T6kWzHpqWmirFWBR0WHmg'});

//########################################  Se establecen las rutas ###################################

router.get('/', ensureAuthenticated, (req, res) => { res.render('admin') })

//Vendedor__________________________________________________________________________________________________-

    /*Ingreso:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    router.get('/ingresar-vendedor', ensureAuthenticated, (req, res) => { res.render('admin-ingresar-vendedor') })

    router.post('/ingresar-vendedor',ensureAuthenticated,(req,res)=>{
        if(req.body.password != req.body.rpassword)
            res.render('admin-ingresar-vendedor',{error:'Contraseñas no coinciden'})
        else{
            if(Number(req.body.edad)<18)
                res.render('admin-ingresar-vendedor',{error:'Debe ser mayor de edad para poder registrarse'})
            else{
                User.findOne().where({username:req.body.username}).exec((e,resp)=>{
                    if(resp!=null){
                        res.render('admin-ingresar-vendedor',{error:'Ya existe un usuario con este correo'})
                    }
                    else{
                        newUser= new User({
                            codigo:Date.now(),
                            nombre: req.body.nombre,
                            cedula:req.body.cedula,
                            telefono:req.body.telefono,
                            sector:req.body.sector,
                            direccion:req.body.direccion,
                            edad:req.body.edad,
                            genero: req.body.genero,
                            username:req.body.username,
                            password: req.body.password,
                            eslocal:false,
                            esadministrador:false,
                            token:req.body.token,
                            activo:true,
                            esvendedor:true,
                            imagen:""
                        })
                        User.createUser(newUser,(e,user)=>{
                            if(e)
                                res.render('500',{error:e})
                            else
                                res.render('admin-ingresar-vendedor',{success_msg:'Registrado con éxito'})
                        }) 
                    }
                })
            }
        } 
    })

    /*Modificación y eliminación::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    router.get('/modificar-vendedor',ensureAuthenticated,(req,res)=>{
        User.find().where({esvendedor:true}).exec((error,vendedor)=>{
            if(error)
                res.render('500',{error:error})
            else
                res.render('admin-modificar-vendedor',{vendedor:vendedor})
        })
    })
    router.post('/modificar-vendedor-obtener',ensureAuthenticated,(req,res)=>{
        User.findOne().where({codigo:req.body.codigo}).exec((error,vendedor)=>{
            if(error)
                res.send('Error: '+error)
            else
                res.send(vendedor)
        })
    })
    router.post('/modificar-vendedor',ensureAuthenticated,(req,res)=>{
        User.findOneAndUpdate({username:req.body.username},{
            nombre:req.body.nombre,
            edad:req.body.edad,
            sector:req.body.sector,
            genero:req.body.genero,
            telefono:req.body.telefono,
            direccion:req.body.direccion
        },(err)=>{
            if(err)
                res.render('500',{error:err})
            else
                res.redirect('/admin/modificar-vendedor')
        })
    })
    router.post('/eliminar-vendedor',ensureAuthenticated,(req,res)=>{
        User.findOneAndRemove({codigo:req.body.codigo},(error,respuesta)=>{
            if(error)
                res.send('Error: '+error)  
            else
                res.send('Elimiando con éxito')
        })
    })

    /*Asignación de tarjetas::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    router.get('/asignar-vendedor',ensureAuthenticated,(req,res)=>{
        res.render('admin-asignar-vendedor')
    })

//Local_______________________________________________________________________________________________________

    /*Ingreso:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    router.get('/ingresar-local', ensureAuthenticated, (req, res) => { res.render('admin-ingresar-local') })

    router.post('/ingresar-local', (req, res) => {
        codigo = Date.now() + ''
        storage = multer.diskStorage({
            destination: (req, file, cb) => { cb(null, 'recursos/especifico/imagenes/locales') },
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
            else {
                cloudinary.uploader.upload("recursos/especifico/imagenes/locales/" + codigo, (result) => {
                    newUser = new User({
                        codigo: codigo,
                        nombre: req.body.nombre,
                        username: req.body.username,
                        password: req.body.password,
                        eslocal: true,
                        esadministrador: false,
                        token: cadenaAleatoria(),
                        activo: true,
                        imagen: result.url
                    })
                    User.createUser(newUser, (e, user) => {
                        if (e)
                            res.render('500', { error: e })
                        else
                            res.render('admin-ingresar-local', { success_msg: 'Local ingresado con éxito' })
                    })
                }, { public_id: 'locales/' + codigo })
            }
        })
    })

    /*Modificación y eliminación:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
        router.post('/modificar-local',ensureAuthenticated,(req,res)=>{
            storage = multer.diskStorage({
                destination: (req, file, cb) => { cb(null, 'recursos/especifico/imagenes/locales') },
                filename: (req, file, cb) => { cb(null, req.body.codigo) }
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
                    query=''
                    cloudinary.uploader.upload("recursos/especifico/imagenes/locales/" + req.body.codigo, (result) => {
                        if(result.url==null)
                            query = { username: req.body.username, nombre: req.body.nombre }
                        else
                            query = { username: req.body.username, nombre: req.body.nombre, imagen: result.url }
                        User.findOneAndUpdate({codigo:req.body.codigo},query,(err,resp)=>{
                            if(err)
                                res.send('500',{error:err})
                            else    
                                res.redirect('/admin/modificar-local')
                        })
                    },{public_id: 'locales/'+req.body.codigo})
                }
            })
        })
        
        router.get('/modificar-local', ensureAuthenticated, (req, res) => {
            User.find().where({eslocal:true}).exec((err,local)=>{
                res.render('admin-modificar-local',{local:local});
            })
        })

        router.post('/eliminar-local',ensureAuthenticated,(req,res)=>{
            User.findOneAndRemove({codigo:req.body.codigo},(error,respuesta)=>{
                if(error)
                    res.send('Error: '+error)  
                else
                    res.send('Elimiando con éxito')
            })
        })

        router.post('/modificar-local-obtener',ensureAuthenticated,(req,res)=>{
            User.findOne().where({codigo:req.body.codigo}).exec((error,local)=>{
                if(error)
                    res.send('Error: '+error)
                else
                    res.send(local)
            })
        })

//Tarjeta______________________________________________________________________________________________________

    /*Ingreso:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    router.get('/reg-tarj', ensureAuthenticated,(req, res) => { 
        User.find().where({eslocal:true}).exec((error,locales)=>{
            res.render('admin-reg-tarj',{locales:locales}) 
        })
    })

    router.post('/ing-tarjeta',ensureAuthenticated,(req,res)=>{
        var query=new Array()
        var localeshtml=req.body.locales
        var locales_elegidos=''
        numeroinicial=req.body.inicial
        numerofinal=req.body.final
        if(!(Array.isArray(localeshtml)))
            localeshtml=[localeshtml]
        for(var i=numeroinicial;i<=numerofinal;i++){
            query.push({'numero':i})
        }
        for(var i=0;i<localeshtml.length;i++){
            coma=''
            if(i==(locales_elegidos.length-1))
                coma=','
            locales_elegidos+='{'+localeshtml[i]+':'+true+'}'+coma
        }
        locales_elegidos=JSON.stringify(locales_elegidos)
        locales_elegidos=JSON.parse(locales_elegidos)
       Tarjeta.find().where({ $or:query}).exec((err,tarjetas)=>{
            if(err)
                res.render('500',{error:err})
            else{
                if(tarjetas.length!=0){
                    errores=``
                    for(var i=0;i<tarjetas.length;i++){
                        errores+=`${tarjetas[i].numero}, `
                    }
                    res.render('500',{error:`No se ha podido registrar, Estas tarjetas ya se encuentran registradas: ${errores}`})
                }else{
                    for(var i=numeroinicial;i<=numerofinal;i++){
                        var nuevaTarjeta=new Tarjeta({
                            numero:i,
                            fechainicial:new Date(req.body.fini),
                            fechafinal:new Date(req.body.ffin),
                            locales:locales_elegidos,
                            activo:false
                        })
                        nuevaTarjeta.save((error,respuesta)=>{
                            if(error)
                                console.log(error)
                        })
                    }
                    User.find().where({eslocal:true}).exec((error,locales)=>{
                        res.render('admin-reg-tarj',{locales:locales,success_msg:'Registrado con éxito'}) 
                    })
                }
            }
       })
    })
    /*Modificación y eliminación:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    router.get('/mod-tarj',ensureAuthenticated,(req,res)=>{
        res.render('admin-mod-tarj')
    })

//Usuario______________________________________________________________________________________________________

    /*Eliminación::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    router.get('/eliminar-usuario',ensureAuthenticated,(req,res)=>{
        res.render('admin-eliminar-usuario')
    })

//Reportes_____________________________________________________________________________________________________

    /*Reportes por usuario::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    router.get('/reporte-usuario',ensureAuthenticated,(req,res)=>{
        res.render('admin-reporte-usuario')
    })

    /*Reportes por local::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    router.get('/reporte-local',ensureAuthenticated,(req,res)=>{
        res.render('admin-reporte-local')
    })

    /*Reportes por tarjeta::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    router.get('/reporte-tarjeta', ensureAuthenticated, (req, res) => {
        res.render('admin-reporte-tarjeta')
    })

    /*Reportes por vendedores:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    router.get('/reporte-vendedor',ensureAuthenticated,(req,res)=>{
        res.render('admin-reporte-vendedor')
    })
//Slider_______________________________________________________________________________________________________

    /*Ingresar imagenes:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    router.get('/slider', ensureAuthenticated, (req, res) => { res.render('admin-slider') })

    /*Modificar imagenes::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
    router.get('/modificar-slider',(req,res)=>{
        res.render('admin-modificar-slider')
    })

//#####################################################################################################

//Permite el enrutamiento______________________________________________________________________________
module.exports = router;
