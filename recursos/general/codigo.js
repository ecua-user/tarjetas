//Se da el valor de una fecha y lo regresa en formato legible
function obtenerFecha(fecha){
    fecha=new Date(fecha)
    return fecha.getDate()+'/'+ fecha.getMonth()+'/'+ fecha.getFullYear()
}

function obtenerHora(fecha){
    fecha=new Date(fecha)
    return fecha.getHours()+' : '+fecha.getMinutes()
}

//Obtiene el valor de un input
function valor(id){
    return document.getElementById(id).value
}

//Sube las imágenes
function alertaOferta(input, val) {
	var imagenAnterior = document.getElementById('img_destino').src;
	if ((val / 1024) > 3000) {
		document.getElementById('centralMensajes').innerHTML = '<div class="alert alert-danger">Esta imágen pesa mas de 3Mb</div>';
		document.getElementById('file_url').value = ''
		$('#esconder').css("display", "none")
		document.getElementById('img_destino').src = imagenAnterior;
	} else {
		$('#esconder').css("display", "block")
		if (input.files && input.files[0]) {
			var reader = new FileReader();
			reader.onload = (e) => {
				$('#img_destino').attr('src', e.target.result);
				document.getElementById('poder').style.display = 'block';
			}
			reader.readAsDataURL(input.files[0]);
		}
	}
}
function alertaOferta1(input, val) {
	document.getElementById('beneficios_desc').innerHTML = '';
	var cadena = ``;
	if (input.files) {
		for (var i = 0; i < input.files.length; i++) {
			cadena += `<div style="margin-bottom:4px"><label>Imagen: ${input.files[i].name}</label>
					<div class="form-group" >
					<div class="input-group">
						<span class="input-group-addon" id="basic-addon1"><i class="zmdi zmdi-assignment-check"></i></span>
						<textarea name="beneficio" class="form-control" placeholder="Beneficio"></textarea>
					</div></div><div class="form-group">
					<div class="input-group">
						<span class="input-group-addon" id="basic-addon1"><i class="zmdi zmdi-block"></i></span>
						<textarea name="restricciones" class="form-control" placeholder="Restricciones"></textarea>
					</div></div></div>`
		}
		document.getElementById('beneficios_desc').innerHTML = cadena;
	}
}

//Establece valor de un input
function asignar(id,contenido){
    document.getElementById(id).value=contenido
}

//Genera una cadena aleatoria
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
//Muestra un mensaje de cargando
function cargando(texto){
    swal({
        title:'Cargando...',
        text: texto ||'No tomará mucho tiempo',
        allowOutsideClick: false, 
        onOpen:()=>{swal.showLoading()},      
    })
}

//Quita el mensaje de cargando
function no_cargando(){
    swal.close()
}

//Ordena las fechas en formato Año-Mes-Dia
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

//Obtiene el innertTEXT de un elemento
function obtenerTexto(identidad){
    return document.getElementById(identidad).innerText
}
//Establece el innerText de un elemento
function innerTexto(elemento, valor){
    document.getElementById(elemento).innerHTML=valor
}

//Presenta un mensaje de error --Obsoleto--
function mensajeError(mensaje){
    document.getElementById('div-error').innerText=mensaje
    document.getElementById('div-error').style.display='block'
    no_cargando()
}

//presenta un mensaje de error en una ubicación
function error_msg(mensaje, ubicacion){
    document.getElementById(ubicacion).innerText=mensaje
    document.getElementById(ubicacion).style.display='block'
}

//Solo permite ingresar numeros
function solonumeros(e){
	var key = e.keyCode || e.which;
	var teclado=String.fromCharCode(key);
	var letras="1234567890";
	especiales="8-37-38-46-164-191";
	var teclado_especial=false;
	for (var i in especiales) {if (key==especiales[i]) {teclado_especial=true;break;}}
	if (letras.indexOf(teclado)==-1 && !teclado_especial) {return false;}
}

//Permite descargar una tabla en excel
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

function texto_ascii(texto) {
    var cadena=''
    for(var i=0;i< texto.length;i++){
        var codigo=texto.charCodeAt(i);
        if(codigo<100)
            codigo='0'+codigo+' '         
        else
            codigo=codigo+' '  
        cadena+=codigo
    }
    return cadena.substr(0, cadena.length-1)
    
}
function ascii_texto(ascii){
    cadena=''
    try {
        codigos=ascii.split(' ')
        for(var i=0; i< (codigos.length);i++){
            cadena+=String.fromCharCode(codigos[i])
        }
    } catch (error) {
        
    }
    return cadena
}
function mostrar_beneficios(activo, elementos){
    var k= elementos
    return `<div id="${elementos.codigo}" class="carousel-item ${activo}" style="padding-left:2%; padding-right:2%">
                    <div class="row" style="padding:12px">
                        <div class="col-lg-1 col-md-1"></div>
                        <div class="col-lg-5 col-md-5">                                      
                                <img class="img-slider d-block w-100" src="${elementos.imagen}"
                                    alt="">                                       
                        </div>
                        <div class="col-lg-5 col-md-5">
                            <h4 class="centrado">Términos y condiciones</h4>
                            <div style="padding-left:5%; padding-right:5%">
                            <textarea class="area-beneficios" readonly name="" id="" cols="30" rows="10" style="width:100% ; height:100%">${ascii_texto(elementos.beneficio)}\n\n${ascii_texto(elementos.restriccion)}
                            </textarea>
                            </div>
                        </div>
                    </div>
                </div>`
}
function cargar_video(link){
	document.getElementById('espacio_video').setAttribute('src',link)
}

function actualizar_img(valor){
    if(valor!='NA'){
        img_trj.setAttribute('src', valor)
        img_trj1.setAttribute('src', valor)
    }else{
        img_trj.setAttribute('src', '../modular/imagenes/local.png')
        img_trj1.setAttribute('src', '../modular/imagenes/local.png')
    }
}
function actualizar_img_act(valor){
    if(valor!='NA')
        img_trj_act.setAttribute('src', valor)
    else
        img_trj_act.setAttribute('src', '../modular/imagenes/local.png')
}
function control_slider_beneficios(){
	cadena = ''
	var imagenes_slider = document.getElementsByClassName('carro_img')
	imagenes_slider[0].className += ' active'
}
function control_slider_videos(){
	cadena = ''
	var imagenes_slider = document.getElementsByClassName('carro_vid')
	imagenes_slider[0].className += ' active'
}

var tableToExcel = (function() {
    var uri = 'data:application/vnd.ms-excel;base64,'
      , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
      , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
      , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
    return function(table, name) {
      if (!table.nodeType) table = document.getElementById(table)
      var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
      window.location.href = uri + base64(format(template, ctx))
    }
  })()

function validarURL(event) {
	entrada = document.getElementById('input_video').value
	if (entrada.indexOf('embed') < 0) {
		document.getElementById('input_video').setCustomValidity('Esta url no es válida, debe ser embebida')
		event.preventDefault()
	}
	else
		document.getElementById('input_video').setCustomValidity('')
}
function quitarValidacion() {
	document.getElementById('input_video').setCustomValidity('')
}