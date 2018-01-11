function detallar(codigo){
	var envio={codigo:codigo}
	cargando('Obteniendo información...');
	$.ajax({
		method: "POST",
		url: "/local",
		data: envio
	}).done(( datos )=>{
		var activo='active'
		var cadena=''
		document.getElementById('img_local').setAttribute('src', datos[0].logotipo)
		innerTexto('nom_loc', datos[0].nombre)
		innerTexto('horario_loc', datos[0].horario)
		innerTexto('dir_loc', datos[0].direccion)
		document.getElementById('mapa_loc', datos[0].mapa)
		document.getElementById('face_local').setAttribute('href', datos[0].facebook)
		document.getElementById('inst_local').setAttribute('href', datos[0].instagram)
		document.getElementById('mapa_loc').setAttribute('src',datos[0].mapa)
		for(var i=0; i< datos[0].beneficio.length; i++){
			if(i!=0)
				activo=''
			cadena+=mostrar_beneficios(activo,datos[0].beneficio[i])
		}
		innerTexto('elementos-carrusel', cadena)	
		no_cargando()
		$('#local-info').modal()
	})
}


function control_slider(){
	cadena = ''
	var imagenes_slider = document.getElementsByClassName('carro_trj')
	document.getElementsByClassName('indica').className += 'active'
	imagenes_slider[0].className += ' active'
}

function detalle_trj(codigo){
	envio={codigo:codigo}
	$.ajax({
		method: "POST",
		url: "/detalles_trj",
		data: envio
	}).done(( datos )=>{
		document.getElementById('flotante_tit').innerText=datos.titulo
		document.getElementById('flotante_desc').innerText=datos.descripcion
		$('#tarjeta-info').modal()
	})
	

}
function ocultar_modal(){
	$('#tarjeta-info').modal('hide')
}