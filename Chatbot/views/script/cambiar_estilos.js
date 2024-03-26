const chat = document.querySelector(".chat-messages")
const header = document.querySelector(".chat-header")
const aplicar = document.querySelector(".send-style")
const restablecer = document.querySelector(".restablecer-style")
const abrir_descargar = document.querySelector(".widget")
const guardar = document.querySelector(".guardar")
const entregar = document.querySelector(".entregar")
const validar = document.querySelector(".validar_key")
const descargar = document.querySelector(".entregar_codigo")
const copiar = document.querySelector(".copiar")
const cerrar = document.querySelector(".cerrar")
const guardar_desp = document.querySelector(".guardar_desp")
const cerrar_guardar = document.querySelector(".cerrar-guardar")
const mis_chats = document.querySelector(".mis-chats")
const entrenar = document.querySelector(".train")
const probar = document.querySelector(".probar")

const input_titulo = document.querySelector(".tit")
const input_nombre = document.querySelector(".nombre_chat")
const color_fondo = document.querySelector(".color-fondo")
const color_nav = document.querySelector(".color-nav")
const color_servidor = document.querySelector(".color-servidor")
const color_cliente = document.querySelector(".color-cliente")
const color_fuente = document.querySelector(".color-fuente")

function cambiar(titulo,nombre,color_f,color_n,color_s,color_c,fuente){
    if(titulo!=""){
        const actual = document.querySelector(".chat-header h2")
        actual.innerHTML = titulo
        input_titulo.value = ""
        input_titulo.placeholder = titulo
    }

    if(nombre!=""){
        const actual = chat.querySelector("li text")
        actual.innerHTML = nombre
        input_nombre.value = ""
        input_nombre.placeholder = nombre
    }
    if(color_f !="#DB930B"){
        chat.style.backgroundColor = color_f
    }
    if(color_n !="#ffa500"){
        header.style.backgroundColor = color_n
    }
    if(color_s !="#e0e0e0"){
        const serv = document.querySelectorAll(".servidor")
        serv.forEach(s => {
            s.style.backgroundColor = color_s
        })
    }
    if(color_c !="#eea74a"){
        const cli = document.querySelectorAll(".cliente")
        cli.forEach(c => {
            c.style.backgroundColor = color_c
        })
    }
    if(fuente !="#000000"){
        chat.style.color = fuente
        header.style.color = fuente
    }
}
aplicar.addEventListener('click', () => {
    cambiar(input_titulo.value,input_nombre.value,color_fondo.value,color_nav.value,color_servidor.value,color_cliente.value,color_fuente.value)
})

entrenar.addEventListener('click', () => {
    const link = document.querySelector(".link")
    console.log("link")
})

restablecer.addEventListener('click', () => {
    const actual = document.querySelector(".chat-header h2")
    actual.innerHTML = "ChatBot"
    input_titulo.value = ""
    input_titulo.placeholder = "ChatBot"

    const act = chat.querySelector("li text")
    act.innerHTML = "Alexa"
    input_nombre.value = ""
    input_nombre.placeholder = "Alexa"

    chat.style.backgroundColor = "#d3b378"
    color_fondo.value = "#d3b378"

    header.style.backgroundColor = "#ffa500"
    color_nav.value = "#ffa500"

    color_servidor.value = "#e0e0e0"
    const serv = document.querySelectorAll(".servidor")
    serv.forEach(s => {
        s.style.backgroundColor = "#e0e0e0"
    })

    color_cliente.value = "#eea74a"
    const cli = document.querySelectorAll(".cliente")
    cli.forEach(c => {
        c.style.backgroundColor = "#eea74a"
    })

    chat.style.color = "#000000"
    header.style.color = "#000000"
    color_fuente.value = "#000000"
    console.log("Hola")
})
probar.addEventListener('click', () => {
    const indice = document.querySelector(".grid")
    if(probar.textContent == "Probar Widget"){
        fetch("http://localhost:3000/widget",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titulo: document.querySelector(".chat-header h2").textContent,
                nombre: chat.querySelector("li text").textContent,
                color_fondo: color_fondo.value,
                color_nav: color_nav.value,
                color_servidor: color_servidor.value,
                color_cliente: color_cliente.value,
                color_fuente: color_fuente.value
            })
        }).then(
            response => response.json()
        ).then(data=>{
            const link_code = document.createElement("link")
            link_code.id="iframe_style"
            link_code.rel = "stylesheet"
            link_code.href = "http://localhost:3000" + data.link_estilos
            const frame = document.createElement("iframe")
            frame.id = "widget"
            frame.src = "http://localhost:3000" + data.link_iframe
            indice.appendChild(link_code)
            indice.appendChild(frame)
        })
    }
    else{
        const estilos = document.querySelector("link #iframe_style")
        const frame = document.querySelector("iframe #widget")
        indice.remove(estilos)
        indice.remove(frame)
        probar.textContent = "Probar Widget"
    }
})
abrir_descargar.addEventListener('click', () => {
    entregar.style.display = "block" 
    validar.addEventListener('click', () => {
        fetch("http://localhost:3000/validar_token",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                key: document.querySelector(".api_key_validar").value,
            })
        }).then(
            response => response.json()
        ).then(data=>{
            if(data.res == "Token valido"){
                descargar_widget()
            }else{
                const error = document.querySelector(".error_key")
                error.textContent = "Token no válido"
            }
        })
    })
    cerrar_guardar.addEventListener('click', () => {
        guardar_desp.style.display = "none"
    })
    cerrar.addEventListener('click', () => {
        entregar.style.display = "none"
    })
})

function descargar_widget(){
    fetch("http://localhost:3000/widget",{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            titulo: document.querySelector(".chat-header h2").textContent,
            nombre: chat.querySelector("li text").textContent,
            color_fondo: color_fondo.value,
            color_nav: color_nav.value,
            color_servidor: color_servidor.value,
            color_cliente: color_cliente.value,
            color_fuente: color_fuente.value
        })
    }).then(
        response => response.json()
    ).then(data=>{
        const codigo = document.createElement("code")
        const link = "<link rel="+"stylesheet"+" href=http://localhost:3000"+data.link_estilos+">"
        const link2 = "<iframe id="+"widget "+"src=http://localhost:3000"+data.link_iframe+">"
        const cierre = "</iframe>"
        codigo.textContent = link
        const lin = document.querySelector(".entregar_codigo textarea")
        lin.value = link + "\n" + link2 + cierre
        descargar.style.display = "block"
        copiar.addEventListener('click', () => {
            lin.select()
            document.execCommand("copy")
        })
        validar.remove()
    })
}
guardar.addEventListener('click', () => {
    guardar_desp.style.display = "block"
    const chat = document.querySelector(".chat-messages")
    console.log(chat)
})
/*document.addEventListener("click", function(event) {
    console.log(entregar.style.display)
    if(entregar.style.display == "block"){
        if (event.target !== entregar && !entregar.contains(event.target)) {
            entregar.style.display = "none";
        }
    }
});*/