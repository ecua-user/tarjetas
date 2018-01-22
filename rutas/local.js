//Dependencias necesarias______________________________________________________________________________
express = require('express')
router = express.Router()

User = require('../modelos/usuarios')
Tarjeta_uso = require('../modelos/tarjeta_uso')
Notificacion = require('../modelos/notificaciones')
Repolocal = require('../modelos/reporte-usuario')
function obtenerFecha(fecha){
    fecha=new Date(fecha)
    return fecha.getDate()+'/'+ fecha.getMonth()+'/'+ fecha.getFullYear()
}

function obtenerHora(fecha){
    fecha=new Date(fecha)
    return fecha.getHours()+' : '+fecha.getMinutes()
}
//Confirma la autenticación del usuario________________________________________________________________
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user.eslocal)
        return next();
    else
        res.redirect('/neutral');
}
router.get('/', ensureAuthenticated, (req, res) => {
    res.render('local/vender')
})
router.post('/beneficios_por_local', (req, res) => {
    User.findOne().where({ codigo: req.body.codigo }).select('beneficio').exec((error, beneficios) => {
        var respuesta = new Array()
        if (!Array.isArray(beneficios))
            respuesta.push(beneficios)
        else
            respuesta = beneficios
        res.send(respuesta)
    })
})
router.post('/activar', ensureAuthenticated, (req, res) => {
    Tarjeta_uso.findOne().where({ $and: [{ numero: req.body.numero }, { vendida: true, activo: true }] }).exec((error, tarjeta) => {
        if (error)
            res.send('Error')
        else {
            if (tarjeta == null)
                res.send('Esta tarjeta no esta actíva')
            else {
                detalles = new Array()
                for (var i = 0; i < tarjeta.locales.length; i++) {
                    if (req.user.codigo == tarjeta.locales[i].local) {
                        detalles.push(tarjeta)
                        detalles.push(tarjeta.locales[i])
                    }
                }
                if (detalles.length == 0)
                    res.send('Esta tarjeta no es válida para este local')
                else
                    res.send(detalles)
            }
        }

    })
})
router.post('/usar-beneficio', ensureAuthenticated, (req, res) => {
    User.findOne().where({ username: req.body.cliente }).exec((error, user_act) => {
        Tarjeta_uso.findOne().where({ numero: req.body.numero }).exec((error, tarjeta) => {
            var sumatoria = 0;
            var comprobante = 0;
            for (var i = 0; i < tarjeta.locales.length; i++) {
                for (var j = 0; j < tarjeta.locales[i].beneficio.length; j++) {
                    sumatoria++
                    if (tarjeta.locales[i].beneficio[j].activo == false) {
                        comprobante++
                    }
                }
            }
            if (sumatoria == comprobante) {
                Tarjeta.findOneAndUpdate({ numero: req.body.numero }, { confirmar: true }, (error, respuesta) => {
                })
            }
        })
        Tarjeta_uso.findOne().where({ numero: req.body.numero }).exec((error, tarjeta) => {
            if (error)
                res.send('Error')
            else {
                if ((new Date(tarjeta.fechafinal)) >= (new Date(req.body.fecha))) {
                    for (var i = 0; i < tarjeta.locales.length; i++) {
                        if (tarjeta.locales[i].local == req.user.codigo) {
                            for (var j = 0; j < tarjeta.locales[i].beneficio.length; j++) {
                                if (req.body.codigo == tarjeta.locales[i].beneficio[j].codigo) {
                                    if (tarjeta.locales[i].beneficio[j].activo == true) {
                                        tarjeta.locales[i].beneficio[j].activo = false
                                        tarjeta.locales[i].beneficio[j].fecha_activacion = new Date(req.body.fecha)
                                        var benfff=''
                                        for(var b=0; b< req.user.beneficio.length; b++){
                                            if(tarjeta.locales[i].beneficio[j].codigo== req.user.beneficio[b].codigo)
                                                benfff=req.user.beneficio[b].beneficio
                                        }
                                        Tarjeta_uso.findOneAndUpdate({ numero: req.body.numero }, { locales: tarjeta.locales }, (error, respuesta) => {
                                            var notifica = new Notificacion({
                                                fecha: new Date(req.body.fecha),
                                                local: req.user.codigo,
                                                local_nombre: req.user.nombre,
                                                numero: req.body.numero,
                                                beneficio: benfff
                                            })
                                            var reporte_usuario = new Repolocal({
                                                codigo: Date.now(),
                                                usuario: req.body.cliente,
                                                nombre:user_act.nombre,
                                                cedula: user_act.cedula,
                                                telefono: user_act.telefono,
                                                direccion: user_act.direccion,
                                                sector: user_act.sector,
                                                edad: user_act.edad,
                                                genero: user_act.genero,
                                                referido: user_act.referido,
                                                local: req.user.nombre,
                                                fecha: new Date(req.body.fecha),
                                                beneficio: benfff,
                                                tarjeta: req.body.numero
                                            })
                                            notifica.save((error, respuesta) => {
                                                reporte_usuario.save((error, respuesta) => {
                                                    res.send('Beneficio aplicado con éxito para '+ user_act.nombre)
                                                })
                                            })
                                        })
                                    } else {
                                        res.send('No puede activarse, Ya '+user_act.nombre+' ha ocupado ese beneficio el día '+ obtenerFecha(tarjeta.locales[i].beneficio[j].fecha_activacion) +' a las '+ obtenerHora(tarjeta.locales[i].beneficio[j].fecha_activacion) )
                                    }
                                }
                            }
                        }
                    }
                } else {
                    Tarjeta_uso.findOneAndUpdate({ numero: req.body.numero }, { confirmar: true }, (error, respuesta) => {
                        res.send('Tarjeta caducada')
                    })
                }
            }
        })
    })

})
router.get('/activaciones', ensureAuthenticated, (req,res)=>{
    Repolocal.find().where({local: req.user.nombre}).exec((error, reporte)=>{
        res.render('administrador/local/reportes', {ventas: reporte})
    })
    
})
//Permite el enrutamiento______________________________________________________________________________
module.exports = router;