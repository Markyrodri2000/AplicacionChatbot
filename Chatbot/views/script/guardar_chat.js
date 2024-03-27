document.addEventListener('DOMContentLoaded', function() {
    const chat = document.querySelector(".chat-container")
    const form = document.querySelector(".formulario1")

    if(sessionStorage.getItem(nombre+"session")=== null){
        const chat_guardar = chat.innerHTML
        sessionStorage.setItem(nombre,chat_guardar)
        sessionStorage.setItem(nombre+"session", "activa")
        sessionStorage.setItem(nombre+"form",form.innerHTML)
    }
    else{
        console.log(sessionStorage.getItem(nombre+"form"))
        chat.innerHTML = sessionStorage.getItem(nombre)
        //form.innerHTML = sessionStorage.getItem(nombre+"form")
    }
})
