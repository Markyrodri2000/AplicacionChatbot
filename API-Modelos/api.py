from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import paramiko

app = Flask(__name__)
CORS(app)

HOSTNAME = '52.143.134.115'
USERNAME = 'azureuser'
PORT = 50000
def COMMAND_POST(mensaje):
    return f"""curl -X POST \
-H "Content-Type: application/json" \
-d '{{"mensaje":"{mensaje}"}}' \
http://localhost:8000/responder"""

def ENTRENAR(objeto):
    return f"""curl -X POST \
-H "Content-Type: application/json" \
-d '{objeto}' \
http://localhost:8000/entrenar"""

def MENSAJES():
    return f"""curl http://localhost:8000/mensajes"""

def SET_MENSAJES(mensajes):
    return f"""curl -X POST \
-H "Content-Type: application/json" \
-d '{mensajes}' \
http://localhost:8000/set_mensajes"""

KEY = "./id_rsa"

class SSH:
    def __init__(self):

        self.ssh = paramiko.SSHClient()
        self.ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        self.ssh.connect(HOSTNAME, username=USERNAME, port=PORT, key_filename=KEY)
        print("Conexión SSH establecida correctamente...")

    def instrucciones(self, comando):
        stdin, stdout1, stderr = self.ssh.exec_command(comando)
        respuesta = stdout1.read().decode("utf-8")
        if stdout1.channel.recv_exit_status() == 0:
            return respuesta
        else:
            print("Respuesta no generada correctamente")
            return "Error"

    def terminar_conexion(self):
        print("Conexión SSH cerrada correctamente...")
        self.ssh.close()

ssh = SSH()

@app.route('/', methods=['POST'])
def post_data():
    mensaje = request.json['mensaje']
    
    respuesta = ssh.instrucciones(COMMAND_POST(mensaje))

    return jsonify({"mensaje": respuesta})

@app.route('/entrenar', methods=['POST'])
def post_data_2():
    req = request.json
    
    respuesta = ssh.instrucciones(ENTRENAR(json.dumps(req)))

    return jsonify({"mensaje": respuesta})

@app.route('/get_mensajes', methods=['GET'])
def post_data_3():
    return ssh.instrucciones(MENSAJES())

@app.route('/set_mensajes', methods=['POST'])
def post_data_4():
    mensajes = request.json['mensajes']

    respuesta = ssh.instrucciones(SET_MENSAJES(mensajes))

    return jsonify({"mensaje": respuesta})

def shutdown_session(exception=None):
    ssh.terminar_conexion()
    print("La aplicación Flask se ha cerrado.")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)