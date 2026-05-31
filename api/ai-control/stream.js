export const config = { runtime: 'edge' };

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  const encoder = new TextEncoder();
  const url = new URL(request.url);
  const prompt = url.searchParams.get('prompt') || 'Hello from Oroboros AI';
  const model = url.searchParams.get('model') || 'deepseek-chat';

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event, data) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      send('meta', { model, timestamp: Date.now() });

      const words = prompt.split(' ');
      for (let i = 0; i < words.length; i++) {
        send('token', { token: words[i] + ' ', index: i });
        await new Promise(r => setTimeout(r, 50));
      }

      send('done', { status: 'complete', tokens: words.length });
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    }
  });
}