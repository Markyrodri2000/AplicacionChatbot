import torch
import transformers
from transformers import AutoTokenizer, AutoModelForCausalLM
from langchain import HuggingFacePipeline
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferMemory

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
    
API = Aplicacion()