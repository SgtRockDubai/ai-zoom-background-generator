// @ts-nocheck
import { fileURLToPath } from 'node:url';
import { dirname, resolve as resolvePath } from 'node:path';
import { defineConfig, loadEnv, type ConfigEnv } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig((envCfg: ConfigEnv) => {
    const env = loadEnv(envCfg.mode, '.', '');
    return {
      server: {
        proxy: {
          '/api': {
            target: 'http://localhost:8787',
            changeOrigin: true,
            secure: false
          }
        }
      },
      resolve: {
        alias: {
          '@': resolvePath(__dirname, '.'),
        }
      }
    };
});
