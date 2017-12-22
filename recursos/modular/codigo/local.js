function activar_desc(event){
    event.preventDefault()
    cargando()
    envio={numero: valor('numero_act')}
    $.ajax({
		method: "POST",
		url: "/local/activar",
		data: envio
	}).done(( respuesta )=>{        
        if(respuesta=='Error'){
            no_cargando()
            swal('Error', 'Ha ocurrido un error', 'error')
            return
        }
        if(respuesta=='Esta tarjeta no esta actíva'){
            no_cargando()
            swal('Error',respuesta,'error')
            return
        }
        if(respuesta=='Esta tarjeta no es válida para este local'){
            no_cargando()
            swal('Error',respuesta,'error')
            return
        }
        var elemento_activo=document.getElementsByClassName('active')[0]
        codigo_beneficio=elemento_activo.getElementsByClassName('benef_cod')[0].innerHTML
        no_cargando()     
        usar_beneficio(codigo_beneficio, respuesta[0].cliente)
    })
}


function usar_beneficio(codigo, cliente){
    try {
        var envio={codigo:codigo, numero: valor('numero_act'), fecha: new Date(), cliente: cliente}
        cargando('Consultando disponibilidad..')
        $.ajax({
            method: "POST",
            url: "/local/usar-beneficio",
            data: envio
        }).done(( respuesta )=>{
            no_cargando()
            if(respuesta.substr(0,9)=='No puede ')
                swal('Error', respuesta, 'error')
            else
                swal('Listo', respuesta, 'success')    
        }) 
    } catch (error) {
        alert(error)
    }
}


function mostrar_beneficios(activo, elementos){
    var k= elementos
    return `<div id="${elementos.codigo}" class="carousel-item ${activo}" style="padding-left:2%; padding-right:2%">
                    <div class="row" style="padding:12px">
                        <div class="col-lg-1 col-md-1"></div>
                        <div class="col-lg-5 col-md-5">  
                                <p style="display:none" class="benef_cod">${elementos.codigo}</p>
                                <img class="img-slider d-block w-100" src="${elementos.imagen}"
                                    alt="">                                       
                        </div>
                        <div class="col-lg-5 col-md-5">
                            <h4 class="centrado">Términos y condiciones</h4>
                            <div style="padding-left:5%; padding-right:5%">
                            <textarea class="area-beneficios" readonly name="" id="" cols="30" rows="10" style="width:100% ; height:100%; border: 0px solid white">${ascii_texto(elementos.beneficio)}\n${ascii_texto(elementos.restriccion)}\n
                            </textarea>
                            </div>
                        </div>
                    </div>
                </div>`
    
}