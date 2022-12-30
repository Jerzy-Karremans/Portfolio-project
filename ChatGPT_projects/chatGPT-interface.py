import http.client
import json

def askForPrompt(prompt):
    conn = http.client.HTTPSConnection("api.openai.com")
    payload = json.dumps({
    "model": "text-davinci-003",
    "prompt": f"{prompt}",
    "temperature": 0,
    "max_tokens": 2000
    })
    headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer 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'
    }
    conn.request("POST", "/v1/completions", payload, headers)
    res = conn.getresponse()
    data = res.read()
    jsonText =  json.loads(data.decode("utf-8"))
    outputText = jsonText['choices'][0]['text']

    print(outputText)

while(True):
    askForPrompt(input("me: "))