var mongoose =require('mongoose');
configSchema=new mongoose.Schema({
    codigo:Number,
    slider:Boolean,
    video:Boolean
}) 
var configuracion=module.exports=mongoose.model('configuracion',configSchema);