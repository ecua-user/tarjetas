//Es necesario siempre hacer referencia al API de mongodb
mongoose = require('mongoose');
bcrypt = require('bcryptjs');

//Se crea el esquema necesario_______________________________________________________________________________________________________________
var usuariosSchema = mongoose.Schema({
	/*Datos generales*/
		codigo:String,
		nombre: String,
		cedula:String,
		telefono:String,
		sector:String,
		direccion:String,
		edad:Number,
		genero: String,
		username:String,
		password: String,
		token:String,
		token:String,
		activo:Boolean,
	/*Datos administrador*/
		esadministrador:Boolean,
	/*Datos  local*/
    	eslocal:Boolean,	
		logotipo:String,
		beneficio:Array,
		facebook:String,
		instagram:String,
		apertura: String,
		cierre: String,
		web:String,
	/*Vendedor*/
		esvendedor:Boolean,
	/*CLiente*/
		escliente:Boolean,
		referido:String
});

//Exporta el esquema para poder ser usado en cada ruta que sea  necesario____________________________________________________________________
var usuarios=module.exports=mongoose.model('usuarios',usuariosSchema);

module.exports.createUser = (newUser, callback)=>{
	bcrypt.genSalt(10, (err, salt)=> {
	    bcrypt.hash(newUser.password, salt, (err, hash) =>{
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = (username, callback)=>{
	User.findOne({username: username}, callback);
}

module.exports.getUserById = (id, callback)=>{
	User.findById(id, callback);
}

module.exports.comparePassword = (candidatePassword, hash, callback)=>{
	bcrypt.compare(candidatePassword, hash, (err, isMatch)=> {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}