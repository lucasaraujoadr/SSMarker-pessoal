import { Template, TemplateDSL } from '@/types';

// Templates padrão para diferentes formatos
export const defaultTemplates: Template[] = [
  // Template Hero para Instagram Square
  {
    id: 'hero-square',
    name: 'Hero Square',
    format: 'IG_SQUARE',
    category: 'social',
    tags: ['hero', 'instagram', 'square', 'title'],
    thumbnail: '/templates/hero-square.jpg',
    dsl: {
      grid: { cols: 12, rows: 12, gutter: 16, margin: 48 },
      slots: [
        { 
          id: 'bg', 
          type: 'image', 
          area: { x: 0, y: 0, w: 12, h: 12 }, 
          fit: 'cover',
          role: 'bg'
        },
        { 
          id: 'title', 
          type: 'text', 
          area: { x: 1, y: 2, w: 10, h: 3 }, 
          role: 'h1',
          defaultContent: 'Título Principal',
          constraints: { minWidth: 200, maxWidth: 800 }
        },
        { 
          id: 'subtitle', 
          type: 'text', 
          area: { x: 1, y: 5, w: 8, h: 2 }, 
          role: 'h2',
          defaultContent: 'Subtítulo explicativo',
          constraints: { minWidth: 150, maxWidth: 600 }
        },
        { 
          id: 'cta', 
          type: 'text', 
          area: { x: 1, y: 9, w: 4, h: 1 }, 
          role: 'cta',
          defaultContent: 'Saiba Mais',
          constraints: { minWidth: 80, maxWidth: 200 }
        },
        { 
          id: 'logo', 
          type: 'image', 
          area: { x: 10, y: 10, w: 2, h: 2 }, 
          fit: 'contain',
          role: 'logo'
        }
      ],
      rules: {
        typographyScale: 1.2,
        contrastMin: 4.5,
        safeAreas: { story: { top: 160, bottom: 220 } }
      }
    },
    recommendedPalettes: [
      ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
      ['#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E', '#00B894'],
      ['#2D3436', '#636E72', '#74B9FF', '#0984E3', '#00B894']
    ]
  },

  // Template Story para Instagram
  {
    id: 'story-vertical',
    name: 'Story Vertical',
    format: 'STORY',
    category: 'social',
    tags: ['story', 'instagram', 'vertical', 'fullscreen'],
    thumbnail: '/templates/story-vertical.jpg',
    dsl: {
      grid: { cols: 12, rows: 21, gutter: 12, margin: 32 },
      slots: [
        { 
          id: 'bg', 
          type: 'image', 
          area: { x: 0, y: 0, w: 12, h: 21 }, 
          fit: 'cover',
          role: 'bg'
        },
        { 
          id: 'title', 
          type: 'text', 
          area: { x: 1, y: 3, w: 10, h: 4 }, 
          role: 'h1',
          defaultContent: 'Título Impactante',
          constraints: { minWidth: 200, maxWidth: 900 }
        },
        { 
          id: 'subtitle', 
          type: 'text', 
          area: { x: 1, y: 7, w: 10, h: 3 }, 
          role: 'h2',
          defaultContent: 'Descrição do conteúdo',
          constraints: { minWidth: 150, maxWidth: 800 }
        },
        { 
          id: 'cta', 
          type: 'text', 
          area: { x: 1, y: 16, w: 6, h: 2 }, 
          role: 'cta',
          defaultContent: 'Clique Aqui',
          constraints: { minWidth: 100, maxWidth: 400 }
        },
        { 
          id: 'logo', 
          type: 'image', 
          area: { x: 10, y: 18, w: 2, h: 2 }, 
          fit: 'contain',
          role: 'logo'
        }
      ],
      rules: {
        typographyScale: 1.15,
        contrastMin: 4.5,
        safeAreas: { story: { top: 160, bottom: 220 } }
      }
    },
    recommendedPalettes: [
      ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
      ['#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E', '#00B894']
    ]
  },

  // Template Carrossel para Instagram
  {
    id: 'carousel-horizontal',
    name: 'Carrossel Horizontal',
    format: 'IG_PORTRAIT',
    category: 'social',
    tags: ['carousel', 'instagram', 'portrait', 'slides'],
    thumbnail: '/templates/carousel-horizontal.jpg',
    dsl: {
      grid: { cols: 12, rows: 16, gutter: 20, margin: 40 },
      slots: [
        { 
          id: 'bg', 
          type: 'image', 
          area: { x: 0, y: 0, w: 12, h: 16 }, 
          fit: 'cover',
          role: 'bg'
        },
        { 
          id: 'overlay', 
          type: 'shape', 
          area: { x: 0, y: 0, w: 12, h: 16 }, 
          role: 'bg'
        },
        { 
          id: 'title', 
          type: 'text', 
          area: { x: 1, y: 2, w: 10, h: 3 }, 
          role: 'h1',
          defaultContent: 'Título do Slide',
          constraints: { minWidth: 200, maxWidth: 800 }
        },
        { 
          id: 'content', 
          type: 'text', 
          area: { x: 1, y: 5, w: 10, h: 6 }, 
          role: 'body',
          defaultContent: 'Conteúdo detalhado do slide com informações importantes',
          constraints: { minWidth: 150, maxWidth: 800 }
        },
        { 
          id: 'cta', 
          type: 'text', 
          area: { x: 1, y: 12, w: 5, h: 2 }, 
          role: 'cta',
          defaultContent: 'Ação',
          constraints: { minWidth: 80, maxWidth: 300 }
        },
        { 
          id: 'page-indicator', 
          type: 'text', 
          area: { x: 10, y: 14, w: 2, h: 1 }, 
          role: 'body',
          defaultContent: '1/3',
          constraints: { minWidth: 40, maxWidth: 100 }
        }
      ],
      rules: {
        typographyScale: 1.1,
        contrastMin: 4.5,
        safeAreas: { story: { top: 160, bottom: 220 } }
      }
    },
    recommendedPalettes: [
      ['#2C3E50', '#34495E', '#3498DB', '#E74C3C', '#F39C12'],
      ['#8E44AD', '#9B59B6', '#3498DB', '#1ABC9C', '#F1C40F']
    ]
  },

  // Template Facebook Link
  {
    id: 'facebook-link',
    name: 'Facebook Link',
    format: 'FB_LINK',
    category: 'social',
    tags: ['facebook', 'link', 'landscape', 'article'],
    thumbnail: '/templates/facebook-link.jpg',
    dsl: {
      grid: { cols: 16, rows: 9, gutter: 12, margin: 24 },
      slots: [
        { 
          id: 'bg', 
          type: 'image', 
          area: { x: 0, y: 0, w: 16, h: 9 }, 
          fit: 'cover',
          role: 'bg'
        },
        { 
          id: 'overlay', 
          type: 'shape', 
          area: { x: 0, y: 0, w: 16, h: 9 }, 
          role: 'bg'
        },
        { 
          id: 'title', 
          type: 'text', 
          area: { x: 1, y: 1, w: 14, h: 2 }, 
          role: 'h1',
          defaultContent: 'Título do Artigo',
          constraints: { minWidth: 300, maxWidth: 1200 }
        },
        { 
          id: 'description', 
          type: 'text', 
          area: { x: 1, y: 3, w: 12, h: 3 }, 
          role: 'body',
          defaultContent: 'Descrição do artigo com informações relevantes',
          constraints: { minWidth: 200, maxWidth: 1000 }
        },
        { 
          id: 'cta', 
          type: 'text', 
          area: { x: 1, y: 6, w: 6, h: 1 }, 
          role: 'cta',
          defaultContent: 'Ler Mais',
          constraints: { minWidth: 100, maxWidth: 400 }
        },
        { 
          id: 'logo', 
          type: 'image', 
          area: { x: 14, y: 7, w: 2, h: 2 }, 
          fit: 'contain',
          role: 'logo'
        }
      ],
      rules: {
        typographyScale: 1.1,
        contrastMin: 4.5
      }
    },
    recommendedPalettes: [
      ['#1877F2', '#42A5F5', '#90CAF9', '#E3F2FD', '#FFFFFF'],
      ['#3B5998', '#8B9DC3', '#DFE3EE', '#F7F7F7', '#FFFFFF']
    ]
  },

  // Template YouTube Thumbnail
  {
    id: 'youtube-thumbnail',
    name: 'YouTube Thumbnail',
    format: 'YT_THUMB',
    category: 'social',
    tags: ['youtube', 'thumbnail', 'landscape', 'video'],
    thumbnail: '/templates/youtube-thumbnail.jpg',
    dsl: {
      grid: { cols: 16, rows: 9, gutter: 16, margin: 32 },
      slots: [
        { 
          id: 'bg', 
          type: 'image', 
          area: { x: 0, y: 0, w: 16, h: 9 }, 
          fit: 'cover',
          role: 'bg'
        },
        { 
          id: 'overlay', 
          type: 'shape', 
          area: { x: 0, y: 0, w: 16, h: 9 }, 
          role: 'bg'
        },
        { 
          id: 'title', 
          type: 'text', 
          area: { x: 1, y: 1, w: 14, h: 3 }, 
          role: 'h1',
          defaultContent: 'Título do Vídeo',
          constraints: { minWidth: 300, maxWidth: 1200 }
        },
        { 
          id: 'subtitle', 
          type: 'text', 
          area: { x: 1, y: 4, w: 12, h: 2 }, 
          role: 'h2',
          defaultContent: 'Subtítulo explicativo',
          constraints: { minWidth: 200, maxWidth: 800 }
        },
        { 
          id: 'play-button', 
          type: 'icon', 
          area: { x: 7, y: 5, w: 2, h: 2 }, 
          role: 'cta'
        },
        { 
          id: 'logo', 
          type: 'image', 
          area: { x: 14, y: 7, w: 2, h: 2 }, 
          fit: 'contain',
          role: 'logo'
        }
      ],
      rules: {
        typographyScale: 1.2,
        contrastMin: 4.5
      }
    },
    recommendedPalettes: [
      ['#FF0000', '#FF4444', '#FF8888', '#FFCCCC', '#FFFFFF'],
      ['#282828', '#606060', '#909090', '#C0C0C0', '#FFFFFF']
    ]
  },

  // Template Minimalista
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    format: 'IG_SQUARE',
    category: 'business',
    tags: ['minimal', 'clean', 'modern', 'simple'],
    thumbnail: '/templates/minimal-clean.jpg',
    dsl: {
      grid: { cols: 12, rows: 12, gutter: 24, margin: 64 },
      slots: [
        { 
          id: 'bg', 
          type: 'shape', 
          area: { x: 0, y: 0, w: 12, h: 12 }, 
          role: 'bg'
        },
        { 
          id: 'title', 
          type: 'text', 
          area: { x: 2, y: 4, w: 8, h: 2 }, 
          role: 'h1',
          defaultContent: 'Título',
          constraints: { minWidth: 150, maxWidth: 600 }
        },
        { 
          id: 'subtitle', 
          type: 'text', 
          area: { x: 2, y: 6, w: 8, h: 1 }, 
          role: 'h2',
          defaultContent: 'Subtítulo',
          constraints: { minWidth: 100, maxWidth: 500 }
        },
        { 
          id: 'accent', 
          type: 'shape', 
          area: { x: 2, y: 8, w: 2, h: 0.5 }, 
          role: 'cta'
        }
      ],
      rules: {
        typographyScale: 1.1,
        contrastMin: 4.5
      }
    },
    recommendedPalettes: [
      ['#FFFFFF', '#F8F9FA', '#E9ECEF', '#6C757D', '#212529'],
      ['#000000', '#212529', '#495057', '#ADB5BD', '#F8F9FA']
    ]
  }
];

// Função para obter template por ID
export const getTemplateById = (id: string): Template | undefined => {
  return defaultTemplates.find(template => template.id === id);
};

// Função para obter templates por formato
export const getTemplatesByFormat = (format: string): Template[] => {
  return defaultTemplates.filter(template => template.format === format);
};

// Função para obter templates por categoria
export const getTemplatesByCategory = (category: string): Template[] => {
  return defaultTemplates.filter(template => template.category === category);
};

// Função para buscar templates por tags
export const searchTemplates = (query: string): Template[] => {
  const lowercaseQuery = query.toLowerCase();
  return defaultTemplates.filter(template => 
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    template.category.toLowerCase().includes(lowercaseQuery)
  );
};

// Função para criar template customizado
export const createCustomTemplate = (
  name: string,
  format: string,
  dsl: TemplateDSL,
  category: string = 'custom',
  tags: string[] = []
): Template => {
  return {
    id: `custom-${Date.now()}`,
    name,
    format: format as any,
    category: category as any,
    tags,
    dsl,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Função para validar template DSL
export const validateTemplateDSL = (dsl: TemplateDSL): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validar grid
  if (dsl.grid.cols <= 0 || dsl.grid.rows <= 0) {
    errors.push('Grid deve ter colunas e linhas positivas');
  }

  if (dsl.grid.margin < 0) {
    errors.push('Margem não pode ser negativa');
  }

  // Validar slots
  if (!dsl.slots || dsl.slots.length === 0) {
    errors.push('Template deve ter pelo menos um slot');
  }

  dsl.slots.forEach((slot, index) => {
    if (!slot.id) {
      errors.push(`Slot ${index} deve ter um ID`);
    }

    if (slot.area.x < 0 || slot.area.y < 0 || slot.area.w <= 0 || slot.area.h <= 0) {
      errors.push(`Slot ${slot.id} tem área inválida`);
    }

    if (slot.area.x + slot.area.w > dsl.grid.cols || slot.area.y + slot.area.h > dsl.grid.rows) {
      errors.push(`Slot ${slot.id} está fora dos limites da grade`);
    }
  });

  // Validar regras
  if (dsl.rules.typographyScale <= 0) {
    errors.push('Escala tipográfica deve ser positiva');
  }

  if (dsl.rules.contrastMin < 1) {
    errors.push('Contraste mínimo deve ser pelo menos 1');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// Função para clonar template
export const cloneTemplate = (template: Template, newName?: string): Template => {
  return {
    ...template,
    id: `clone-${Date.now()}`,
    name: newName || `${template.name} (Cópia)`,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};
