from flask import Flask, request, jsonify
from flask_cors import CORS
#from chat_config import config
from together import responder

app = Flask(__name__)
CORS(app)
#modelo = config()

@app.route('/', methods=['POST'])
def post_data():
    datos = request.json
    if 'nombre' in datos and datos['nombre'] == "Marc":
        data = "Hola Marc"
    else:
        """question = datos['mensaje']
        response = modelo.run(question)
        print(response)
        print(datos['mensaje'])"""
        response = responder(datos['mensaje'])
        data = response
    
    return jsonify({"mensaje": data})

@app.route('/', methods=['GET'])
def get_data():
    data = {'message': 'Hola desde el servidor Flask!'}
    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)