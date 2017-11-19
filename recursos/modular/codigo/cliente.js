function activar_tarjeta(event){
    event.preventDefault()
    cargando()
    var envio={numero: valor('txt_numero'), activacion: valor('txt_codigo')}
    $.ajax({
		method: "POST",
		url: "/cliente/comprobar",
		data: envio
	}).done(( datos )=>{
        if(datos=='Error'){
            no_cargando()
            swal('Error', 'Ha ocurrido un error de red, inetente más tarde', 'error')
            return
        }
        if(datos=='No se puede activar') {
            no_cargando()
            swal('Error', 'Asegurese de que esta tarjeta haya sido comprada para este usuario, que no haya sido previamente activada o que el código de activación este correcto', 'error')
            return;
        }
        no_cargando()
        var cadena=''
        for(var i=0;i < datos[0].locales.length;i++){
            cadena+=`<div class="row" style="margin:12px; "><div class="col-lg-4 col-md-4 col-sm-3">
                        <h3 class="centrado">${datos[1][i].nombre}</h3>
                        <img width="100%" src="${datos[1][i].logotipo}"/><br>
                    </div>
                    <div class="col-lg-8 col-md-8 col-sm-9">
                        <div class="table">
                            <table class="table">
                                <tr class="pinfor centrado"><th style="width:20%">Imágen</th><th style="width:40%">Beneficio</th><th style="width:40%">Restricciones</th></tr>
                                ${obtener_beneficio(datos[0].locales[i].beneficio)}
                            </table
                        </div>
                    </div></div>`
        }
        innerTexto('detalles_beneficios', cadena)
        innerTexto('num_trj', datos[0].numero)
        $('#modal_tarjeta').modal()
    })
}

function obtener_beneficio(elementos){
    var cadena=''
    for(var i=0; i< elementos.length;i++){
        cadena+=`<tr  class="centrado">
                    <td> <img width="100%" src="${elementos[i].imagen}"/></td>
                    <td>${elementos[i].beneficio}</td>
                    <td>${elementos[i].restriccion}</td>
                </tr>`
    }
    return  cadena
}

function finalizar_activacion(){
    var envio={numero: obtenerTexto('num_trj')}
    cargando()
    $.ajax({
		method: "POST",
		url: "/cliente/finalizar-activacion",
		data: envio
	}).done(( datos )=>{
        no_cargando()
        if(datos=='Error')
            swal('Error', 'Ha ocurrido un error inesperado','error')
        else{
            swal('Listo', datos, 'success')
        }
        location.reload()
    })
}



function detallar_tarjeta(numero){
    cargando()
    var envio={numero:numero}
    $.ajax({
		method: "POST",
		url: "/cliente/detallar_mas",
		data: envio
	}).done(( datos )=>{
        if(datos=='Error'){
            no_cargando()
            swal('Error', 'Ha ocurrido un error de red, inetente más tarde', 'error')
            return
        }
        no_cargando()
        var cadena=''
        for(var i=0;i < datos[0].locales.length;i++){
            cadena+=`<div class="row" style="margin:12px; "><div class="col-lg-4 col-md-4 col-sm-3">
                        <h3 class="centrado">${datos[1][i].nombre}</h3>
                        <img width="100%" src="${datos[1][i].logotipo}"/><br>
                    </div>
                    <div class="col-lg-8 col-md-8 col-sm-9">
                        <div class="table">
                            <table class="table">
                                <tr class="pinfor centrado"><th style="width:20%">Imágen</th><th style="width:35%">Beneficio</th><th style="width:35%">Restricciones</th><th style="width:10%">Disp.</th></tr>
                                ${obtener_beneficio_perfil(datos[0].locales[i].beneficio)}
                            </table
                        </div>
                    </div></div>`
        }
        innerTexto('detalles_beneficios', cadena)
        innerTexto('num_trj', datos[0].numero)
        $('#modal_tarjeta').modal()
    })
}
function obtener_beneficio_perfil(elementos){
    var cadena=''
    for(var i=0; i< elementos.length;i++){
        cadena+=`<tr  class="centrado">
                    <td> <img width="100%" src="${elementos[i].imagen}"/></td>
                    <td>${elementos[i].beneficio}</td>
                    <td>${elementos[i].restriccion}</td>
                    <td><span class="glyphicon ${disponibilidad(elementos[i].activo)}" aria-hidden="true"></span></td>
                </tr>`
    }
    return  cadena
}
function disponibilidad(elementos){
    if(elementos)
        return 'btn-success glyphicon-ok'
    else{
        return 'btn-danger glyphicon-remove'
    }
}

function renovar(){
    swal("Renovar tarjeta", "Por favor contacte a <a href='mailto:ecuadoractiva@gmail.com'>ecuadoractiva@gmail.com</a> para mas información")
}