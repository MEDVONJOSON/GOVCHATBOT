
const fs = require('fs');
const path = require('path');

const RAW_FILE_PATH = 'C:/Users/medvo/Desktop/GOV-AI CHATBOX/ChatFAQ/chatFAQ';
const KB_PATH = 'C:/Users/medvo/Desktop/GOV-AI CHATBOX/simple-chatbot/data/knowledge_base.json';

// Helper to extract keywords (naive)
function extractKeywords(text) {
    const stopWords = new Set(['what', 'is', 'the', 'how', 'why', 'are', 'in', 'of', 'and', 'to', 'a', 'for', 'on', 'with', 'does', 'do', 'can', 'be', 'this', 'that', 'it', 'or', 'an']);
    const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
    const keywords = words.filter(w => w.length > 3 && !stopWords.has(w));
    return [...new Set(keywords)].slice(0, 10); // limited to 10
}

function parseRawFile() {
    const rawContent = fs.readFileSync(RAW_FILE_PATH, 'utf8');
    const lines = rawContent.split('\n');

    const entries = [];
    let currentQ = null;
    let currentA = null;
    let currentStartLine = 0;

    // Pattern for Questions: Q1:, Q1., 1., Q:
    // Pattern for Answers: A:, Answer:

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) continue;

        // Skip chat transcript artifacts
        if (line.includes("ChatGPT") || line.includes("I prefer this response") || line.includes("Just tell me what you want")) continue;

        // Detect Question
        // Regex: Starts with Q followed by number and char, or Number followed by dot.
        // e.g. "Q1:", "Q1", "1.", "Q1."
        // Also capture the text.
        const qMatch = line.match(/^(Q\d+[:.]?|\d+\.)\s*(.*)/i);

        if (qMatch) {
            // If we have a pending Q&A, push it
            if (currentQ && currentA) {
                entries.push({ q: currentQ, a: currentA.trim() });
                currentQ = null;
                currentA = null;
            } else if (currentQ && !currentA) {
                // Found a new question but haven't found answer for previous? 
                // Possibly multi-line question or previous was just a header?
                // Let's assume previous Q was abandoned or part of header text.
                // OR maybe the previous 'Q' was actually the answer content? 
                // It's safer to just overwrite currentQ if A is empty.
            }

            currentQ = qMatch[2] || line; // specific text or full line
            // Check if Question text is empty, maybe on next line?
            if (!qMatch[2] && lines[i + 1]) {
                // Peek next line
                // currentQ = lines[i+1].trim(); 
                // i++;
            }
        }
        // Detect Answer
        else if (line.match(/^(A:|Answer:)/i)) {
            currentA = ""; // Initialize answer buffer
            // Check if there is text on the same line
            const aMatch = line.match(/^(A:|Answer:)\s*(.*)/i);
            if (aMatch && aMatch[2]) {
                currentA += aMatch[2] + "\n";
            }
        }
        else {
            // Content line.
            // If we are in an Answer block, append.
            if (currentA !== null) {
                currentA += line + "\n";
            } else if (currentQ !== null) {
                // If we are in a Question block (but before Answer), maybe append to Question?
                currentQ += " " + line;
            }
        }
    }

    // Push last entry
    if (currentQ && currentA) {
        entries.push({ q: currentQ, a: currentA.trim() });
    }

    return entries;
}

function updateKnowledgeBase() {
    let kb = [];
    try {
        kb = JSON.parse(fs.readFileSync(KB_PATH, 'utf8'));
    } catch (e) {
        console.log("Creating new KB file.");
    }

    // Preserve IDs 1-7 (General Info)
    const preserved = kb.filter(item => parseInt(item.id) <= 7);

    const newEntries = parseRawFile();
    console.log(`Parsed ${newEntries.length} new Q&A pairs.`);

    let nextId = 8;

    // Add new entries
    for (const entry of newEntries) {
        // Clean up text
        const question = entry.q.replace(/SL-Cyber-Security-Policy/g, '').trim();
        const answer = entry.a.replace(/SL-Cyber-Security-Policy/g, '').trim();

        if (question.length < 5 || answer.length < 5) continue; // Skip noise

        preserved.push({
            id: String(nextId++),
            topic: question.substring(0, 100) + (question.length > 100 ? "..." : ""),
            content: question + "\n" + answer,
            keywords: extractKeywords(question + " " + answer)
        });
    }

    fs.writeFileSync(KB_PATH, JSON.stringify(preserved, null, 4));
    console.log(`Updated Knowledge Base with ${preserved.length} total entries.`);
}

updateKnowledgeBase();
