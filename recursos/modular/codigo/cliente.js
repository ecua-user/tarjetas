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
            swal('Error', datos,'error'+', o ya ha sido activada')
        else{
            swal('Listo', datos, 'success')
        }
        location.reload()
    })
}


function presentar_locales(identidad){
    estado_local.style.display='none'
    vencimiento.innerHTML=''
    if(identidad=='Seleccionar'){
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
        no_cargando()
        var cadena=''
        document.getElementById('nada').style.display='none'
        if(datos[0].confirmar){
            estado_local.style.color='red'
            estado_local.style.display='block'
        }else{
            estado_local.style.color='greenyellow';
            estado_local.style.display='block'
        }
        vencimiento.innerHTML= ordenarFechas(new Date(datos[0].fechafinal)) 
        for(var i=0;i< datos[1].length;i++){
            cadena+=`<div class="col-lg-3 col-md-4 col-sm-2 col-xs-12">
                        <div style="padding:4px ; margin:1px solid white">
                            <img onclick="detallarLoc('${datos[1][i].codigo}')" width="100%" src="${datos[1][i].logotipo }"/>
                        </div>
                    </div>`       
        }
        document.getElementById('todos_locales').innerHTML=cadena
    })
   
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
		innerTexto('dir_loc', datos[0].direccion)
		document.getElementById('mapa_loc', datos[0].mapa)
		document.getElementById('face_local').setAttribute('href', datos[0].facebook)
		document.getElementById('inst_local').setAttribute('href', datos[0].instagram)
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
    var texto=''
    var transparente='rgba(000,000,000,0)'
    if(!elementos.activo){
        color='rgba(111,000,000,0.7)'
        texto='No'
    }
        
    return `<div id="${elementos.codigo}" class="carousel-item ${activo}" style="padding-left:2%; padding-right:2% ; background-color:${color}">
                    <div class="row" style="padding:12px">
                        <div class="col-lg-1 col-md-1"></div>
                        <div class="col-lg-5 col-md-5">                                      
                                <img class="img-slider d-block w-100" src="${elementos.imagen}"
                                    alt="">  
                                <h2 class="centrado">${texto} Disponible</h2>                                     
                        </div>
                        <div class="col-lg-5 col-md-5">
                            <h4 class="centrado">Términos y condiciones</h4>
                            <div style="padding-left:5%; padding-right:5%">
                            <textarea class="area-beneficios" readonly name="" id="" cols="30" rows="10" style="width:100% ; height:100%; background-color:${transparente}">${ascii_texto(elementos.beneficio)}\n${ascii_texto(elementos.restriccion)}\n
                            </textarea>
                            </div>
                        </div>
                    </div>
                </div>`
    
}
