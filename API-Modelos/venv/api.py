from flask import Flask, request, jsonify
app = Flask(__name__)
from gpt import respuesta

@app.route('/', methods=['POST'])
def post_data():
    datos = request.json

    if 'nombre' in datos:
        if datos['mensaje']=="Bienvenida":
            res = "Hola,"+datos['nombre']+" ,soy Nistrica, tu asistente virtual. ¿En qué puedo ayudarte?"
        else:
            res = respuesta(datos['mensaje']+"Respondo dede la api")
    else:
        res="No se ha enviado ningún dato"
    return jsonify({"mensaje": res})

@app.route('/', methods=['GET'])
def get_data():
    return "Hello World!"

if __name__ == '__main__':
    app.run(host='localhost', port=8000, debug=True)