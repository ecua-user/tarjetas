var mongoose =require('mongoose');
imgSchema=new mongoose.Schema({
    codigo:String,
    imagen:String,
    locales:Array,
    inicial:Date,
    final:Date,
    titulo:String,
    descripcion:String,
    linkface:String,
    linkInst:String
}) 
var img=module.exports=mongoose.model('img',imgSchema);
