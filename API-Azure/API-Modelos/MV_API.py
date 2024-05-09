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

from googletrans import Translator

class Aplicacion:

    def __init__(self):
        self.mensajes = ChatMessageHistory()
        self.crear_modelo("llama2","Eres un asistente servicial. Por favor responda las consultas de los usuarios.",0.5,"es","")

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
        
        self.chain = prompt | self.llm

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

    def crear_modelo(self,modelo, prompt, temperatura, idioma, link):

        self.idioma = idioma

        self.translator = Translator()

        promp = self.translator.translate(prompt,src=self.idioma,dest='en').text
        
        self.llm = Ollama(model=modelo,base_url="http://ollama:11434",temperature = str(temperatura))

        if(link == ""):
            self.simpleChatbot(promp)
            self.simplechatbot = True

        else:
            self.retrieverChatbot(link,promp)
            self.simplechatbot = False

        self.link = link

        return "Creado"

    def responder(self,mensaje):

        mis = self.translator.translate(mensaje,src=self.idioma,dest='en').text

        self.mensajes.add_user_message(mis)

        response = self.chain.invoke({"messages": self.mensajes.messages})

        if(self.simplechatbot == False):
            response = response['answer']

        self.mensajes.add_ai_message(response)

        return self.translator.translate(response,src='en',dest=self.idioma).text

    def get_chat_history(self):
        mensajes = {}
        for i in range(len(self.mensajes.messages)):
            mensaje = self.mensajes.messages[i].content
            mensajes["mensajes"+str(i+1)] = mensaje
        
        return mensajes

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

    res = modelo.crear_modelo(nombre_modelo, prompt, temperatura, idioma, link)

    return res

@app.route('/mensajes', methods=['GET'])
def post_data_3():
    return modelo.get_chat_history()

@app.route('/set_mensajes', methods=['POST'])
def post_data_4():
    req = request.json
    
    return modelo.crear_history(req)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)