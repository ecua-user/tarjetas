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
        
    })
}