export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      pipeline: 'oroboros-video-diffusion',
      models: ['oroboros-diffusion-xl','oroboros-diffusion-hd','oroboros-diffusion-4k','oroboros-diffusion-anime','oroboros-diffusion-cinematic','oroboros-diffusion-photoreal'],
      samplers: ['euler','euler_a','ddim','dpm++_2m','dpm++_sde','uni_pc'],
      maxResolution: '4096x4096',
      windows: {
        w1: { name: 'Primary Canvas', description: 'Main generation viewport with realtime preview' },
        w2: { name: 'Reference Feed', description: 'Input references, ControlNet feeds, style images' },
        w3: { name: 'Timeline', description: 'Video frame timeline with keyframe editor' },
        w4: { name: 'Preview Grid', description: 'Batch preview, comparison, variant selector' },
        w5: { name: 'Voice Sync', description: 'Oroboros voice-to-video lip sync, emotion transfer, viseme mapping' }
      },
      voiceSyncVoices: ['Microsoft AriaNeural','Microsoft JennyNeural','oroboros-alpha','oroboros-omega'],
      features: ['img2img','inpainting','outpainting','controlnet','loras','textual-inversion','upscaling','face-restore','tile-upscale','video-diffusion','interpolation','voice-sync','lip-sync','emotion-transfer','5-window-mode']
    });
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { prompt, negative_prompt = '', model = 'oroboros-diffusion-xl', width = 512, height = 512, steps = 30, fps = 24, sampler = 'dpm++_2m', cfg_scale = 7.5, seed = -1, batch_size = 1, windows = {}, controlnet, lora, upscale = false, videoMode = false, frameCount = 0 } = req.body;
  const wins = { w1: !!windows.w1, w2: !!windows.w2, w3: !!windows.w3, w4: !!windows.w4, w5: !!windows.w5 };
  const taskId = `diff_${Date.now()}`;
  res.status(200).json({
    status: 'processing', taskId, prompt, negative_prompt, model, width, height, steps, fps, sampler, cfg_scale, seed, batch_size,
    windows: wins, controlnet: controlnet || null, lora: lora || null, upscale, videoMode, frameCount,
    oroboros: { connected: true, pipeline: 'oroboros-video-diffusion', version: '3.0', features: ['5-window-mode','realtime-preview','voice-sync','lip-sync','emotion-transfer','viseme-mapping','windows-voices','video-generation'], voiceWindow: wins.w5 ? 'active' : 'inactive' },
    estimatedTime: videoMode ? frameCount * steps * 0.5 : steps * 2,
    streamUrl: `/api/ai-control/stream/${taskId}`
  });
}