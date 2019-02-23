//Dependencias necesarias______________________________
express = require('express')
router = express.Router()

//Confirma la autenticación del usuario________________
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user.esadministrador)
        return next();
    else
        res.redirect('/neutral');
}

//Crea los token_______________________________________
function cadenaAleatoria() {
    longitud = 16
    caracteres = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    cadena = ""
    max = caracteres.length - 1
    for (var i = 0; i < longitud; i++) { cadena += caracteres[Math.floor(Math.random() * (max + 1))]; }
    return cadena;
}
Tarjeta_uso=require('../../modelos/tarjeta_uso')

Regaladas = require('../../modelos/regaladas')

router.get('/reg-tarj', ensureAuthenticated, (req, res) => {
    User.find().where({ eslocal: true }).exec((error, locales) => {
        res.render('administrador/tarjeta/ingresar', { locales: locales })
    })
})
router.post('/ing-tarjeta', ensureAuthenticated, (req, res) => {
    codigo = Date.now() + '.png'
    storage = multer.diskStorage({
        destination: (req, file, cb) => { cb(null, 'recursos/modular/imagenes/tarjetas') },
        filename: (req, file, cb) => { cb(null, codigo) }
    });
    upload = multer({
        storage: storage, fileFilter: (req, file, cb) => {
            if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') { cb(null, true); } else { cb(null, false); }
        }
    }).single('image_producto');
    upload(req, res, (err) => {
        if (err)
            res.render('errores/500', { error: err })
        else {
            query = new Array()
            t_registrar = new Array()
            locales = req.body.locales
            elegidos = new Array()
            numeroinicial = req.body.inicial
            numerofinal = req.body.final
            if (!(Array.isArray(locales)))
                locales = [locales]
            for (var i = numeroinicial; i <= numerofinal; i++) {
                t_registrar.push({ numero: i, vendedor: '', cliente: '', activo: false })
                query.push(i)
            }
            Tarjeta.find({ tarjetas: { $elemMatch: { numero: { $in: query } } } }, (error, t_econtradas) => {
                if (error)
                    res.render('errores/500', { error: err })
                else {
                    if (t_econtradas.length != 0) 
                        res.render('errores/500', { error: `No se ha podido registrar, varias tarjetas ya se encuentran registradas` })
                    else {
                        var locales_escogidos_tarjeta = new Array()
                        for (var i = 0; i < locales.length; i++) {
                            locales_escogidos_tarjeta.push({ codigo: locales[i] })
                        }
                        User.find().where({ $or: locales_escogidos_tarjeta }).exec((error, locales_respuesta) => {
                            for (var i = 0; i < locales_respuesta.length; i++) {
                                var benef_ing=new Array()
                                for(var l=0; l< locales_respuesta[i].beneficio.length; l++){
                                    benef_ing.push({
                                        imagen:locales_respuesta[i].beneficio[l].imagen,
                                        activo:true,
                                        codigo:locales_respuesta[i].beneficio[l].codigo,
                                        fecha_activacion:""
                                    })
                                }
                                elegidos.push({ local: locales_respuesta[i].codigo, beneficio: benef_ing })
                            }
                            newCodigo = 'img' + Date.now()
                            cloudinary.uploader.upload("recursos/modular/imagenes/tarjetas/" + codigo, (result) => {
                                var nuevaTarjeta = new Tarjeta({
                                    codigo: Date.now(),
                                    fechainicial: new Date(req.body.fini),
                                    fechafinal: new Date(req.body.ffin),
                                    titulo: req.body.titulo,
                                    descripcion:req.body.descripcion,
                                    imagen: result.url,
                                    linkface: req.body.linkface,
                                    linkInst: req.body.linkInst,
                                    tarjetas: t_registrar,
                                    locales: elegidos
                                })
                                nuevaTarjeta.save((error, respuesta) => {
                                    if (error)
                                        res.render('errores/500', { error: err })
                                    else{
                                        User.find().where({ eslocal: true }).exec((error, locales) => {
                                            res.render('administrador/tarjeta/ingresar', { locales: locales, success_msg: 'Registrado con éxito' })
                                        })
                                    }                
                                })
                            }, { public_id: 'tarjetas/' + newCodigo })
                        })
                    }
                }
            })
        }
    })
})

router.get('/ver-asignaciones', ensureAuthenticated, (req,res)=>{
    User.find().where({esvendedor:true}).exec((error, vendedores)=>{
        if(error)
            res.render('500', {error: error})
        else{
            Tarjeta.find().select('tarjetas').exec((error, tarjetas)=>{
                var respuesta= new Array()
                for(var i=0; i<tarjetas.length;i++){
                    for(var j=0; j< tarjetas[i].tarjetas.length; j++){
                        if(tarjetas[i].tarjetas[j].vendedor!=''){
                            if(tarjetas[i].tarjetas[j].cliente!=''){      
                                tarjetas[i].tarjetas[j].cliente=true
                            }                                
                            respuesta.push(tarjetas[i].tarjetas[j])
                        }
                    }
                }
                res.render('administrador/reportes/asignaciones',{vendedor: vendedores,tarjeta: respuesta})
            })     
        }      
    })
})

router.post('/quitar-asignacion', ensureAuthenticated, (req,res)=>{
    Tarjeta.find().select('tarjetas codigo').exec((error, tarjetas)=>{
        if(error)
            res.send('Error')
        else{
            for(var i=0; i < tarjetas.length; i++){
                for(var j=0; j < tarjetas[i].tarjetas.length; j++){
                    if((req.body.tarjetas).includes(tarjetas[i].tarjetas[j].numero+'')){
                        tarjetas[i].tarjetas[j].vendedor=''
                    }
                }
                Tarjeta.findOneAndUpdate({codigo: tarjetas[i].codigo},{tarjetas: tarjetas[i].tarjetas},(error, listo)=>{
                    if(error)
                        console.log(error)
                })
            }
            res.send('OK')
        }
    })
})
router.get('/mod-tarj', ensureAuthenticated,(req, res) => {
    var todasTarjetas = new Array()
    User.find().where({esvendedor:true}).exec((error, vendedores)=>{
        Tarjeta.find().exec((error, imgs) => {
            res.render('administrador/tarjeta/modificar-eliminar', { tarjetas: imgs ,vendedores: vendedores })
        })
    }) 
})

router.post('/limitaciones', ensureAuthenticated, (req,res)=>{
    var respuesta= new Array();
    var respuesta= new Array()
    Tarjeta.findOne().where( {"codigo": req.body.codigo}).select('tarjetas').exec((e, tarjetas)=>{
        respuesta.push(tarjetas.tarjetas[tarjetas.tarjetas.length-1].numero)
        respuesta.push(tarjetas.tarjetas[0].numero)      
        res.send(respuesta)
    })
})
router.post('/consultar-numero', ensureAuthenticated, (req, res) => {
    Tarjeta_uso.findOne().where({ numero: req.body.numero }).exec((error, tarjeta) => {
        if (error)
            res.send(error)
        else {
            try {
                if(tarjeta==null){
                    res.send('Nada')
                }else{
                    var locales = new Array()
                    for (var i = 0; i < tarjeta.locales.length; i++) {
                        locales.push({ codigo: tarjeta.locales[i].local })
                    }
                    var resultado = new Array()
                    User.find().where({ $or: locales }).exec((e, loc) => {
                        if (e)
                            res.send(e)
                        else {
                            resultado.push(tarjeta)
                            resultado.push(loc)
                            res.send(resultado)
                        }
                    })
                }
            } catch (error) {
                console.log(error)
                res.send('Solo números')
            }

        }
    })
})
router.post('/eliminar-numero', ensureAuthenticated, (req, res) => {
    Tarjeta.find().select('codigo tarjetas').exec((error, tarjetas)=>{
        if(error)
            res.send('Error')
        else{
            for(var i=0; i < tarjetas.length; i++){
                for(var j=0; j < tarjetas[i].tarjetas.length; j++){
                    if (tarjetas[i].tarjetas[j].numero == req.body.numero) {
                        tarjetas[i].tarjetas.splice(j,1)
                    }
                }
                Tarjeta.findOneAndUpdate({codigo: tarjetas[i].codigo},{tarjetas: tarjetas[i].tarjetas},(e, listo)=>{})
            }

            Tarjeta_uso.findOneAndRemove({numero:req.body.numero },(error, listo)=>{
                res.send('Eliminado con éxito')
            })
        }
    })
})

router.post('/detalles-masa', ensureAuthenticated, (req, res) => {
    var resultados = new Array()
    Tarjeta.findOne().where({codigo:req.body.codigo}).exec((error, tarjetas)=>{
        resultados.push(tarjetas)
        User.find().where({ eslocal: true }).select('codigo nombre').exec((e, loc_det) => {
            if(e)
                res.send('Error')
            else{
                resultados.push(loc_det)
                res.send(resultados)
            }
        })
    })
})
router.post('/eliminar-tarjetas', ensureAuthenticated, (req, res) => {
    Tarjeta.findOneAndRemove({ codigo: req.body.codigo },(error, eliminado)=>{
        if(error)
            res.send('Error')
        else{
            Tarjeta_uso.remove({cabeza: req.body.codigo },(error, listo)=>{  
                res.send('Listo')
            })
        }      
    })
})
router.post('/modificar-masa', ensureAuthenticated, (req, res) => {
    codigo = Date.now() + '.png'
    storage = multer.diskStorage({
        destination: (req, file, cb) => { cb(null, 'recursos/modular/imagenes/tarjetas') },
        filename: (req, file, cb) => { cb(null, codigo) }
    });
    upload = multer({
        storage: storage, fileFilter: (req, file, cb) => {
            if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') { cb(null, true); } else { cb(null, false); }
        }
    }).single('image_producto');
    upload(req, res, (err) => {
        if (err)
            res.render('errores/500', { error: err })
        else {
            elegidos = new Array()
            locales = req.body.locales
            var locales_escogidos_tarjeta = new Array()
            if (!(Array.isArray(locales)))
                locales = [locales]
            for (var i = 0; i < locales.length; i++) {
                locales_escogidos_tarjeta.push({ codigo: locales[i] })
            }
            User.find().where({ $or: locales_escogidos_tarjeta }).exec((error, locales_respuesta) => {
                for (var i = 0; i < locales_respuesta.length; i++) {
                    var benef_ing=new Array()
                    for(var l=0; l< locales_respuesta[i].beneficio.length; l++){
                        benef_ing.push({
                            imagen:locales_respuesta[i].beneficio[l].imagen,
                            activo:true,
                            codigo:locales_respuesta[i].beneficio[l].codigo,
                            fecha_activacion:""
                        })
                    }
                    elegidos.push({ local: locales_respuesta[i].codigo, beneficio: benef_ing })
                }
                cloudinary.uploader.upload("recursos/modular/imagenes/tarjetas/" + codigo, (result) => {
                    Tarjeta.findOne().where({codigo:req.body.codigo}).exec((error, respuesta)=>{
                        var img_tr = respuesta.imagen
                        if (result.url != null)
                            img_tr = result.url
                        var query= {
                            fechainicial: new Date(req.body.fini),
                            fechafinal: new Date(req.body.ffin),
                            titulo: req.body.titulo,
                            descripcion: req.body.descripcion,
                            imagen: img_tr,
                            linkface: req.body.linkface,
                            linkInst: req.body.linkInst,
                            locales: elegidos
                        }

                        Tarjeta.findOneAndUpdate({codigo: req.body.codigo},query,(error, actualizado)=>{
                            if(error)
                                res.render('errores/500', {error: 'No se pudo actualizar: Error '+error})
                            else{
                                Tarjeta_uso.find().where({cabeza: req.body.codigo}).exec((error, usadas)=>{
                                    if(error)
                                        res.render('errores/500', {error: 'No se pudo actualizar las tarjetas vendidas: Error '+error})
                                    else{
                                        if(usadas!=null){
                                            for(var i =0; i < usadas.length; i++){
                                                var nuevoquery={
                                                    fechainicial: new Date(req.body.fini),
                                                    fechafinal: new Date(req.body.ffin),
                                                    titulo: req.body.titulo,
                                                    descripcion: req.body.descripcion,
                                                    imagen: img_tr,
                                                    linkface: req.body.linkface,
                                                    linkInst: req.body.linkInst,
                                                    locales: actualizacion_locales(elegidos, usadas[i].locales)
                                                }
                                                Tarjeta_uso.findOneAndUpdate({numero: usadas[i].numero},nuevoquery,(error, listo)=>{})
                                            }
                                        }
                                        
                                        res.redirect('/admin-tarjetas/mod-tarj')
                                    }
                                })
                            }
                        })
                    })                    
                }, { public_id: 'tarjetas/' + req.body.codigo })
            })
        }
    })
})

function actualizacion_locales(principal, obtenido){
    //Recorre el array de locales nuevos
    for(var i=0; i< principal.length; i++){
        //Recorre el array de locales de tarjetas vendidas
        for(var j=0; j< obtenido.length; j++){
            //Si un local coincide en ambas tarjetas pregunta por sus beneficios
            if(principal[i].local== obtenido[j].local){
                //Recorre el array de los beneficios nuevos
                for(var k=0; k < principal[i].beneficio.length; k++){
                    //Recorre el array de beneficios de las tarjetas vendidas
                    for(var l=0; l < obtenido[j].beneficio.length; l++){
                        if(principal[i].beneficio[k].codigo == obtenido[j].beneficio[l].codigo){
                            principal[i].beneficio[k].fecha_activacion=obtenido[j].beneficio[l].fecha_activacion
                            principal[i].beneficio[k].activo=obtenido[j].beneficio[l].activo
                            l=obtenido[j].beneficio.length
                        }
                    }
                }
                j=obtenido.length
            }
        }       
    }
    return principal
}
router.post('/trj_vend',ensureAuthenticated ,(req,res)=>{
    Tarjeta_uso.findOne().where({numero:req.body.numero}).exec((error, respuesta)=>{
        if(respuesta==null){
            res.send('no existe')
        }else{
            if(!respuesta.vendida){
                res.send('no vendida')
            }else{
                Tarjeta_uso.findOneAndUpdate({numero: req.body.numero}, {activo: true},(error, respuesta)=>{
                    res.send('activo')
                })
            }
        }
    })
})

router.get('/regalar', ensureAuthenticated,(req,res)=>{
    User.find().where({eslocal:false, esadministrador:false}).exec((error, clientes)=>{
        Regaladas.find().exec((error, regalos)=>{
            Tarjeta.find().exec((error, id_trj)=>{
                res.render('administrador/tarjeta/regalar',{clientes:clientes, regaladas:regalos.reverse(), id_trj: id_trj})
            })
        })
    })
})

router.post('/regalar', ensureAuthenticated, (req,res)=>{
    Tarjeta.find().where({tarjetas: { $elemMatch: { numero: Number(req.body.numero), vendedor:"" } } }).exec((error, tj_enc)=>{
        if(error) {res.send('Error'); return}
        if(tj_enc.length==0) {res.send('Error 1'); return } //Esta tarjeta esta asignada no puede ser regalada       
        Tarjeta.findOneAndUpdate(
            {codigo : req.body.tarjeta }, { $set: { 
                "tarjetas.$[elem].vendedor" : req.user.codigo, 
                "tarjetas.$[elem].activo" :true,
                "tarjetas.$[elem].cliente": req.body.correo
            }},{ arrayFilters: [ { 
                "elem.vendedor": "" , 
                "elem.numero": Number(req.body.numero) 
            } ], upsert: true }, (error, listo)=>{
                var activacion = cadenaAleatoria()
                var nuevaVenta = new Tarjeta_uso({
                    cabeza: listo.codigo,                          numero: req.body.numero,    fechainicial: new Date(listo.fechainicial),
                    fechafinal: new Date(listo.fechafinal),        titulo: listo.titulo,      imagen: listo.imagen,
                    linkface: listo.linkface,                      linkInst: listo.linkInst,  locales: listo.locales,
                    activacion: activacion,                         activo: true,               vendedor: req.user.codigo,
                    fechaasignacion: new Date(listo.fechainicial), fechaventa: new Date(),     confirmar: false,
                    vendida: true,                                  cliente: req.body.correo
                })
                nuevaVenta.save((error, completo) => {
                    if (error){ res.send('Error') ; return} 
                    var regalo = new Regaladas( { tarjeta: listo.titulo ,numero: req.body.numero, fecha:new Date(), cliente:req.body.correo } )
                    regalo.save((error, listo)=>{
                        if (error){ res.send('Error');  return}
                        res.send(req.body.correo)
                    })
                })
            })
        })
})     
                    

module.exports = router;