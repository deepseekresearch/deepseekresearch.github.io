export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      totalVoices: 68,
      groups: {
        Windows: [
          'Microsoft David','Microsoft Zira','Microsoft Mark','Microsoft Eva',
          'Microsoft George','Microsoft Hazel','Microsoft Susan','Microsoft Catherine',
          'Microsoft Richard','Microsoft Linda','Microsoft Heera','Microsoft Ravi',
          'Microsoft Hanhan','Microsoft Yaoyao','Microsoft Kangkang','Microsoft Huihui',
          'Microsoft Irina','Microsoft Pavel','Microsoft Haruka','Microsoft Ayumi',
          'Microsoft Lucia','Microsoft Cosimo','Microsoft Stefan','Microsoft Carmit'
        ],
        Google: [
          'Google US English','Google UK English Female','Google UK English Male',
          'Google Deutsch','Google Español','Google Français','Google Italiano',
          'Google Nederlands','Google Polski','Google Português','Google русский',
          'Google 日本語','Google 한국의','Google 中文'
        ],
        eSpeak: [
          'default','en-us','en-gb','fr-fr','de-de','es-es','it-it','pt-br',
          'ru-ru','zh-cn','ja','ko','nl','pl','sv','tr','hi','ar'
        ],
        Oroboros: [
          'oroboros-alpha','oroboros-beta','oroboros-gamma','oroboros-delta',
          'oroboros-epsilon','oroboros-zeta','oroboros-eta','oroboros-theta'
        ]
      },
      features: ['streaming','clone','speed-control','pitch-control','ssml','realtime']
    });
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { text, voice = 'default', speed = 1.0, pitch = 1.0, format = 'mp3', stream = false } = req.body;
  res.status(200).json({
    status: 'synthesizing',
    taskId: `voice_${Date.now()}`,
    text: text?.substring(0, 500), voice, speed, pitch, format, stream,
    voices: [
      'Microsoft David','Microsoft Zira','Microsoft Haruka','Microsoft Lucia',
      'Google US English','Google 日本語','oroboros-alpha','oroboros-epsilon'
    ],
    audioUrl: `/api/ai-control/stream/voice_${Date.now()}`
  });
}