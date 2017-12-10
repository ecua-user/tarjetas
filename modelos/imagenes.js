var mongoose =require('mongoose');
imagen=new mongoose.Schema({
    codigo:String,
    imagen: String
}) 
var img_ben=module.exports=mongoose.model('img_ben',imagen);
