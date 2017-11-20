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

function descargarExcel(tabla){
    //$('#descarga').css('display:block');
     var navegador = navigator.userAgent;
        if (navigator.userAgent.indexOf('MSIE') !=-1) {
            alert('Está usando Internet Explorer, no hay compatibilidad');
        } else if (navigator.userAgent.indexOf('Firefox') !=-1) {
            ExportToExcel(tabla);
        } else if (navigator.userAgent.indexOf('Chrome') !=-1) {
            excel(tabla);
        } else if (navigator.userAgent.indexOf('Opera') !=-1) {
            alert('Está usando Opera, no hay compatibilidad');
        } else {
            alert('Está usando un navegador no identificado no hay compatibilidad');
        }
    }
function excel(tabla){
    var fecha=new Date();
        var tmpElemento = document.createElement('a');
        var data_type = 'data:application/vnd.ms-excel';
        var tabla_div = tabla;
        var tabla_html = tabla_div.outerHTML.replace(/ /g, '%20');
        tmpElemento.href = data_type + ', ' + tabla_html;
        tmpElemento.download = 'Consulta-'+fecha+'.xls';
        tmpElemento.click();
    }
function ExportToExcel(tabla){
    var htmltable= tabla
    var html = htmltable.outerHTML;
    window.open('data:application/vnd.ms-excel,' + encodeURIComponent(html));
}

function exportar(elemento){
    var tabla=document.getElementById(elemento);
    descargarExcel(tabla);
}
function imprimir(muestra){ 
	var ficha=document.getElementById(muestra);
	var ventimp=window.open(' ','popimpr');
	ventimp.document.write(ficha.innerHTML);
	var estiloFactura=ventimp.document.createElement("link");
	estiloFactura.setAttribute("href","https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css")// Aqui va el archivo css que se desee mostrar en impresora
	estiloFactura.setAttribute("rel", "stylesheet");
    estiloFactura.setAttribute("type", "text/css");
    estiloFactura.setAttribute("integrity","sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u");
	estiloFactura.setAttribute('crossorigin',"anonymous");
	ventimp.document.head.appendChild(estiloFactura);
	ventimp.document.close();
	ventimp.print();
    ventimp.close();	

}