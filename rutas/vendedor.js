//Dependencias necesarias______________________________________________________________________________
express = require('express')
router = express.Router()

//Confirma la autenticación del usuario________________________________________________________________
function ensureAuthenticated(req, res, next) { 
	if (req.isAuthenticated() && req.user.esvendedor)
		return next(); 
	else
		res.redirect('/neutral'); 
}

//########################################  Se establecen las rutas ###################################
router.get('/',ensureAuthenticated,(req,res)=>{
	res.render('vendedor')
})

//#####################################################################################################

//Permite el enrutamiento______________________________________________________________________________
module.exports = router;
