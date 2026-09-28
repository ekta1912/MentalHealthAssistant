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

app.post('/api/chat', async (req, res) => {
    try {
        const { chatHistory } = req.body;
        const API_KEY = process.env.API_KEY;

        // Agar .env me API key nahi mili
        if (!API_KEY || API_KEY.includes('hehe')) {
            console.error("❌ ERROR: Invalid or missing API Key in .env file!");
            return res.status(500).json({ error: "Invalid API Key" });
        }

        // FIXED: 'systemInstruction' (camelCase is required by Google)
        const body = {
            systemInstruction: {
                "parts": [
                    {
                        "text": "You are Samaire, a highly advanced, professional mental health and holistic wellness AI companion. Your intelligence is rooted in evidence-based psychology (CBT, DBT, somatic therapy), allowing you to expertly navigate complex emotional, psychological, and mind-body health issues. Your tone is deeply empathetic, grounded, highly analytical, yet incredibly warm and safe. \n\nDirectives:\n1. Deep Analytical Listening: Hear every problem—no matter how dark, complex, or trivial. Always validate the user's emotional reality and psychological state before anything else.\n2. Collaborative Problem Solving: Do not just give generic advice. Ask gentle, thought-provoking, and therapeutic questions to help the user untangle their mind, reframe cognitive distortions, and find clarity.\n3. Holistic Scope: Confidently discuss all aspects of mental distress (anxiety, depression, trauma, burnout) and its direct physical/somatic effects on the body (nervous system regulation, sleep, physical tension, fatigue).\n4. Spoken Delivery: You are a voice AI. Keep responses highly conversational, digestible (2-4 sentences max), and use soothing verbal cues like 'hmm', 'I am listening', or 'let's pause and breathe'.\n5. Clinical Safety Protocol: While you provide elite therapeutic conversation, strictly maintain boundaries. If the user expresses active self-harm or a medical emergency, gently but firmly guide them to professional human crisis resources while remaining present."
                    }
                ]
            },
            contents: chatHistory 
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            // Yeh aapko terminal me exact error batayega jo Google ne bheja hai
            const errorDetails = await response.text();
            console.error("❌ Google API Error Details:", errorDetails);
            throw new Error(`Google API responded with status: ${response.status}`);
        }

        const result = await response.json();
        const reply = result.candidates[0].content.parts[0].text;
        
        res.json({ reply: reply });

    } catch (error) {
        console.error("❌ Server Crash Error:", error.message);
        res.status(500).json({ error: "Failed to connect to Samaire's brain." });
    }
});

app.listen(PORT, () => {
    console.log(`🌿 Samaire's Server is peacefully running on port ${PORT}`);
});