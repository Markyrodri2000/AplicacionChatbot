import express from 'express'
import routes from './routes/routing.js'
import path from 'path'
import {dirname, join} from 'path'
import {fileURLToPath} from 'url'
import bodyParser from 'body-parser'
import mysql from 'mysql2'
import myconnection from 'express-myconnection'
import session from 'express-session'
import db from './bd/config.js'

const app = express()

//Middleware
//REQ AND GET
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

//BD
app.use(myconnection(mysql,db.dbConfig))
app.use(session(db.sessio))
//CSS
app.use(express.static(join(dirname(fileURLToPath(import.meta.url)),'views')))

const views = join(dirname(fileURLToPath(import.meta.url)),'views')

app.set('view engine','ejs')
app.set('views',views)

app.use(routes)

console.log("Connexión a la base de datos correctamente...")
app.listen(3000)

console.log("Server is listening on port 3000...")

export default views