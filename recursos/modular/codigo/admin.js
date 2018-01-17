//Vendedor_______________________________________________________________________________-
    //Obtener datos para modificar
        function modificar_vendedor(identidad) {
            envio = { codigo: identidad }
            cargando('Verificando datos...');
            $.ajax({
                method: "POST",
                url: "/admin-vendedor/modificar-vendedor-obtener",
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
                    superior[i].removeAttribute('selected')
                }
                for (var i = 0; i < superior.length; i++) {
                    if (datos.codigo == superior[i].value) {
                        superior[i].style.display = 'none'                   
                    }
                    if (datos.referido == superior[i].innerText || datos.referido== superior[i].value){
                        superior[i].setAttribute('selected', '')
                    }                    
                }
                no_cargando()
                $('#modal-modificar-vendedor').modal();
            });
		}
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
    //Eliminar
        function eliminar_vendedor(identidad) {
            swal({
                title: "¿Está seguro?",
                text: "Una vez eliminado no se podrá recuperar",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    cargando()
                    envio = { codigo: identidad }
                    $.ajax({
                        method: "POST",
                        url: "/admin-vendedor/eliminar-vendedor",
                        data: envio
                    }).done((respuesta) => {
                        swal("Listo", respuesta)
                        location.reload()
                        no_cargando()
                    })
                }
            })        
        }

//Locales__________________________________________________________________________________
	//Obtener datos para modificar
		function modificar_local(identidad) {
			cargando();
			envio = { codigo: identidad }
			$.ajax({
				method: "POST",
				url: "/admin-local/obtener-local",
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
	//Eliminar local comercial
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
							url: "/admin-local/eliminar-local",
							data: envio
						}).done((respuesta) => {
							no_cargando()
							swal("Listo", respuesta)
							location.reload()
						})
					}
				});
		}
	//Buscador de locales
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

//Home___________________________________________________________________________________
	//Eliminar imagen
		function eliminar_img(codigo) {
			envio = { codigo: codigo }
			cargando()
			$.ajax({
				method: "POST",
				url: "/admin-home/eliminar-imagen",
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
	//Eliminar video
		function eliminarVideo(identificador) {
			var envio = { codigo: identificador }
			cargando('Eliminando video')
			$.ajax({
				method: "POST",
				url: "/admin-home/eliminar-video",
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
//Listar
	//Eliminar un usuario
		function eliminar_user(identidad) {
			envio = { codigo: identidad }
			cargando('Procesando...')
			$.ajax({
				method: "POST",
				url: "/admin-cliente/eliminar-cliente",
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
	//Obtener datos de usuario
		function modificar_user(identidad) {
			cargando('Obteniedo información del usuario')
			envio = { codigo: identidad }
			$.ajax({
				method: "POST",
				url: "/admin-cliente/editar-cliente",
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
						opciones[i].removeAttribute('selected')
					}
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
	//Actualizar los datos
		function actualizar_cliente(event) {
			event.preventDefault()
			cargando('Actualizando...')
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
				url: "/admin-cliente/actualizar-cliente",
				data: envio
			}).done((datos) => {
				no_cargando()
				if (datos != 'Error') {
					swal('Listo', 'Actualizado con éxito', 'success')
					location.reload()
				} else {
					swal('Error', 'Ha ocurrido un error inesperado', 'error')
					location.reload()
				}
			})
		}
//Vendedor_____________________________________________________________________________--
	//Comprobar validez
		function comprobar_validez(event) {
			document.getElementById('div-error').innerText = ''
			document.getElementById('div-error').style.display = 'none'
			event.preventDefault()
			if (Number(valor('tarj_ini')) > Number(valor('tarje_fin'))) {
				document.getElementById('div-error').innerText = 'Tarjeta final debe ser mayor a inicial'
				document.getElementById('div-error').style.display = 'block'
				return;
			}
			cargando('Comprobando disponibilidad...')
			var envio = { tarjeta_ini: valor('tarj_ini'), tarjeta_fin: valor('tarje_fin') }
			$.ajax({
				method: "POST",
				url: "/admin-vendedor/comprobacion",
				data: envio
			}).done((respuesta) => {
				try {
					if (respuesta=='No existen las tarjetas') {
						no_cargando()
						document.getElementById('div-error').innerText = 'No estan registradas algunas de esas tarjetas o ya han sido asignadas a un vendedor'
						document.getElementById('div-error').style.display = 'block'
					} else {
						no_cargando()
						cargando('Asignando...')
						envio = { tarjeta_ini: valor('tarj_ini'), tarjeta_fin: valor('tarje_fin'), vendedor: valor('todos_vendedores'), fecha: valor('fechayhora') }
						$.ajax({
							method: "POST",
							url: "/admin-vendedor/asignar-vendedor",
							data: envio
						}).done((respuesta) => {
							no_cargando();
							swal("Listo", respuesta)
							location.reload();						
						})
					}
				} catch (error) {
					no_cargando()
					alert(error)
				}
				
				
			})
		}
//Reportes 
	//Por local
		function generar_reporte_local() {
			var envio = { nombre: valor('todos_locales') }
			cargando()
			$.ajax({
				method: "POST",
				url: "/admin-reportes/ver-reporte-locales",
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
								<td>${obtenerHora(respuesta[i].fecha)}</td>
								<td>${ascii_texto(respuesta[i].beneficio)}</td>
							</tr>`
				}
				no_cargando()
				innerTexto('datos_reporte', cadena)
			})
		}
	//Por referido
		function generar_reporte_referido() {
			var envio = { nombre: valor('todos_vendedores') }
			cargando()
			$.ajax({
				method: "POST",
				url: "/admin-reportes/ver-reporte-referidos",
				data: envio
			}).done((respuesta) => {
				try {
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
								<td>${obtenerHora(respuesta[i].fecha)}</td>
								<td><button id="PC${respuesta[i].codigo}" onclick="paga_cabeza('${respuesta[i].codigo}')" class="btn btn-primary   ${pagado_ono(respuesta[i].pagado_cabeza) || ''}">Pagar</button></td>
								<td><button id="PS${respuesta[i].codigo}" onclick="paga_sub('${respuesta[i].codigo}')" class="btn btn-warning  ${pagado_ono(respuesta[i].pagado_vendedor) || ''}">Pagar</button></td>
							</tr>`
				}			
				innerTexto('datos_reporte', cadena)
				habilitador()
				} catch (error) {
					alert(error)
				}			
				no_cargando()
			})
		}
	//Por vendedor
		function generar_reporte_vendedor() {
			var envio = { nombre: valor('todos_vendedores') }
			cargando()
			$.ajax({
				method: "POST",
				url: "/admin-reportes/ver-reporte-vendedor",
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
								<td>${obtenerHora(respuesta[i].fecha)}</td>
								<td><img src="${respuesta[i].tarjeta}" width="60px"/></td>
								<td>${respuesta[i].numero}</td>
							</tr>`
				}
				no_cargando()
				innerTexto('datos_reporte', cadena)
				obtener_superior()
			})
		}
	//Obtener tipo de vendedor
		function tipo_vendedor(superior) {
			if (superior != '') {
				if (superior == 'Ninguno')
					return 'Principal'
				else
					return 'Subvendedor'
			}
		}
	//Si esta pagado o no
		function pagado_ono(dato) {
			if (dato == true) 
				return 'desactivado'
			else 
				return 'activado'
		}
	//Hace los pagos
		function paga_cabeza(codigo) {
			cargando('Actualizando información')
			var envio = { codigo: codigo }
			$.ajax({
				method: "POST",
				url: "/admin-reportes/paga_cabeza",
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
				url: "/admin-reportes/paga_sub",
				data: envio
			}).done((respuesta) => {
				if (respuesta == 'error')
					swal('Error', 'No se pudo actualizar', 'error')
				else
					generar_reporte_referido()
				no_cargando()
			})
		}
	//Habilita o deshabilita los botones para pagar a un vendedor o su superior
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
	//Obtiene al superior de un vendedor
		function obtener_superior(){
			cargando('Obteniendo información')
			var superiores= document.getElementsByClassName('refer')
			for(var i=0; i < superiores.length; i++){
				envio={numero:i,nombre: superiores[i].innerText}
				$.ajax({
					method: "POST",
					url: "/admin-reportes/cabeza_principal",
					data: envio
				}).done((respuesta) => {
					document.getElementsByClassName('superior')[respuesta.numero].innerHTML=respuesta.referido
					var env={numero:respuesta.numero, nombre:document.getElementsByClassName('superior')[respuesta.numero].innerHTML}
					$.ajax({
						method: "POST",
						url: "/admin-reportes/cabeza_principal",
						data: env
					}).done((respuesta) => {
						document.getElementsByClassName('principal')[respuesta.numero].innerHTML=respuesta.referido
					})
				})
			}
			no_cargando()
		}
//Asignaciones de las tarjetas
	//Evita la edición de tarjetas vendidas
		function evitar_vendidos(){
			vendidos=document.getElementsByClassName('vendtrue')
			for(var i=0; i < vendidos.length; i++){
				document.getElementsByClassName('vendtrue')[i].setAttribute('disabled', '')
			}
		}
	//Obtiene los nombres de los vendedores
		function obtener_nombre() {
			codigos = document.getElementsByClassName('cod_vend')
			for (var i = 0; i < codigos.length; i++) {
				envio = { codigo: codigos[i].innerText }
				$.ajax({
					method: "POST",
					url: "/admin-reportes/nombre-vendedor",
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
	
	//Permite chequear todos los elementos
		function checar_todos() {
			var asign = document.getElementsByName('asignadas')
			for (var i = 0; i < asign.length; i++) {
				asign[i].checked=true
			}
		}
	//Libera las tarjetas seleccionadas
		function Guardar_asignacion(){
			cargando('Listo, estamos quitando la asignación a las tarjetas deseleccionadas')
			asignadas=document.getElementsByName('asignadas')
			var sin_asignar=new Array()
			for(var i=0; i< asignadas.length; i++){
				var resultado=document.getElementsByName('asignadas')[i].checked
				if(!resultado)
					sin_asignar.push(asignadas[i].value)
			}
			envio = { tarjetas: sin_asignar }
			$.ajax({
				type: "POST",
				url: "/admin-tarjetas/quitar-asignacion",
				dataType: "text",
				contentType: "application/json",
				data: JSON.stringify(envio)
			}).done(function (resp) {
				no_cargando()
				document.getElementById('contenido-tarjetas').innerHTML='Recargando...'
				swal('Listo', 'Tarjetas liberadas, si al finalizar siguen apareciendo tarjetas liberadas solo recargue la página una vez más', 'success')
				location.reload()
			})
		}
	//Buscar asignaciones
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
//Tarjetas
	//Abrir individual
		function tarjeta_individual() {
			document.getElementById('individual').style.display = 'block'
			document.getElementById('grupal').style.display = 'none'
			$('#link-indiv').addClass('active');
			$('#link-grup').removeClass('active')
			document.getElementById('control_error').style.display = 'none'
			document.getElementById('consulta_edicion').style.display = 'block'
			document.getElementById('edicion_individual').style.display = 'none'
		}
	//Abrir grupal
		function tarjeta_grupal() {
			document.getElementById('individual').style.display = 'none'
			document.getElementById('grupal').style.display = 'block'
			$('#link-indiv').removeClass('active');
			$('#link-grup').addClass('active')
			document.getElementById('control_error').style.display = 'none'
			document.getElementById('edicion_individual').style.display = 'none'
		}
	//Obtener para modificar individual
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
			url: "/admin-tarjetas/consultar-numero",
			data: envio
		}).done((respuesta) => {
				if (respuesta == 'Nada') {
					$('#div-error').html('Esta tarjeta no existe, o no ha sido vendida, individualmente sólo pueden modificarse tarjetas vendidas')
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
	//Eliminar una tarjeta individual
		function eliminar_trj() {
			swal({
				title: "¿Está seguro?",
				text: "Una vez eliminado no se podrá recuperar",
				icon: "warning",
				buttons: true,
				dangerMode: true,
			}).then((willDelete) => {
					if (willDelete) {
						var envio = { numero: valor('numero_consulta') }
						cargando()
						$.ajax({
							method: "POST",
							url: "/admin-tarjetas/eliminar-numero",
							data: envio
						}).done((respuesta) => {
							swal(respuesta)
						})
					}
				})
		}
	//Obtener información de datos en masa
		function modificar_grupo_trj(identificador) {
			var envio = { codigo: identificador }
			cargando()
			$.ajax({
				method: "POST",
				url: "/admin-tarjetas/detalles-masa",
				data: envio
			}).done((respuesta) => {
				try {
					asignar('desc_tar_mas', respuesta[0].descripcion)
					asignar('codInteSiste', respuesta[0].codigo)
					asignar('tit_tar_mas', respuesta[0].titulo)
					asignar('fecha-inicial', ordenarFechas(respuesta[0].fechainicial))
					asignar('fecha-final', ordenarFechas(respuesta[0].fechafinal))
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
	//Eliminar tarjetas en masa
		function eliminar_grupo_trj(valor) {
			swal({
				title: "¿Está seguro?",
				text: "Una vez eliminado no se podrá recuperar",
				icon: "warning",
				buttons: true,
				dangerMode: true,
			}).then((willDelete) => {
				if (willDelete) {
					var envio = { codigo: valor }
					$.ajax({
						method: "POST",
						url: "/admin-tarjetas/eliminar-tarjetas",
						data: envio
					}).done((respuesta) => {
						swal(respuesta)
						location.reload()
					})
				}
			})	
		}