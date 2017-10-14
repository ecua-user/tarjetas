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
function cambiar_password(){
    usuario=document.getElementById('id_user').innerText
    $('#modal-password').modal()
}