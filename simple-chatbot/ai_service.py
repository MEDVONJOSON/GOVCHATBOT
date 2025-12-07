import sys
import json
import random
import time
import urllib.request
import urllib.error
import os

# Load knowledge base
def load_knowledge_base():
    try:
        with open("data/knowledge_base.json", "r") as f:
            return json.load(f)
    except Exception as e:
        sys.stderr.write(f"Error loading knowledge base: {e}\n")
        return []

KNOWLEDGE_BASE = load_knowledge_base()

def retrieve_context(query):
    query_words = query.lower().split()
    relevant_info = []
    
    for item in KNOWLEDGE_BASE:
        score = 0
        for keyword in item['keywords']:
            if keyword in query.lower():
                score += 1
        
        if score > 0:
            relevant_info.append((score, item['content']))
    
    # Sort by score and take top 2
    relevant_info.sort(key=lambda x: x[0], reverse=True)
    return [info[1] for info in relevant_info[:2]]

def get_api_keys():
    keys = {
        "openai": os.environ.get("OPENAI_API_KEY"),
        "gemini": os.environ.get("GEMINI_API_KEY"),
        "deepseek": os.environ.get("DeepSeek_API_KEY")
    }
    
    # Fallback to api_key.txt if env vars are missing
    if not keys["openai"] and not keys["gemini"] and not keys["deepseek"]:
        try:
            with open("api_key.txt", "r") as f:
                lines = f.readlines()
                for line in lines:
                    line = line.strip()
                    if line.startswith("sk-"):
                        keys["openai"] = line
                    elif line.startswith("AIza"):
                        keys["gemini"] = line
        except:
            pass
    return keys

def call_deepseek(message, context, api_key):
    """Call DeepSeek R1T2 Chimera Free via OpenRouter"""
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
        "HTTP-Referer": "https://govchat-sierraleone.gov.sl",
        "X-Title": "Sierra Leone Truth Engine"
    }
    
    system_prompt = f"""You are the Sierra Leone Government's Truth Engine, an AI assistant designed to fight misinformation and help citizens.

Your role:
- Verify information against official sources
- Detect and warn about scams
- Provide accurate government information
- Be professional, helpful, and trustworthy

Context from knowledge base:
{chr(10).join(context) if context else 'No specific context available'}

Always cite official sources when possible."""
    
    data = {
        "model": "deepseek/deepseek-chat",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message}
        ],
        "temperature": 0.7,
        "max_tokens": 500
    }
    
    try:
        req = urllib.request.Request(url, json.dumps(data).encode('utf-8'), headers)
        with urllib.request.urlopen(req, timeout=30) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result['choices'][0]['message']['content']
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        sys.stderr.write(f"DeepSeek API Error: {e.code} - {error_body}\n")
        return None
    except Exception as e:
        sys.stderr.write(f"DeepSeek Error: {str(e)}\n")
        return None

def call_openai(message, context, api_key):
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    system_prompt = "You are the 'Truth Engine', an official AI assistant for the Government of Sierra Leone. Your goal is to provide accurate, verified information to citizens. Use the provided CONTEXT to answer the user's question. If the answer is in the context, cite it as 'According to official records...'. If the answer is not in the context, use your general knowledge but clarify that it is general information. Be helpful, authoritative, and neutral."
    
    user_prompt = f"Context:\n{context}\n\nUser Question: {message}"

    data = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.5
    }
    
    try:
        req = urllib.request.Request(url, json.dumps(data).encode('utf-8'), headers)
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result['choices'][0]['message']['content']
    except urllib.error.HTTPError as e:
        sys.stderr.write(f"OpenAI API Error: {e}\n")
        return None
    except Exception as e:
        sys.stderr.write(f"General API Error: {e}\n")
        return None

def call_gemini(message, context, api_key):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    
    system_prompt = "You are the 'Truth Engine', an official AI assistant for the Government of Sierra Leone. Use the provided CONTEXT to answer the user's question. If the answer is in the context, cite it. If not, provide a helpful general answer but note it is not from the specific context."
    
    full_prompt = f"{system_prompt}\n\nCONTEXT:\n{context}\n\nQUESTION: {message}"

    data = {
        "contents": [{"parts": [{"text": full_prompt}]}]
    }
    
    try:
        req = urllib.request.Request(url, json.dumps(data).encode('utf-8'), headers)
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result['candidates'][0]['content']['parts'][0]['text']
    except urllib.error.HTTPError as e:
        sys.stderr.write(f"Gemini API Error: {e}\n")
        return None
    except Exception as e:
        sys.stderr.write(f"General Gemini API Error: {e}\n")
        return None

def get_response(message, mode="chat"):
    keys = get_api_keys()
    
    # Prepend specialized context based on mode
    special_context = ""
    if mode == "research":
        special_context = "[DEEP RESEARCH MODE]: You are a specialized research assistant. Provide detailed, well-sourced, and comprehensive answers. Breakdown complex topics."
    elif mode == "thinking":
        special_context = "[THINKING MODE]: You are a logical reasoning assistant. Show your chain of thought step-by-step before providing the final answer."
    elif mode == "shopping":
        special_context = "[SHOPPING ASSISTANT]: You are a helpful shopping guide for government procurement and local Sierra Leonean businesses. Suggest prices, locations, and quality checks."
    elif mode == "image":
        # Since this script is text-only, we handle image requests by describing what would be generated
        return "I have generated an image request for: '" + message + "'. (Note: Image generation requires a connected GPU service. I am ready to link with DALL-E or Stable Diffusion API)."

    if special_context:
        message = f"{special_context}\n\nUser Query: {message}"
    
    # Retrieve relevant context
    context_list = retrieve_context(message)
    context_str = "\n".join(context_list) if context_list else "No specific official records found for this query."
    
    sys.stderr.write(f"🔍 Processing message: {message}\n")
    sys.stderr.write(f"📚 Found {len(context_list)} context items\n")
    sys.stderr.write(f"🔑 Available keys: DeepSeek={bool(keys['deepseek'])}, OpenAI={bool(keys['openai'])}, Gemini={bool(keys['gemini'])}\n")
    
    # Try DeepSeek first (R1T2 Chimera Free)
    if keys["deepseek"]:
        sys.stderr.write("🚀 Calling DeepSeek API...\n")
        response = call_deepseek(message, context_list, keys["deepseek"])
        if response:
            sys.stderr.write("✅ DeepSeek response received\n")
            return response
        else:
            sys.stderr.write("❌ DeepSeek returned None\n")
    
    # Try OpenAI as fallback
    if keys["openai"]:
        sys.stderr.write("🔄 Falling back to OpenAI...\n")
        response = call_openai(message, context_str, keys["openai"])
        if response:
            return response
            
    # Try Gemini if DeepSeek and OpenAI failed or missing
    if keys["gemini"]:
        sys.stderr.write("🔄 Falling back to Gemini...\n")
        response = call_gemini(message, context_str, keys["gemini"])
        if response:
            return response
    
    sys.stderr.write("⚠️ All APIs failed, using fallback logic\n")
    
    # Fallback to simple logic if no key or API failed
    message = message.lower()
    
    # Simulate thinking time for realism
    time.sleep(0.5)
    
    # Check local knowledge base first for exact keyword matches
    for item in KNOWLEDGE_BASE:
        for keyword in item['keywords']:
            if keyword in message:
                return f"According to official records: {item['content']} (Offline Mode)"

    if "hello" in message or "hi" in message:
        if keys["openai"] or keys["gemini"]:
            return "Hello! I'm using my backup brain right now (APIs are busy/error), but I'm still here to help!"
        return "Hello! I am your Python-powered AI assistant. How can I help you? (Add an API key to api_key.txt to talk to GPT or Gemini!)"
    elif "how are you" in message:
        return "I'm functioning perfectly! My Python logic is running smoothly."
    elif "python" in message:
        return "Yes, I am running on Python! This allows for advanced data processing and AI capabilities."
    elif "help" in message:
        return "I can help you with general questions. Try asking about 'passport', 'emergency', or 'Feed Salone'."
    elif "weather" in message:
        return "I can't check real-time weather yet, but it's always sunny in the digital world!"
    elif "joke" in message:
        jokes = [
            "Why did the Python programmer break up with the Java programmer? Because he treated her like an object.",
            "Why do programmers prefer dark mode? Because light attracts bugs.",
            "How many programmers does it take to change a light bulb? None, that's a hardware problem."
        ]
        return random.choice(jokes)
    else:
        if keys["openai"] or keys["gemini"]:
            return f"Interesting... You said '{message}'. (I'm using my local backup responses because the AI APIs returned an error.)"
        return f"Interesting... You said '{message}'. (Add an OpenAI or Gemini API Key to api_key.txt to get real AI responses!)"

def verify_information(message, image_url=None):
    keys = get_api_keys()
    context_list = retrieve_context(message)
    context_str = "\n".join(context_list) if context_list else "No specific official records found."
    
    # Use DeepSeek or OpenAI for structured verification
    api_key = keys["deepseek"] or keys["openai"]
    if not api_key:
        return json.dumps({
            "status": "unverified",
            "color": "yellow",
            "message": "AI service unavailable. Unable to verify at this time.",
            "official_source": None
        })

    # Construct prompt for JSON output
    system_prompt = """You are the Sierra Leone Government's Truth Engine. 
    Analyze the user's claim against the provided CONTEXT.
    Return ONLY a JSON object with the following format:
    {
        "status": "true" | "false" | "unverified",
        "color": "green" | "red" | "yellow",
        "message": "A short explanation (max 2 sentences).",
        "official_source": "Cite the source if available, else null"
    }
    
    Rules:
    - "true" (green): Claim matches context.
    - "false" (red): Claim contradicts context or is a known scam.
    - "unverified" (yellow): No info in context.
    """
    
    user_prompt = f"Context:\n{context_str}\n\nClaim to Verify: {message}"
    if image_url:
        user_prompt += f"\n\n[USER HAS UPLOADED AN IMAGE AS EVIDENCE: {image_url}. If this image URL is accessible, consider it. If not, assume the user believes the image supports their claim.]"
    
    # Call API (Reusing call_deepseek or call_openai logic but adapted for JSON)
    # For simplicity, we'll use a direct call pattern here or reuse existing if possible.
    # Let's create a specific call for verification to ensure JSON format.
    
    url = "https://openrouter.ai/api/v1/chat/completions" if keys["deepseek"] else "https://api.openai.com/v1/chat/completions"
    model = "deepseek/deepseek-chat" if keys["deepseek"] else "gpt-3.5-turbo"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    if keys["deepseek"]:
        headers["HTTP-Referer"] = "https://govchat-sierraleone.gov.sl"
        headers["X-Title"] = "Sierra Leone Truth Engine"

    data = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.3 # Lower temp for more deterministic JSON
    }

    try:
        req = urllib.request.Request(url, json.dumps(data).encode('utf-8'), headers)
        with urllib.request.urlopen(req, timeout=30) as response:
            result = json.loads(response.read().decode('utf-8'))
            content = result['choices'][0]['message']['content']
            
            # Clean up content to ensure it's just JSON
            content = content.strip()
            if content.startswith("```json"):
                content = content[7:-3]
            elif content.startswith("```"):
                content = content[3:-3]
            
            return content # Should be a JSON string
            
    except Exception as e:
        sys.stderr.write(f"Verification API Error: {e}\n")
        return json.dumps({
            "status": "unverified",
            "color": "yellow",
            "message": "Error connecting to verification service.",
            "official_source": None
        })

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("message", nargs="?", help="The user message")
    parser.add_argument("--verify", action="store_true", help="Verify mode")
    parser.add_argument("--mode", default="chat", help="Chat mode (chat, research, thinking, shopping, image)")
    parser.add_argument("--image_url", default=None, help="URL of uploaded image")
    
    # Handle cases where args are passed directly without flags (legacy support)
    if len(sys.argv) > 1 and not sys.argv[1].startswith("-"):
        args, unknown = parser.parse_known_args()
        if not args.message:
            args.message = sys.argv[1] # Legacy position 1
    else:
        args = parser.parse_args()

    if args.verify:
        response = verify_information(args.message, args.image_url)
        print(response)
    elif args.message:
        response = get_response(args.message, mode=args.mode)
        print(json.dumps({"response": response, "mode": args.mode}))
    else:
        print(json.dumps({"error": "No message provided"}))
