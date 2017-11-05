function detallar(identidad){
    document.getElementById('tarjeta-img').style.display='none'
    $("html, body").animate({ scrollTop: 0 }, 600);
    document.getElementById('nombre-local').innerText=obtenerTexto('nom'+identidad)
    document.getElementById('beneficio-local').innerText=obtenerTexto('benef-loc'+identidad)
    document.getElementById('direccion-local').innerText=obtenerTexto('di_loc'+identidad)
    document.getElementById('telefono-local').innerText=obtenerTexto('tel_loc'+identidad)
    desde=document.getElementById('fecha_inic').innerText
    desde=new Date(desde)
    hasta=document.getElementById('fecha_fin').innerText
    hasta=new Date(hasta)
    document.getElementById('valido-desde').innerText=desde.getDate()+'/'+desde.getMonth()+'/'+ desde.getFullYear()
    document.getElementById('valido-hasta').innerText=hasta.getDate()+'/'+hasta.getMonth()+'/'+ hasta.getFullYear()
    document.getElementById('adicionales-local').innerText=obtenerTexto('adic-loc'+identidad)
    document.getElementById('benef-local-img').setAttribute('src',obtenerTexto('img-ben'+identidad))
    $('#local-desc').show('slow')
}

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
function activar_tarjeta(event){
    document.getElementById('div-error').innerText=''
    document.getElementById('div-error').style.display='none'
    event.preventDefault()
    cargando()
    envio={numero:valor('txt_numero'),codigo:valor('txt_codigo')}
    $.ajax({
		method: "POST",
		url: "/cliente/activar",
		data: envio
	}).done(( respuesta )=>{
        if(respuesta=='Error'){
            mensajeError('Ha ocurrido un error de conexión')
            return
        }
        if(respuesta=='vacio'){
            mensajeError('Esta tarjeta no esta disponible')
            return
        } 
        if(respuesta=='incorrecto'){
            mensajeError('El codigo de activación ingresado es erroneo')
            return
        }
        asignar('txtnumero',respuesta[0].numero)     
        asignar('txtcod',respuesta[0].activacion)     
        document.getElementById('img_trj').setAttribute('src',respuesta[1].imagen)
        document.getElementById('valido-d').innerText=obtenerFecha(respuesta[0].fechainicial)
        document.getElementById('valido-h').innerText=obtenerFecha(respuesta[0].fechafinal)
        for(var i=0;i<respuesta[2].length;i++){
            colocarLocales(respuesta[2][i])
        }
        no_cargando()
        $('#modal_tarjeta').modal()
    })   
}
function mensajeError(mensaje){
    document.getElementById('div-error').innerText=mensaje
    document.getElementById('div-error').style.display='block'
    no_cargando()
}
function obtenerFecha(fecha){
    fecha=new Date(fecha)
    return fecha.getDate()+'/'+ fecha.getMonth()+'/'+ fecha.getFullYear()
}
function colocarLocales(local){
    var cadena=`<div class="alert alert-light" role="alert">
                    <div class="row">
                        <div class="col-lg-4 col-md-4">
                            <img src="${local.logotipo}" width="100%" alt="">
                        </div>
                        <div class="col-lg-8 col-md-8">
                            <p class="centrado"><strong>${local.nombre}</strong></p>
                        </div>
                    </div>
                </div>`
    document.getElementById('locales').innerHTML+=cadena
}

function conteoTarj(){
    var activos=document.getElementsByClassName('trj_activas');
    document.getElementById('num_act').innerText=activos.length
    var finalizados=document.getElementsByClassName('trj_fin')
    document.getElementById('num_fin').innerText=finalizados.length
    var caducados=document.getElementsByClassName('trj_cad')
    document.getElementById('num_cad').innerText=caducados.length
}

function renovar(){
    swal("Renovar tarjeta", "Por favor contacte a <a href='mailto:ecuadoractiva@gmail.com'>ecuadoractiva@gmail.com</a> para mas información")
}

function detallar_trj(numero){
    cargando()
    envio={numero:numero}
    $.ajax({
		method: "POST",
		url: "/cliente/detallar",
		data: envio
	}).done(( respuesta )=>{
        document.getElementById('tabla_locales').innerHTML='';
        no_cargando()
        if(respuesta!='Error'){
            var e=respuesta           
            document.getElementById('txtnum').innerText=numero
            document.getElementById('txt-desde').innerText=obtenerFecha(respuesta[0].fechainicial)
            document.getElementById('txt-hasta').innerText=obtenerFecha(respuesta[0].fechafinal)   
            var cadena=''
            for(var i=0;i<respuesta[1].length;i++){
                for(var j=0;j<respuesta[0].locales.length;j++){
                    if(respuesta[1][i].codigo==respuesta[0].locales[j].local){
                        var estado='NO'
                        if(respuesta[0].locales[j].activo)
                            estado=''
                        cadena+=`<tr><td>${respuesta[1][i].nombre}</td><td>${estado} DISPONIBLE</td></tr>`
                    }                      
                }
            } 
            document.getElementById('tabla_locales').innerHTML+=cadena
            $('#detalle-modal').modal()
        }else{
            swal('Error','Ha ocurrido un error')
        }     
    })
}