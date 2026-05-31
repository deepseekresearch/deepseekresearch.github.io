export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { text, voice = 'nova', speed = 1.0, format = 'mp3' } = req.body;
  res.status(200).json({ 
    status: 'synthesizing', 
    taskId: `voice_${Date.now()}`,
    text: text?.substring(0, 500), voice, speed, format,
    voices: ['alloy','echo','fable','onyx','nova','shimmer','oroboros-alpha','oroboros-beta'],
    audioUrl: `/api/ai-control/stream/voice_${Date.now()}`
  });
}