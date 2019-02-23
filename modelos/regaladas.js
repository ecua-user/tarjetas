var mongoose =require('mongoose');
TarjetaRegaloSchema=new mongoose.Schema({
    tarjeta: String,
    numero: Number,
    fecha:Date,
    cliente:String,
}) 
var TarjetaRegalo=module.exports=mongoose.model('TarjetaRegalo',TarjetaRegaloSchema);