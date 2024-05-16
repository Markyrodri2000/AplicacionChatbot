from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import paramiko

app = Flask(__name__)
CORS(app)

HOSTNAME = '52.143.134.115'
USERNAME = 'azureuser'
PORT = 50000
def COMMAND_POST(mensaje,id):
    return f"""curl -X POST \
-H "Content-Type: application/json" \
-d '{{"mensaje":"{mensaje}","id":"{id}"}}' \
http://localhost:8000/responder"""

def ENTRENAR(objeto):
    return f"""curl -X POST \
-H "Content-Type: application/json" \
-d '{objeto}' \
http://localhost:8000/entrenar"""

def MENSAJES(id):
    return f"""curl -X POST \
-H "Content-Type: application/json" \
-d '{{"id":"{id}"}}' \
http://localhost:8000/mensajes"""

def SET_ID(id,id_antiguo):
    return f"""curl -X POST \
-H "Content-Type: application/json" \
-d '{{"id":"{id}","id_antiguo":"{id_antiguo}"}}' \
http://localhost:8000/set_id"""

def ABIERTO(id):
    return f"""curl -X POST \
-H "Content-Type: application/json" \
-d '{{"id":"{id}"}}' \
http://localhost:8000/abierto"""

def BORRAR(id):
    return f"""curl -X POST \
-H "Content-Type: application/json" \
-d '{{"id":"{id}"}}' \
http://localhost:8000/borrar"""

def RESTABLECER_CHAT(id):
    return f"""curl -X POST \
-H "Content-Type: application/json" \
-d '{{"id":"{id}"}}' \
http://localhost:8000/restablecer_chat"""



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
    id = request.json['id']
    
    respuesta = ssh.instrucciones(COMMAND_POST(mensaje,id))

    return jsonify({"mensaje": respuesta})

@app.route('/entrenar', methods=['POST'])
def post_data_2():
    req = request.json
    
    respuesta = ssh.instrucciones(ENTRENAR(json.dumps(req)))

    return jsonify({"mensaje": respuesta})

@app.route('/get_mensajes', methods=['POST'])
def post_data_3():
    id = request.json['id']
    return ssh.instrucciones(MENSAJES(id))


@app.route('/set_id', methods=['POST'])
def post_data_5():
    id = request.json['id']
    id_antiguo = request.json['id_antiguo']
    return ssh.instrucciones(SET_ID(id,id_antiguo))

@app.route('/abierto', methods=['POST'])
def post_data_6():
    id = request.json['id']
    return ssh.instrucciones(ABIERTO(id))

@app.route('/borrar', methods=['POST'])
def post_data_7():
    id = request.json['id']
    return ssh.instrucciones(BORRAR(id))

@app.route('/restablecer_chat', methods=['POST'])
def post_data_8():
    id = request.json['id']
    return ssh.instrucciones(RESTABLECER_CHAT(id))

def shutdown_session(exception=None):
    ssh.terminar_conexion()
    print("La aplicación Flask se ha cerrado.")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)