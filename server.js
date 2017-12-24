//Instalamos las dependencias__________________________________________________________________________________________
cookieParser = require('cookie-parser')
bodyParser = require('body-parser')
exphbs = require('express-handlebars')
expressValidator = require('express-validator')
flash = require('connect-flash')
session = require('express-session')
path = require('path')
passport = require('passport')
LocalStrategy = require('passport-local').Strategy
mongoose = require('mongoose')
express = require('express')
servidor = express()

//Establecemos el puerto de conexión web
puerto=3000;
http = require('http').Server(servidor)
port = process.env.PORT || puerto

//# region conexion======================= Conexión con la base de datos ======================//
//mongoose.connect('mongodb://Admin:Abc123.....@ds163806.mlab.com:63806/ecactiva',{ server: { reconnectTries: Number.MAX_VALUE } });
mongoose.connect('mongodb://Admin:Abc123.....@ds013941.mlab.com:13941/pruebas',{ server: { reconnectTries: Number.MAX_VALUE } });

//Establecemos las rutas para cada uso
routes = require('./rutas/index')
rutaUsuario=require('./rutas/users')
admin = require('./rutas/admin')
rutaVendedor=require('./rutas/vendedor')
rutaLocal=require('./rutas/local')
rutaCliente=require('./rutas/cliente')

//Definimos que se usará tecnología hbs para modificar la vista de una página
servidor.set('views', path.join(__dirname, 'views'));

//La página estática sirve para reciclar elementos
servidor.engine('handlebars', exphbs({ defaultLayout: 'estatico' }));
servidor.set('view engine', 'handlebars');

//Permitimos el reconocimiento de JSON en el sistema 
servidor.use(bodyParser.json());
servidor.use(bodyParser.urlencoded({ extended: false }));
servidor.use(cookieParser());

//Aqui se define donde estarán los estilos y scripts tanto globales como modulares
servidor.use(express.static(path.join(__dirname, 'recursos')));

//Con esto nos aseguramos que se usen sesiones e inicios de sesión con encriptación
servidor.use(session({ secret: 'secret', saveUninitialized: true, resave: true }));
servidor.use(passport.initialize());
servidor.use(passport.session());

//Usando esta API se puede validar campos desde ambos lados (Cliente- Servidor)
servidor.use(expressValidator({
    errorFormatter: (param, msg, value)=>{
        var namespace = param.split('.'), root = namespace.shift(), formParam = root;
        while (namespace.length) { formParam += '[' + namespace.shift() + ']'; }
        return { param: formParam, msg: msg, value: value };
    }
}));

//Es necesario el poder enviar mensajes automáticos desde el servidor
servidor.use(flash());

//Establecemos variables globales para el envío de datos
servidor.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null;
    next()
});

//usamos las rutas creadas anteriormente
servidor.use('/', routes)
servidor.use('/users',rutaUsuario)
servidor.use('/vendedor',rutaVendedor)
servidor.use('/admin', admin)
servidor.use('/local', rutaLocal)
servidor.use('/cliente',rutaCliente)


//Controlamos el error de página no encontrada
servidor.use((req, res)=>{
    res.status('404')
    res.render('errores/400')
});

//Controlamos el error de fallos en el servidor
servidor.use((err, req, res, next)=>{
    res.status(500);
    res.render('errores/500', { error: err })
});

//Inicializamos el servidor
http.listen(port);