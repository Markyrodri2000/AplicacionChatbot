from flask import Flask, request, jsonify
from flask_cors import CORS
from Aplicacion import API

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST'])
def post_data():
    datos = request.json
    mensaje = API.run(user_input="Capital de españa?")
    
    return jsonify({"mensaje": mensaje})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)