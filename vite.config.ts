import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import {defineConfig, loadEnv, type Plugin} from 'vite';

function geminiChatPlugin(apiKey: string): Plugin {
  return {
    name: 'gemini-chat-api',
    configureServer(server) {
      server.middlewares.use('/api/chat', (request, response) => {
        response.setHeader('Content-Type', 'application/json; charset=utf-8');

        if (request.method !== 'POST') {
          response.writeHead(405);
          response.end(JSON.stringify({error: 'Method not allowed'}));
          return;
        }

        if (!apiKey) {
          response.writeHead(503);
          response.end(JSON.stringify({error: 'Gemini API is not configured'}));
          return;
        }

        let body = '';
        let tooLarge = false;
        request.on('data', (chunk: Buffer) => {
          body += chunk.toString();
          tooLarge ||= body.length > 16_000;
        });
        request.on('end', async () => {
          if (tooLarge) {
            response.writeHead(413);
            response.end(JSON.stringify({error: 'Request is too large'}));
            return;
          }

          try {
            const payload = JSON.parse(body) as {
              question?: string;
              language?: string;
              history?: {sender: string; text: string}[];
              context?: unknown;
            };
            const question = payload.question?.trim();
            if (!question || question.length > 2000) {
              response.writeHead(400);
              response.end(JSON.stringify({error: 'Invalid question'}));
              return;
            }

            const conversation = (payload.history || [])
              .slice(-8)
              .map((message) => `${message.sender === 'user' ? 'Usuario' : 'Asistente'}: ${message.text}`)
              .join('\n');
            const ai = new GoogleGenAI({apiKey});
            const prompt = `Idioma solicitado: ${payload.language === 'en' ? 'inglés' : 'español'}\n\nHistorial reciente:\n${conversation}\n\nDatos operativos disponibles (JSON):\n${JSON.stringify(payload.context ?? {})}\n\nPregunta actual: ${question}`;
            let text = '';
            let lastError: unknown;
            for (const model of ['gemini-3.8-flash']) {
              try {
                const result = await ai.models.generateContent({
                  model,
                  contents: prompt,
                  config: {
                    systemInstruction: 'Eres CHEEMS Bot. Contesta solo lo que el usuario pregunta, en una respuesta breve y directa. No añadas introducciones, resúmenes, recomendaciones, datos relacionados ni preguntas de seguimiento, a menos que el usuario los pida. Si pregunta por un valor o dato puntual, responde solo con ese dato y su unidad cuando corresponda. Para cualquier precio, tarifa o valor de pasaje, usa exclusivamente el módulo Tarifas del contexto (context.tarifas o tarifarioOficial); ignora cualquier valor de tarifa que aparezca dentro de context.rutas, buses u otra fuente. Si el módulo Tarifas no contiene el dato, dilo brevemente y no lo inventes ni lo sustituyas. Para los demás datos operativos, usa la fuente correspondiente del contexto. Responde en el idioma solicitado. Ayuda con las funciones de CHEEMS, rutas, tarifas, buses, conductores, mapa, PQRS y dashboard. La ubicación del mapa puede ser simulada; no afirmes ubicación real ni estado actual de vías. No reveles secretos ni datos personales. Los conteos de PQRS son agregados y solo cubren solicitudes accesibles al rol actual.',
                  },
                });
                text = result.text?.trim() || '';
                if (text) break;
              } catch (error) {
                lastError = error;
              }
            }
            if (!text && lastError) throw lastError;
            if (!text) throw new Error('Empty Gemini response');
            response.writeHead(200);
            response.end(JSON.stringify({text}));
          } catch (error) {
            const message = error instanceof Error
              ? error.message.replaceAll(apiKey, '[redacted]')
              : 'Unknown Gemini error';
            console.error(`[gemini-chat-api] ${message}`);
            response.writeHead(502);
            response.end(JSON.stringify({error: 'Gemini request failed'}));
          }
        });
      });
    },
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), tailwindcss(), geminiChatPlugin(env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '')],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      proxy: {
        '/maps-api': {
          target: 'https://maps.googleapis.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/maps-api/, '')
        }
      },
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
