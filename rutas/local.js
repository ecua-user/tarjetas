//Dependencias necesarias______________________________________________________________________________
express = require('express')
router = express.Router()
cloudinary = require('cloudinary')

//Confirma la autenticación del usuario________________________________________________________________
function ensureAuthenticated(req, res, next) { 
	if (req.isAuthenticated() && req.user.eslocal)
		return next(); 
	else
		res.redirect('/neutral'); 
}

//########################################  Se establecen las rutas ###################################

router.get('/',ensureAuthenticated,(req,res)=>{
	res.render('local')
})

//#####################################################################################################

//Permite el enrutamiento______________________________________________________________________________
module.exports = router;
