function obtenerFecha(fecha){
    fecha=new Date(fecha)
    return fecha.getDate()+'/'+ fecha.getMonth()+'/'+ fecha.getFullYear()
}
function valor(id){
    return document.getElementById(id).value
}
function cadenaAleatoria() {
    longitud =  16
    caracteres =  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    cadena = "" 
    max = caracteres.length - 1
	for (var i = 0; i < longitud; i++) {
        cadena += caracteres[Math.floor(Math.random() * (max + 1))]; 
    }
    return cadena;
}
function cargando(){
    swal({title:'Cargando...',text:'No tomará mucho tiempo',allowOutsideClick: false,onOpen:()=>{swal.showLoading()}})
}
function no_cargando(){
    swal.close()
}

function ordenarFechas(fecha){
	fecha=new Date(fecha);
	dia=fecha.getDate()+1;
	if(dia<10)
		dia='0'+dia
	mes=fecha.getMonth()+1
	if(mes<10)
		mes='0'+mes
	return fecha.getFullYear()+'-'+mes+'-'+dia
}

function asignar(id,contenido){
    document.getElementById(id).value=contenido
}
function obtenerTexto(identidad){
    return document.getElementById(identidad).innerText
}
function mensajeError(mensaje){
    document.getElementById('div-error').innerText=mensaje
    document.getElementById('div-error').style.display='block'
    no_cargando()
}

function error_msg(mensaje, ubicacion){
    document.getElementById(ubicacion).innerText=mensaje
    document.getElementById(ubicacion).style.display='block'
}

function innerTexto(elemento, valor){
    document.getElementById(elemento).innerHTML=valor
}

function solonumeros(e){
	var key = e.keyCode || e.which;
	var teclado=String.fromCharCode(key);
	var letras="1234567890";
	especiales="8-37-38-46-164-191";
	var teclado_especial=false;
	for (var i in especiales) {if (key==especiales[i]) {teclado_especial=true;break;}}
	if (letras.indexOf(teclado)==-1 && !teclado_especial) {return false;}
}