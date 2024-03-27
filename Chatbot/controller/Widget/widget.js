const chatbot = document.querySelector("#widget")
const abrir = document.querySelector(".abrir_cerrar_widget")
const imagen = document.querySelector(".abrir_cerrar_widget img")

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