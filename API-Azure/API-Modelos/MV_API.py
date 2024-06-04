from flask import Flask, request
from flask_cors import CORS
import torch
from transformers import BitsAndBytesConfig
from transformers import AutoTokenizer, AutoModelForCausalLM
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    TrainingArguments,
    pipeline,
    logging,
)
from peft import (
    LoraConfig,
    PeftConfig,
    get_peft_model,
    prepare_model_for_kbit_training,
)
from datasets import load_dataset
from huggingface_hub import login
from trl import SFTTrainer
from langchain_community.llms import Ollama
#from langchain_experimental.llms.ollama_functions import OllamaFunctions
from langchain_core.output_parsers import StrOutputParser
from langchain.prompts import (
    ChatPromptTemplate,
    MessagesPlaceholder
)
from langchain.memory import ChatMessageHistory
from langchain_community.document_loaders import WebBaseLoader
from langchain_community.document_loaders.recursive_url_loader import RecursiveUrlLoader
from langchain_community.document_loaders import UnstructuredURLLoader
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
        self.crear_modelo("0", "llama2", "Eres un asistente servicial. Por favor responda las consultas de los usuarios.", 0.5, "es", "", False,"")

    def simpleChatbot(self,promp):

        prompt = ChatPromptTemplate.from_messages(
            [
                ("system",promp),
                MessagesPlaceholder(variable_name="messages"),
            ]
        )

        chain = prompt | self.llm
        return chain
    
    def fine_tuning(self,dataset,modelo):
        login(token = "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")
    
        """nf4_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_use_double_quant=True,
            bnb_4bit_compute_dtype=torch.bfloat16
        )
        
        SOLO ES POSIBLE CON GRÁFICA
        """
        base_model = "meta-llama/Llama-2-7b-chat-hf"

        if(modelo!="llama2"):
            if(modelo == "mistral"):
                base_model = "mistralai/Mistral-7B-v0.3"
            else:
                if(modelo == "gemma"):
                    base_model = "google/gemma-7b"

        model = AutoModelForCausalLM.from_pretrained(
            base_model
        )
        tokenizer = AutoTokenizer.from_pretrained(base_model, trust_remote_code=True)
        tokenizer.pad_token = tokenizer.eos_token
        tokenizer.padding_side = "right"

        peft_params  = LoraConfig(
            r=16,
            lora_alpha=32,
            target_modules=[
                "q_proj",
                "up_proj",
                "o_proj",
                "k_proj",
                "down_proj",
                "gate_proj",
                "v_proj"
            ],
            lora_dropout=0.05,
            bias="none",
            task_type="CAUSAL_LM"
        )


        training_arguments = TrainingArguments(
            per_device_train_batch_size=4,
            gradient_accumulation_steps=4,
            optim="paged_adamw_32bit",
            logging_steps=1,
            learning_rate=1e-4,
            fp16=True,
            max_grad_norm=0.3,
            num_train_epochs=1,
            evaluation_strategy="steps",
            eval_steps=0.2,
            warmup_ratio=0.05,
            save_strategy="epoch",
            group_by_length=True,
            output_dir="./results",
            report_to="tensorboard",
            save_safetensors=True,
            lr_scheduler_type="cosine",
            seed=42,
        )

        for i in dataset:
            data = load_dataset(i, split="train")

            trainer = SFTTrainer(
                model=model,
                train_dataset=data,
                peft_config=peft_params,
                dataset_text_field="text",
                max_seq_length=4096,
                tokenizer=tokenizer,
                args=training_arguments,
            )
            print("PREEE")
            trainer.train()
            print("ENTRENADOOO")

        return "Creado"


    def retrieverChatbot(self,link,instrucciones):
        if(len(link)>1):
            print("Unstructured")
            loader = UnstructuredURLLoader(link)
        else:
            print("Recursive")
            loader = RecursiveUrlLoader(link[0])

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

        chain = RunnablePassthrough.assign(
            context=query_transforming_retriever_chain,
        ).assign(
            answer=document_chain,
        )
        return chain

    def borrar(self,id):
        self.chats.pop(id)
        return "Borrado"
    
    def restablecer_chat(self,id):
        self.chats[id]["mensajes"] = ChatMessageHistory()

        self.abierto(id)
        return "Restablecido"
    
    def abierto(self,id):
        self.chats["0"] = copy.deepcopy(self.chats[id])
        return "Abierto"
    
    def set_id(self,id):
        self.chats[id] = copy.deepcopy(self.chats["0"])

        print(self.chats)
        return "Creado"


    def crear_modelo(self, id, modelo, prompt, temperatura, idioma, link,restablecer,dataset):

        if(self.chats.get(id) is None):
            mensajes = ChatMessageHistory()

            self.translator = Translator()

            promp = self.translator.translate(prompt,src=idioma,dest='en').text
            
            self.llm = Ollama(model=modelo,base_url="http://ollama:11434", temperature = str(temperatura))

            chain = self.simpleChatbot(promp)
            simplechatbot = True
            
            chat = {
                "chain": chain,
                "mensajes": mensajes,
                "idioma": idioma,
                "simple": simplechatbot,
                "temperatura": temperatura,
                "prompt": prompt,
                "modelo": modelo,
            }

            self.chats[id] = chat

        else:
            
            self.llm = Ollama(model=modelo,base_url="http://ollama:11434",temperature = str(temperatura))
            

            promp = self.translator.translate(prompt,dest='en').text

            if(len(dataset) > 0 and dataset[0] != ''):
                self.llm = self.fine_tuning(dataset,modelo)
                

            if(len(link) > 0 and link[0] != ''):
                chain = self.retrieverChatbot(link,promp)
                simplechatbot = False

            else:
                chain = self.simpleChatbot(promp)
                simplechatbot = True

            self.chats["0"]["modelo"] = modelo
            self.chats["0"]["chain"] = chain
            self.chats["0"]["idioma"] = idioma
            self.chats["0"]["simple"] = simplechatbot
            self.chats["0"]["temperatura"] = temperatura
            self.chats["0"]["prompt"] = prompt
            self.chats["0"]["link"] = link

            if(restablecer == True):
                self.chats["0"]["mensajes"] = ChatMessageHistory()
            
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
    dataset = request.json['dataset']
    id = request.json['id']
    restablecer = request.json['restablecer']

    res = modelo.crear_modelo(id,nombre_modelo, prompt, temperatura, idioma, link, restablecer,dataset)

    return res

@app.route('/mensajes', methods=['POST'])
def post_data_3():
    id = request.json['id']
    return modelo.get_chat_history(id)

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