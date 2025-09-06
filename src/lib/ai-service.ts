// Serviço para integração com APIs de IA
// Suporta múltiplas APIs: OpenAI DALL-E, Stable Diffusion, Midjourney, etc.

export interface AIGenerationRequest {
  prompt: string;
  style?: string;
  aspectRatio?: string;
  width?: number;
  height?: number;
  quality?: number;
  seed?: number;
  model?: string;
}

export interface AIGenerationResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  metadata?: {
    model: string;
    generationTime: number;
    cost?: number;
    apiProvider?: string;
  };
}

export interface AIProvider {
  name: string;
  generateImage(request: AIGenerationRequest): Promise<AIGenerationResponse>;
  isConfigured(): boolean;
}

// Configuração das APIs
export interface AIConfig {
  openai?: {
    apiKey: string;
    model?: string; // 'dall-e-2' | 'dall-e-3'
  };
  stableDiffusion?: {
    apiKey: string;
    endpoint?: string;
  };
  replicate?: {
    apiKey: string;
    model?: string;
  };
  midjourney?: {
    apiKey: string;
    endpoint?: string;
  };
}

class OpenAIProvider implements AIProvider {
  name = 'OpenAI DALL-E';
  private apiKey: string;
  private model: string;

  constructor(config: AIConfig['openai']) {
    this.apiKey = config?.apiKey || '';
    this.model = config?.model || 'dall-e-3';
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  async generateImage(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API key não configurada');
    }

    try {
      const startTime = Date.now();
      
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: request.prompt,
          n: 1,
          size: `${request.width || 1024}x${request.height || 1024}`,
          quality: request.quality || 'standard',
          response_format: 'url',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        imageUrl: data.data[0].url,
        metadata: {
          model: this.model,
          generationTime: Date.now() - startTime,
          apiProvider: 'OpenAI',
        },
      };
    } catch (error) {
      console.error('OpenAI Generation Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

class StableDiffusionProvider implements AIProvider {
  name = 'Stable Diffusion';
  private apiKey: string;
  private endpoint: string;

  constructor(config: AIConfig['stableDiffusion']) {
    this.apiKey = config?.apiKey || '';
    this.endpoint = config?.endpoint || 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image';
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  async generateImage(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    if (!this.isConfigured()) {
      throw new Error('Stable Diffusion API key não configurada');
    }

    try {
      const startTime = Date.now();
      
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: request.prompt,
              weight: 1,
            },
          ],
          cfg_scale: 7,
          height: request.height || 1024,
          width: request.width || 1024,
          samples: 1,
          steps: 30,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Stable Diffusion API Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        imageUrl: `data:image/png;base64,${data.artifacts[0].base64}`,
        metadata: {
          model: 'stable-diffusion-xl-1024-v1-0',
          generationTime: Date.now() - startTime,
          apiProvider: 'Stability AI',
        },
      };
    } catch (error) {
      console.error('Stable Diffusion Generation Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

class ReplicateProvider implements AIProvider {
  name = 'Replicate';
  private apiKey: string;
  private model: string;

  constructor(config: AIConfig['replicate']) {
    this.apiKey = config?.apiKey || '';
    this.model = config?.model || 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b';
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  async generateImage(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    if (!this.isConfigured()) {
      throw new Error('Replicate API key não configurada');
    }

    try {
      const startTime = Date.now();
      
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: this.model.split(':')[1],
          input: {
            prompt: request.prompt,
            width: request.width || 1024,
            height: request.height || 1024,
            num_outputs: 1,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Replicate API Error: ${response.status} - ${errorData.detail || 'Unknown error'}`);
      }

      const prediction = await response.json();
      
      // Poll for completion
      let result = prediction;
      while (result.status !== 'succeeded' && result.status !== 'failed') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
          headers: {
            'Authorization': `Token ${this.apiKey}`,
          },
        });
        result = await pollResponse.json();
      }

      if (result.status === 'failed') {
        throw new Error('Geração falhou no Replicate');
      }

      return {
        success: true,
        imageUrl: result.output[0],
        metadata: {
          model: this.model.split(':')[0],
          generationTime: Date.now() - startTime,
          apiProvider: 'Replicate',
        },
      };
    } catch (error) {
      console.error('Replicate Generation Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

class SimulatedProvider implements AIProvider {
  name = 'Simulado (Demo)';

  isConfigured(): boolean {
    return true; // Sempre disponível
  }

  async generateImage(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    // Simular delay de geração
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

    // Gerar imagem de exemplo baseada no prompt
    const width = request.width || 1024;
    const height = request.height || 1024;
    
    // Usar Picsum para simular imagens geradas
    const imageUrl = `https://picsum.photos/${width}/${height}?random=${Date.now()}`;

    return {
      success: true,
      imageUrl,
      metadata: {
        model: 'simulated-ai-model',
        generationTime: 2500,
        apiProvider: 'Demo',
      },
    };
  }
}

export class AIService {
  private static instance: AIService;
  private providers: AIProvider[] = [];
  private config: AIConfig = {};

  private constructor() {
    this.initializeProviders();
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  private initializeProviders() {
    // Carregar configuração das APIs
    this.config = {
      openai: {
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
        model: 'dall-e-3',
      },
      stableDiffusion: {
        apiKey: process.env.NEXT_PUBLIC_STABILITY_API_KEY || '',
      },
      replicate: {
        apiKey: process.env.NEXT_PUBLIC_REPLICATE_API_KEY || '',
      },
    };

    // Inicializar provedores (sem simulado)
    this.providers = [
      new OpenAIProvider(this.config.openai),
      new StableDiffusionProvider(this.config.stableDiffusion),
      new ReplicateProvider(this.config.replicate),
    ];
  }

  updateConfig(newConfig: Partial<AIConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.initializeProviders();
  }

  getAvailableProviders(): AIProvider[] {
    return this.providers.filter(provider => provider.isConfigured());
  }

  async generateImage(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    // Sempre utilizar a rota de servidor (sem modo simulado)
    try {
      const startTime = Date.now();
      const qualityLabel = (request.quality || 0) > 90 ? 'hd' : 'standard';
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: request.prompt,
          width: request.width || 1024,
          height: request.height || 1024,
          quality: qualityLabel,
          model: request.model || this.config.openai?.model || 'dall-e-3',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.success && data?.imageUrl) {
          return {
            success: true,
            imageUrl: data.imageUrl,
            metadata: {
              model: data?.metadata?.model || (request.model || this.config.openai?.model || 'dall-e-3'),
              generationTime: Date.now() - startTime,
              apiProvider: 'OpenAI',
            },
          };
        }
        return { success: false, error: data?.error || 'Erro desconhecido ao gerar imagem' };
      }

      const errorText = await res.text().catch(() => 'Erro desconhecido');
      console.error('Falha na rota de servidor /api/ai/generate:', errorText);
      return { success: false, error: errorText };
    } catch (e: any) {
      console.error('Erro chamando rota de servidor /api/ai/generate:', e?.message || e);
      return { success: false, error: e?.message || 'Erro ao chamar servidor' };
    }
  }

  async generateWithProvider(providerName: string, request: AIGenerationRequest): Promise<AIGenerationResponse> {
    const provider = this.providers.find(p => p.name === providerName);
    if (!provider) {
      throw new Error(`Provedor não encontrado: ${providerName}`);
    }
    return await provider.generateImage(request);
  }

  async enhancePrompt(prompt: string): Promise<string> {
    // Simular melhoria de prompt
    const enhancements = [
      'alta qualidade, detalhes nítidos',
      'iluminação profissional',
      'composição equilibrada',
      'cores vibrantes',
      'estilo moderno',
    ];

    const randomEnhancement = enhancements[Math.floor(Math.random() * enhancements.length)];
    return `${prompt}, ${randomEnhancement}`;
  }

  async generateVariations(imageUrl: string, count: number = 4): Promise<AIGenerationResponse[]> {
    // Simular geração de variações
    const variations: AIGenerationResponse[] = [];
    
    for (let i = 0; i < count; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      variations.push({
        success: true,
        imageUrl: `https://picsum.photos/1024/1024?random=${Date.now() + i}`,
        metadata: {
          model: 'simulated-variation-model',
          generationTime: 1500,
          apiProvider: 'Demo',
        },
      });
    }

    return variations;
  }

  async analyzeImage(imageUrl: string): Promise<{
    tags: string[];
    colors: string[];
    style: string;
    confidence: number;
  }> {
    // Simular análise de imagem
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      tags: ['arte', 'design', 'moderno', 'criativo'],
      colors: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'],
      style: 'moderno',
      confidence: 0.85,
    };
  }
}

// Exportar instância singleton
export const aiService = AIService.getInstance();
