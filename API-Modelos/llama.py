import requests

def responder(pregunta):
    res = requests.post("https://api.together.xyz/inference", json={
        "model": "togethercomputer/llama-2-70b-chat",
        "max_tokens": 512,
        "prompt": "[INST] " + pregunta + " [/INST]",
        "request_type": "language-model-inference",
        "temperature": 0.7,
        "top_p": 0.7,
        "top_k": 50,
        "repetition_penalty": 1,
        "stop": [
            "[INST]"
        ],
        "safety_model": "",
        "repetitive_penalty": 1
    }, headers={
        "Authorization": "Bearer " + "09b87efdb5c26d7c3a0c1f8d213c0613e7bc0ba41fbf1c4d37e4f40db43b9cce"
    })

    response = res.json()["output"]["choices"][0]["text"]
    return response
