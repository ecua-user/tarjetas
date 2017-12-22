var mongoose =require('mongoose');
repousuarioSchema=new mongoose.Schema({
    codigo: String,
    usuario: String,
    nombre: String,
    cedula: String,
    telefono: String,
    direccion: String,
    sector: String,
    edad: String,
    genero: String,
    referido: String,
    local: String,
    fecha: Date,
    beneficio: String,
    tarjeta: Number 
}) 
var Repousuario=module.exports=mongoose.model('Repousuario',repousuarioSchema);

