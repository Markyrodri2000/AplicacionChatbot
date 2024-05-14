from flask import Flask, request
from flask_cors import CORS

from langchain_community.llms import Ollama
from langchain_core.output_parsers import StrOutputParser
from langchain.prompts import (
    ChatPromptTemplate,
    MessagesPlaceholder
)
from langchain.memory import ChatMessageHistory
from langchain_community.document_loaders import WebBaseLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import OllamaEmbeddings
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_community.vectorstores import FAISS
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableBranch
from langchain_core.messages.base import messages_to_dict
from langchain_core.messages.utils import messages_from_dict

import json
import copy

from googletrans import Translator

class Aplicacion:

    def __init__(self):
        self.chats = {}
        self.crear_modelo("0", "llama2", "Eres un asistente servicial. Por favor responda las consultas de los usuarios.", 0.5, "es", "")

    """def cargar_llama2(self):
        login(token = "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")
        model = "meta-llama/Llama-2-7b-chat-hf" 
        tokenizer = AutoTokenizer.from_pretrained(model,use_auth_token=True)
        pipeline = transformers.pipeline(
            "text-generation",
            model=model,
            tokenizer=tokenizer,
            torch_dtype=torch.bfloat16,
            device_map="auto",
            max_new_tokens=150,
            min_new_tokens=-1,
            temperature=0.75,
            do_sample=True,
            top_k=30,
            num_return_sequences=1,
            eos_token_id=tokenizer.eos_token_id
        )
        llm=HuggingFacePipeline(pipeline=pipeline,model_kwargs={'temperature':0})

        return llm
    """

    def verificar_enlace(link):
        try:
            # Realizar una solicitud GET al enlace
            response = request.get(link)
            
            # Comprobar si la solicitud fue exitosa (código de estado 200)
            if response.status_code == 200:
                return True
            else:
                return False
        except Exception as e:
            # Capturar cualquier excepción que pueda ocurrir durante la solicitud
            print(f"Error al verificar el enlace: {e}")
            return False
    

    def simpleChatbot(self,promp):

        prompt = ChatPromptTemplate.from_messages(
            [
                ("system",promp),
                MessagesPlaceholder(variable_name="messages"),
            ]
        )
        chain = prompt | self.llm
        return chain

    def retrieverChatbot(self,link,instrucciones):
        print(link)
        loader = WebBaseLoader(link)
        data = loader.load() 
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=20)
        all_splits = text_splitter.split_documents(data)
        db = FAISS.from_documents(documents=all_splits, embedding=OllamaEmbeddings(base_url="http://ollama:11434"))
        retriever = db.as_retriever()
        
        query_transform_prompt = ChatPromptTemplate.from_messages(
            [
                MessagesPlaceholder(variable_name="messages"),
                (
                    "user",
                    "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation. Only respond with the query, nothing else.",
                ),
            ]
        )
        
        query_transforming_retriever_chain = RunnableBranch(
            (
                lambda x: len(x.get("messages", [])) == 1,
                (lambda x: x["messages"][-1].content) | retriever,
            ),
            query_transform_prompt | self.llm | StrOutputParser() | retriever,
        ).with_config(run_name="chat_retriever_chain")

        promp = instrucciones + """

            <context>
            {context}
            <context>
        """

        prompt = ChatPromptTemplate.from_messages(
            [
                ("system", promp),
                MessagesPlaceholder(variable_name="messages"),
            ]
        )

        document_chain = create_stuff_documents_chain(self.llm, prompt)

        self.chain = RunnablePassthrough.assign(
            context=query_transforming_retriever_chain,
        ).assign(
            answer=document_chain,
        )

    def borrar(self,id):
        self.chats.pop(id)
        print(self.chats)
        return "Borrado"
    
    def restablecer_chat(self,id):
        self.chats[id]["mensajes"] = ChatMessageHistory()

        self.abierto(id)
        return "Restablecido"
    
    def abierto(self,id):
        self.chats["0"] = copy.deepcopy(self.chats[id])

        print(id)
        print(self.chats["0"]["mensajes"])
        print(self.chats["0"]["prompt"])
        return "Abierto"
    
    def set_id(self,id):
        self.chats[id] = copy.deepcopy(self.chats["0"])

        print(self.chats)
        return "Creado"

    def crear_modelo(self, id, modelo, prompt, temperatura, idioma, link):

        if(self.chats.get(id) is None):
            mensajes = ChatMessageHistory()

            self.translator = Translator()

            promp = self.translator.translate(prompt,src=idioma,dest='en').text
            
            self.llm = Ollama(model=modelo,base_url="http://ollama:11434",temperature = str(temperatura))

            if(link == ""):
                chain = self.simpleChatbot(promp)
                simplechatbot = True

            else:
                chain = self.retrieverChatbot(link,promp)
                simplechatbot = False

            self.link = link
            
            chat = {
                "chain": chain,
                "mensajes": mensajes,
                "idioma": idioma,
                "simple": simplechatbot,
                "temperatura": temperatura,
                "prompt": prompt,
                "modelo": modelo 
            }

            self.chats[id] = chat

        else:
            self.llm = Ollama(model=modelo,base_url="http://ollama:11434",temperature = str(temperatura))
            promp = self.translator.translate(prompt,dest='en').text
            print(promp)
            chain = self.simpleChatbot(promp)
            self.chats["0"]["modelo"] = modelo
            self.chats["0"]["chain"] = chain
            self.chats["0"]["idioma"] = idioma
            self.chats["0"]["temperatura"] = temperatura
            self.chats["0"]["prompt"] = prompt
            
        print(self.chats)

        return "Creado"

    def responder(self,mensaje):
        
        mis = self.translator.translate(mensaje,dest='en').text

        self.chats["0"]["mensajes"].add_user_message(mis)

        response = self.chats["0"]["chain"].invoke({"messages": self.chats["0"]["mensajes"].messages})

        if(self.chats["0"]["simple"] == False):
            response = response['answer']

        self.chats["0"]["mensajes"].add_ai_message(response)

        print(self.chats["0"]["mensajes"].messages)
        print(self.translator.translate(response,src='en',dest=self.chats["0"]["idioma"]).text)

        return self.translator.translate(response,src='en',dest=self.chats["0"]["idioma"]).text

    def get_chat_history(self,id):
        id = str(id)
        print(self.chats)
        if(self.chats.get(id) is not None):
            mensajes = {}
            for i in range(len(self.chats[id]["mensajes"].messages)):
                mensaje = self.chats[id]["mensajes"].messages[i].content
                mensajes["mensajes"+str(i+1)] = mensaje
            
            return mensajes
        else:
            print("Chat no encontrado")
            return "Chat no encontrado"

    def crear_history(self,mensajes):
        self.mensajes = ChatMessageHistory()
        par = 0
        for i in mensajes:
            if par % 2 == 0:
                self.mensajes.add_user_message(mensajes[i])
            else:
                self.mensajes.add_ai_message(mensajes[i])
            par = par + 1

        return "Creado"
        
modelo = Aplicacion()

app = Flask(__name__)
CORS(app)

@app.route('/responder', methods=['POST'])
def post_data():
    mensaje = request.json['mensaje']
    
    respuesta = modelo.responder(mensaje)

    return respuesta

@app.route('/entrenar', methods=['POST'])
def post_data_2():
    temperatura = request.json['temperatura']
    nombre_modelo = request.json['modelo']
    prompt = request.json['prompt']
    idioma = request.json['idioma']
    link = request.json['link']
    id = request.json['id']

    res = modelo.crear_modelo(id,nombre_modelo, prompt, temperatura, idioma, link)

    return res

@app.route('/mensajes', methods=['POST'])
def post_data_3():
    id = request.json['id']
    return modelo.get_chat_history(id)

@app.route('/set_mensajes', methods=['POST'])
def post_data_4():
    req = request.json
    
    return modelo.crear_history(req)

@app.route('/set_id', methods=['POST'])
def post_data_5():
    id = request.json['id']
    return modelo.set_id(id)

@app.route('/abierto', methods=['POST'])
def post_data_6():
    id = request.json['id']
    return modelo.abierto(id)

@app.route('/borrar', methods=['POST'])
def post_data_7():
    id = request.json['id']
    return modelo.borrar(id)

@app.route('/restablecer_chat', methods=['POST'])
def post_data_8():
    id = request.json['id']
    return modelo.restablecer_chat(id)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)