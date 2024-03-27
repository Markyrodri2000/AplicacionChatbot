window.addEventListener('beforeunload', function(event) {
    if(sessionStorage.getItem(nombre+"session")=== "activa"){
        const chat_guardar = document.querySelector(".chat-container").innerHTML;
        sessionStorage.setItem(nombre,chat_guardar)
    }
})

document.addEventListener('DOMContentLoaded', function() {
    if(sessionStorage.getItem(nombre+"session")=== null){
        const chat_guardar = document.querySelector(".chat-container").innerHTML
        sessionStorage.setItem(nombre,chat_guardar)
        sessionStorage.setItem(nombre+"session", "activa")
    }
    else{
        const chat= document.querySelector(".chat-container")
        chat.innerHTML = sessionStorage.getItem(nombre)
    }
})
