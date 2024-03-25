import router from '../routes/routing.js'
import fs from 'fs'

async function Index(req,res){
    let nom = ""
    if(req.session.nombre!=null){
        nom = req.session.nombre
        desplegar_css(req,res)

    }
    res.render('index', { nombre: nom})
}
function desplegar_css(req,res){
    //Desplegar posicion widget
    const estilos = fs.readFileSync('./controller/Widget/estilos.css','utf-8')
    const link = '/widget/estilos.css'
    router.get(link, (req, res) => {
        res.setHeader('Content-Type', 'text/css')
        res.send(estilos)
    })
    //Desplegar imágenes
    const abrir = fs.readFileSync('./controller/Widget/img/comment.png')
    const link_img1 = '/widget/comment.png'
    router.get(link_img1, (req, res) => {
        res.setHeader('Content-Type', 'image/png')
        res.send(abrir)
    })

    const cerrar = fs.readFileSync('./controller/Widget/img/close.png')
    const link_img2 = '/widget/close.png'
    router.get(link_img2, (req, res) => {
        res.setHeader('Content-Type', 'image/png')
        res.send(cerrar)
    })

    const enviar = fs.readFileSync('./controller/Widget/img/send.png')
    const link_img3 = '/widget/send.png'
    router.get(link_img3, (req, res) => {
        res.setHeader('Content-Type', 'image/png')
        res.send(enviar)
    })
}
function Chats(req,res){
    if(req.session.nombre!=null){
        res.render("chats", {nombre: req.session.nombre})
    }
    else{
        res.redirect("/login")
    }
}
function Widget(req,res){
    //Widget
    const iframe = fs.readFileSync('./controller/Widget/widget.html','utf-8')
    const random = crypto.getRandomValues(new Uint32Array(1))
    const link = '/widget/crear/'+req.session.nombre+'/'+ random + '.html'
    router.get(link, (req, res) => {
        res.setHeader('Content-Type', 'text/html')
        res.send(iframe)
    })
    const cambio_estilos = actualizar_valores_widget(req.body)
    res.send(JSON.stringify({
        link_iframe: link,
        link_estilos: '/widget/estilos.css'
    }))
}
function actualizar_valores_widget(body){
    const titulo = body.titulo
    const nombre = body.nombre
    const color_f = body.color_fondo
    const color_n = body.color_nav
    const color_s = body.color_servidor
    const color_c = body.color_cliente
    const fuente = body.color_fuente

    const estilos = `
        const actual = document.querySelector(".chat-header h2")
        const nombre = document.querySelector("li text")
        const chat = document.querySelector(".chat-messages")
        const header = document.querySelector(".chat-header")
        const serv = document.querySelector(".servidor")
        const cli = document.querySelector(".cliente")

        actual.innerHTML = '${titulo}'
        nombre.innerHTML = '${nombre}'
        chat.style.backgroundColor = '${color_f}'
        header.style.backgroundColor = '${color_n}'
        serv.style.backgroundColor = '${color_s}'
        cli.style.backgroundColor = '${color_c}'
        chat.style.color = '${fuente}'
        header.style.color = '${fuente}'
    `
    return estilos
}
function crear_Widget(){
    const html = `
        <button class="chatbot-toggler">
            <span class="">abrir</span>
            <span class="">close</span>
        </button>
        <div class="chatbot">
            <header class="chat-header">
                <h2>OPEN AI</h2>
                <span class="close-button">close</span>
            </header>
            <ul class="chat-messages">
                <li class="servidor incoming"><p>Bienvenido/a Marc, soy <text>Nistrica</text> tu asistente virtual, ¿en que puedo ayudarte?</p></li>
                <li class="cliente incoming"><p>Hola, encantado de conocerte, yo soy Marc</p></li>
            </ul>
            <div class="chat-input">
                <textarea placeholder="Enter a message..." spellcheck="false" required></textarea>
                <button class="send-button">send</button>
            </div>
        </div>
    `
    const css = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

        .chatbot-toggler {
        position: fixed;
        bottom: 30px;
        right: 35px;
        outline: none;
        border: none;
        height: 50px;
        width: 50px;
        display: flex;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: #724ae8;
        transition: all 0.2s ease;
        }
        body.show-chatbot .chatbot-toggler {
        transform: rotate(90deg);
        }
        .chatbot-toggler span {
        color: #fff;
        position: absolute;
        }
        .chatbot-toggler span:last-child,
        body.show-chatbot .chatbot-toggler span:first-child  {
        opacity: 0;
        }
        body.show-chatbot .chatbot-toggler span:last-child {
        opacity: 1;
        }
        .chatbot {
        position: fixed;
        right: 35px;
        bottom: 90px;
        width: 400px;
        max-height: 500px;
        background: #fff;
        border-radius: 15px;
        overflow: hidden;
        opacity: 0;
        pointer-events: none;
        transform: scale(0.5);
        transform-origin: bottom right;
        box-shadow: 0 0 128px 0 rgba(0,0,0,0.1),
                    0 32px 64px -48px rgba(0,0,0,0.5);
        transition: all 0.1s ease;
        }
        body.show-chatbot .chatbot {
        opacity: 1;
        pointer-events: auto;
        transform: scale(1);
        }
        .chatbot header {
        padding: 16px 0;
        position: relative;
        text-align: center;
        color: #fff;
        background: #724ae8;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .chatbot header span {
        position: absolute;
        right: 15px;
        top: 50%;
        display: none;
        cursor: pointer;
        transform: translateY(-50%);
        }

        header h2 {
        font-size: 1.4rem;
        height: 10px;
        }
        .chatbot .chat-messages {
        overflow-y: auto;
        height: 400px;
        padding: 30px 20px 100px;
        }
        .chatbot :where(.chat-messages, textarea)::-webkit-scrollbar {
        width: 6px;
        }
        .chatbot :where(.chat-messages, textarea)::-webkit-scrollbar-track {
        background: #fff;
        border-radius: 25px;
        }
        .chatbot :where(.chat-messages, textarea)::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 25px;
        }
        .chat-messages li {
        display: flex;
        list-style: none;
        }
        .chat-messages .outgoing {
        margin: 20px 0;
        justify-content: flex-end;
        }
        .chat-messages .incoming span {
        color: #fff;
        cursor: default;
        text-align: center;
        line-height: 32px;
        align-self: flex-end;
        background: #724ae8;
        border-radius: 4px;
        margin: 0 10px 7px 0;
        }
        .chat-messages .chat p {
        white-space: pre-wrap;
        padding: 12px 16px;
        border-radius: 10px 10px 0 10px;
        max-width: auto;
        color: #fff;
        font-size: 0.50rem;
        background: #724ae8;
        }
        .chatbox .incoming p {
        border-radius: 10px 10px 10px 0;
        }
        .chatbox .chat p.error {
        color: #721c24;
        background: #f8d7da;
        }
        .chatbox .incoming p {
        color: #000;
        background: #f2f2f2;
        }
        .chatbot .chat-input {
        display: flex;
        gap: 5px;
        position: absolute;
        bottom: 0;
        width: 100%;
        background: #fff;
        padding: 3px 20px;
        border-top: 1px solid #ddd;
        }
        .chat-input textarea {
        height: 55px;
        width: 100%;
        border: none;
        outline: none;
        resize: none;
        max-height: 180px;
        padding: 15px 15px 15px 0;
        }
        .chat-input span {
        align-self: flex-end;
        color: #724ae8;
        cursor: pointer;
        height: 55px;
        display: flex;
        align-items: center;
        visibility: hidden;
        font-size: 1.35rem;
        }
        .chat-input textarea:valid ~ span {
        visibility: visible;
        }


        @media (max-width: 490px) {
        .chatbot-toggler {
            right: 20px;
            bottom: 20px;
        }
        .chatbot {
            right: 0;
            bottom: 0;
            height: 100%;
            border-radius: 0;
            width: 100%;
        }
        .chatbot .chat-messages {
            padding: 25px 15px 100px;
        }
        .chatbot .chat-input {
            padding: 5px 15px;
        }
        .chatbot header span {
            display: block;
        }
        }
        .cliente {
            list-style-type: none;
            margin-bottom: 10px;
            text-align: left;
            max-width: auto;
            background-color: #eea74a;
            border-radius: 10px;
            padding: 10px;
            float:right;
            clear: both;
            word-wrap: break-word;
        }
            
        .servidor{
            list-style-type: none; 
            margin-bottom: 10px; 
            text-align: left; 
            max-width: auto; 
            background-color: #e0e0e0; 
            border-radius: 10px; 
            padding: 10px; 
            clear: both;
            word-wrap: break-word;
        }
        .chat-input input{
            max-width: 100%;
        }
        .chat-input{
        max-width: 375px;
        }
    `
    return {html, css}
}
const chat = {
    Index,
    Widget,
    Chats
}
export default chat