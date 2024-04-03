const json_chats = JSON.parse(chats)
if(json_chats.length>0){
    Object.keys(json_chats).forEach(key => {
        const inp = document.createElement("input")
        inp.type = "text"
        inp.name = "bot"
        inp.value = json_chats[key].nombre
        inp.readOnly = true
        const mis_chat = document.querySelector("#MisChats #chats")

        const borrar = document.createElement("img")
        borrar.classList.add("borrar")
        borrar.src = "../img/delete.png"
        borrar.id = json_chats[key].nombre

        const editar = document.createElement("img")
        editar.classList.add("editar")
        editar.src = "../img/edit.png"
        editar.id = json_chats[key].nombre
        
        mis_chat.appendChild(inp)
        mis_chat.appendChild(borrar)
        mis_chat.appendChild(editar)

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

        inp.addEventListener('mouseover',() => {
            inp.style.backgroundColor = "#d3b378"
            inp.style.cursor = "auto"
            inp.addEventListener('mouseleave', () => {
                inp.style.backgroundColor = ""
            })
        })

        editar.addEventListener('mouseover',() => {
            inp.style.backgroundColor = "#d3b378"
            editar.style.cursor = "pointer"
            editar.addEventListener('mouseleave', () => {
                inp.style.backgroundColor = ""
            })
        })

        borrar.addEventListener('mouseover',() => {
            inp.style.backgroundColor = "#d3b378"
            borrar.style.cursor = "pointer"
            borrar.addEventListener('mouseleave', () => {
                inp.style.backgroundColor = ""
            })
        })
    })
}
else{
    const inp = document.createElement("p")
    inp.textContent = "No hay chats guardados"
    inp.classList.add("no_chats_guardados")
    const mis_chat = document.querySelector("#MisChats #chats")
    mis_chat.appendChild(inp)
}