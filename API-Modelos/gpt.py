import torch
import transformers
from transformers import AutoTokenizer, AutoModelForCausalLM
from langchain import HuggingFacePipeline
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

model = "meta-llama/Llama-2-7b-chat-hf"
tokenizer = AutoTokenizer.from_pretrained(model,use_auth_token=True)

pipeline = transformers.pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    torch_dtype=torch.bfloat16,
    device_map="auto",
    max_new_tokens=512,
    min_new_tokens=-1,
    temperature=0.75,
    do_sample=True,
    top_k=30,
    num_return_sequences=1,
    eos_token_id=tokenizer.eos_token_id
)
llm=HuggingFacePipeline(pipeline=pipeline,model_kwargs={'temperature':0})

B_INST, E_INST = "[INST]", "[/INST]"
B_SYS, E_SYS = "<<SYS>>\n","\n<<SYS>>\n\n"

DEFAULT_SYSTEM_PROMPT="""\
You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe. Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature.

If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.
"""
instruction = "Who won the T20 Cricket World Cup 2022"
SYSTEM_PROMPT = B_SYS + DEFAULT_SYSTEM_PROMPT + E_SYS
template = B_INST + SYSTEM_PROMPT + instruction + E_INST

prompt = PromptTemplate(input_variables=["text"], template=template)
text = "How are you"
LLM_Chain=LLMChain(llm=llm, prompt=prompt)
LLM_Chain.run(text)

