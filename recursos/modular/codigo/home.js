function cargar_video(link){
	document.getElementById('espacio_video').setAttribute('src',link)
}
function detallar(codigo){
	var envio={codigo:codigo}
	$('#local-info').modal()
	cargando();
	$.ajax({
		method: "POST",
		url: "/local",
		data: envio
	}).done(( datos )=>{
		try {
			document.getElementById('img_loc').setAttribute('src', datos.logotipo)
			innerTexto('nom_loc', datos.nombre)
			innerTexto('tel-loc', datos.telefono)
			innerTexto('val_desde', obtenerFecha(obtenerTexto('fecha_inic')))
			innerTexto('val_hasta', obtenerFecha(obtenerTexto('fecha_fin')))
			
			document.getElementById('tel-loc').setAttribute('href','tel://'+datos.telefono)
			innerTexto('web_loc', datos.web)
			document.getElementById('web_loc').setAttribute('href',+datos.web)
			innerTexto('mail_loc',datos.username)
			document.getElementById('mail_loc').setAttribute('href','mailto:'+datos.username)
			innerTexto('ate_loc', 'De: '+datos.apertura+' a '+ datos.cierre)
			var cadena_beneficio=''
			for(var i=0; i< datos.beneficio.length;i++){
				cadena_beneficio+=`<div class="row separador_bene" >
										<div class="col-lg-4 col-md-4 ">
											<img width="100%" src="${datos.beneficio[i].imagen}"/>
										</div>
										<div class="col-lg-4 col-md-4 ">
											<h5 class="centrado pinfor">Beneficio</h5>
											<p class="centrado">${datos.beneficio[i].beneficio}</p>											
										</div>
										<div class="col-lg-4 col-md-4 ">
											<h5 class="centrado pinfor">Restricciones</h5>
											<p class="centrado">${datos.beneficio[i].restriccion}</p>
										</div>
									</div><div class="divider"></div>`
			}
			innerTexto('beneficios',cadena_beneficio)
		} catch (error) {
			swal("Error", datos, "error");
		}
		no_cargando()
	})
}

