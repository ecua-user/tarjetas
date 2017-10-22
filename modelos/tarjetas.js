var mongoose =require('mongoose');
TarjetaSchema=new mongoose.Schema({
    numero:Number,
    fechainicial:Date,
    fechafinal:Date,
    locales:Array,
    activacion:String
}) 
var Tarjetas=module.exports=mongoose.model('Tarjetas',TarjetaSchema);