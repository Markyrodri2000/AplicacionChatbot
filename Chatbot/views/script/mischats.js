const json_chats = JSON.parse(chats)
if(json_chats.length>0){
    Object.keys(json_chats).forEach(key => {
        const inp = document.createElement("input")
        inp.type = "text"
        inp.name = "bot"
        inp.value = json_chats[key].nombre
        inp.readOnly = true
        const mis_chat = document.querySelector("#MisChats #chats")
        mis_chat.appendChild(inp)
        inp.addEventListener('mouseover',() => {
            inp.style.backgroundColor = "#d3b378"
            inp.style.cursor = "pointer"
            inp.addEventListener('mouseleave', () => {
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