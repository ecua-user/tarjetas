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
router.get('/compra',ensureAuthenticated,(req,res)=>{
	res.render('compra');
})
router.get('/ingresar-local',ensureAuthenticated,(req,res)=>{
	res.render('ingresar-local')
})

router.post('/ingresar-local',(req,res)=>{
    codigo=Date.now()+''
    storage = multer.diskStorage({
		destination: (req, file, cb)=> {cb(null, 'recursos/especifico/imagenes/locales')},
		filename: (req, file, cb) =>{cb(null,codigo)}
    });
    upload = multer({ storage: storage,fileFilter:(req,file,cb)=>{
        if(file.mimetype=='image/png'|| file.mimetype=='image/jpg' || file.mimetype=='image/jpeg'){cb(null, true);}else{cb(null, false);}
    }}).single('image_producto');
    upload(req, res, (err)=> {
        if(err)
            res.render('500',{error:err})
        else{
            cloudinary.uploader.upload("recursos/especifico/imagenes/locales/"+codigo,(result)=>{
                newUser= new User({
                    codigo:codigo,
                    nombre: req.body.nombre,
                    username:req.body.username,
                    password: req.body.password,
                    eslocal:true,
                    esadministrador:false,
                    token:cadenaAleatoria(),
                    activo:true,
                    imagen:result.url
                })
                User.createUser(newUser,(e,user)=>{
                    if(e)
                        res.render('500',{error:e})
                    else
                        res.render('ingresar-local',{success_msg:'Local ingresado con éxito'})
                }) 
            },{public_id: 'locales/'+codigo})
        }
    })
})

//#####################################################################################################
router.get('/',ensureAuthenticated,(req,res)=>{
	res.redirect('/admin/compra')
})

router.get('/modificar-local',ensureAuthenticated,(req,res)=>{
	res.render('modificar-local');
})
router.get('/reg-tarj',ensureAuthenticated, (req,res)=>{
	res.render('reg-tarj')
})
router.get('/mod-tarj',ensureAuthenticated,(req,res)=>{
	res.render('mod-tarj')
})
router.get('/eliminar-usuario',ensureAuthenticated,(req,res)=>{
	res.render('eliminar-usuario')
})
router.get('/reporte-usuario',ensureAuthenticated,(req,res)=>{
	res.render('reporte-usuario')
})
router.get('/reporte-local',ensureAuthenticated,(req,res)=>{
	res.render('reporte-local')
})
router.get('/reporte-tarjeta',ensureAuthenticated,(req,res)=>{
	res.render('reporte-tarjeta')
})

//Permite el enrutamiento______________________________________________________________________________
module.exports = router;
