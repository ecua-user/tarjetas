function detallar(identidad){
    document.getElementById('tarjeta-img').style.display='none'
    $("html, body").animate({ scrollTop: 0 }, 600);
    document.getElementById('nombre-local').innerText=obtenerTexto('nom'+identidad)
    document.getElementById('beneficio-local').innerText='hasta un '+obtenerTexto('benef-loc')
    document.getElementById('direccion-local').innerText=obtenerTexto('di_loc')
    document.getElementById('telefono-local').innerText=obtenerTexto('tel_loc')
    desde=document.getElementById('fecha_inic').innerText
    desde=new Date(desde)
    hasta=document.getElementById('fecha_fin').innerText
    hasta=new Date(hasta)
    document.getElementById('valido-desde').innerText=desde.getDate()+'/'+desde.getMonth()+'/'+ desde.getFullYear()
    document.getElementById('valido-hasta').innerText=hasta.getDate()+'/'+hasta.getMonth()+'/'+ hasta.getFullYear()
    document.getElementById('adicionales-local').innerText=obtenerTexto('adic-loc')
    document.getElementById('benef-local-img').setAttribute('src',obtenerTexto('img-ben'))
    $('#local-desc').show('slow')
}

function obtenerTexto(identidad){
    return document.getElementById(identidad).innerText
}