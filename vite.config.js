import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function netlifyFunctionDevPlugin() {
  return {
    name: 'netlify-function-dev-middleware',
    configureServer(server) {
      server.middlewares.use('/.netlify/functions/chatbot', async (req, res) => {
        let body = '';

        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const { handler } = await import('./netlify/functions/chatbot.js');
            const response = await handler({
              httpMethod: req.method,
              headers: {
                ...req.headers,
                origin: req.headers.origin || 'http://localhost:5173',
                'x-forwarded-for': req.socket.remoteAddress || '127.0.0.1',
              },
              body,
            });

            Object.entries(response.headers || {}).forEach(([key, value]) => {
              res.setHeader(key, value);
            });

            res.statusCode = response.statusCode || 200;
            res.end(response.body || '');
          } catch (error) {
            console.error('Local chatbot function failed:', error);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Local chatbot function failed.' }));
          }
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const plugins = [react()];

  Object.entries(env).forEach(([key, value]) => {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  });

  if (mode === 'development') {
    plugins.push(netlifyFunctionDevPlugin());
  }

  return {
    plugins,
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          },
        },
      },
    },
    server: {
      host: '127.0.0.1',
    },
  };
})
