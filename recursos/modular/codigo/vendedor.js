
function venderTarjeta(event){
    cargando()
    event.preventDefault()
    envio={numero:valor('numero_tarjeta'), correo: valor('correo_tarjetas'), fecha: new Date(), tarjeta: valor('elecc_trj')}
    if(envio.tarjeta=='NA'){
        document.getElementById('div-error').innerText='Selecione tipo de tarjeta'
        document.getElementById('div-error').style.display='block'
        no_cargando()   
        return
    }
    $.ajax({
		method: "POST",
		url: "/vendedor/vender",
		data: envio
	}).done(( respuesta )=>{
        if(respuesta!='Error'){
            emailjs.send("default_service","template_KK3G9LwJ",{
                to_name: respuesta[1],
                to_destinatario: envio.correo,
                mensaje: `Para poder activar su tarjeta número ${envio.numero} de ECUADORACTIVA.COM es necesario introducir el siguiente código de activación :  ${respuesta[0]}`
            }
            ).then(
                (response)=> {
                    no_cargando()   
                    swal("Listo", "Su asignación de tarjeta ha ido un éxito, buena venta continua vendiendo")	
                    history.back()
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

