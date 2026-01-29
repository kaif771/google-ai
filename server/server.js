import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(express.json());
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. Logic to Create/Refresh Context Cache
app.post('/api/cache-codebase', async (req, res) => {
    try {
        const { projectFiles } = req.body; // Full string of your frontend code
        const model = "models/gemini-1.5-pro-002"; // Supports 1M+ context

        // Create an explicit cache (Valid for 1 hour by default)
        const cache = await genAI.getGenerativeModel({ model }).createCachedContent({
            model,
            displayName: "Gemini_Architect_Context",
            systemInstruction: "You are a Senior Architect. Use the provided frontend context to design matching backends.",
            contents: [{ role: "user", parts: [{ text: projectFiles }] }],
            ttlSeconds: 3600,
        });

        res.json({ cacheName: cache.name });
    } catch (error) {
        res.status(500).json({ error: "Caching failed" });
    }
});

// 2. The Main Architect Route (Uses the Cache)
app.post('/api/architect', async (req, res) => {
    try {
        const { prompt, cacheName } = req.body;
        const model = genAI.getGenerativeModel(
            { model: "gemini-1.5-pro-002" },
            { apiVersion: 'v1beta' } // Caching requires v1beta
        );

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            cachedContent: cacheName
        });

        res.json({ plan: result.response.text() });
    } catch (error) {
        res.status(500).json({ error: "AI Reasoning Error" });
    }
});

// 3. General Chat Endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-002" });

        const chat = model.startChat({
            history: history || []
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;

        res.json({ reply: response.text() });
    } catch (error) {
        console.error('Chat Error:', error);
        res.status(500).json({ error: "Chat failed" });
    }
});

app.listen(8080, () => console.log('Backend Online: Port 8080'));