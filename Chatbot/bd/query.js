const comprobacion_register = 'SELECT * FROM users WHERE email = ?'
const register = 'INSERT INTO users set ?'
const login = 'SELECT * FROM users WHERE email = ?'
const reset_bd = 'DELETE FROM users'
const nombre = 'SELECT Nombre FROM users WHERE email = ?'
const modificar = 'UPDATE users SET password = ? WHERE email = ?'
const verificar = 'SELECT password FROM users WHERE email = ?'
const crear_apikey = 'INSERT INTO apikeys set ?'
const tokens = 'SELECT nombre,apikey FROM apikeys WHERE usuario_email = ?'
const permisos = 'SET SQL_SAFE_UPDATES = 0'
const eliminar_token = 'DELETE from apikeys where apikey = ? and usuario_email = ?'
const validar_token = 'SELECT * FROM apikeys WHERE apikey = ? and usuario_email = ?'
const guardar_chat = 'INSERT INTO chats set ?'

const queries = {
    comprobacion_register,
    register,
    login,
    reset_bd,
    nombre,
    modificar,
    verificar,
    crear_apikey,
    tokens,
    permisos,
    eliminar_token,
    validar_token,
    guardar_chat
}
export default queries