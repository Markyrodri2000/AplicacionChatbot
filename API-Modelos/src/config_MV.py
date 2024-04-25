import paramiko

hostname = 'dirección_IP_de_tu_máquina_virtual'
username = 'tu_usuario_ssh'
password = 'tu_contraseña'
script_path = '/ruta/al/script/remoto.py'
parametros = ['parametro1', 'parametro2']

def ejecutar_script_remoto(hostname, username, password, script_path, parametros):
    # Configurar la conexión SSH
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    # Conectar a la máquina virtual
    ssh.connect(hostname, username=username, password=password)

    # Construir el comando para ejecutar el script con los parámetros
    comando = f'python {script_path} {" ".join(parametros)}'

    # Ejecutar el comando en la máquina virtual
    stdin, stdout, stderr = ssh.exec_command(comando)

    # Leer la salida del comando
    salida = stdout.read().decode('utf-8')

    # Cerrar la conexión SSH
    ssh.close()

    return salida

print('Respuesta del script remoto:')
