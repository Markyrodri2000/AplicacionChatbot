import router from '../routes/routing.js'
import fs from 'fs'
import queries from '../bd/query.js'
import usuario from './controllerUsuario.js'

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
        const email = req.session.email
        req.getConnection((err, conn) => {
            if (err) {
                console.log('Error al conectar a la base de datos');
            }
            conn.query(queries.seleccionar_chat, email, (err, rows) => {
                if (err) {
                    console.log('Error al consultar chats');
                    res.redirect("/login")
                }
                else{
                    if(rows.length>0){
                        let chats = rows.map(row => ({ ...row }))
                        console.log("Chats consultados correctamente")
                        res.render("chats",{"chats":chats})
                    }else{
                        res.render("chats",{"chats":""})
                    }
                }
            });
        });
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
    const nombre = req.body.nombre
    const estado = req.body.estado
    const modelo = req.body.modelo
    const idioma = req.body.idioma
    const temperatura = req.body.temperatura
    const prompt = req.body.promptt
    const links = req.body.links
    console.log(links)

    const valores = {
        codigo,
        usuario_email,
        nombre,
        modelo,
        idioma,
        temperatura,
        prompt,
        links
    }
    const sobreescribir = {
        codigo,
        nombre,
        modelo,
        idioma,
        temperatura,
        prompt,
        links
    }
    req.getConnection((err, conn) => {
        if (err) {
            console.log('Error al conectar a la base de datos');
        }
        conn.query(queries.comprobar_chat, nombre, (err, rows) => {
            if (err) {
                console.log('Error al buscar chat en la base de datos');
                res.redirect("/login")
            }
            else{
                console.log("Chat consultado correctamente")
                if(rows.length>0){
                    if(estado=="guardar"){
                        res.send({respuesta: "Existe"})
                    }else{
                        conn.query(queries.sobreescribir, [sobreescribir,usuario_email,nombre], (err, rows) => {
                            if (err) {
                                console.log('Error al sobreescribir chat en la base de datos');
                                res.redirect("/login")
                            }
                            else{
                                console.log("Chat sobreescrito correctamente")
                                res.send({respuesta: "Guardado"})
                            }
                        });
                    }
                }else{
                    conn.query(queries.guardar_chat, valores, (err, rows) => {
                        if (err) {
                            console.log('Error al guardar chat en la base de datos');
                            console.log(err)
                            res.redirect("/login")
                        }
                        else{
                            console.log("Chat guardado correctamente")
                            res.send({respuesta: "Guardado"})
                        }
                    });
                }
            }
        });
    });
}
function getId(req,res){
    const usuario_email = req.session.email
    const nombre = req.body.nombre
    
    req.getConnection((err, conn) => {
        if (err) {
            console.log('Error al conectar a la base de datos');
        }
        else{
            conn.query(queries.get_id, [nombre,usuario_email], (err, rows) => {
                if (err) {
                    console.log('Error al get id en la base de datos');
                    res.redirect("/login")
                }
                else{
                    console.log("Id consultado correctamente")
                    res.send({id: rows[0].id})
                }
            });
        }
    })
}
function editar_chats(req,res){
    const usuario_email = req.session.email
    const nombre = req.body.nombre
    
    req.getConnection((err, conn) => {
        if (err) {
            console.log('Error al conectar a la base de datos');
        }
        else{
            conn.query(queries.seleccionar_codigo, [nombre,usuario_email], (err, rows) => {
                if (err) {
                    console.log('Error al seleccionar código en la base de datos');
                    res.redirect("/login")
                }
                else{
                    console.log("Código consultado correctamente")
                    res.send({links: rows[0].links,id: rows[0].id, nombre: req.session.nombre,codigo: rows[0].codigo,modelo: rows[0].modelo,temperatura:rows[0].temperatura,prompt:rows[0].prompt,idioma:rows[0].idioma})
                }
            });
        }
    })
}
function borrar_chat(req,res){
    const usuario_email = req.session.email
    const nombre = req.body.nombre
    
    req.getConnection((err, conn) => {
        if (err) {
            console.log('Error al conectar a la base de datos');
        }
        else{
            conn.query(queries.borrar_chat, [nombre,usuario_email], (err, rows) => {
                if (err) {
                    console.log('Error al borrar chat en la base de datos');
                    res.redirect("/login")
                }
                else{
                    console.log("Chat borrado correctamente")
                    res.send({nombre: req.session.nombre})
                }
            });
        }
    })
}
const chat = {
    Index,
    Widget,
    Chats,
    guardar_chat,
    editar_chats,
    borrar_chat,
    getId
}
export default chat