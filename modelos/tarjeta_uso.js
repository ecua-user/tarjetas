var mongoose =require('mongoose');
TarjetaUsoSchema=new mongoose.Schema({
    cabeza:String,
    numero: Number,
    fechainicial:Date,
    fechafinal:Date,
    titulo: String,
    imagen:String,
    linkface:String,
    linkInst:String,
    locales: Array,
    activacion: String,
    activo: Boolean,
    vendedor:String,
    fechaasignacion:Date,
    fechaventa:Date,
    confirmar: Boolean,
    vendida:Boolean,
    cliente:String,
}) 
var Tarjetas_uso=module.exports=mongoose.model('Tarjetas_uso',TarjetaUsoSchema);

/*
numero:Number,
    fechainicial:Date,x
    fechafinal:Date,x
    locales:Array,x
    imagen:String,x
    activacion:String,
    activo:Boolean,
    vendedor:String,
    fechaasignacion:Date,
    fechaventa: Date,
    confirmar:Boolean,
    vendida:Boolean,
    cliente:String,
    codigo:String,
    imagen:String,
    locales:Array,
    inicial:Date,
    final:Date,
    titulo:String,x
    linkface:String,x
    linkInst:Stringx
*/
