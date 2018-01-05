var sesion_tarjeta='' 
function activar_tarjeta(event){
    event.preventDefault()
    var envio={numero: valor('num_trj'), token: valor('txt_codigo')}
    cargando()
    $.ajax({
		method: "POST",
		url: "/cliente/finalizar-activacion",
		data: envio
	}).done(( datos )=>{
        no_cargando()
        if(datos=='Ha ocurrido un error inesperado' || datos=='No existe esta tarjeta para este usuario')
            swal('Error', datos+', o ya ha sido activada','error')
        else{
            swal('Listo', 'TU TARJETA HA SIDO  ACTIVADA CON ÉXITO VIVE UNA NUEVA EXPERIENCIA DE CONSUMO', 'success').then((result)=>{
                if (result) {
                    location.reload()
                }
            })	
        }
    })
}


function presentar_locales(identidad){
    estado_local.style.display='none'
    vencimiento.innerHTML=''
    if(identidad=='Seleccionar tarjeta'){
        swal('Atención', 'Seleccione una tarjeta que haya comprado y activado', 'warning')
        document.getElementById('nada').style.display='block'
        document.getElementById('todos_locales').innerHTML=''
        return;
    }
    cargando('Obteniendo información')
    envio={numero: identidad}
    sesion_tarjeta=identidad
    $.ajax({
		method: "POST",
		url: "/cliente/tarjeta",
		data: envio
	}).done(( datos )=>{
        var cadena=''
        document.getElementById('nada').style.display='none'
        if(datos[0].confirmar){
            estado_local.style.color='red'
            estado_local.style.display='block'
            estado_local1.style.color='red'
            estado_local1.style.display='block'
        }else{
            estado_local.style.color='greenyellow';
            estado_local.style.display='block'
            estado_local1.style.color='greenyellow';
            estado_local1.style.display='block'
        }
        vencimiento.innerHTML= ordenarFechas(new Date(datos[0].fechafinal)) 
        vencimiento1.innerHTML= ordenarFechas(new Date(datos[0].fechafinal)) 
        document.getElementById('Rvencimiento1').style.display='block'
        document.getElementById('Rvencimiento').style.display='block'
        document.getElementById('todos_locales').innerHTML=''
        for(var i=0;i< datos[1].length;i++){
            document.getElementById('todos_locales').innerHTML+=`<div style="padding:4px; width:25%; float:left">
                        <img onclick="detallarLoc('${datos[1][i].codigo}')" width="100%" src="${datos[1][i].logotipo }" alt="${datos[0].imagen}"/>
                    </div> 
                     `       
                    
        }
        no_cargando()
    })
   
}

function reenviar_cod(){
    envio={numero: valor()}
}

function detallarLoc(codigo){
	var envio={codigo:codigo, numero: sesion_tarjeta}
	cargando('Obteniendo información...');
	$.ajax({
		method: "POST",
		url: "/cliente/local-trj",
		data: envio
	}).done(( datos )=>{
		var activo='active'
		var cadena=''
		document.getElementById('img_local').setAttribute('src', datos[0].logotipo)
		innerTexto('nom_loc', datos[0].nombre)
        innerTexto('horario_loc', datos[0].horario)
        innerTexto('tel_loc', datos[0].telefono)
		innerTexto('dir_loc', datos[0].direccion)
		document.getElementById('mapa_loc', datos[0].mapa)
		document.getElementById('face_local').setAttribute('href', datos[0].facebook)
        document.getElementById('inst_local').setAttribute('href', datos[0].instagram)
        document.getElementById('tel_local').setAttribute('href', 'tel://'+ datos[0].telefono)
        document.getElementById('mail_local').setAttribute('href', 'mailto:'+ datos[0].username)
        document.getElementById('web_local').setAttribute('href', datos[0].web)
		document.getElementById('mapa_loc').setAttribute('src',datos[0].mapa)
		for(var i=0; i< datos[0].beneficio.length; i++){
			if(i!=0)
				activo=''
			cadena+=mostrar_beneficiosLoc(activo,datos[0].beneficio[i])
		}
		innerTexto('elementos-carrusel', cadena)	
		no_cargando()
		$('#local-info').modal()
	})
}

function mostrar_beneficiosLoc(activo, elementos){
    var color='white'
    var texto='<h1>Disponible</h1>'
    var transparente='background:transparent;border: solid 0px white;'
    if(!elementos.activo){
        texto=`<div class="blanco"><h3>UTILIZADO</h3>
                En la fecha: ${obtenerFecha(elementos.fecha_activacion)}<br>
                Hora: ${obtenerHora(elementos.fecha_activacion)}</div>`
        color='#D75E5E'
    }
        
    return `<div id="${elementos.codigo}" class="carousel-item ${activo}" style="padding-left:2%; padding-right:2% ; background-color:${color}">
                    <div class="row" style="padding:12px">
                        <div class="col-lg-1 col-md-1"></div>
                        <div class="col-lg-4 col-md-4">                                      
                                <img class="img-slider d-block w-100" src="${elementos.imagen}"
                                    alt="">  
                                <div class="centrado">${texto}</div>                                     
                        </div>
                        <div class="col-lg-6 col-md-6" style="font-size:140%">
                            <h3 class="centrado">Términos y condiciones</h3>
                            <div style="padding-left:5%; padding-right:5%">
                            <textarea class="area-beneficios"  readonly name="" id="" rows="8" style="width:100% ; height:100%; ${transparente}">${ascii_texto(elementos.beneficio)}\n${ascii_texto(elementos.restriccion)}\n
                            </textarea>
                            </div>
                        </div>
                    </div>
                </div>`
    
}
