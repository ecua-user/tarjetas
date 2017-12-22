var mongoose =require('mongoose');
reporteventasSchema=new mongoose.Schema({
    vendedor:String,
    referido: String,
    cliente: String ,
    nombre: String,
    cedula:String,
    fecha: Date,
    tarjeta: String,
    numero:String,
    codigo: String
}) 
var RepoVentas=module.exports=mongoose.model('RepoVentas',reporteventasSchema);
