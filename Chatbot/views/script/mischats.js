const json_chats = JSON.parse(chats)
if(json_chats.length>0){
    Object.keys(json_chats).forEach(key => {
        const inp = document.createElement("input")
        inp.type = "text"
        inp.name = "bot"
        inp.value = json_chats[key].nombre
        const mis_chat = document.querySelector("#MisChats #chats")
        mis_chat.appendChild(inp)
    })
}
else{
    console.log("HOLA2")
}