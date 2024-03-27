import router from '../routes/routing.js'
import fs from 'fs'

async function Index(req,res){
    let nom = ""
    if(req.session.nombre!=null){
        nom = req.session.nombre
        desplegar_css(req,res)
        desplegar_js(req,res)
    }
    res.render('index', { nombre: nom})
}
function desplegar_js(req,res){
    const javascript = fs.readFileSync('./controller/Widget/widget.js','utf-8')
    const link = '/widget/widget.js'
    router.get(link, (req, res) => {
        res.setHeader('Content-Type', 'text/javascript')
        res.send(javascript)
    })
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
    /*const cambio_estilos = actualizar_valores_widget(req.body)
    const javascript = fs.readFileSync('./controller/Widget/widget.js','utf-8')
    var script = `
    var añadir = \`
        <link rel=stylesheet href=http://localhost:3000/widget/estilos.css>
        <button id="abrir" class="abrir_cerrar_widget"><img src=http://localhost:3000/widget/comment.png></button>
        <iframe id="widget" src=http://localhost:3000`+link+`></iframe>
    \`
    document.body.innerHTML = añadir + document.body.outerHTML
    ${javascript}
    `
    const rand = crypto.getRandomValues(new Uint32Array(1))
    const link_def = '/widget/'+req.session.nombre+'/'+ rand + '.js'
    router.get(link_def, (req, res) => {
        res.setHeader('Content-Type', 'text/javascript')
        res.send(script)
    })*/
    res.send(JSON.stringify({
        link_estilos: '/widget/estilos.css',
        link_script: '/widget/widget.js',
        link_iframe: link
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
const chat = {
    Index,
    Widget,
    Chats
}
export default chat