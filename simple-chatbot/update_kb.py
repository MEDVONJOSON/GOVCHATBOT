import json
import re

def parse_faq(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by "Q[0-9]+:" to find questions
    # This regex looks for Q followed by digits and a colon
    pattern = re.compile(r'Q(\d+):(.*?)\nA:(.*?)(?=\nQ\d+:|$)', re.DOTALL)
    
    # The file structure is a bit loose, let's try a more robust split
    # We can split by "Q<number>:"
    
    entries = []
    
    # Normalize newlines
    content = content.replace('\r\n', '\n')
    
    # Find all Q&A blocks
    # We'll iterate through the file line by line to be safer
    lines = content.split('\n')
    
    current_q = ""
    current_a = ""
    current_id = 0
    capturing_a = False
    
    qa_pairs = []
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Check for Question
        q_match = re.match(r'^Q(\d+):\s*(.*)', line)
        if q_match:
            # Save previous if exists
            if current_q:
                qa_pairs.append({'q': current_q, 'a': current_a.strip()})
            
            current_id = q_match.group(1)
            current_q = q_match.group(2)
            current_a = ""
            capturing_a = False
            continue
            
        # Check for Answer start
        if line.startswith('A:'):
            capturing_a = True
            current_a += line[2:].strip() + " "
            continue
            
        # If capturing answer, append line
        if capturing_a:
            # Stop if we hit a "SL-Cyber-Security-Policy" line or Section header
            if "SL-Cyber-Security-Policy" in line or line.startswith("SECTION"):
                continue
            current_a += line + " "

    # Append last one
    if current_q:
        qa_pairs.append({'q': current_q, 'a': current_a.strip()})

    return qa_pairs

def generate_keywords(text):
    # Simple keyword extraction
    common_words = {'what', 'is', 'the', 'of', 'and', 'to', 'in', 'a', 'for', 'how', 'why', 'does', 'do', 'are', 'it', 'this', 'that', 'with', 'on', 'be', 'will', 'can', 'has', 'have', 'by', 'an', 'as', 'from', 'or'}
    words = re.findall(r'\w+', text.lower())
    keywords = [w for w in words if w not in common_words and len(w) > 2]
    return list(set(keywords))[:10] # Limit to 10 keywords

def update_knowledge_base(faq_path, kb_path):
    # Read existing KB
    try:
        with open(kb_path, 'r', encoding='utf-8') as f:
            kb = json.load(f)
    except:
        kb = []
        
    # Get max ID
    max_id = 0
    for item in kb:
        try:
            if int(item['id']) > max_id:
                max_id = int(item['id'])
        except:
            pass
            
    # Parse FAQ
    new_qa = parse_faq(faq_path)
    
    # Add to KB
    for item in new_qa:
        max_id += 1
        
        # Combine Q and A for content, or just use A?
        # The user wants the chatbot to answer these questions.
        # The "content" field is what the AI uses for context.
        # So we should put "Question: ... Answer: ..." in the content so the AI knows the context.
        
        content = f"{item['q']}\n{item['a']}"
        
        # Generate keywords from Question and Answer
        keywords = generate_keywords(item['q'] + " " + item['a'])
        
        new_entry = {
            "id": str(max_id),
            "topic": item['q'][:50] + "..." if len(item['q']) > 50 else item['q'],
            "content": content,
            "keywords": keywords
        }
        
        kb.append(new_entry)
        
    # Write back
    with open(kb_path, 'w', encoding='utf-8') as f:
        json.dump(kb, f, indent=4)
        
    print(f"Added {len(new_qa)} new entries to knowledge base.")

if __name__ == "__main__":
    faq_file = r"c:\Users\medvo\Desktop\GOV-AI CHATBOX\ChatFAQ\chatFAQ"
    kb_file = r"c:\Users\medvo\Desktop\GOV-AI CHATBOX\simple-chatbot\data\knowledge_base.json"
    update_knowledge_base(faq_file, kb_file)
