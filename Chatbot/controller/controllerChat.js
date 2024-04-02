import router from '../routes/routing.js'
import fs from 'fs'
import queries from '../bd/query.js'

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

    const enviar = fs.readFileSync('./controller/Widget/img/enviar.png')
    const link_img3 = '/widget/enviar.png'
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
    const iframeTemplate = fs.readFileSync('./controller/Widget/widget.html','utf-8')
    const random = crypto.getRandomValues(new Uint32Array(1))
    const link = '/widget/crear/'+req.session.nombre+'/'+ random + '.html'
    const iframe = actualizar_valores_widget(req.body,iframeTemplate)
    const bot_fondo = req.body.color_nav

    router.get(link, (req, res) => {
        res.setHeader('Content-Type', 'text/html')
        res.send(iframe)
    })
    res.send(JSON.stringify({
        link_estilos: '/widget/estilos.css',
        link_script: '/widget/widget.js',
        link_iframe: link,
        boton_fondo: bot_fondo
    }))
}
function actualizar_valores_widget(body,iframeTemplate){
    const titulo = body.titulo
    const nombre = body.nombre
    const color_f = body.color_fondo
    const color_n = body.color_nav
    const color_s = body.color_servidor
    const color_c = body.color_cliente
    const fuente = body.color_fuente

    const iframe = iframeTemplate.replace(/titulo_remplazado/g,`'${titulo}'`)
                                 .replace(/nombre_remplazado/g,`'${nombre}'`)
                                 .replace(/color_f_remplazado/g,`'${color_f}'`)
                                 .replace(/color_n_remplazado/g,`'${color_n}'`)
                                 .replace(/color_s_remplazado/g,`'${color_s}'`)
                                 .replace(/color_c_remplazado/g,`'${color_c}'`)
                                 .replace(/fuente_remplazado/g,`'${fuente}'`)

    return iframe
}

function guardar_chat(req,res){
    const codigo = req.body.codigo
    const usuario_email = req.session.email
    const valores = {
        codigo,
        usuario_email
    }
    req.getConnection((err, conn) => {
        if (err) {
            console.log('Error al conectar a la base de datos');
        }
        conn.query(queries.guardar_chat, valores, (err, rows) => {
            if (err) {
                console.log('Error al guardar chat en la base de datos');
                res.redirect("/login")
            }
            else{
                console.log("Chat guardado correctamente")
            }
        });
    });
}
const chat = {
    Index,
    Widget,
    Chats,
    guardar_chat
}
export default chat