import bcrypt from 'bcrypt'
import queries from '../bd/query.js'
import generateApiKey from 'generate-api-key'
import chat from './controllerChat.js'

function Registro(req, res) {
  const data = req.body;
  /*req.getConnection((err, conn) => {
    conn.query(queries.reset_bd, (err, rows) => {
        if (err) {
            console.log('Error al resetear la base de datos');
        }
        else{
            console.log('Base de datos reseteada correctamente')
        }
    })
  })*/
  bcrypt.hash(data.password, 10, (err, hash) => {
    if (err) {
      console.log('Error al encriptar la contraseña');
      res.status(500).send('Error al encriptar la contraseña');
      return;
    }
    data.password = hash;
    req.getConnection((err, conn) => {
        if (err) {
            console.log('Error al conectar a la base de datos');
        }
        conn.query(queries.comprobacion_register, [data.email], (err, rows) => {
            if (err) {
            console.log('Error al insertar el usuario');
            }
            else{
                if (rows.length > 0) {
                    res.render('registro',{error: "El usuario ya existe"})
                } else {
                    conn.query(queries.register, [data], (err, rows) => {
                        if (err) {
                            console.log('Error al insertar el usuario');
                        }
                        else{
                            req.session.loggedin = true
                            req.session.nombre = req.body.Nombre
                            req.session.email = data.email
                            req.session.password = data.password
                            res.redirect("/")
                            //res.render('index',{nombre: req.session.nombre, chat: ""})
                        }
                    });
                }   
            }
        });
    });
  });
}

function Login(req, res) {
    const data = req.body;
    req.getConnection((err, conn) => {
        if (err) {
            console.log('Error al conectar a la base de datos');
        }
        conn.query(queries.login, [data.email], (err, rows) => {
            if (err) {
                console.log('Error al realizar la query en la base de datos');
            }
            else{
                if (rows.length > 0) {
                    bcrypt.compare(data.password, rows[0].password, (err, result) => {
                        if (err) {
                            res.render('login',{error: 'Contraseña incorrecta'})
                        }
                        if (result) {
                            console.log('Usuario logeado correctamente');
                            conn.query(queries.nombre, [data.email], (err, rows) => {
                                if (err) {
                                    console.log('Error al encontrar el nombre del usuario');
                                }
                                else{
                                    req.session.loggedin = true
                                    req.session.nombre = rows[0].Nombre
                                    req.session.email = data.email
                                    req.session.password = data.password
                                    res.redirect("/")
                                }
                            })
                        } else {
                            res.render('login',{error: 'Contraseña incorrecta'})
                        }
                    });
                } else {
                    res.render('login',{error: 'Usuario no existe'})
                }
            }
        });
    });
  }
function Logout(req,res){
    if(req.session.loggedin){
        req.session.destroy();
        res.redirect("/login")
    }else{
        res.redirect("/login")
    }
}

function Cuenta(req,res){
    if(req.session.nombre!=null){
        res.render("cuenta", {nombre: req.session.nombre, email: req.session.email,password:req.session.password,error:"",tokens:""})
    }
    else{
        res.redirect("/login")
    }
}
function CambiarPsw(req,res){
    const data = req.body;
    const email = req.session.email
    req.getConnection((err, conn) => {
        if (err) {
            console.log('Error al conectar a la base de datos');
        }
        conn.query(queries.verificar, [email], (err, rows) => {
            if (err) {
                console.log('Error al realizar la query en la base de datos');
            }
            else{
                bcrypt.compare(data.anterior_pssw, rows[0].password, (err, result) => {
                    if (err) {
                        res.render("cuenta", {nombre: req.session.nombre, email: req.session.email,password:req.session.password,error:"Contraseña anterior incorrecta",tokens:""})
                    }
                    if (result) {
                        console.log('Contraseña anterior correcta');
                        if(data.new_pssw==data.conf_new_pssw){
                            bcrypt.hash(data.new_pssw, 10, (err, hash) => {
                                if(err){
                                    console.log('Error al encriptar la contraseña');
                                }else{
                                    conn.query(queries.modificar, [hash,email], (err, rows) => {
                                        if (err) {
                                            console.log('Error al cambiar la contraseña de ususario')
                                        }
                                        else{
                                            req.session.password = data.new_pssw
                                            res.render("cuenta", {nombre: req.session.nombre, email: req.session.email,password:req.session.password,error:"Contraseña cambiada correctamente",tokens:""})
                                        }
                                    })
                                }
                            })
                        }else{
                            res.render("cuenta", {nombre: req.session.nombre, email: req.session.email,password:req.session.password,error:"Nueva contraseña no coinciden",tokens:""})
                        }
                    }else{
                        res.render("cuenta", {nombre: req.session.nombre, email: req.session.email,password:req.session.password,error:"Contraseña anterior incorrecta",tokens:""})
                    }
                });
            }
        });
    });
}

function generarToken(req,res){
    const data = req.body;
    const usuario_email = req.session.email
    const apikey = generateApiKey.generateApiKey()
    const nombre = data.token
    const valores = {
        apikey,
        usuario_email,
        nombre
    }
    req.getConnection((err, conn) => {
        if (err) {
            console.log('Error al conectar a la base de datos');
        }
        conn.query(queries.crear_apikey, valores, (err, rows) => {
            if (err) {
                console.log('Error al generar token');
                res.redirect("/login")
            }
            else{
                console.log("Token generado correctamente")
                res.redirect("/tokens")
            }
        });
    });
}

function mostrar_keys(req,res){
    const email = req.session.email
    req.getConnection((err, conn) => {
        if (err) {
            console.log('Error al conectar a la base de datos');
        }
        conn.query(queries.tokens, email, (err, rows) => {
            if (err) {
                console.log('Error al consultar tokens');
                res.redirect("/login")
            }
            else{
                if(rows.length>0){
                    let tokens = rows.map(row => ({ ...row }))
                    console.log("Token consultados correctamente")
                    res.render("cuenta", {nombre: req.session.nombre, email: req.session.email,password:req.session.password,error:"Mostrar tokens",tokens:tokens})
                }else{
                    res.render("cuenta", {nombre: req.session.nombre, email: req.session.email,password:req.session.password,error:"Mostrar tokens",tokens:""})
                }
            }
        });
    });
}
function Cerrar(req,res){
    res.redirect("/cuenta")
}

function Borrar(req,res){
    const usuario_email = req.session.email
    const key = req.body.key
    req.getConnection((err, conn) => {
        if (err) {
            console.log('Error al conectar a la base de datos');
        }
        conn.query(queries.permisos, (err, rows) => {
            if (err) {
                console.log('Error al dar permisos');
                res.redirect("/login")
            }
            else{
                conn.query(queries.eliminar_token, [key,usuario_email], (err, rows) => {
                    if (err) {
                        console.log(err)
                        console.log('Error al eliminar tokens');
                        res.redirect("/login")
                    }
                    else{
                        console.log('Token eliminado correctamente')
                        res.redirect("/tokens")
                    }
                });
            }
        })
    });
}
function ValidarToken(req,res){
    const key = req.body.key
    const usuario_email = req.session.email
    req.getConnection((err, conn) => {
        if (err) {
            console.log('Error al conectar a la base de datos');
        }
        conn.query(queries.validar_token,[key,usuario_email], (err, rows) => {
            if (err) {
                console.log('Error al consultar api key');
                res.redirect("/")
            }
            else{
                console.log("Token validado correctamente")
                var respuesta = "Token no valido"
                if(rows.length>0){
                    respuesta = "Token valido"
                }
                res.send(JSON.stringify({
                    res: respuesta     
                }))
            }
        })
    });
}
const usuario = {
    Registro,
    Login,
    Logout,
    Cuenta,
    CambiarPsw,
    generarToken,
    mostrar_keys,
    Cerrar,
    Borrar,
    ValidarToken
}
export default usuario;
