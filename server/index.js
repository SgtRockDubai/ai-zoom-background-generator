import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load env: server/.env first, then project root .env
const serverEnvPath = path.resolve(process.cwd(), 'server', '.env');
if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
} else {
  dotenv.config();
}

const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT ? Number(process.env.PORT) : 8787;

// Validation constants
const PROMPT_MIN_LENGTH = 1;
const PROMPT_MAX_LENGTH = 2000;

const app = express();

// Security: Use simple query parser to avoid prototype pollution (CVE-2024-51999)
app.set('query parser', 'simple');

// Security: Helmet sets secure HTTP headers
app.use(helmet({
  contentSecurityPolicy: false, // Allow inline scripts for Vite/React dev
  crossOriginEmbedderPolicy: false
}));

// CORS: restrict origins in production
const corsOptions = isProduction
  ? { origin: process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || true }
  : { origin: true };
app.use(cors(corsOptions));

app.use(express.json({ limit: '2mb' }));

// Rate limiting: prevent abuse (10 requests per minute per IP for image generation)
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' }
});
app.use('/api/', apiLimiter);

// Health check (no rate limit)
app.get('/health', (_req, res) => res.json({ ok: true }));

// Image generation endpoint
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body ?? {};
    const promptStr = typeof prompt === 'string' ? prompt : String(prompt ?? '').trim();

    if (!promptStr) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (promptStr.length > PROMPT_MAX_LENGTH) {
      return res.status(400).json({
        error: `Prompt must be ${PROMPT_MAX_LENGTH} characters or fewer`
      });
    }

    // Mock mode: allow testing without a real API key
    if (process.env.MOCK_AI === 'true') {
      const placeholder = '/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEBUQFRUQFRUVFRUVFRUVFRUVFhUVFhUVFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OGxAQGy0lICUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAAEAAQMBIgACEQEDEQH/xAAXAAEBAQEAAAAAAAAAAAAAAAAABQEE/8QAFxABAQEBAAAAAAAAAAAAAAAAAQACIf/EABYBAQEBAAAAAAAAAAAAAAAAAAACA//EABYRAQEBAAAAAAAAAAAAAAAAAAABEf/aAAwDAQACEQMRAD8A7wCKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/2Q==';
      return res.json({ imageBytes: placeholder });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'Image generation service is temporarily unavailable'
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const fullPrompt = `A professional, high-resolution 16:9 aspect ratio virtual background for a video conference. The style is photorealistic and visually appealing. The scene is: ${promptStr}. The image must be suitable for a professional setting, with good lighting and composition. Avoid text and logos.`;

    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: fullPrompt,
      config: { numberOfImages: 1, outputMimeType: 'image/jpeg' }
    });

    const imageBytes = response?.generatedImages?.[0]?.image?.imageBytes;
    if (!imageBytes) {
      return res.status(502).json({ error: 'Image generation failed. Please try again.' });
    }

    return res.json({ imageBytes });
  } catch (error) {
    console.error('Error in /api/generate-image:', error);
    const message = isProduction
      ? 'Image generation failed. Please try again.'
      : (error instanceof Error ? error.message : 'Unknown error');
    return res.status(500).json({ error: message });
  }
});

// Serve static build and SPA fallback (only if dist exists)
const distDir = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
  if (process.env.MOCK_AI === 'true') {
    console.log('MOCK_AI enabled: returning placeholder images');
  }
});
