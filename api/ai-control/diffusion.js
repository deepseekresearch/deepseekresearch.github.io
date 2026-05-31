export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { prompt, model = 'oroboros-diffusion', width = 512, height = 512, steps = 30, fps = 24, windows = {} } = req.body;
  const wins = [!!windows.w1, !!windows.w2, !!windows.w3, !!windows.w4];
  res.status(200).json({
    status: 'processing',
    taskId: `diff_${Date.now()}`,
    prompt, model, width, height, steps, fps,
    windows: wins,
    estimatedTime: steps * 2,
    streamUrl: `/api/ai-control/stream/diff_${Date.now()}`
  });
}
