// Configuração das APIs de IA
// Por enquanto, deixar vazio para usar o serviço simulado

export const AI_CONFIG = {
  // OpenAI DALL-E
  openai: {
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
    model: 'dall-e-3',
  },
  
  // Stability AI (Stable Diffusion)
  stableDiffusion: {
    apiKey: process.env.NEXT_PUBLIC_STABILITY_API_KEY || '',
  },
  
  // Replicate
  replicate: {
    apiKey: process.env.NEXT_PUBLIC_REPLICATE_API_KEY || '',
  },
  
  // Configuração para usar serviço simulado por padrão
  useSimulatedService: true,
};

// Função para verificar se alguma API está configurada
export const hasConfiguredAPIs = (): boolean => {
  return !!(AI_CONFIG.openai.apiKey || AI_CONFIG.stableDiffusion.apiKey || AI_CONFIG.replicate.apiKey);
};

// Função para obter o provedor padrão
export const getDefaultProvider = (): string => {
  if (AI_CONFIG.openai.apiKey) return 'OpenAI DALL-E';
  if (AI_CONFIG.stableDiffusion.apiKey) return 'Stable Diffusion';
  if (AI_CONFIG.replicate.apiKey) return 'Replicate';
  return 'Simulado (Demo)';
};
