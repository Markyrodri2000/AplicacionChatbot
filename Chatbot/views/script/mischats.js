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
        borrar.classList.add("borrar_chat")
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
            fetch("http://localhost:3000/borrar_chat",{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: json_chats[key].nombre
                })
            }).then(
                response => response.json()
            )
            .then( data => {
                sessionStorage.removeItem(data.nombre)
                sessionStorage.removeItem(data.nombre+"session")
                window.location.href = "http://localhost:3000/chats";
            })
        })

        inp.addEventListener('mouseover',() => {
            inp.style.backgroundColor = "#d3b378"
            inp.style.cursor = "auto"
            inp.addEventListener('mouseleave', () => {
                inp.style.backgroundColor = ""
            })
        })

        editar.addEventListener('click', () => {
            fetch("http://localhost:3000/editar_chat",{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: json_chats[key].nombre
                })
            })
            .then(
                response => response.json()
            )
            .then( data => {
                sessionStorage.setItem(data.nombre,data.codigo)
                sessionStorage.setItem(data.nombre+"Modelo",data.modelo)
                sessionStorage.setItem(data.nombre+"Temperatura",data.temperatura)
                sessionStorage.setItem(data.nombre+"Prompt",data.prompt)
                sessionStorage.setItem(data.nombre+"Idioma",data.idioma)
                sessionStorage.setItem(data.nombre+"Mensajes",data.mensajes)
                window.location.href = "http://localhost:3000/"
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