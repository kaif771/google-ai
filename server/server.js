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

// 2. The Main Architect Route (Deep Reasoning)
app.post('/api/architect', async (req, res) => {
    try {
        const { prompt, projectContext } = req.body;
        console.log("Architect received prompt:", prompt);

        // Use a model capable of complex reasoning
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
            systemInstruction: `You are Gemini Architect 3.0, a Full-Stack Autonomous Agent. 
            Your goal is to "see" the user's frontend and build the matching backend infrastructure.
            
            You have access to the user's current codebase context.
            
            Analyze the request and the context.
            Return a JSON object with the following structure:
            {
                "thought": "A detailed explanation of your reasoning, considering data relationships, security, and scalability.",
                "plan": "A step-by-step implementation plan.",
                "code": "The actual code implementation (e.g., Express routes, Mongoose schemas)."
            }
            Always return valid JSON. Do not wrap in markdown code blocks.`,
            cachedContent: req.body.cacheName || undefined,
        });

        const result = await model.generateContent({
            contents: [{
                role: "user",
                parts: [{ text: `CONTEXT:\n${projectContext}\n\nUSER REQUEST: ${prompt}` }]
            }],
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        const responseText = result.response.text();
        console.log("Architect thought process complete.");

        res.json(JSON.parse(responseText));
    } catch (error) {
        console.error("Architect Error:", error);
        res.status(500).json({ error: "AI Architect failed to reason." });
    }
});

// 3. General Chat Endpoint (Multimodal)
app.post('/api/chat', async (req, res) => {
    try {
        const { message, history, image, cacheName } = req.body;
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro-002",
            cachedContent: cacheName || undefined
        });

        const chat = model.startChat({
            history: history || []
        });

        let result;
        if (image) {
            // Remove header "data:image/jpeg;base64," if present
            const base64Data = image.split(',')[1] || image;
            const mimeType = image.split(';')[0].split(':')[1] || 'image/png';

            result = await chat.sendMessage([
                message,
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: mimeType
                    }
                }
            ]);
        } else {
            result = await chat.sendMessage(message);
        }

        const response = await result.response;
        res.json({ reply: response.text() });
    } catch (error) {
        console.error('Chat Error:', error);
        res.status(500).json({ error: "Chat failed" });
    }
});

app.listen(8080, () => console.log('Backend Online: Port 8080'));