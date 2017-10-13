//Dependencias necesarias______________________________________________________________________________
express = require('express')
router = express.Router()

//Confirma la autenticación del usuario________________________________________________________________
function ensureAuthenticated(req, res, next) { 
	if (req.isAuthenticated() && !req.user.esadministrador && !req.user.eslocal){				
		return next(); 
	}
	else{
		res.redirect('/neutral'); 
	}
}

//########################################  Se establecen las rutas ###################################
router.get('/',(req,res)=>{
	res.redirect('/cliente/comprado')
})

router.get('/comprado',ensureAuthenticated,(req,res)=>{
	res.render('comprado')
})

router.get('/perfil',ensureAuthenticated,(req,res)=>{
	res.render('perfil')
})



//#####################################################################################################

//Permite el enrutamiento______________________________________________________________________________
module.exports = router;
