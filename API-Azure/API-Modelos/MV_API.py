from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import transformers
from langchain_community.llms import Ollama
from huggingface_hub import login
from transformers import AutoTokenizer
from langchain import HuggingFacePipeline
from langchain.chains import ConversationChain
from langchain_core.output_parsers import StrOutputParser
from langchain.chains.conversation.memory import ConversationBufferWindowMemory
from langchain_core.messages.ai import AIMessage
from langchain_core.messages.human import HumanMessage
from langchain.prompts import (
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
    ChatPromptTemplate,
    MessagesPlaceholder
)
from langchain.memory import ChatMessageHistory

from googletrans import Translator

class Aplicacion:

    def __init__(self):
        self.crear_modelo()

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
    def crear_modelo(self):
        
        self.llm = Ollama(model="llama2")

        prompt = ChatPromptTemplate.from_messages(
            [
                ("system","You are a helpful assistant. Please response to the user queries"),
                MessagesPlaceholder(variable_name="messages"),
            ]
        )

        self.mensajes = ChatMessageHistory()

        self.chain = prompt | self.llm

        #Traductor

        self.translator = Translator()

    def responder(self,mensaje):

        mis = self.translator.translate(mensaje,src='en',dest='es').text

        self.mensajes.add_user_message(mis)

        response = self.chain.invoke({"messages": self.mensajes.messages})

        return self.translator.translate(response,src='en',dest='es').text


modelo = Aplicacion()

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST'])
def post_data():
    mensaje = request.json['mensaje']
    
    respuesta = modelo.responder(mensaje)

    return respuesta
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)