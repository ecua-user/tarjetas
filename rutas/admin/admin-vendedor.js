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
    Tarjeta= require('../../modelos/tarjetas')
    Tarjeta_uso=require('../../modelos/tarjeta_uso')

//Crea los token_______________________________________
    function cadenaAleatoria() {
        longitud = 16
        caracteres = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        cadena = ""
        max = caracteres.length - 1
        for (var i = 0; i < longitud; i++) { cadena += caracteres[Math.floor(Math.random() * (max + 1))]; }
        return cadena;
    }

router.get('/ingresar-vendedor', ensureAuthenticated, (req, res) => {
    User.find().where({ esvendedor: true }).exec((err, vendedores) => {
        if (err)
            res.render('errores/500', { error: err })
        else
            res.render('administrador/vendedor/ingresar')
    })
})
router.post('/ingresar-vendedor', ensureAuthenticated, (req, res) => {
    if (req.body.password != req.body.rpassword) {
        res.render('administrador/vendedor/ingresar', { error: 'Contraseñas no coinciden' })
        return
    }
    if (Number(req.body.edad) < 18) {
        res.render('administrador/vendedor/ingresar', { error: 'Debe ser mayor de edad para poder registrarse' })
        return
    }
    User.findOne().where({ username: req.body.username }).exec((e, resp) => {
        if (resp != null)
            res.render('administrador/vendedor/ingresar', { error: 'Ya existe un usuario con este correo' })
        else {
            newUser = new User({
                codigo: Date.now(),
                nombre: req.body.nombre,
                cedula: req.body.cedula,
                telefono: req.body.telefono,
                sector: req.body.sector,
                direccion: req.body.direccion,
                edad: req.body.edad,
                genero: req.body.genero,
                username: req.body.username,
                password: req.body.password,
                eslocal: false,
                esadministrador: false,
                token: req.body.token,
                activo: true,
                esvendedor: true,
                imagen: "",
                referido: req.body.superior
            })
            User.createUser(newUser, (e, user) => {
                if (e)
                    res.render('errores/500', { error: e })
                else
                    res.render('administrador/vendedor/ingresar', { success_msg: 'Registrado con éxito' })
            })
        }
    })
})

router.get('/modificar-vendedor', ensureAuthenticated, (req, res) => {
    User.find().where({ esvendedor: true }).exec((error, vendedor) => {
        if (error)
            res.render('errores/500', { error: error })
        else
            res.render('administrador/vendedor/modificar-eliminar', { vendedor: vendedor })
    })
})
router.post('/modificar-vendedor-obtener', ensureAuthenticated, (req, res) => {
    User.findOne().where({ codigo: req.body.codigo }).exec((error, vendedor) => {
        if (error)
            res.send('Error: ' + error)
        else
            res.send(vendedor)
    })
})

router.post('/modificar-vendedor', ensureAuthenticated, (req, res) => {
    User.findOneAndUpdate({ username: req.body.username }, {
        nombre: req.body.nombre,
        edad: req.body.edad,
        sector: req.body.sector,
        genero: req.body.genero,
        telefono: req.body.telefono,
        direccion: req.body.direccion,
        referido: req.body.superior
    }, (err) => {
        if (err)
            res.render('errores/500', { error: err })
        else
            res.redirect('/admin-vendedor/modificar-vendedor')
    })
})
router.post('/eliminar-vendedor', ensureAuthenticated, (req, res) => {
    User.findOneAndRemove({ codigo: req.body.codigo }, (error, respuesta) => {
        if (error)
            res.send('Error: ' + error)
        else
            res.send('Elimiando con éxito')
    })
})
router.get('/asignar-vendedor', ensureAuthenticated, (req, res) => {
    User.find().where({ esvendedor: true }).exec((err, vendedores) => {
        if (err)
            res.render('errores/500', { error: err })
        else
            res.render('administrador/vendedor/asignar', { vendedor: vendedores })
    })
})

router.post('/comprobacion',ensureAuthenticated,(req, res) => {
    Tarjeta.find().select('tarjetas').exec((error, tarjetas)=>{
        var todasTarjetas= new Array()
        for(var i=0; i< tarjetas.length; i++){
            if(i==0)
                todasTarjetas=tarjetas[i].tarjetas
            else    
                todasTarjetas.concat(tarjetas[i].tarjetas)
        }
        var noasignadas=new Array()
        for(var i=0; i< todasTarjetas.length; i++){
            if(todasTarjetas[i].vendedor=="")
                noasignadas.push(todasTarjetas[i])
        }
        var para_asignar= new Array()
        var inicio=Number(req.body.tarjeta_ini)
        do{
            para_asignar.push(inicio)
            inicio++   
        }while(inicio <= Number(req.body.tarjeta_fin))
        res.send(comprobar_activaciones(noasignadas, para_asignar))
    })
})

router.post('/asignar-vendedor', ensureAuthenticated,(req, res) => {
    var para_asignar= new Array()
    var inicio=Number(req.body.tarjeta_ini)
    do{
        para_asignar.push({numero:inicio})
        inicio++   
    }while(inicio <= Number(req.body.tarjeta_fin))
    Tarjeta.find().select('codigo tarjetas').exec((error, tipo_tarjetas)=>{
        if(error)
            res.send('Error')
        else{
            for(var i=0; i < tipo_tarjetas.length; i++){
                for(var j=0; j< tipo_tarjetas[i].tarjetas.length; j++){
                    for(var k=0; k< para_asignar.length; k++){
                        if(tipo_tarjetas[i].tarjetas[j].numero==para_asignar[k].numero){                           
                            tipo_tarjetas[i].tarjetas[j].vendedor=req.body.vendedor
                            k=para_asignar.length+1
                        }
                    }
                }
                Tarjeta.findOneAndUpdate({codigo:tipo_tarjetas[i].codigo},{tarjetas:tipo_tarjetas[i].tarjetas},(error, actualizado)=>{
                    if(error){console.log(error)}
                })
            }
            res.send('Tarjetas asignadas')
        }
    })
})

router.post('/resetear', (req,res)=>{
    Tarjeta.find().select('tarjetas locales codigo').exec((error, Tarjetas)=>{
        if(error)
            res.send('Error')
        else{
            var codigos, ejemplo_tarjetas
            for(var i=0; i< Tarjetas.length; i++){
                try {
                    for(var j=0; j<Tarjetas[i].tarjetas.length; j++){
                        if(Tarjetas[i].tarjetas[j].numero==req.body.numero){
                            Tarjetas[i].tarjetas[j].vendedor=''
                            Tarjetas[i].tarjetas[j].cliente=''
                            Tarjetas[i].tarjetas[j].activo=false    
                            codigos= Tarjetas[i].codigo  
                            ejemplo_tarjetas=Tarjetas[i].tarjetas
                            j=Tarjetas[i].tarjetas.length
                            i=Tarjetas.length
                        }                  
                    }    
                } catch (error) {
                    console.log(error)
                }                  
                Tarjeta.findOneAndUpdate({codigo:codigos},{tarjetas:ejemplo_tarjetas}, (error, listo)=>{})
            }
            //Aqui se resetearan las vendidas
            Tarjeta_uso.findOneAndRemove({numero:req.body.numero}, (error, eliminado)=>{
                res.send('OK')
            })
        }
    })
})

router.get('/tarjeta',(req,res)=>{
    Tarjeta.find().exec((error, tarjeta)=>{
        res.send(tarjeta)
    })
})


function comprobar_activaciones(madre, hijo){
    var cadena_madre='-'
    for(var i=0; i< madre.length; i++){
        cadena_madre+=madre[i].numero+'-'
    }
    var cadena_hijo='-'
    for(var i=0; i< hijo.length; i++){
        cadena_hijo+=hijo[i]+'-'
    }
    if(cadena_madre.indexOf(cadena_hijo)==-1)
        return ('No existen las tarjetas')
    else
        return ('Listas para asignar')
}

module.exports = router;

