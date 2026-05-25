// DeepSeek Research Chat — Vercel Serverless API
// Proxies chat requests to local Ollama with keep-alive pooling
// Deploy: connect deepseek-research-chat project to this repo

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://host.docker.internal:11434';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function ollamaFetch(path, body, retries = MAX_RETRIES) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`${OLLAMA_HOST}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(55000)
      });
      if (!res.ok && i < retries - 1) { await sleep(RETRY_DELAY * (i + 1)); continue; }
      return res;
    } catch (e) {
      if (i === retries - 1) throw e;
      await sleep(RETRY_DELAY * (i + 1));
    }
  }
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = req.body;
    const isStream = body.stream === true;

    if (isStream) {
      // Streaming response — pipe directly
      const ollamaRes = await ollamaFetch('/api/chat', body);
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.status(ollamaRes.status);
      const reader = ollamaRes.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(decoder.decode(value, { stream: true }));
      }
      res.end();
    } else {
      const ollamaRes = await ollamaFetch('/api/chat', body);
      const data = await ollamaRes.json();
      res.status(ollamaRes.status).json(data);
    }
  } catch (err) {
    res.status(502).json({ error: `Ollama unreachable: ${err.message}` });
  }
}
