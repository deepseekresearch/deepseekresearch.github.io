export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { prompt, model = 'oroboros-diffusion', width = 512, height = 512, steps = 30 } = req.body;
  // Orooboros video/image diffusion endpoint
  res.status(200).json({ 
    status: 'processing', 
    taskId: `diff_${Date.now()}`,
    prompt, model, width, height, steps,
    estimatedTime: steps * 2,
    streamUrl: `/api/ai-control/stream/diff_${Date.now()}`
  });
}