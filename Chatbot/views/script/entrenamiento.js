const slider = document.getElementById("miSlider")
const sliderValue = document.getElementById("sliderValue")

slider.addEventListener("input", () => {
    sliderValue.textContent = slider.value
})

var idioma = document.getElementById("desplegable_idioma")
var selectedOptionidioma = idioma.options[0]
var selectedValueidioma = "es"

idioma.addEventListener("change", function() {
    selectedOptionidioma = idioma.options[idioma.selectedIndex]
    selectedValueidioma = selectedOptionidioma.value
})

var modelo = document.getElementById("desplegable_modelo")
var selectedOptionmodelo = modelo.options[0]
var selectedValuemodelo = "llama2"

modelo.addEventListener("change", function() {
    selectedOptionmodelo = modelo.options[modelo.selectedIndex]
    selectedValuemodelo = selectedOptionmodelo.value
})

function train_entrenamiento(restablecer){
    const progressbar = document.querySelector(".progressbar")
    progressbar.style.display="block"
    document.addEventListener('click', bloquearClick, true)
    document.addEventListener('keydown', bloquearTeclado, true)
    
    temperatura = document.querySelector(".miSlider").value
    promptt = document.querySelector(".descripcion").value
    if(promptt == ""){
        promptt = "Eres un asistente servicial. Por favor responda las consultas de los usuarios."
    }
    link = document.querySelectorAll(".link")
    let linkTexts = Array.from(link).map(link => link.value)
    let varcharString = linkTexts.join(',')

    dataset = document.querySelectorAll(".dataset")
    let linkDataset = Array.from(dataset).map(dataset => dataset.value)
    let varcharStringData = linkDataset.join(',')
    
    fetch("http://localhost:8000/entrenar",{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                temperatura: temperatura,
                prompt: promptt,
                idioma: selectedValueidioma,
                modelo: selectedValuemodelo,
                link: linkTexts,
                dataset: linkDataset,
                id: sessionStorage.getItem(nombre+"Contador"),
                restablecer: restablecer,

            }
        )
    })
    .then(response => response.json())
    .then(data => {
        progressbar.style.display="none"
        document.removeEventListener('click', bloquearClick, true)
        document.removeEventListener('keydown', bloquearTeclado, true)
        
        if(data.mensaje == "Link Incorrecto"){
            const incorrecto = document.querySelector(".incorrecto")
            incorrecto.style.display = "block"
            setTimeout(() => {
                incorrecto.style.display = "none"
            }, 3000)
        }else{
            sessionStorage.setItem(nombre+"Modelo",selectedOptionmodelo.id)
            sessionStorage.setItem(nombre+"Idioma",selectedOptionidioma.id)
            sessionStorage.setItem(nombre+"Temperatura",temperatura)
            sessionStorage.setItem(nombre+"Prompt",promptt)
            sessionStorage.setItem(nombre+"Links",varcharString)
            sessionStorage.setItem(nombre+"Datasets",varcharStringData)
        }
    })
}
const entrenamiento = document.querySelector(".train");
entrenamiento.addEventListener("click",() => {
    train_entrenamiento(false)
})

function bloquearClick(evento) {
    evento.stopPropagation();
    evento.preventDefault();
}


function bloquearTeclado(evento) {
    evento.stopPropagation();
    evento.preventDefault();
}


const restart = document.querySelector("#restar_model").addEventListener('click',() => {
    document.querySelector(".miSlider").value = 0.5
    document.querySelector(".slidervalue").textContent = 0.5
    document.querySelector(".descripcion").value = "You are a helpful assistant. Please response to the user queries"
    idioma.selectedIndex = 0
    modelo.selectedIndex = 0
    let links = document.querySelectorAll(".link")
    links[0].value = ""
    for (let i = 1; i < links.length; i++) {
        links[i].remove();
    }

    let data = document.querySelectorAll(".dataset")
    data[0].value = ""
    for (let i = 1; i < data.length; i++) {
        data[i].remove();
    }

    train_entrenamiento(true)
})

document.addEventListener('DOMContentLoaded', (event) => {
    let selectedInput = null

    function addInputEventListener(input) {
        input.addEventListener('click', () => {
            selectedInput = input
            let inputs = document.querySelectorAll('.entrenamiento input')
            inputs.forEach(i => i.classList.remove('selected'))
            input.classList.add('selected')
        })
    }

    let inputs = document.querySelectorAll('.entrenamiento input')
    inputs.forEach(input => addInputEventListener(input))

    let deleteImg = document.querySelector('.quitarLink')
    deleteImg.addEventListener('click', () => {
        if (selectedInput) {
            selectedInput.remove()
            selectedInput = null
        } else {
            console.log('No input selected')
        }
    })

    let deleteData = document.querySelector('.quitarDataset')
    deleteData.addEventListener('click', () => {
        if (selectedInput) {
            selectedInput.remove()
            selectedInput = null
        } else {
            console.log('No input selected')
        }
    })

    let addImg = document.querySelector('.añadirLink')
    addImg.addEventListener('click', () => {
        let newInput = document.createElement('input')
        newInput.type = 'text'
        newInput.classList.add("link")
        newInput.placeholder = 'Nuevo enlace'
        document.querySelector('.links').appendChild(newInput)
        addInputEventListener(newInput)
    })

    let addDataset = document.querySelector('.añadirDataset')
    addDataset.addEventListener('click', () => {
        let newInput = document.createElement('input')
        newInput.type = 'text'
        newInput.classList.add("dataset")
        newInput.placeholder = 'Nuevo dataset'
        document.querySelector('.datasets').appendChild(newInput)
        addInputEventListener(newInput)
    })
})