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
        var div=12/(respuesta[1].beneficio.length)
        var porcentaje='100%'
        if(div>10)
            porcentaje='40%'
        var cadena=''
        innerTexto('cliente-compra', respuesta[0].cliente)
        for(var i=0;i< respuesta[1].beneficio.length;i++){
            cadena+=`<div class="col-lg-${div} centrado fondo-blanco">
                        <img width="${porcentaje}" src="${respuesta[1].beneficio[i].imagen}"/><br>
                        <strong class="centrado pinfor">Beneficio</strong>
                        <p class="centrado">${respuesta[1].beneficio[i].beneficio}</p><br>
                        <strong class="centrado pinfor">Restricciones</strong>
                        <p class="centrado">${respuesta[1].beneficio[i].restriccion}</p>
                        <button class="btn btn-dark" onclick="usar_beneficio('${respuesta[1].beneficio[i].codigo}')">Usar beneficio</button>
                    </div>`
        }
        innerTexto('beneficios', cadena)
        no_cargando()
         $('#modal_ventas').modal()
    })
}


function usar_beneficio(codigo){
    try {
        var envio={codigo:codigo, numero: valor('numero_act'), fecha: new Date()}
        cargando()
        $.ajax({
            method: "POST",
            url: "/local/usar-beneficio",
            data: envio
        }).done(( respuesta )=>{
            no_cargando()
            swal(respuesta)
        }) 
    } catch (error) {
        alert(error)
    }
}