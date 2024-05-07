const slider = document.getElementById("miSlider")
const sliderValue = document.getElementById("sliderValue")

slider.addEventListener("input", () => {
    sliderValue.textContent = slider.value
})

var idioma = document.getElementById("desplegable_idioma")
var selectedOptionidioma = null
var selectedValueidioma = "es"

idioma.addEventListener("change", function() {
    selectedOptionidioma = idioma.options[idioma.selectedIndex]
    selectedValueidioma = selectedOptionidioma.value
});

var modelo = document.getElementById("desplegable_modelo");
var selectedOptionmodelo = null
var selectedValuemodelo = "llama2"

modelo.addEventListener("change", function() {
    selectedOptionmodelo = modelo.options[modelo.selectedIndex]
    selectedValuemodelo = selectedOptionmodelo.value
    console.log("Opción seleccionada:", selectedValuemodelo);
})

const entrenamiento = document.querySelector(".train");
entrenamiento.addEventListener("click",() => {
    const progressbar = document.querySelector(".progressbar")
    progressbar.style.display="block"
    document.addEventListener('click', bloquearClick, true);
    document.addEventListener('keydown', bloquearTeclado, true);
    
    temperatura = document.querySelector(".miSlider").value
    promptt = document.querySelector(".descripcion").value
    if(promptt == ""){
        promptt = "You are a helpful assistant. Please response to the user queries"
    }
    link = document.querySelector(".link").value

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
                link: link,
            }
        )
    })
    .then(response => {
        response.json()
    })
    .then(data => {
        progressbar.style.display="none"
        document.removeEventListener('click', bloquearClick, true);
        document.removeEventListener('keydown', bloquearTeclado, true);
    })
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
    document.querySelector(".descripcion").value = "You are a helpful assistant. Please response to the user queries"
    idioma.selectedIndex = 0
    modelo.selectedIndex = 0
    document.querySelector(".link").value = ""
})