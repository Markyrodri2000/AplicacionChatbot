import {Router} from 'express'
import views from '../index.js'
import {join} from 'path'
import usuario from '../controller/controllerUsuario.js'
import chat from '../controller/controllerChat.js'

const router = Router()

router.get('/', chat.Index)

router.get('/registro', (req, res) => res.render(join(views,'registro'),{error: ''}))
router.get('/login', (req, res) => res.render(join(views,'login'),{error: ''}))
router.get('/logout', usuario.Logout)
router.get('/chats', chat.Chats)
router.get('/cuenta', usuario.Cuenta)
router.get('/tokens',usuario.mostrar_keys)

router.post('/tokens', usuario.mostrar_keys)
router.post('/generar_token', usuario.generarToken)
router.post('/registro', usuario.Registro)
router.post('/login', usuario.Login)
router.post('/cambiar_password', usuario.CambiarPsw)
router.post('/cerrar', usuario.Cerrar)
router.post('/borrar_token',usuario.Borrar)
router.post('/validar_token',usuario.ValidarToken)
router.post('/guardar_chat',chat.guardar_chat)
router.post('/editar_chat', chat.editar_chats)
router.post('/borrar_chat', chat.borrar_chat)
router.post('/get_id',chat.getId)

//Servir Widget
router.post('/widget',(chat.Widget))

export default router