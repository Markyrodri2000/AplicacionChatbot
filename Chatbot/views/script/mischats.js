const json_chats = JSON.parse(chats)
if(json_chats.length>0){
    Object.keys(json_chats).forEach(key => {
        
        const span = document.createElement("span")
        span.classList.add("info_chats")
        span.id = "Chatbot"+key

        const tit = document.createElement("h3")
        tit.textContent = "Información modelo"

        const input_modelo = document.createElement("input")
        input_modelo.readOnly = true
        input_modelo.style.type = "text"
        input_modelo.classList.add("modelo")
        input_modelo.value = json_chats[key].modelo

        const input_temperatura = document.createElement("input")
        input_temperatura.readOnly = true
        input_temperatura.style.type = "text"
        input_temperatura.classList.add("temperatura")
        input_temperatura.value = json_chats[key].temperatura

        const input_idioma = document.createElement("input")
        input_idioma.readOnly = true
        input_idioma.style.type = "text"
        input_idioma.classList.add("idioma")
        input_idioma.value = json_chats[key].idioma

        const input_prompt = document.createElement("textarea")
        input_prompt.readOnly = true
        input_prompt.classList.add("prompt")
        input_prompt.textContent = json_chats[key].prompt

        const cerrar = document.createElement("button")
        cerrar.classList.add("cerrar")
        cerrar.textContent = "Cerrar"

        span.appendChild(tit)
        span.appendChild(input_modelo)
        span.appendChild(input_temperatura)
        span.appendChild(input_prompt)
        span.appendChild(input_idioma)

        let linkTexts = json_chats[key].links.split(',')
        if(linkTexts[0] !== ''){
            linkTexts.forEach(link => {
                const input_link = document.createElement("input")
                input_link.readOnly = true
                input_link.style.type = "text"
                input_link.classList.add("link")
                input_link.value = link
                span.appendChild(input_link)
            })   
        }

        span.appendChild(cerrar)

        const chats = document.querySelector("#MisChats")
        chats.appendChild(span)
        

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

        const info = document.createElement("img")
        info.classList.add("info")
        info.src = "../img/info.png"
        info.id = json_chats[key].nombre

        
        mis_chat.appendChild(inp)
        mis_chat.appendChild(borrar)
        mis_chat.appendChild(editar)
        mis_chat.appendChild(info)

        cerrar.addEventListener("click", function() {
            span.style.display = "none"
        })
        info.addEventListener("click",function() {
            span.style.display = "block"
        })

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
                fetch("http://localhost:8000/borrar",{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            id:sessionStorage.getItem(data.nombre+"Contador")
                        }
                    )
                })
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
                sessionStorage.setItem(data.nombre+"Contador",data.id)
                console.log(data.links)
                sessionStorage.setItem(data.nombre+"Links",data.links)

                fetch("http://localhost:8000/abierto",{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            id:sessionStorage.getItem(data.nombre+"Contador")
                        }
                    )
                })
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