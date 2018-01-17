//Dependencias necesarias______________________________
express = require('express')
router = express.Router()

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user.esadministrador)
        return next();
    else
        res.redirect('/neutral');
}
//Vista principal______________________________________
router.get('/', ensureAuthenticated, (req, res) => { 
    res.render('administrador/inicio') 
})

module.exports = router;
