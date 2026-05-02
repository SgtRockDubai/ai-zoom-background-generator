# AI Zoom Background Generator

Create professional video-call backgrounds with a React frontend and a small Express backend that keeps the Gemini API key server-side.

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm ci`
2. Create `server/.env`:
   ```env
   GEMINI_API_KEY=GEMINI_API_KEY_GOES_HERE
   APP_ACCESS_TOKEN=choose-a-private-dev-token
   MOCK_AI=true
   DAILY_IMAGE_LIMIT_PER_IP=50
   IMAGE_REQUESTS_PER_MINUTE=10
   ```
3. Create `.env.local`:
   ```env
   VITE_APP_ACCESS_TOKEN=choose-a-private-dev-token
   ```
4. Start both server and frontend:
   `npm run dev:full` (server on 8787, Vite on 5173)

Use `MOCK_AI=true` to test without calling Gemini. When you are ready to use the real model, replace `GEMINI_API_KEY_GOES_HERE` with your real key and set `MOCK_AI=false`.

## Production Notes

- Set `NODE_ENV=production`.
- Set `GEMINI_API_KEY`, `APP_ACCESS_TOKEN`, and `ALLOWED_ORIGINS`.
- Keep `VITE_APP_ACCESS_TOKEN` matched to `APP_ACCESS_TOKEN` for the deployed frontend.
- Tune `DAILY_IMAGE_LIMIT_PER_IP` and `IMAGE_REQUESTS_PER_MINUTE` based on your budget.
- The daily quota is in-memory, so use Redis or a hosted KV store if you run multiple server instances.

## NPM Security Workflow

This project uses a project-local `.npmrc` to reduce exposure to recent npm supply-chain attacks:

- `ignore-scripts=true` blocks automatic `preinstall`, `install`, and `postinstall` scripts by default.
- `audit=true` and `audit-level=high` keep high/critical dependency issues visible during installs.
- Direct dependency versions are pinned exactly, and `package-lock.json` should be committed for reproducible installs.

Prefer `npm ci` instead of `npm install` for clean installs from the lockfile.

If a future trusted dependency genuinely requires lifecycle scripts, review it first, then run that install intentionally with scripts enabled for that command only:

```bash
npm install <trusted-package> --ignore-scripts=false
```

After dependency changes, run:

```bash
npm audit --omit=dev
npm run build
node --check server/index.js
```
