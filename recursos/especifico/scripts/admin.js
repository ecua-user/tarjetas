function alertaOferta(input, val) {
	document.getElementById('centralMensajes').innerHTML = ''
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
			reader.onload =  (e)=> {
				$('#img_destino').attr('src', e.target.result);
				document.getElementById('poder').style.display = 'block';
			}
			reader.readAsDataURL(input.files[0]);
		}
	}
}

function modificar_vendedor(identidad){
	envio={codigo:identidad}
	cargando();
	$.ajax({
		method: "POST",
		url: "/admin/modificar-vendedor-obtener",
		data: envio
	}).done(( datos )=>{
		asignar('modificar-nombre', datos.nombre)
		asignar('modificar-edad', datos.edad)
		asignar('modificar-cedula', datos.cedula)
		asignar('modificar-email', datos.username)
		asignar('modificar-sector', datos.sector)
		asignar('modificar-direccion', datos.direccion)
		asignar('modificar-telefono',datos.telefono)
		genero=document.getElementsByClassName('genero')
		for(var i=0;i<genero.length;i++){
			if(datos.genero==genero[i].value)
				genero[i].setAttribute('selected','')
		}
		no_cargando()
		$('#modal-modificar-vendedor').modal();
	});
}
function eliminar_vendedor(identidad){
	cargando()
	envio={codigo:identidad}
	$.ajax({
		method: "POST",
		url: "/admin/eliminar-vendedor",
		data: envio
	}).done(( respuesta )=>{
		no_cargando()
		swal("Listo", respuesta)
		location.reload()
	})
}
function filtro_vendedores(){
	filtro=(document.getElementById('filtro-buscar').value).toUpperCase()
	elementos=document.getElementsByClassName('busqueda')
	contenedores=document.getElementsByClassName('vendedores-buscar')
	for(var i=0;i<elementos.length;i++){
		if (elementos[i].innerHTML.toUpperCase().indexOf(filtro) > -1) 
			contenedores[i].style.display = ""
		else
			contenedores[i].style.display = "none"
	}
}

function modificar_local(identidad){
	cargando();
	envio={codigo:identidad}
	$.ajax({
		method: "POST",
		url: "/admin/modificar-local-obtener",
		data: envio
	}).done(( datos )=>{
		asignar('modificar-nombre',datos.nombre)
		asignar('modificar-email',datos.username)
		asignar('modificar-cod',datos.codigo)
		document.getElementById('img_destino').setAttribute('src',datos.imagen)
		no_cargando()
		$('#modal-modificar-local').modal()
	})
}

function eliminar_local(identidad){
	cargando()
	envio={codigo:identidad}
	$.ajax({
		method: "POST",
		url: "/admin/eliminar-local",
		data: envio
	}).done(( respuesta )=>{
		no_cargando()
		swal("Listo", respuesta)
		location.reload()
	})
}

function filtro_locales(){
	filtro=(document.getElementById('filtro-buscar').value).toUpperCase()
	elementos=document.getElementsByClassName('busqueda')
	contenedores=document.getElementsByClassName('locales-buscar')
	for(var i=0;i<elementos.length;i++){
		if (elementos[i].innerHTML.toUpperCase().indexOf(filtro) > -1) 
			contenedores[i].style.display = ""
		else
			contenedores[i].style.display = "none"
	}
}

function validaciones(event) {
	cargando()
	var fechaInicial = new Date(valor('fecha-inicial'))
	var fechaFinal = new Date(valor('fecha-final'))
	if (fechaInicial == 'Invalid Date' || fechaFinal == 'Invalid Date') {
		presentarError('Son fechas inválidas, use el formato MM/DD/AAAA',event)
		return
	}
	if ((fechaFinal - fechaInicial) <= 0) {
		presentarError('La fecha de caducidad no puede ser menor que la inicial',event)
		return
	}
	var numeroInicial=Number(valor('tarjeta-inicial'))
	var numeroFinal=Number(valor('tarjeta-final'))
	if(numeroFinal<=numeroInicial){
		presentarError('El número final debe ser mayor que la inicial',event)
		return
	}
	var opciones=document.getElementsByTagName('option')
	contador=0;
	for(var i=0;i<opciones.length;i++){
		if(opciones[i].selected)
			contador++
	}
	/*
	if(contador<40 || contador>40){
		presentarError('Deben elegirse 40 locales comerciales',event)
		return
	}
	*/
}
function presentarError(mensaje,event) {
	no_cargando()
	event.preventDefault()
	document.getElementById('div-peligro').innerText = mensaje
	document.getElementById('div-peligro').style.display = 'block'
}