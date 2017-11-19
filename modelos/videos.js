var mongoose =require('mongoose');
VideosSchema=new mongoose.Schema({
    codigo: Number,
    titulo: String,
    url: String
}) 
var Videos=module.exports=mongoose.model('Videos',VideosSchema);
