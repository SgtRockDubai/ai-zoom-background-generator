import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load env from server/.env if present, else fallback to project root .env/.env.local
const serverEnvPath = path.resolve(process.cwd(), 'server', '.env');
if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
} else {
  dotenv.config();
}

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 8787;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body ?? {};
    if (!prompt || !String(prompt).trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server is not configured with GEMINI_API_KEY' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const fullPrompt = `A professional, high-resolution 16:9 aspect ratio virtual background for a video conference. The style is photorealistic and visually appealing. The scene is: ${prompt}. The image must be suitable for a professional setting, with good lighting and composition. Avoid text and logos.`;

    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: fullPrompt,
      config: { numberOfImages: 1, outputMimeType: 'image/jpeg' }
    });

    const imageBytes = response?.generatedImages?.[0]?.image?.imageBytes;
    if (!imageBytes) {
      return res.status(502).json({ error: 'Image generation failed: empty API response' });
    }

    return res.json({ imageBytes });
  } catch (error) {
    console.error('Error in /api/generate-image:', error);
    const message = error instanceof Error ? error.message : 'Unknown server error';
    return res.status(500).json({ error: message });
  }
});

app.get('/health', (_req, res) => res.json({ ok: true }));

// Optional: serve production build if present
const distDir = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

// Lightweight JS entrypoint to avoid needing ts-node for dev
import('./index.ts');


