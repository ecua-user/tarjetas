function venderTarjeta(event){
    cargando()
    event.preventDefault()
    envio={numero:valor('numero_tarjeta'), username: valor('correo_tarjetas'), fecha: new Date()}
    $.ajax({
		method: "POST",
		url: "/vendedor/vender",
		data: envio
	}).done(( respuesta )=>{
        if(respuesta!='Error'){
            emailjs.send("default_service","template_KK3G9LwJ",{
                to_destinatario: envio.username,
                mensaje: `Para poder activar la tarjeta use el siguiente código:  ${respuesta}`
            }
            ).then(
                (response)=> {
                    no_cargando()   
                    swal("Listo", "Venta realizada con éxito")	
                    location.reload()
                }, 
                (error)=> {
                    document.getElementById('div-error').innerText='No se ha podido concretar el proceso favor intente nuevamente'
                    document.getElementById('div-error').style.display='block'
                    no_cargando()   
                    location.reload()
                }
            );
        }else{
            swal("Listo", "Ha ocurrido un error")
        }                 
	})
}

