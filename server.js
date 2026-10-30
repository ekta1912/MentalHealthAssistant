import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint for system monitoring
app.get('/api/health', (req, res) => {
    res.json({
        status: "healthy",
        app: "Samaira Mental Health Coach",
        uptime: Math.floor(process.uptime()),
        model: "gemini-2.5-flash",
        timestamp: new Date().toISOString()
    });
});

app.post('/api/chat', async (req, res) => {
    try {
        const { chatHistory } = req.body;
        const API_KEY = process.env.API_KEY;

        if (!API_KEY || API_KEY.includes('your_gemini_api_key')) {
            console.error("❌ ERROR: Invalid or missing API Key in .env file!");
            return res.status(500).json({ error: "Invalid or unconfigured Gemini API Key." });
        }

        if (!chatHistory || !Array.isArray(chatHistory) || chatHistory.length === 0) {
            return res.status(400).json({ error: "Invalid payload: chatHistory must be a non-empty array." });
        }

        const body = {
            systemInstruction: {
                "parts": [
                    {
                        "text": "You are Samaira, a highly advanced, professional mental health and holistic wellness AI companion. Your intelligence is rooted in evidence-based psychology (CBT, DBT, somatic therapy), allowing you to expertly navigate complex emotional, psychological, and mind-body health issues. Your tone is deeply empathetic, grounded, highly analytical, yet incredibly warm and safe. \n\nDirectives:\n1. Deep Analytical Listening: Hear every problem—no matter how dark, complex, or trivial. Always validate the user's emotional reality and psychological state before anything else.\n2. Collaborative Problem Solving: Do not just give generic advice. Ask gentle, thought-provoking, and therapeutic questions to help the user untangle their mind, reframe cognitive distortions, and find clarity.\n3. Holistic Scope: Confidently discuss all aspects of mental distress (anxiety, depression, trauma, burnout) and its direct physical/somatic effects on the body (nervous system regulation, sleep, physical tension, fatigue).\n4. Spoken Delivery: You are a voice AI. Keep responses highly conversational, digestible (2-4 sentences max), clear and natural for speech without bullet points or asterisks. Use soothing verbal cues like 'hmm', 'I am listening', or 'let's pause and breathe'.\n5. Clinical Safety Protocol: While you provide elite therapeutic conversation, strictly maintain boundaries. If the user expresses active self-harm or a medical emergency, gently but firmly guide them to professional human crisis resources while remaining present."
                    }
                ]
            },
            contents: chatHistory,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 300,
                thinkingConfig: {
                    thinkingBudget: 0 // Removes thinking delay for fast, clear voice responses
                }
            }
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            console.error("❌ Google API Error Details:", errorDetails);
            
            if (response.status === 429) {
                return res.status(429).json({ error: "Samaira is experiencing high volume. Please take a breath and try again shortly." });
            }
            return res.status(response.status >= 500 ? 502 : response.status).json({
                error: `AI gateway returned error code ${response.status}`
            });
        }

        const result = await response.json();
        const candidate = result.candidates?.[0];
        
        let reply = "";
        if (candidate?.content?.parts) {
            reply = candidate.content.parts.map(p => p.text).filter(Boolean).join('');
        }

        if (!reply) {
            console.warn("⚠️ Warning: No text returned in candidate parts:", JSON.stringify(candidate));
            reply = "I'm listening. Take a gentle breath, and tell me what you're experiencing.";
        }
        
        res.json({ reply: reply });

    } catch (error) {
        console.error("❌ Server Error:", error.message);
        res.status(500).json({ error: "Failed to connect to Samaira's brain. Please verify server connection." });
    }
});

app.listen(PORT, () => {
    console.log(`🌿 Samaira's Server is peacefully running on port ${PORT}`);
});
