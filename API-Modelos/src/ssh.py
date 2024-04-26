
import paramiko

HOSTNAME = '52.143.134.115'
USERNAME = 'azureuser'
PORT= 50000
fingerpoint = "SHA256:t+hHcZ9Tym7g6bLwbnR8wak4k+E40MLqxgbfBpuUPr0"
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.RejectPolicy())

try:
    ssh.connect(HOSTNAME, username=USERNAME, port=PORT)
except paramiko.ssh_exception.SSHException as e:
    print("La huella digital del servidor no coincide.")
    print("Por favor, verifica la huella digital manualmente y vuelve a intentarlo.")
    raise e

ssh.connect(HOSTNAME, username=USERNAME, port=PORT)

comando = 'ls'

stdin, stdout, stderr = ssh.exec_command(comando)

print(stdout)
 