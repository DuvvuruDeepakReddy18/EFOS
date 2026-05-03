import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// Local API middleware that simulates Vercel serverless functions for dev
function localApiPlugin(): Plugin {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (!req.url?.startsWith('/api/')) return next();

        const funcName = req.url.replace('/api/', '').split('?')[0];
        const modulePath = path.resolve(__dirname, `api/${funcName}.js`);

        try {
          const moduleUrl = `file:///${modulePath.replace(/\\/g, '/')}?t=${Date.now()}`;
          const mod = await import(moduleUrl);
          const handler = mod.default;

          let body = {};
          if (req.method === 'POST') {
            body = await new Promise<Record<string, unknown>>((resolve) => {
              let data = '';
              req.on('data', (chunk: string) => data += chunk);
              req.on('end', () => {
                try { resolve(JSON.parse(data)); }
                catch { resolve({}); }
              });
            });
          }

          const mockReq = { method: req.method, body, headers: req.headers, query: {} };
          const mockRes = {
            _status: 200,
            _headers: {} as Record<string, string>,
            _body: null as string | null,
            setHeader(k: string, v: string) { this._headers[k] = v; return this; },
            status(code: number) { this._status = code; return this; },
            json(data: unknown) { this._body = JSON.stringify(data); return this; },
            end() { return this; },
          };

          await handler(mockReq, mockRes);

          res.statusCode = mockRes._status;
          Object.entries(mockRes._headers).forEach(([k, v]: [string, string]) => res.setHeader(k, v));
          res.setHeader('Content-Type', 'application/json');
          res.end(mockRes._body || '{}');
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          console.error(`[local-api] Error in /api/${funcName}:`, message);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: message }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
