function registro(event) {
    event.preventDefault()
    cargando('Una vez finalizado revise su email para confirmar su cuenta por favor')
    var envio = {
        nombre: valor('txtnombre'),
        cedula: valor('txtcedula'),
        telefono: valor('txttelefono'),
        sector: valor('txtsector'),
        direccion: valor('txtdireccion'),
        edad: valor('txtedad'),
        genero: valor('generoSelector'),
        username: valor('txtcorreo'),
        password: valor('txtpassword'),
        rpassword: valor('txtRpassword'),
        token: cadenaAleatoria(),
        referido: valor('idreferido')
    }
    $.ajax({
        type: "POST",
        url: "/users/registro",
        dataType: "text",
        contentType: "application/json",
        data: JSON.stringify(envio)
    }).done((resp) => {
        if (resp.length != 13) {
            $('#div-error').html(resp)
            document.getElementById('div-error').style.display = 'block'
            no_cargando()
        } else{
            emailjs.send("default_service","template_KK3G9LwJ",{
                    to_destinatario: envio.username, 
                    to_name:envio.nombre,
                    mensaje: `Usted ha solicitado registrarse en "Republica del Salvador Activa" y para ello necesitará activar su cuenta al dar click al siguiente vínculo `,
                    link:`www.ecuadoractiva.com/users/activacion:${resp}-${envio.token}`
                }
            ).then(
                (response)=> {
                    no_cargando()
                    swal('Listo', 'Revise su email para confirma la cuenta', 'success')
                    localStorage.setItem('user',envio.username)			
                }, 
                (error)=> {
                    no_cargando()
                    $('#div-error').html('Ha ocurrido un error al enviar su token de confirmación')
                    document.getElementById('div-error').style.display = 'block'
                    
                }
            );
        }
    })   
}

/*
function validar() {
    cedula = document.getElementById("txtcedula").value
    vector=cedula.split('')
    var sumatotal=0
    ultimo=Number(vector[9])
    if(vector.length==10){
        //if(cedula=='0000000000'){
            document.getElementById("txtcedula").setCustomValidity('Esta cédula no es real')
            retornar=false;
        //}else{
            for(var i=0;i<vector.length-1;i++){
                var numero=Number(vector[i])
                if((i+1)%2==1){
                    numero=Number(vector[i])*2
                    if(numero>9)
                        numero=numero-9
                }
                sumatotal+=numero
            }
            sumatotal=10-(sumatotal%10)
            retornar=true
            if(sumatotal>9){
                if(ultimo!=0){
                    document.getElementById("txtcedula").setCustomValidity('Esta cédula no es real')
                    retornar=false;
                }    
                else
                    document.getElementById("txtcedula").setCustomValidity('')  
            }else{
                if(ultimo!=sumatotal){
                    document.getElementById("txtcedula").setCustomValidity('Esta cédula no es real')
                    retornar=false
                } 
                else
                    document.getElementById("txtcedula").setCustomValidity('')
            }
        //}
        return retornar
    }
    
}
*/

function olvido(event){
    event.preventDefault()
    envio={username:valor('usuario-mail')}
    cargando()
    $.ajax({
        type: "POST",
        url: "/users/olvido-mail",
        contentType: "application/json",
        data: JSON.stringify(envio)
    }).done((resp) => {
        if(resp=='Error: No existe este usuario'){
            $('#div-error').html('Este usuario no existe en el sistema')
            document.getElementById('div-error').style.display = 'block'
            no_cargando()
        }else{
            if(resp=='Error'){
                $('#div-error').html('Ha ocurrido un error al realizar el proceso, intente nuevamente')
                document.getElementById('div-error').style.display = 'block'
                no_cargando()
            }else{
                if(resp[0]==null){
                    $('#div-error').html('Ha ocurrido un error al realizar el proceso, intente nuevamente')
                    document.getElementById('div-error').style.display = 'block'
                    no_cargando()
                }else{
                    emailjs.send("default_service","template_KK3G9LwJ",{
                        to_destinatario: envio.username, 
                        to_name:resp[1],
                        mensaje: `Para poder recuperar su cuenta es necesario ingresar este token: ${resp[0]}`
                    }
                    ).then(
                        (response)=> {
                            location.replace('/users/recuperar')			
                        }, 
                        (error)=> {
                            $('#div-error').html('Ha ocurrido un error al enviar el token de recuperación')
                            document.getElementById('div-error').style.display = 'block'
                            no_cargando()
                        }
                    );
                }
            }
        }
    })
}

