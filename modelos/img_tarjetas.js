var mongoose =require('mongoose');
imgSchema=new mongoose.Schema({
    codigo:String,
    imagen:String,
    locales:Array,
    inicial:Date,
    final:Date
}) 
var img=module.exports=mongoose.model('img',imgSchema);