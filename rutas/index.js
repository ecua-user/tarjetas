//Dependencias necesarias______________________________________________________________________________
express = require('express')
router = express.Router()

//########################################  Se establecen las rutas ###################################
router.get('/',(req,res)=>{
    res.render('index')
})

router.get('/neutral',(req,res)=>{
    try{
        if(req.user.esadministrador)
            res.redirect('/admin')
        else{
            if(req.user.eslocal)
                res.redirect('/local')
            else
                res.redirect('/cliente/comprado')
        }
    }catch(e){
        res.redirect('/users/login')
    }
})
//#####################################################################################################

//Permite el enrutamiento______________________________________________________________________________
module.exports = router;
