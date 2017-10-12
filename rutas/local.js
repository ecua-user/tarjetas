//Dependencias necesarias______________________________________________________________________________
express = require('express')
router = express.Router()
cloudinary = require('cloudinary')

//Confirma la autenticación del usuario________________________________________________________________
function ensureAuthenticated(req, res, next) { 
	if (req.isAuthenticated())
		return next(); 
	else
		res.redirect('/login'); 
}

//########################################  Se establecen las rutas ###################################

router.get('/',(req,res)=>{
	res.render('local')
})

//#####################################################################################################

//Permite el enrutamiento______________________________________________________________________________
module.exports = router;
