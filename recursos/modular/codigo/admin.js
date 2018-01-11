function filtro_vendedores() {
	filtro = (document.getElementById('filtro-buscar').value).toUpperCase()
	elementos = document.getElementsByClassName('busqueda')
	contenedores = document.getElementsByClassName('vendedores-buscar')
	for (var i = 0; i < elementos.length; i++) {
		if (elementos[i].innerHTML.toUpperCase().indexOf(filtro) > -1)
			contenedores[i].style.display = ""
		else
			contenedores[i].style.display = "none"
	}
}
function modificar_vendedor(identidad) {
	envio = { codigo: identidad }
	cargando();
	$.ajax({
		method: "POST",
		url: "/admin/modificar-vendedor-obtener",
		data: envio
	}).done((datos) => {
		asignar('modificar-nombre', datos.nombre)
		asignar('modificar-edad', datos.edad)
		asignar('modificar-cedula', datos.cedula)
		asignar('modificar-email', datos.username)
		asignar('modificar-sector', datos.sector)
		asignar('modificar-direccion', datos.direccion)
		asignar('modificar-telefono', datos.telefono)
		genero = document.getElementsByClassName('genero')
		for (var i = 0; i < genero.length; i++) {
			if (datos.genero == genero[i].value)
				genero[i].setAttribute('selected', '')
		}
		superior = document.getElementsByClassName('todos_superior')
		for (var i = 0; i < superior.length; i++) {
			if (datos.codigo == superior[i].value) {
				superior[i].style.display = 'none'
			}
			if (datos.referido == superior[i].value)
				superior[i].setAttribute('selected', '')
		}
		no_cargando()
		$('#modal-modificar-vendedor').modal();
	});
}
function eliminar_vendedor(identidad) {
	swal({
		title: "¿Está seguro?",
		text: "Una vez eliminado no se podrá recuperar",
		icon: "warning",
		buttons: true,
		dangerMode: true,
	})
		.then((willDelete) => {
			if (willDelete) {
				cargando()
				envio = { codigo: identidad }
				$.ajax({
					method: "POST",
					url: "/admin/eliminar-vendedor",
					data: envio
				}).done((respuesta) => {
					swal("Listo", respuesta)
					location.reload()
					no_cargando()
				})
			}
		})
}

//Revisar
function comprobar_validez(event) {
	document.getElementById('div-error').innerText = ''
	document.getElementById('div-error').style.display = 'none'
	event.preventDefault()
	if (valor('tarj_ini') > valor('tarje_fin')) {
		document.getElementById('div-error').innerText = 'Tarjeta final debe ser mayor a inicial'
		document.getElementById('div-error').style.display = 'block'
		return;
	}
	cargando()
	var envio = { tarjeta_ini: valor('tarj_ini'), tarjeta_fin: valor('tarje_fin') }
	$.ajax({
		method: "POST",
		url: "/admin/comprobacion",
		data: envio
	}).done((respuesta) => {
		var resta = Number(envio.tarjeta_fin) - Number(envio.tarjeta_ini)
		resta++
		if (resta != respuesta) {
			document.getElementById('div-error').innerText = 'No estan registradas algunas de esas tarjetas o ya han sido asignadas a un vendedor'
			document.getElementById('div-error').style.display = 'block'
		} else {
			envio = { tarjeta_ini: valor('tarj_ini'), tarjeta_fin: valor('tarje_fin'), vendedor: valor('todos_vendedores'), fecha: valor('fechayhora') }
			$.ajax({
				method: "POST",
				url: "/admin/asignar-vendedor",
				data: envio
			}).done((respuesta) => {
				swal("Listo", respuesta)
				location.reload();
				
			})
		}
		no_cargando();
	})
}


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

function modificar_local(identidad) {
	cargando();
	envio = { codigo: identidad }
	$.ajax({
		method: "POST",
		url: "/admin/obtener-local",
		data: envio
	}).done((datos) => {
		//asignar('modificar-nombre',datos.nombre)
		document.getElementById('img_destino').setAttribute('src', datos.logotipo)
		asignar('modificar_nombre_local', datos.nombre)
		asignar('modificar_facebook_local', datos.facebook)
		asignar('modificar_instagram_local', datos.instagram)
		asignar('modificar_direccion_local', datos.direccion)
		asignar('modificar_telefono_local', datos.telefono)
		asignar('modificar_website_local', datos.web)
		asignar('modificar_horario_local', datos.horario)
		asignar('modificar_email_local', datos.username)
		asignar('codigo_local', datos.codigo)
		asignar('mapa_local', datos.mapa)

		var cadena = ''
		for (var i = 0; i < datos.beneficio.length; i++) {
			cadena += `<div style="margin-bottom:8px">
						<img width="100%" src="${datos.beneficio[i].imagen}" />
						<div class="form-group">
							<div class="input-group">
								<span class="input-group-addon" id="basic-addon1"><i class="zmdi zmdi-assignment-check"></i></span>
								<textarea name="beneficio" class="form-control" placeholder="Beneficio">${ascii_texto(datos.beneficio[i].beneficio)}</textarea>
							</div>
						</div>
						<div class="form-group">
							<div class="input-group">
								<span class="input-group-addon" id="basic-addon1"><i class="zmdi zmdi-block"></i></span>
								<textarea name="restricciones" class="form-control" placeholder="Restricciones">${ascii_texto(datos.beneficio[i].restriccion)}</textarea>
							</div>
						</div>
					</div>`
		}
		document.getElementById('beneficios_desc').innerHTML = cadena
		no_cargando()
		$('#modal-modificar-local').modal()
	})
}

function eliminar_local(identidad) {
	swal({
		title: "¿Está seguro?",
		text: "Una vez eliminado no se podrá recuperar",
		icon: "warning",
		buttons: true,
		dangerMode: true,
	})
		.then((willDelete) => {
			if (willDelete) {
				cargando()
				envio = { codigo: identidad }
				$.ajax({
					method: "POST",
					url: "/admin/eliminar-local",
					data: envio
				}).done((respuesta) => {
					no_cargando()
					swal("Listo", respuesta)
					location.reload()
				})
			}
		});
}
function filtro_locales() {
	filtro = (document.getElementById('filtro-buscar').value).toUpperCase()
	elementos = document.getElementsByClassName('busqueda')
	contenedores = document.getElementsByClassName('locales-buscar')
	for (var i = 0; i < elementos.length; i++) {
		if (elementos[i].innerHTML.toUpperCase().indexOf(filtro) > -1)
			contenedores[i].style.display = ""
		else
			contenedores[i].style.display = "none"
	}
}

function tarjeta_individual() {
	document.getElementById('individual').style.display = 'block'
	document.getElementById('grupal').style.display = 'none'
	$('#link-indiv').addClass('active');
	$('#link-grup').removeClass('active')
	document.getElementById('control_error').style.display = 'none'
	document.getElementById('consulta_edicion').style.display = 'block'
	document.getElementById('edicion_individual').style.display = 'none'
}
function tarjeta_grupal() {
	document.getElementById('individual').style.display = 'none'
	document.getElementById('grupal').style.display = 'block'
	$('#link-indiv').removeClass('active');
	$('#link-grup').addClass('active')
	document.getElementById('control_error').style.display = 'none'
	document.getElementById('edicion_individual').style.display = 'none'
}
function eliminar_trj() {
	var envio = { numero: valor('numero_consulta') }
	cargando()
	$.ajax({
		method: "POST",
		url: "/admin/eliminar-numero",
		data: envio
	}).done((respuesta) => {
		swal(respuesta)
	})
}

function modificar_grupo_trj(identificador) {
	var envio = { codigo: identificador }
	cargando()
	$.ajax({
		method: "POST",
		url: "/admin/detalles-masa",
		data: envio
	}).done((respuesta) => {
		try {
			asignar('desc_tar_mas', respuesta[0].descripcion)
			asignar('codInteSiste', respuesta[0].codigo)
			asignar('tit_tar_mas', respuesta[0].titulo)
			asignar('fecha-inicial', ordenarFechas(respuesta[0].inicial))
			asignar('fecha-final', ordenarFechas(respuesta[0].final))
			asignar('linkfacebook', respuesta[0].linkface)
			asignar('linkinstagram', respuesta[0].linkInst)
			document.getElementById('img_destino').setAttribute('src', respuesta[0].imagen)
			var opciones = ``
			for (var i = 0; i < respuesta[1].length; i++) {
				var seleccion = ''
				for (var j = 0; j < respuesta[0].locales.length; j++) {
					if (respuesta[1][i].codigo == respuesta[0].locales[j].local) {
						seleccion = 'selected'
					}
				}
				opciones += `<option ${seleccion} value="${respuesta[1][i].codigo}">${respuesta[1][i].nombre}</option>`
			}
			innerTexto('mod_masa_loc', opciones)
			no_cargando()
			$('#modal_edit_tarj').modal()
		} catch (error) {
			no_cargando()
			swal('Ha ocurrido un error', 'No existe respuesta del servidor', 'error')
		}
	})
}

function actualiza_trj_indivdidual() {
	var a_enviar = new Array()
	var locales = document.getElementsByClassName('este-es-local');
	var inicial = new Date(valor('mod_tar_inic'))
	var final = new Date(valor('mod_tar_fin'))
	if (inicial >= final) {
		error_msg('Fechas mal establecidas', 'error_trj')
		return
	} else {
		document.getElementById('error_trj').style.display = 'none'
	}
	cargando()
	for (var i = 0; i < locales.length; i++) {
		codigo = locales[i].getAttribute('id')
		opciones = locales[i].getElementsByClassName('benef_escog')
		var beneficios_a_enviar = new Array()
		for (var j = 0; j < opciones.length; j += 2) {
			disp_o_no = opciones[j].getAttribute('name')
			estado = $('input:radio[name=' + disp_o_no + ']:checked').val()
			if (estado == 0)
				estado = false
			if (estado == 1)
				estado = true
			beneficios_a_enviar.push({ codigo: disp_o_no, estado: estado })
		}
		a_enviar.push({ codigo: codigo, beneficios: beneficios_a_enviar })
	}

	var envio = { numero: valor('mod_tar_num'), cambios: a_enviar, inicial: valor('mod_tar_inic'), final: valor('mod_tar_fin'), vendedor: valor('listar_vend') }

	$.ajax({
		type: "POST",
		url: "/admin/actualizar-numero",
		dataType: "text",
		async: false,
		contentType: "application/json",
		data: JSON.stringify(envio)
	}).done(function (resp) {
		no_cargando()
		if (resp == 'ok')
			swal({ title: "Listo", text: "Tarjeta actualizada, click afuera para cerrar", icon: "success", button: "Ok", });
		else
			swal({ title: "Error", text: "Tarjeta no actualizada, click afuera para cerrar", icon: "error", button: "Ok", });
		location.reload()
	})


}


function consultar_trj() {
	var opciones_vend = document.getElementsByClassName('lista_vendedores')
	for (var i = 0; i < opciones_vend.length; i++) {
		try {
			document.getElementsByClassName('lista_vendedores')[1].removeAttribute('selected', '')
		} catch (error) {
		}
	}
	var envio = { numero: valor('numero_consulta') }
	cargando()
	$.ajax({
		method: "POST",
		url: "/admin/consultar-numero",
		data: envio
	}).done((respuesta) => {
			if (respuesta.length == 0) {
				$('#div-error').html('Esta tarjeta no existe')
				document.getElementById('div-error').style.display = 'block'
				no_cargando()
				return
			}
			var opciones_vend = document.getElementsByClassName('lista_vendedores')
			for (var i = 0; i < opciones_vend.length; i++) {
				if (opciones_vend[i].value == respuesta[0].vendedor) {
					opciones_vend[i].setAttribute('selected', '')
				}
			}
			document.getElementById('div-error').style.display = 'none'
			asignar('mod_tar_num', respuesta[0].numero)
			asignar('mod_tar_inic', ordenarFechas(respuesta[0].fechainicial))
			asignar('mod_tar_fin', ordenarFechas(respuesta[0].fechafinal))
			var cadena = '';
			for (var i = 0; i < respuesta[0].locales.length; i++) {
				try {
					cadena += `<div class="row fondo-blanco este-es-local" style=" width:100%" id="${respuesta[1][i].codigo}">
							<div class="col-lg-3 col-md-4">
							<label>Local</label>
							<img width="100%" src="${respuesta[1][i].logotipo}"/>
							<h5 class="centrado">${respuesta[1][i].nombre}</h5>
						</div> 
						<div class="col-lg-9 col-md-8">
							<div class="table">
								<table class="table  table-bordered"><tr> <th>Beneficio</th><th colspan="2">Estado</th></tr>`
				for (var j = 0; j < respuesta[0].locales[i].beneficio.length; j++) {
					var estado_benef = verificar_benef(respuesta[0].locales[i].beneficio[j].activo)
					cadena += `<tr>
							<td><textarea class="area-beneficios" readonly style="width:100%; height:140px; border: solid 0px white" resizable="none">${ascii_texto(respuesta[0].locales[i].beneficio[j].beneficio)}
							</textarea></td>
							<td>
							<label><input value="1" onchange="conSeleccion(this)" class="benef_escog" name="${respuesta[0].locales[i].beneficio[j].codigo}" ${estado_benef[0]}  type="radio"/>  Disponible.</label>
							</td>	
							<td>
								<label><input value="0" onchange="sinSeleccion(this)" class="benef_escog" ${estado_benef[1]}  name="${respuesta[0].locales[i].beneficio[j].codigo}" type="radio"/>  No Disponible.</label>
							</td>	</tr>						
							`
				}
				cadena += `</table>
								</div>
							</div>
						</div>`
				} catch (error) {
					cadena+=''
				}
			}
			document.getElementById('loc_mod_tar').innerHTML = cadena
			document.getElementById('edicion_individual').style.display = 'block'
			document.getElementById('consulta_edicion').style.display = 'none'
			asignar('numero_consulta', '')
		no_cargando()
	})
}



function verificar_benef(atributo) {
	var respuesta = new Array()
	if (atributo) {
		respuesta.push('checked')
		respuesta.push('')
	} else {
		respuesta.push('')
		respuesta.push('checked')
	}
	return respuesta
}
function conSeleccion(elemento) {
	var nombre = elemento.name
	document.getElementsByName(nombre)[1].removeAttribute('checked')
	document.getElementsByName(nombre)[0].setAttribute('checked', '')
}

function sinSeleccion(elemento) {
	var nombre = elemento.name
	document.getElementsByName(nombre)[0].removeAttribute('checked')
	document.getElementsByName(nombre)[1].setAttribute('checked', '')
}

function eliminar_user(identidad) {
	envio = { codigo: identidad }
	cargando('Procesando...')
	$.ajax({
		method: "POST",
		url: "/admin/eliminar-cliente",
		data: envio
	}).done((respuesta) => {
		if (respuesta == 'Error al eliminar el cliente') {
			$('#div-error').html('Tarjeta no encontrada')
			document.getElementById('div-error').style.display = 'block'
			no_cargando()
		} else {
			location.reload()
			no_cargando()
		}
	})
}
function generar_reporte_local() {
	var envio = { nombre: valor('todos_locales') }
	cargando()
	$.ajax({
		method: "POST",
		url: "/admin/ver-reporte-locales",
		data: envio
	}).done((respuesta) => {
		var cadena = `<tr>
						<th class="encabezado_tabla">Local</th>
						<th class="encabezado_tabla">Cédula Cliente</th>
						<th class="encabezado_tabla">Mail Cliente</th>
						<th class="encabezado_tabla">Nombre Cliente</th>
						<th class="encabezado_tabla">Edad Cliente</th>
						<th class="encabezado_tabla">Genero Cliente</th>
						<th class="encabezado_tabla">Ref. Cliente</th>
						<th class="encabezado_tabla">Teléfono</th>
						<th class="encabezado_tabla">Sector</th>
						<th class="encabezado_tabla">Dirección</th>
						<th class="encabezado_tabla">Tarjeta</th>
						<th class="encabezado_tabla">Fecha</th>
						<th class="encabezado_tabla">Hora</th>
						<th class="encabezado_tabla">Beneficio</th>
					</tr>`
		for (var i = 0; i < respuesta.length; i++) {
			cadena += `<tr>
						<td>${respuesta[i].local}</td>
						<td>${respuesta[i].cedula || ''}</td>
						<td>${respuesta[i].usuario}</td>
						<td>${respuesta[i].nombre || ''}</td>
						<td>${respuesta[i].edad || ''}</td>
						<td>${respuesta[i].genero || ''}</td>
						<td>${respuesta[i].referido || ''}</td>
						<td>${respuesta[i].telefono || ''}</td>
						<td>${respuesta[i].sector || ''}</td>
						<td>${respuesta[i].direccion || ''}</td>
						<td>${respuesta[i].tarjeta}</td>
						<td>${obtenerFecha(respuesta[i].fecha)}</td>
						<td>${obetenerHora(respuesta[i].fecha)}</td>
						<td>${ascii_texto(respuesta[i].beneficio)}</td>
					</tr>`
		}
		no_cargando()
		innerTexto('datos_reporte', cadena)
	})
}



function generar_reporte_cliente() {
	var envio = { nombre: valor('todos_usuarios') }
	cargando()
	$.ajax({
		method: "POST",
		url: "/admin/ver-reporte-usuario",
		data: envio
	}).done((respuesta) => {
		var cadena = `<tr>
						<th>Código</th>
						<th>Local</th>
						<th>Cliente</th>
						<th>Tarjeta</th>
						<th>Fecha</th>
						<th>Hora</th>
						<th>Beneficio</th>
					</tr>`
		for (var i = 0; i < respuesta.length; i++) {
			cadena += `<tr>
						<td>${respuesta[i].codigo}</td>
						<td>${respuesta[i].local}</td>
						<td>${respuesta[i].usuario}</td>
						<td>${respuesta[i].tarjeta}</td>
						<td>${obtenerFecha(respuesta[i].fecha)}</td>
						<td>${obetenerHora(respuesta[i].fecha)}</td>
						<td>${ascii_texto(respuesta[i].beneficio)}</td>
					</tr>`
		}
		no_cargando()
		innerTexto('datos_reporte', cadena)
	})
}

function eliminar_grupo_trj(valor) {
	var envio = { codigo: valor }
	$.ajax({
		method: "POST",
		url: "/admin/eliminar-tarjetas",
		data: envio
	}).done((respuesta) => {
		swal(respuesta)
		location.reload()
	})
}
function obetenerHora(fecha) {
	var nfecha = new Date(fecha)
	return nfecha.getHours() + ':' + nfecha.getMinutes()
}

function eliminarVideo(identificador) {
	var envio = { codigo: identificador }
	cargando()
	$.ajax({
		method: "POST",
		url: "/admin/eliminar-video",
		data: envio
	}).done((respuesta) => {
		no_cargando()
		if (respuesta == 'Error')
			swal('Error', 'No se ha podido eliminar', 'error')
		else
			swal('Listo', respuesta, 'success')
		location.reload()
	})
}
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

function generar_reporte_vendedor() {
	var envio = { nombre: valor('todos_vendedores') }
	cargando()
	$.ajax({
		method: "POST",
		url: "/admin/ver-reporte-vendedor",
		data: envio
	}).done((respuesta) => {
		var cadena = `<tr>
						<th>Principal</th>
						<th>Superior</th>
						<th>Vendedor</th>
						<th>Tipo</th>
						<th>Email Cliente</th>
						<th>Cédula</th>
						<th>Nombre</th>
						<th>Fecha</th>
						<th>Hora</th>
						<th>Tarjeta</th>
						<th>Número</th>
					</tr>`
		for (var i = 0; i < respuesta.length; i++) {
			cadena += `<tr>
						<td class="principal"></td>
						<td class="superior"></td>
						<td class="refer">${respuesta[i].vendedor}</td>
						<td>${tipo_vendedor(respuesta[i].referido || '') || ''}</td>
						<td>${respuesta[i].cliente}</td>
						<td>${respuesta[i].cedula || ''}</td>
						<td>${respuesta[i].nombre || ''}</td>
						<td>${obtenerFecha(respuesta[i].fecha)}</td>
						<td>${obetenerHora(respuesta[i].fecha)}</td>
						<td><img src="${respuesta[i].tarjeta}" width="60px"/></td>
						<td>${respuesta[i].numero}</td>
					</tr>`
		}
		no_cargando()
		innerTexto('datos_reporte', cadena)
		obtener_superior()
	})
}
function obtener_superior(){
	cargando('Obteniendo información')
	var superiores= document.getElementsByClassName('refer')
	for(var i=0; i < superiores.length; i++){
		envio={numero:i,nombre: superiores[i].innerText}
		$.ajax({
			method: "POST",
			url: "/admin/cabeza_principal",
			data: envio
		}).done((respuesta) => {
			document.getElementsByClassName('superior')[respuesta.numero].innerHTML=respuesta.referido
			var env={numero:respuesta.numero, nombre:document.getElementsByClassName('superior')[respuesta.numero].innerHTML}
			$.ajax({
				method: "POST",
				url: "/admin/cabeza_principal",
				data: env
			}).done((respuesta) => {
				document.getElementsByClassName('principal')[respuesta.numero].innerHTML=respuesta.referido
			})
		})
	}
	no_cargando()
}


function generar_reporte_referido() {
	var envio = { nombre: valor('todos_vendedores') }
	cargando()
	$.ajax({
		method: "POST",
		url: "/admin/ver-reporte-referidos",
		data: envio
	}).done((respuesta) => {
		var cadena = `<tr>
						<th >Cliente</th>
						<th>Nombre</th>
						<th>Tarjeta</th>
						<th class="encabezado_tabla">Referido</th>
						<th>Tipo</th>
						<th class="encabezado_tabla">Vendedor</th>
						<th>Hora</th>
						<th>Fecha</th>
						<th>Pagado socio</th>
						<th>Pagado vendedor</th>
					</tr>`
		for (var i = 0; i < respuesta.length; i++) {
			cadena += `<tr>
						<td class="referer">${respuesta[i].cliente}</td>
						<td>${respuesta[i].nombre || ''}</td>
						<td class="numero">${ respuesta[i].numero}</td>
						<td>${respuesta[i].referido || ''}</td>
						<td>${tipo_vendedor(respuesta[i].referido || '') || ''}</td>
						<td>${respuesta[i].vendedor}</td>
						<td>${obtenerFecha(respuesta[i].fecha)}</td>
						<td>${obetenerHora(respuesta[i].fecha)}</td>
						<td><button id="PC${respuesta[i].codigo}" onclick="paga_cabeza('${respuesta[i].codigo}')" class="btn btn-primary   ${pagado_ono(respuesta[i].pagado_cabeza) || ''}">Pagar</button></td>
						<td><button id="PS${respuesta[i].codigo}" onclick="paga_sub('${respuesta[i].codigo}')" class="btn btn-warning  ${pagado_ono(respuesta[i].pagado_vendedor) || ''}">Pagar</button></td>
					</tr>`
		}

		innerTexto('datos_reporte', cadena)
		habilitador()
		
		no_cargando()
	})
}

function habilitador() {
	activos = document.getElementsByClassName('activado')
	for (var i = 0; i < activos.length; i++) {
		document.getElementsByClassName('activado')[i].innerText = 'No pagado'

	}
	desactivos = document.getElementsByClassName('desactivado')
	for (var i = 0; i < desactivos.length; i++) {
		document.getElementsByClassName('desactivado')[i].innerText = 'Pagado'
		document.getElementsByClassName('desactivado')[i].setAttribute('disabled', '')
	}
}
function pagado_ono(dato) {
	//Si esta pagado en true debe desactivarse
	if (dato == true) {
		return 'desactivado'
	} else {
		return 'activado'
	}
}
function paga_cabeza(codigo) {
	cargando('Actualizando información')
	var envio = { codigo: codigo }
	$.ajax({
		method: "POST",
		url: "/admin/paga_cabeza",
		data: envio
	}).done((respuesta) => {
		if (respuesta == 'error')
			swal('Error', 'No se pudo actualizar', 'error')
		else
			generar_reporte_referido()
		no_cargando()
	})
}
function paga_sub(codigo) {
	cargando('Actualizando información')
	var envio = { codigo: codigo }
	$.ajax({
		method: "POST",
		url: "/admin/paga_sub",
		data: envio
	}).done((respuesta) => {
		if (respuesta == 'error')
			swal('Error', 'No se pudo actualizar', 'error')
		else
			generar_reporte_referido()
		no_cargando()
	})
}

function tipo_vendedor(superior) {
	if (superior != '') {
		if (superior == 'Ninguno')
			return 'Principal'
		else
			return 'Subvendedor'
	}
}

function eliminar_img(codigo) {
	envio = { codigo: codigo }
	cargando()
	$.ajax({
		method: "POST",
		url: "/admin/eliminar-imagen",
		data: envio
	}).done((datos) => {
		no_cargando()
		if (datos == 'Error') {
			swal('Error', 'Ha ocurrido un error inesperado', 'error')
		} else {
			swal('Listo', 'Eliminado con éxito', 'success')
			location.reload()
		}
	})
}
function modificar_user(identidad) {
	cargando('Obteniedo información del usuario')
	envio = { codigo: identidad }
	$.ajax({
		method: "POST",
		url: "/admin/editar-cliente",
		data: envio
	}).done((datos) => {
		if (datos != 'Error') {
			no_cargando()
			asignar('txtnombre', datos.nombre)
			asignar('txtedad', datos.edad)
			asignar('txtsector', datos.sector)
			asignar('txtcedula', datos.cedula)
			asignar('txttelefono', datos.telefono)
			asignar('textdireccion', datos.direccion)
			asignar('txtmail', datos.username)
			var opciones = document.getElementsByClassName('listado_referidos')
			for (var i = 0; i < opciones.length; i++) {
				if (datos.referido == opciones[i].value)
					opciones[i].setAttribute('selected', '')
			}
			$('#modal-modificar-user').modal()
		} else {
			no_cargando()
			swal('Error', 'Ha ocurrido un error inesperado', 'error')
		}
	})

}
function actualizar_cliente(event) {
	event.preventDefault()
	envio = {
		nombre: valor('txtnombre'),
		edad: valor('txtedad'),
		sector: valor('txtsector'),
		cedula: valor('txtcedula'),
		telefono: valor('txttelefono'),
		direccion: valor('textdireccion'),
		referido: valor('referidos_lista'),
		username: valor('txtmail')
	}
	$.ajax({
		method: "POST",
		url: "/admin/actualizar-cliente",
		data: envio
	}).done((datos) => {
		if (datos != 'Error') {
			swal('Listo', 'Actualizado con éxito', 'success')
			location.reload()
		} else {
			swal('Error', 'Ha ocurrido un error inesperado', 'error')
			location.reload()
		}
	})
}
function obtener_nombre() {
	codigos = document.getElementsByClassName('cod_vend')
	for (var i = 0; i < codigos.length; i++) {
		envio = { codigo: codigos[i].innerText }
		$.ajax({
			method: "POST",
			url: "/admin/nombre-vendedor",
			data: envio
		}).done((datos) => {
			Tcodigos = document.getElementsByClassName('cod_vend')
			for (var j = 0; j < Tcodigos.length; j++) {
				if (Tcodigos[j].innerText == datos.codigo) {
					Tcodigos[j].innerText = datos.nombre
				}
			}
		})
	}
}
function checar_todos() {
	var asign = document.getElementsByName('asignadas')
	for (var i = 0; i < asign.length; i++) {
		asign[i].checked=true
	}
}
function filtroAsignacion() {
	parametro = valor('todos_vendedores')
	if (parametro == 'NA') {
		var desocultar = document.getElementsByClassName('tarjetas_asig')
		for (var i = 0; i < desocultar.length; i++) {
			desocultar[i].style.display = 'block'
		}
	} else {
		var desocultar = document.getElementsByClassName('tarjetas_asig')
		for (var i = 0; i < desocultar.length; i++) {
			desocultar[i].style.display = 'none'
		}

		clases = document.getElementsByClassName('TA' + parametro)
		for (var j = 0; j < clases.length; j++) {
			clases[j].style.display = 'block'
		}
	}
}
function Guardar_asignacion(){
	cargando('Listo, estamos quitando la asignación a las tarjetas deseleccionadas')
	asignadas=document.getElementsByName('asignadas')
	var sin_asignar=new Array()
	for(var i=0; i< asignadas.length; i++){
		var resultado=document.getElementsByName('asignadas')[i].checked
		if(!resultado)
			sin_asignar.push(asignadas[i].value)
	}
	envio={tarjetas: sin_asignar}
	$.ajax({
        type: "POST",
        url: "/admin/quitar-asignacion",
        dataType: "text",
        contentType: "application/json",
        data: JSON.stringify(envio)
    }).done(function (resp) {
		no_cargando()
		swal('Listo', 'Tarjetas liberadas', 'success')
		var asign = document.getElementsByName('asignadas')
		for (var i = 0; i < asign.length; i++) {
			asign[i].checked=true
		}
		location.reload()
	})
}
function evitar_vendidos(){
	vendidos=document.getElementsByClassName('vendtrue')
	for(var i=0; i < vendidos.length; i++){
		document.getElementsByClassName('vendtrue')[i].setAttribute('disabled', '')
	}
}
function preguntas_modificar(event){
	event.preventDefault()
	swal({
		title: "Información",
		text: "Con respecto a los locales comerciales y sus beneficios solo podrán ser modificadas las tarjetas que no hayan sido vendidas, no sería bueno quitar beneficios que un cliente haya pagado o aumentar unos que no haya pagado",
		icon: "warning",
		buttons: true,
		dangerMode: true,
	})
		.then((willDelete) => {
			if (willDelete) {
				document.forms['form-masa'].submit()
			}
		})
}
/*
function arreglo(){
	var referidos=document.getElementsByClassName('referer')
	var numero= document.getElementsByClassName('numero')
	for(var i=0; i < referidos.length; i++){  
		envio={username: referidos[i].innerText, numero: numero[i].innerText}
		$.ajax({
			method: "POST",
			url: "/admin/arreglar-referido",
			data: envio
		}).done((respuesta) => {
			alert(respuesta)
		})
	}       
}
*/