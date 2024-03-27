var scriptEjectuado = false
var chatbot = null
var abrir = null
var imagen = null

if(!scriptEjectuado){
    chatbot = document.querySelector("#widget")
    abrir = document.querySelector(".abrir_cerrar_widget")
    imagen = document.querySelector(".abrir_cerrar_widget img")
    scriptEjectuado = true
}

abrir.addEventListener('click',() => {
    if(abrir.id == "abrir"){
        chatbot.style.display = "block"
        imagen.src = "http://localhost:3000/widget/close.png"
        abrir.id = "cerrar"
    }
    else{
        if(abrir.id == "cerrar"){
            chatbot.style.display = "none"
            imagen.src = "http://localhost:3000/widget/comment.png"
            abrir.id = "abrir"
        }
    }
})