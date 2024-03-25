from langchain import HuggingFacePipeline,LLMChain, PromptTemplate
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

def config():
    model_id = "gpt2-medium"
    tokenizer = AutoTokenizer.from_pretrained(model_id)
    model = AutoModelForCausalLM.from_pretrained(model_id)

    pipe = pipeline(
        "text-generation", 
        model=model, 
        tokenizer=tokenizer, 
        max_length=100
    )

    chat = HuggingFacePipeline(pipeline = pipe)
    template = """Question: {question}

    Answer: Let's think step by step."""
    
    prompt = PromptTemplate(template=template, input_variables=["question"])
    llm_chain = LLMChain(prompt=prompt, llm=chat)
    return llm_chain