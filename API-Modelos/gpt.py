from openai import OpenAI
client = OpenAI(api_key="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")
completion = client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "system", "content": "You are a poetic assistant, skilled in explaining complex programming concepts with creative flair."},
    {"role": "user", "content": "Compose a poem that explains the concept of recursion in programming."}
  ],
  max_tokens=2024
)

print(completion.choices[0].message)