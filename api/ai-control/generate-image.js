export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { prompt, width = 512, height = 512, style = 'photorealistic', steps = 30 } = req.body;
  res.status(200).json({
    status: 'processing',
    taskId: `img_${Date.now()}`,
    prompt, width, height, style, steps,
    estimatedTime: steps * 1.5,
    imageUrl: `/api/ai-control/stream/img_${Date.now()}`
  });
}