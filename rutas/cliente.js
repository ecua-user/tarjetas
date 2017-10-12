//Dependencias necesarias______________________________________________________________________________
express = require('express')
router = express.Router()

//Confirma la autenticación del usuario________________________________________________________________
function ensureAuthenticated(req, res, next) { 
	if (req.isAuthenticated())
		return next(); 
	else
		res.redirect('/login'); 
}

//########################################  Se establecen las rutas ###################################

router.get('/comprado',(req,res)=>{
	res.render('comprado')
})

router.get('/perfil',(req,res)=>{
	res.render('perfil')
})
//#####################################################################################################

//Permite el enrutamiento______________________________________________________________________________
module.exports = router;
