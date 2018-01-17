var mongoose =require('mongoose');
TarjetaSchema=new mongoose.Schema({
    codigo: Number,
    fechainicial:Date,
    fechafinal:Date,
    titulo: String,
    descripcion:String,
    imagen:String,
    linkface:String,
    linkInst:String,
    tarjetas: Array,
    locales: Array
}) 
var Tarjetas=module.exports=mongoose.model('Tarjetas',TarjetaSchema); 