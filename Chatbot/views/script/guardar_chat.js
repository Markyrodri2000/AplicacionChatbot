document.addEventListener('DOMContentLoaded', function() {
    const chat = document.querySelector(".actualizar_pagina")
    if(typeof nombre!=="undefined"){
        if(sessionStorage.getItem(nombre+"session")=== null){
            const chat_guardar = chat.innerHTML
            sessionStorage.setItem(nombre,chat_guardar)
            sessionStorage.setItem(nombre+"session", "activa")
            sessionStorage.setItem(nombre+"Modelo","llama2")
            sessionStorage.setItem(nombre+"Idioma","Español")
            sessionStorage.setItem(nombre+"Temperatura","0.5")
            sessionStorage.setItem(nombre+"Prompt","Eres un asistente servicial. Por favor responda las consultas de los usuarios.")
            sessionStorage.setItem(nombre+"Contador",0)
            sessionStorage.setItem(nombre+"Links","")
        }
        else{
            
            chat.innerHTML = sessionStorage.getItem(nombre)
            const mensajes = document.querySelector(".chat-messages")
            mensajes.scrollTo(0, mensajes.scrollHeight)
            actualizar_form()
            actualizar_entrenar()
            consultar_id()
        }
    }
})

function consultar_id(){
    console.log(sessionStorage.getItem(nombre+"Contador"))
    console.log("Abierto...")
}
function actualizar_form(){
    const actual = document.querySelector(".chat-header h2")
    const input_titulo = document.querySelector(".tit")
    input_titulo.value = ""
    input_titulo.placeholder = actual.textContent

    const act = document.querySelector(".chat-messages li text")
    const input_nombre = document.querySelector(".nombre_chat")
    input_nombre.value = ""
    input_nombre.placeholder = act.textContent

    const chat = document.querySelector(".chat-messages")

    const color_fondo = document.querySelector(".formulario1 .color-fondo")
    if(chat.style.backgroundColor != ""){
        color_fondo.value = rgbaToHex(chat.style.backgroundColor)
    }

    const header = document.querySelector(".chat-header")
    if(header.style.backgroundColor != ""){
        const color_nav = document.querySelector(".formulario1 .color-nav")
        color_nav.value = rgbaToHex(header.style.backgroundColor)
    }

    const serv = document.querySelector(".servidor")
    const color_servidor = document.querySelector(".formulario1 .color-servidor")
    if(serv.style.backgroundColor != ""){
        color_servidor.value = rgbaToHex(serv.style.backgroundColor)
    }

    const client = document.querySelector(".cliente")
    const color_cliente = document.querySelector(".formulario1 .color-cliente")
    if(client.style.backgroundColor != ""){
        color_cliente.value = rgbaToHex(client.style.backgroundColor)
    }

    const color_fuente = document.querySelector(".formulario1 .color-fuente")
    if(chat.style.color != ""){
        color_fuente.value = rgbaToHex(chat.style.color)
    }
   
}

function actualizar_entrenar(){
    document.querySelector(".descripcion").value = sessionStorage.getItem(nombre+"Prompt")
    document.querySelector(".miSlider").value = sessionStorage.getItem(nombre+"Temperatura")
    document.querySelector(".slidervalue").textContent = sessionStorage.getItem(nombre+"Temperatura")

    var idioma = document.querySelector("#desplegable_idioma #"+sessionStorage.getItem(nombre+"Idioma"))
    idioma.selected = true

    var modelo = document.querySelector("#desplegable_modelo #"+sessionStorage.getItem(nombre+"Modelo"))
    modelo.selected = true

    let linkTexts = sessionStorage.getItem(nombre+"Links").split(',')
    const link = document.querySelector(".link")
    link.value = linkTexts[0]

    const labels = document.querySelector(".links")

    for (let i = 1; i < linkTexts.length; i++) {
        let newInput = document.createElement('input')
        newInput.type = 'text'
        newInput.classList.add('link')
        newInput.value = linkTexts[i]
        labels.appendChild(newInput)
    }

}

function rgbaToHex(rgbaColor) {
    // Extraer los componentes R, G, B y A del color RGBA
    const matches = rgbaColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(\.\d+)?))?\)/);

    if (!matches) {
        // Si no se encontraron coincidencias, devuelve el color original
        return rgbaColor;
    }

    // Extraer los valores de los componentes R, G y B
    const r = parseInt(matches[1]);
    const g = parseInt(matches[2]);
    const b = parseInt(matches[3]);

    // Convertir los valores de los componentes R, G y B a su representación hexadecimal
    const hex = ((r << 16) | (g << 8) | b).toString(16);

    // Agregar ceros a la izquierda si es necesario para completar los 6 dígitos del color hexadecimal
    const paddedHex = '#' + '0'.repeat(6 - hex.length) + hex;

    return paddedHex;
}