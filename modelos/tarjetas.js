var mongoose =require('mongoose');
TarjetaSchema=new mongoose.Schema({
    numero:Number,
    fechainicial:Date,
    fechafinal:Date,
    locales:Array,
    imagen:String,
    activacion:String,
    activo:Boolean
}) 
var Tarjetas=module.exports=mongoose.model('Tarjetas',TarjetaSchema);