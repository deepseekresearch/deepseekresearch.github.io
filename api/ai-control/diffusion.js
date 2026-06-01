export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      pipeline: 'oroboros-video-diffusion',
      models: ['oroboros-diffusion-xl','oroboros-diffusion-hd','oroboros-diffusion-4k','oroboros-diffusion-anime','oroboros-diffusion-cinematic','oroboros-diffusion-photoreal'],
      samplers: ['euler','euler_a','ddim','dpm++_2m','dpm++_sde','uni_pc'],
      maxResolution: '4096x4096',
      windows: { w1: 'Primary Canvas', w2: 'Reference Feed', w3: 'Timeline', w4: 'Preview Grid' },
      features: ['img2img','inpainting','outpainting','controlnet','loras','textual-inversion','upscaling','face-restore','tile-upscale','video-diffusion','interpolation']
    });
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { prompt, negative_prompt = '', model = 'oroboros-diffusion-xl', width = 512, height = 512, steps = 30, fps = 24, sampler = 'dpm++_2m', cfg_scale = 7.5, seed = -1, batch_size = 1, windows = {}, controlnet, lora, upscale = false, videoMode = false, frameCount = 0 } = req.body;
  const wins = { w1: !!windows.w1, w2: !!windows.w2, w3: !!windows.w3, w4: !!windows.w4 };
  const taskId = `diff_${Date.now()}`;
  res.status(200).json({
    status: 'processing', taskId, prompt, negative_prompt, model, width, height, steps, fps, sampler, cfg_scale, seed, batch_size,
    windows: wins, controlnet: controlnet || null, lora: lora || null, upscale, videoMode, frameCount,
    oroboros: { connected: true, pipeline: 'oroboros-video-diffusion', version: '2.0', features: ['multi-window','realtime-preview','voice-sync','lip-sync'] },
    estimatedTime: videoMode ? frameCount * steps * 0.5 : steps * 2,
    streamUrl: `/api/ai-control/stream/${taskId}`
  });
}