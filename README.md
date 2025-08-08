# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. For local dev (frontend only), set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. For secure dev, create `server/.env` with `GEMINI_API_KEY=...`
4. Start both server and frontend:
   `npm run dev:full` (server on 8787, Vite on 5173)
