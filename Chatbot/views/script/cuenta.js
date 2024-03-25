const cambiar = document.querySelector(".cambiar")
const cambiar_span = document.querySelector(".cambiar_psw")
const copiar = document.querySelector(".copiar")
const cerrar = document.querySelector(".cerrar")
const cerrar_token = document.querySelector(".cerrar_token")
const mensajes = document.querySelector(".mensajes")
const formulario = document.querySelector("#Contraseña")
const confirmar = document.querySelector(".confirmar")
const token = document.querySelector(".api")
const span_tokens = document.querySelector(".generate_token")
const mensajes_tokens = document.querySelector(".mensajes_tokens")

if(error !=""){
    if(error=="Mostrar tokens"){
        const json_tokens = JSON.parse(tokens)
        var contador = 0
        if(json_tokens.length>0){
            Object.keys(json_tokens).forEach(key => {
                const tok = document.createElement("p")
                const nombre = document.createElement("p")
                const div = document.createElement("div")
                const key_ocultado= document.createElement("p")

                tok.classList.add("token_key")
                nombre.classList.add("token_nombre")
                div.classList.add("token_elemento")
                key_ocultado.classList.add("token_key_ocultado")
                
                key_ocultado.textContent = json_tokens[key].apikey
                tok.id = "key"+contador.toString()
                div.id = "key"+contador.toString()
                key_ocultado.id = "key"+contador.toString()
                
                let token_asteriscos = "";
                for(let i=0; i<json_tokens[key].apikey.length; i++){
                    if (i < 6) {
                        token_asteriscos+=json_tokens[key].apikey[i]
                    } else {
                        token_asteriscos+="*"
                    }
                }
                
                tok.textContent = token_asteriscos
                nombre.textContent = json_tokens[key].nombre

                const copiar = document.createElement("img")
                copiar.classList.add("copiar")
                copiar.src = "img/copy.png"
                copiar.id = "key"+contador.toString()

                const borrar = document.createElement("img")
                borrar.classList.add("borrar")
                borrar.src = "img/delete.png"
                borrar.id = "key"+contador.toString()

                tok.appendChild(key_ocultado)
                tok.appendChild(borrar)
                tok.appendChild(copiar)
                div.appendChild(nombre)
                div.appendChild(tok)
    
                mensajes_tokens.appendChild(div)
                contador++

                copiar.addEventListener("click", function() {
                    const elemento = "p.token_key_ocultado#"+copiar.id
                    const sel = document.querySelector(elemento)
                    const texto = sel.textContent
                    navigator.clipboard.writeText(texto)
                        .then(() => {
                            console.log("Texto copiado al portapapeles correctamente:", texto)
                        })
                        .catch(err => {
                            console.error("Error al copiar texto al portapapeles:", err)
                        })
                });
                borrar.addEventListener("click", function() {
                    const elemento = "p.token_key_ocultado#"+borrar.id
                    const sel = document.querySelector(elemento)
                    const texto = sel.textContent

                    fetch("http://localhost:3000/borrar_token",{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            key: texto
                        })
                    })
                    const div = document.querySelector("div#"+borrar.id)
                    div.remove()
                    if(mensajes_tokens.children.length===0){
                        console.log("Hola")
                        no_tokens()
                    }
                })
            })
        }
        else{
            no_tokens()
        }
        span_tokens.style.display = "block"
    }else{
        mensajes.textContent = error
        cambiar_span.style.display = "block"
        if(error=="Contraseña cambiada correctamente"){
            confirmar.style.display = "none"
            const elementos = formulario.querySelectorAll("input")
            elementos.forEach(element => {
                element.style.display = "none"
                element.value=""
            });
        }
    }
}
cambiar.addEventListener('click', () => {
    cambiar_span.style.display = "block"
    formulario.style.display = "block"
    mensajes.textContent = ""
    confirmar.style.display = "block"
    const elementos = formulario.querySelectorAll("input")
    elementos.forEach(element => {
        element.value = ""
        element.style.display = "block"
    });
})
token.addEventListener('click', () => {
    setTimeout(function() {
        span_tokens.style.display = "block"
    }, 1000);
})
function no_tokens(){
    const tok = document.createElement("p")
    tok.classList.add("no_elementos")
    tok.textContent = "No hay tokens generados"
    mensajes_tokens.appendChild(tok)
}