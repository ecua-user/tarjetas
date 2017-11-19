//Dependencias necesarias______________________________________________________________________________
express = require('express')
router = express.Router()

User = require('../modelos/usuarios')
Tarjeta = require('../modelos/tarjetas')
Notificacion = require('../modelos/notificaciones')

//Confirma la autenticación del usuario________________________________________________________________
function ensureAuthenticated(req, res, next) { 
	if (req.isAuthenticated() && req.user.eslocal)
		return next(); 
	else
		res.redirect('/neutral'); 
}

//########################################  Se establecen las rutas ###################################
router.get('/',ensureAuthenticated,(req,res)=>{
	res.render('local/vender')
})

router.post ('/activar', ensureAuthenticated, (req,res)=>{
    Tarjeta.findOne().where({$and:[{numero: req.body.numero},{vendida:true, activo:true}]}).exec((error, tarjeta)=>{
        if(error)
            res.send('Error')
        else{
            if(tarjeta==null)
                res.send('Esta tarjeta no esta actíva')
            else{
                detalles= new Array()
                for(var i=0;i < tarjeta.locales.length;i++){
                    if(req.user.codigo==tarjeta.locales[i].local){
                        detalles.push(tarjeta)
                        detalles.push(tarjeta.locales[i])
                    }
                }
                if(detalles.length==0)
                    res.send('Esta tarjeta no es válida para este local')
                else
                    res.send(detalles)
            }
        }
            
    })
})
//Permite el enrutamiento______________________________________________________________________________
module.exports = router;
