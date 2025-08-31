import { BrandKit } from '@/types';

// Brand kits padrão
export const defaultBrandKits: BrandKit[] = [
  {
    id: 'modern-blue',
    name: 'Modern Blue',
    colors: ['#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'],
    fonts: [
      { family: 'Inter', weights: [400, 500, 600, 700] },
      { family: 'Poppins', weights: [400, 500, 600, 700] }
    ],
    logos: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'warm-orange',
    name: 'Warm Orange',
    colors: ['#EA580C', '#F97316', '#FB923C', '#FDBA74', '#FED7AA'],
    fonts: [
      { family: 'Inter', weights: [400, 500, 600, 700] },
      { family: 'Open Sans', weights: [400, 600, 700] }
    ],
    logos: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'elegant-purple',
    name: 'Elegant Purple',
    colors: ['#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE'],
    fonts: [
      { family: 'Playfair Display', weights: [400, 500, 600, 700] },
      { family: 'Inter', weights: [400, 500, 600] }
    ],
    logos: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'nature-green',
    name: 'Nature Green',
    colors: ['#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0'],
    fonts: [
      { family: 'Inter', weights: [400, 500, 600, 700] },
      { family: 'Source Sans Pro', weights: [400, 600] }
    ],
    logos: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'minimal-gray',
    name: 'Minimal Gray',
    colors: ['#111827', '#374151', '#6B7280', '#9CA3AF', '#F3F4F6'],
    fonts: [
      { family: 'Inter', weights: [400, 500, 600, 700] },
      { family: 'Roboto', weights: [400, 500, 700] }
    ],
    logos: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'vibrant-gradient',
    name: 'Vibrant Gradient',
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
    fonts: [
      { family: 'Inter', weights: [400, 500, 600, 700] },
      { family: 'Montserrat', weights: [400, 500, 600, 700] }
    ],
    logos: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Paletas de cores populares
export const colorPalettes = {
  // Paletas do Instagram
  instagram: [
    ['#405DE6', '#5851DB', '#833AB4', '#C13584', '#E1306C', '#FD1D1D'],
    ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
    ['#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E', '#00B894', '#74B9FF']
  ],
  
  // Paletas do Facebook
  facebook: [
    ['#1877F2', '#42A5F5', '#90CAF9', '#E3F2FD', '#FFFFFF', '#F8F9FA'],
    ['#3B5998', '#8B9DC3', '#DFE3EE', '#F7F7F7', '#FFFFFF', '#E9ECEF']
  ],
  
  // Paletas do YouTube
  youtube: [
    ['#FF0000', '#FF4444', '#FF8888', '#FFCCCC', '#FFFFFF', '#F8F9FA'],
    ['#282828', '#606060', '#909090', '#C0C0C0', '#FFFFFF', '#F8F9FA']
  ],
  
  // Paletas profissionais
  professional: [
    ['#2C3E50', '#34495E', '#3498DB', '#E74C3C', '#F39C12', '#27AE60'],
    ['#1A1A1A', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF'],
    ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D', '#592E83', '#2D5A27']
  ],
  
  // Paletas modernas
  modern: [
    ['#667EEA', '#764BA2', '#F093FB', '#F5576C', '#4FACFE', '#00F2FE'],
    ['#FA709A', '#FEE140', '#FF9A9E', '#FECFEF', '#FECFEF', '#FECFEF'],
    ['#A8EDEA', '#FED6E3', '#FFE5B4', '#FFB6C1', '#C8E6C9', '#D1C4E9']
  ]
};

// Tipografias populares
export const fontFamilies = {
  // Fontes sans-serif
  sans: [
    'Inter',
    'Roboto',
    'Open Sans',
    'Poppins',
    'Montserrat',
    'Source Sans Pro',
    'Nunito',
    'Work Sans',
    'DM Sans',
    'Outfit'
  ],
  
  // Fontes serif
  serif: [
    'Playfair Display',
    'Merriweather',
    'Lora',
    'Source Serif Pro',
    'Crimson Text',
    'Libre Baskerville',
    'Georgia',
    'Times New Roman'
  ],
  
  // Fontes display
  display: [
    'Playfair Display',
    'Abril Fatface',
    'Bebas Neue',
    'Righteous',
    'Bungee',
    'Fredoka One',
    'Lobster',
    'Pacifico'
  ],
  
  // Fontes mono
  mono: [
    'JetBrains Mono',
    'Fira Code',
    'Source Code Pro',
    'Roboto Mono',
    'Inconsolata',
    'Cousine',
    'Ubuntu Mono'
  ]
};

// Função para obter brand kit por ID
export const getBrandKitById = (id: string): BrandKit | undefined => {
  return defaultBrandKits.find(kit => kit.id === id);
};

// Função para criar brand kit customizado
export const createBrandKit = (
  name: string,
  colors: string[],
  fonts: { family: string; weights: number[] }[],
  logos: string[] = []
): BrandKit => {
  return {
    id: `custom-${Date.now()}`,
    name,
    colors,
    fonts,
    logos,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Função para validar brand kit
export const validateBrandKit = (brandKit: Partial<BrandKit>): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!brandKit.name || brandKit.name.trim().length === 0) {
    errors.push('Nome do brand kit é obrigatório');
  }

  if (!brandKit.colors || brandKit.colors.length === 0) {
    errors.push('Brand kit deve ter pelo menos uma cor');
  }

  if (brandKit.colors && brandKit.colors.length > 10) {
    errors.push('Brand kit não pode ter mais de 10 cores');
  }

  if (brandKit.colors) {
    brandKit.colors.forEach((color, index) => {
      if (!isValidHexColor(color)) {
        errors.push(`Cor ${index + 1} não é um código hexadecimal válido`);
      }
    });
  }

  if (!brandKit.fonts || brandKit.fonts.length === 0) {
    errors.push('Brand kit deve ter pelo menos uma fonte');
  }

  if (brandKit.fonts && brandKit.fonts.length > 5) {
    errors.push('Brand kit não pode ter mais de 5 fontes');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// Função para validar cor hexadecimal
export const isValidHexColor = (color: string): boolean => {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
};

// Função para gerar paleta de cores baseada em uma cor
export const generateColorPalette = (baseColor: string, type: 'monochromatic' | 'complementary' | 'triadic' | 'analogous' = 'monochromatic'): string[] => {
  if (!isValidHexColor(baseColor)) {
    return [baseColor];
  }

  const hsl = hexToHsl(baseColor);
  const palette: string[] = [baseColor];

  switch (type) {
    case 'monochromatic':
      // Variações de saturação e luminosidade
      palette.push(
        hslToHex(hsl.h, Math.max(0, hsl.s - 20), Math.max(0, hsl.l - 20)),
        hslToHex(hsl.h, Math.min(100, hsl.s + 20), Math.min(100, hsl.l + 20)),
        hslToHex(hsl.h, Math.max(0, hsl.s - 40), Math.max(0, hsl.l - 40)),
        hslToHex(hsl.h, Math.min(100, hsl.s + 40), Math.min(100, hsl.l + 40))
      );
      break;

    case 'complementary':
      // Cor complementar (180° oposta)
      const complementaryHue = (hsl.h + 180) % 360;
      palette.push(
        hslToHex(complementaryHue, hsl.s, hsl.l),
        hslToHex(complementaryHue, Math.max(0, hsl.s - 20), Math.max(0, hsl.l - 20)),
        hslToHex(complementaryHue, Math.min(100, hsl.s + 20), Math.min(100, hsl.l + 20))
      );
      break;

    case 'triadic':
      // Cores triádicas (120° de distância)
      palette.push(
        hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l)
      );
      break;

    case 'analogous':
      // Cores análogas (30° de distância)
      palette.push(
        hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l)
      );
      break;
  }

  return palette.slice(0, 6); // Limitar a 6 cores
};

// Função para converter hex para HSL
export const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

// Função para converter HSL para hex
export const hslToHex = (h: number, s: number, l: number): string => {
  h /= 360;
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h * 6) % 2 - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 1 / 6) {
    r = c;
    g = x;
    b = 0;
  } else if (1 / 6 <= h && h < 1 / 3) {
    r = x;
    g = c;
    b = 0;
  } else if (1 / 3 <= h && h < 1 / 2) {
    r = 0;
    g = c;
    b = x;
  } else if (1 / 2 <= h && h < 2 / 3) {
    r = 0;
    g = x;
    b = c;
  } else if (2 / 3 <= h && h < 5 / 6) {
    r = x;
    g = 0;
    b = c;
  } else if (5 / 6 <= h && h <= 1) {
    r = c;
    g = 0;
    b = x;
  }

  const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
  const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
  const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
};

// Função para calcular contraste entre duas cores
export const calculateContrast = (color1: string, color2: string): number => {
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);
  
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

// Função para calcular luminância
export const getLuminance = (color: string): number => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  
  return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB;
};

// Função para sugerir cores baseadas em uma imagem
export const extractColorsFromImage = async (imageUrl: string): Promise<string[]> => {
  // TODO: Implementar extração de cores de imagem
  // Por enquanto, retorna paleta padrão
  return ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
};

// Função para aplicar brand kit a um projeto
export const applyBrandKitToProject = (brandKit: BrandKit, project: any): any => {
  // TODO: Implementar aplicação do brand kit
  return project;
};
