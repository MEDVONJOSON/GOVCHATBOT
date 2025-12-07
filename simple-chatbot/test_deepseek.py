import urllib.request
import json
import os
import sys

def test_deepseek():
    api_key = os.environ.get("DeepSeek_API_KEY")
    if not api_key:
        print("Error: DeepSeek_API_KEY not found in environment")
        return

    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
        "HTTP-Referer": "https://govchat-sierraleone.gov.sl",
        "X-Title": "Sierra Leone Truth Engine"
    }
    
    data = {
        "model": "deepseek/deepseek-chat",
        "messages": [
            {"role": "user", "content": "Hello, are you working?"}
        ]
    }
    
    print(f"Testing DeepSeek API with key: {api_key[:5]}...")
    
    try:
        req = urllib.request.Request(url, json.dumps(data).encode('utf-8'), headers)
        with urllib.request.urlopen(req, timeout=30) as response:
            result = json.loads(response.read().decode('utf-8'))
            print("Success!")
            print(json.dumps(result, indent=2))
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code}")
        print(e.read().decode('utf-8'))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Load env vars from .env file manually since we're running a script
    try:
        with open(".env", "r") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, value = line.split("=", 1)
                    os.environ[key] = value
    except:
        pass
        
    test_deepseek()
