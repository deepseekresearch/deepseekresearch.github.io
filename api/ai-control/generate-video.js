export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { prompt, duration = 5, fps = 24, resolution = '720p', style = 'cinematic' } = req.body;
  res.status(200).json({ 
    status: 'queued', 
    taskId: `vid_${Date.now()}`,
    prompt, duration, fps, resolution, style,
    queuePosition: 1,
    estimatedTime: duration * 15,
    progressUrl: `/api/ai-control/stream/vid_${Date.now()}`
  });
}