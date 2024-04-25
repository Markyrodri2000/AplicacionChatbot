from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import transformers
from transformers import AutoTokenizer, AutoModelForCausalLM
from langchain import HuggingFacePipeline
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferMemory

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST'])
def post_data():
    datos = request.json
    mensaje = ai.run(user_input="Capital de españa?")
    
    return jsonify({"mensaje": mensaje})

class Aplicacion:
    def __init__(self):
        model = "meta-llama/Llama-2-7b-chat-hf" 
        tokenizer = AutoTokenizer.from_pretrained(model,use_auth_token=True)
        pipeline = transformers.pipeline(
            "text-generation",
            model=model,
            tokenizer=tokenizer,
            torch_dtype=torch.bfloat16,
            device_map="auto",
            max_new_tokens=25,
            min_new_tokens=-1,
            temperature=0.75,
            do_sample=True,
            top_k=30,
            num_return_sequences=1,
            eos_token_id=tokenizer.eos_token_id
        )
        llm=HuggingFacePipeline(pipeline=pipeline,model_kwargs={'temperature':0})

        instruction = "Chat history: \n\n{chat_history} \n User:\n {user_input}"
        B_INST, E_INST = "[INST]", "[/INST]"
        B_SYS, E_SYS = "<<SYS>>\n","\n<<SYS>>\n\n"
        Custom_SYSTEM_PROMPT = """\
        You are a helpful assistant, you always anoly answer for the assistant then you stop. read the chat history to get context. Answer always in spanish.
        """
        System_Prompt = B_SYS + Custom_SYSTEM_PROMPT + E_SYS
        template = B_INST + System_Prompt+instruction+ E_INST

        prompt = PromptTemplate(input_variables=["chat_history","user_input"], template=template)
        memory = ConversationBufferMemory(memory_key="chat_history")
        chain=LLMChain(llm=llm, prompt=prompt, memory=memory, verbose=True)
        return chain
    
if __name__ == '__main__':
    ai = Aplicacion()
    app.run(host='0.0.0.0', port=8000, debug=True)