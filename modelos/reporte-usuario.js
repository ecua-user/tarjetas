var mongoose =require('mongoose');
repousuarioSchema=new mongoose.Schema({
    codigo: String,
    usuario: String,
    local: String,
    fecha: Date,
    beneficio: String
}) 
var Repousuario=module.exports=mongoose.model('Repousuario',repousuarioSchema);
