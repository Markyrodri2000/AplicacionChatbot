const mensajes = document.querySelector(".chat-messages")
const input = document.querySelector(".chat-input textarea")
const boton = document.querySelector(".send-button")
const col_clien = document.querySelector(".cliente").style.backgroundColor
const col_serv = document.querySelector(".servidor").style.backgroundColor
const text = document.querySelector(".chat-input textarea")

function crear_mensaje(mensaje){
    const persona = mensaje[0]
    const mes = mensaje[1]
    const imagen = ''
    const chatLi = document.createElement("li")
    if (persona == "cliente"){
        chatLi.classList.add("cliente")
        const col_clien = document.querySelector(".cliente").style.backgroundColor
        chatLi.style.backgroundColor = col_clien
    }
    if(persona == "servidor"){
        chatLi.classList.add("servidor")
        const col_serv = document.querySelector(".servidor").style.backgroundColor
        chatLi.style.backgroundColor = col_serv
    }
    let chatContent =  `<p></p>`
    chatLi.innerHTML = chatContent
    chatLi.querySelector("p").textContent = mes
    return chatLi
}

function responder(mis){
    const chatLi = document.createElement("li")
    chatLi.classList.add("servidor")
    chatLi.innerHTML = `
        <div class="puntos">
            <div class="punto"></div>
            <div class="punto"></div>
            <div class="punto"></div>
        </div>
    `
    mensajes.appendChild(chatLi)
    mensajes.scrollTo(0, mensajes.scrollHeight)
    fetch("http://app:8000/",{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {mensaje: mis}
        )
    })
    .then(response => response.json())
    .then(data => {
        let chatContent =  `<p>${data.mensaje}</p>`
        chatLi.innerHTML = chatContent
        mensajes.scrollTo(0, mensajes.scrollHeight)
        //añadir_mensaje(["servidor",data.mensaje])
    })
    .catch(error => {
        console.error('Error en la solicitud:', error)
    });

}
function añadir_mensaje(mes) {
    const mis = mes
    input.value = ""
    if (!mis) return
    mensajes.appendChild(crear_mensaje(mis))
}

boton.addEventListener('click', () => {
    const mensaje = input.value
    añadir_mensaje(["cliente",input.value])
    responder(mensaje)
})

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        if(input.value != ""){
            const mensaje = input.value
            añadir_mensaje(["cliente",input.value])
            responder(mensaje)
        }
    }
});