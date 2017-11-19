var mongoose =require('mongoose');
TarjetaSchema=new mongoose.Schema({
    numero:Number,
    fechainicial:Date,
    fechafinal:Date,
    locales:Array,
    imagen:String,
    activacion:String,
    activo:Boolean,
    vendedor:String,
    fechaasignacion:Date,
    fechaventa: Date,
    vendida:Boolean,
    cliente:String,
    linkface:String,
    linkInst:String
}) 
var Tarjetas=module.exports=mongoose.model('Tarjetas',TarjetaSchema);
