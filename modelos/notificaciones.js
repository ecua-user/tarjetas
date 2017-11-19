var mongoose =require('mongoose');
notificacionesSchema=new mongoose.Schema({
    fecha: Date,
    cliente:String,
    local:String,
    local_nombre:String,
    numero: Number,
     beneficio:String
}) 
var Notificacion=module.exports=mongoose.model('Notificacion',notificacionesSchema);
