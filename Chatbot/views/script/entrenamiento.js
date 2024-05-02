const slider = document.getElementById("miSlider")
const sliderValue = document.getElementById("sliderValue")

slider.addEventListener("input", () => {
    sliderValue.textContent = slider.value
})

var idioma = document.getElementById("desplegable_idioma")
var selectedOptionidioma = null
var selectedValueidioma = null

idioma.addEventListener("change", function() {
    selectedOptionidioma = selectElement.options[selectElement.selectedIndex]
    selectedValueidioma = selectedOption.value
});

var modelo = document.getElementById("desplegable_modelo");
var selectedOptionmodelo = null
var selectedValuemodelo = null
modelo.addEventListener("change", function() {
    selectedOptionmodelo = selectElement.options[selectElement.selectedIndex]
    selectedValuemodelo = selectedOption.value
});

const entrenamiento = document.querySelector(".train");
entrenamiento.addEventListener("click",() => {
    const progressbar = document.querySelector(".progressbar")
    progressbar.style.display="block"
    
    const temperatura = document.querySelector(".miSlider").value
    const prompt = document.querySelector(".descripcion").textContent
    const idioma = selectedValueidioma
    const modelo = selectedValuemodelo
    const link = document.querySelector(".link").value

    fetch("http://localhost:8000/entrenar",{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                temperatura: temperatura,
                prompt: prompt,
                idioma: idioma,
                modelo: modelo,
                link: link,
            }
        )
    })
})