const dbConfig = {
    host: 'db',  
    user: 'root',
    password: '00280300',
    port: 3306,
    database: 'Nistrica'
}

const sessio = {
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}

const bd = {
    dbConfig,
    sessio,
}
export default bd