//Dependencias necesarias______________________________________________________________________________
express = require('express')
router = express.Router()
multer = require('multer')
fs = require('fs')
passport = require('passport')
LocalStrategy = require('passport-local').Strategy
cloudinary = require('cloudinary')

//Confirma la autenticación del usuario________________________________________________________________
function ensureAuthenticated(req, res, next) { 
	if (req.isAuthenticated() && req.user.esadministrador)
		return next(); 
	else
		res.redirect('/neutral'); 
}

//Se comunica con el servicio de imágenes______________________________________________________________
cloudinary.config({cloud_name: '',api_key: '',api_secret: ''});

//########################################  Se establecen las rutas ###################################
router.get('/compra',ensureAuthenticated,(req,res)=>{
	res.render('compra');
})
router.get('/ingresar-local',ensureAuthenticated,(req,res)=>{
	res.render('ingresar-local')
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
