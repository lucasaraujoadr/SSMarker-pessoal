import { TemplateDSL, TemplateSlot, LayoutResult, BrandKit } from '@/types';

export class LayoutEngine {
  private static instance: LayoutEngine;

  static getInstance(): LayoutEngine {
    if (!LayoutEngine.instance) {
      LayoutEngine.instance = new LayoutEngine();
    }
    return LayoutEngine.instance;
  }

  /**
   * Calcula o layout automático baseado no template DSL e conteúdo
   */
  calculateLayout(
    template: TemplateDSL,
    content: Record<string, any>,
    canvasSize: { width: number; height: number },
    brandKit?: BrandKit
  ): LayoutResult {
    const positions: Record<string, { x: number; y: number; width: number; height: number }> = {};
    const styles: Record<string, any> = {};
    const warnings: string[] = [];

    // Calcular tamanhos da grade
    const gridCellWidth = (canvasSize.width - template.grid.margin * 2) / template.grid.cols;
    const gridCellHeight = (canvasSize.height - template.grid.margin * 2) / template.grid.rows;

    // Processar cada slot
    for (const slot of template.slots) {
      const slotContent = content[slot.id];
      
      if (!slotContent) {
        warnings.push(`Conteúdo não encontrado para slot: ${slot.id}`);
        continue;
      }

      // Calcular posição baseada na grade
      const x = template.grid.margin + slot.area.x * gridCellWidth;
      const y = template.grid.margin + slot.area.y * gridCellHeight;
      const width = slot.area.w * gridCellWidth;
      const height = slot.area.h * gridCellHeight;

      positions[slot.id] = { x, y, width, height };

      // Aplicar estilos baseados no tipo e papel
      const slotStyles = this.calculateSlotStyles(slot, slotContent, brandKit, template.rules);
      styles[slot.id] = slotStyles;

      // Validar constraints
      this.validateConstraints(slot, positions[slot.id], warnings);
    }

    // Aplicar regras de tipografia
    this.applyTypographyRules(template, styles, brandKit);

    // Aplicar regras de contraste
    this.applyContrastRules(template, styles, warnings);

    return { positions, styles, warnings };
  }

  /**
   * Calcula estilos específicos para cada slot
   */
  private calculateSlotStyles(
    slot: TemplateSlot,
    content: any,
    brandKit?: BrandKit,
    rules?: any
  ): any {
    const styles: any = {};

    switch (slot.type) {
      case 'text':
        styles.fontFamily = this.getFontFamily(slot.role, brandKit);
        styles.fontWeight = this.getFontWeight(slot.role, brandKit);
        styles.fontSize = this.calculateFontSize(slot, content, rules);
        styles.lineHeight = this.calculateLineHeight(styles.fontSize);
        styles.letterSpacing = this.getLetterSpacing(slot.role);
        styles.color = this.getTextColor(slot.role, brandKit);
        styles.textAlign = this.getTextAlign(slot.role);
        break;

      case 'image':
        styles.objectFit = slot.fit || 'cover';
        styles.borderRadius = this.getImageBorderRadius(slot.role);
        break;

      case 'shape':
        styles.fill = this.getShapeFill(slot.role, brandKit);
        styles.stroke = this.getShapeStroke(slot.role, brandKit);
        styles.strokeWidth = this.getStrokeWidth(slot.role);
        break;

      case 'icon':
        styles.color = this.getIconColor(slot.role, brandKit);
        styles.size = this.calculateIconSize(slot);
        break;
    }

    return styles;
  }

  /**
   * Aplica regras de tipografia baseadas na escala modular
   */
  private applyTypographyRules(template: TemplateDSL, styles: Record<string, any>, brandKit?: BrandKit): void {
    const scale = template.rules.typographyScale;

    // Definir tamanhos base para cada papel
    const baseSizes = {
      h1: 48,
      h2: 32,
      h3: 24,
      body: 16,
      cta: 18,
    };

    // Aplicar escala para cada slot de texto
    Object.entries(styles).forEach(([slotId, slotStyles]) => {
      if (slotStyles.fontSize && slotStyles.role) {
        const baseSize = baseSizes[slotStyles.role as keyof typeof baseSizes] || 16;
        slotStyles.fontSize = Math.round(baseSize * Math.pow(scale, this.getHierarchyLevel(slotStyles.role)));
      }
    });
  }

  /**
   * Aplica regras de contraste para acessibilidade
   */
  private applyContrastRules(template: TemplateDSL, styles: Record<string, any>, warnings: string[]): void {
    const minContrast = template.rules.contrastMin || 4.5;

    Object.entries(styles).forEach(([slotId, slotStyles]) => {
      if (slotStyles.color && slotStyles.backgroundColor) {
        const contrast = this.calculateContrast(slotStyles.color, slotStyles.backgroundColor);
        if (contrast < minContrast) {
          warnings.push(`Contraste insuficiente (${contrast.toFixed(2)}) para slot: ${slotId}`);
          // Ajustar automaticamente para melhor contraste
          slotStyles.color = this.adjustForContrast(slotStyles.color, slotStyles.backgroundColor, minContrast);
        }
      }
    });
  }

  /**
   * Valida constraints do slot
   */
  private validateConstraints(
    slot: TemplateSlot,
    position: { x: number; y: number; width: number; height: number },
    warnings: string[]
  ): void {
    if (slot.constraints) {
      if (slot.constraints.minWidth && position.width < slot.constraints.minWidth) {
        warnings.push(`Largura mínima não atendida para slot: ${slot.id}`);
      }
      if (slot.constraints.maxWidth && position.width > slot.constraints.maxWidth) {
        warnings.push(`Largura máxima excedida para slot: ${slot.id}`);
      }
      if (slot.constraints.minHeight && position.height < slot.constraints.minHeight) {
        warnings.push(`Altura mínima não atendida para slot: ${slot.id}`);
      }
      if (slot.constraints.maxHeight && position.height > slot.constraints.maxHeight) {
        warnings.push(`Altura máxima excedida para slot: ${slot.id}`);
      }
    }
  }

  /**
   * Calcula tamanho de fonte baseado no conteúdo e papel
   */
  private calculateFontSize(slot: TemplateSlot, content: any, rules?: any): number {
    const baseSize = this.getBaseFontSize(slot.role);
    const contentLength = content?.length || 0;
    
    // Ajustar baseado no tamanho do conteúdo
    let size = baseSize;
    if (contentLength > 100) {
      size *= 0.9;
    } else if (contentLength < 20) {
      size *= 1.1;
    }

    // Aplicar escala do template
    if (rules?.typographyScale) {
      size *= rules.typographyScale;
    }

    return Math.round(size);
  }

  /**
   * Calcula altura da linha baseada no tamanho da fonte
   */
  private calculateLineHeight(fontSize: number): number {
    return Math.round(fontSize * 1.4);
  }

  /**
   * Calcula tamanho do ícone baseado no slot
   */
  private calculateIconSize(slot: TemplateSlot): number {
    const baseSize = 24;
    const area = slot.area.w * slot.area.h;
    
    // Ajustar baseado na área disponível
    if (area < 4) return baseSize * 0.5;
    if (area > 16) return baseSize * 1.5;
    
    return baseSize;
  }

  /**
   * Obtém família de fonte baseada no papel e brand kit
   */
  private getFontFamily(role?: string, brandKit?: BrandKit): string {
    if (brandKit?.fonts && brandKit.fonts.length > 0) {
      // Mapear papel para fonte específica
      const fontMap: Record<string, number> = {
        h1: 0,
        h2: 0,
        h3: 0,
        body: 1,
        cta: 0,
      };
      
      const fontIndex = fontMap[role || 'body'] || 0;
      return brandKit.fonts[fontIndex]?.family || 'Inter';
    }
    
    return 'Inter';
  }

  /**
   * Obtém peso da fonte baseado no papel
   */
  private getFontWeight(role?: string, brandKit?: BrandKit): number {
    const weightMap: Record<string, number> = {
      h1: 700,
      h2: 600,
      h3: 600,
      body: 400,
      cta: 600,
    };
    
    return weightMap[role || 'body'] || 400;
  }

  /**
   * Obtém cor do texto baseada no papel e brand kit
   */
  private getTextColor(role?: string, brandKit?: BrandKit): string {
    if (brandKit?.colors && brandKit.colors.length > 0) {
      const colorMap: Record<string, number> = {
        h1: 0,
        h2: 0,
        h3: 1,
        body: 2,
        cta: 1,
      };
      
      const colorIndex = colorMap[role || 'body'] || 0;
      return brandKit.colors[colorIndex] || '#000000';
    }
    
    return '#000000';
  }

  /**
   * Obtém alinhamento de texto baseado no papel
   */
  private getTextAlign(role?: string): string {
    const alignMap: Record<string, string> = {
      h1: 'center',
      h2: 'left',
      h3: 'left',
      body: 'left',
      cta: 'center',
    };
    
    return alignMap[role || 'body'] || 'left';
  }

  /**
   * Obtém espaçamento entre letras baseado no papel
   */
  private getLetterSpacing(role?: string): number {
    const spacingMap: Record<string, number> = {
      h1: 0.5,
      h2: 0.2,
      h3: 0.1,
      body: 0,
      cta: 0.5,
    };
    
    return spacingMap[role || 'body'] || 0;
  }

  /**
   * Obtém tamanho base da fonte
   */
  private getBaseFontSize(role?: string): number {
    const sizeMap: Record<string, number> = {
      h1: 48,
      h2: 32,
      h3: 24,
      body: 16,
      cta: 18,
    };
    
    return sizeMap[role || 'body'] || 16;
  }

  /**
   * Obtém nível hierárquico para escala tipográfica
   */
  private getHierarchyLevel(role?: string): number {
    const levelMap: Record<string, number> = {
      h1: 2,
      h2: 1,
      h3: 0,
      body: -1,
      cta: 0,
    };
    
    return levelMap[role || 'body'] || 0;
  }

  /**
   * Obtém cor de preenchimento para formas
   */
  private getShapeFill(role?: string, brandKit?: BrandKit): string {
    if (brandKit?.colors && brandKit.colors.length > 0) {
      return brandKit.colors[0] || '#000000';
    }
    return '#000000';
  }

  /**
   * Obtém cor de contorno para formas
   */
  private getShapeStroke(role?: string, brandKit?: BrandKit): string {
    if (brandKit?.colors && brandKit.colors.length > 1) {
      return brandKit.colors[1] || '#000000';
    }
    return 'transparent';
  }

  /**
   * Obtém largura do contorno
   */
  private getStrokeWidth(role?: string): number {
    return role === 'cta' ? 2 : 1;
  }

  /**
   * Obtém cor do ícone
   */
  private getIconColor(role?: string, brandKit?: BrandKit): string {
    return this.getTextColor(role, brandKit);
  }

  /**
   * Obtém raio da borda para imagens
   */
  private getImageBorderRadius(role?: string): number {
    return role === 'logo' ? 0 : 8;
  }

  /**
   * Calcula contraste entre duas cores
   */
  private calculateContrast(color1: string, color2: string): number {
    const luminance1 = this.getLuminance(color1);
    const luminance2 = this.getLuminance(color2);
    
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Calcula luminância de uma cor
   */
  private getLuminance(color: string): number {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    
    return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB;
  }

  /**
   * Ajusta cor para melhor contraste
   */
  private adjustForContrast(color: string, backgroundColor: string, minContrast: number): string {
    // Implementação simplificada - inverter a cor se necessário
    const contrast = this.calculateContrast(color, backgroundColor);
    if (contrast < minContrast) {
      return this.invertColor(color);
    }
    return color;
  }

  /**
   * Inverte uma cor
   */
  private invertColor(color: string): string {
    const hex = color.replace('#', '');
    const r = (255 - parseInt(hex.substr(0, 2), 16)).toString(16).padStart(2, '0');
    const g = (255 - parseInt(hex.substr(2, 2), 16)).toString(16).padStart(2, '0');
    const b = (255 - parseInt(hex.substr(4, 2), 16)).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }

  /**
   * Gera variações de layout
   */
  generateVariations(
    template: TemplateDSL,
    content: Record<string, any>,
    canvasSize: { width: number; height: number },
    brandKit?: BrandKit,
    variationType: 'color' | 'layout' | 'typography' = 'color'
  ): LayoutResult[] {
    const variations: LayoutResult[] = [];

    switch (variationType) {
      case 'color':
        variations.push(...this.generateColorVariations(template, content, canvasSize, brandKit));
        break;
      case 'layout':
        variations.push(...this.generateLayoutVariations(template, content, canvasSize, brandKit));
        break;
      case 'typography':
        variations.push(...this.generateTypographyVariations(template, content, canvasSize, brandKit));
        break;
    }

    return variations;
  }

  /**
   * Gera variações de cor
   */
  private generateColorVariations(
    template: TemplateDSL,
    content: Record<string, any>,
    canvasSize: { width: number; height: number },
    brandKit?: BrandKit
  ): LayoutResult[] {
    const variations: LayoutResult[] = [];
    
    if (!brandKit?.colors || brandKit.colors.length < 2) {
      return variations;
    }

    // Criar variações com diferentes combinações de cores
    for (let i = 0; i < Math.min(3, brandKit.colors.length); i++) {
      const modifiedBrandKit = {
        ...brandKit,
        colors: [...brandKit.colors.slice(i), ...brandKit.colors.slice(0, i)]
      };
      
      const variation = this.calculateLayout(template, content, canvasSize, modifiedBrandKit);
      variations.push(variation);
    }

    return variations;
  }

  /**
   * Gera variações de layout
   */
  private generateLayoutVariations(
    template: TemplateDSL,
    content: Record<string, any>,
    canvasSize: { width: number; height: number },
    brandKit?: BrandKit
  ): LayoutResult[] {
    const variations: LayoutResult[] = [];

    // Variação 1: Layout mais espaçado
    const spacedTemplate = {
      ...template,
      grid: { ...template.grid, gutter: template.grid.gutter * 1.5 }
    };
    variations.push(this.calculateLayout(spacedTemplate, content, canvasSize, brandKit));

    // Variação 2: Layout mais compacto
    const compactTemplate = {
      ...template,
      grid: { ...template.grid, gutter: template.grid.gutter * 0.5 }
    };
    variations.push(this.calculateLayout(compactTemplate, content, canvasSize, brandKit));

    return variations;
  }

  /**
   * Gera variações de tipografia
   */
  private generateTypographyVariations(
    template: TemplateDSL,
    content: Record<string, any>,
    canvasSize: { width: number; height: number },
    brandKit?: BrandKit
  ): LayoutResult[] {
    const variations: LayoutResult[] = [];

    // Variação 1: Escala maior
    const largerTemplate = {
      ...template,
      rules: { ...template.rules, typographyScale: template.rules.typographyScale * 1.2 }
    };
    variations.push(this.calculateLayout(largerTemplate, content, canvasSize, brandKit));

    // Variação 2: Escala menor
    const smallerTemplate = {
      ...template,
      rules: { ...template.rules, typographyScale: template.rules.typographyScale * 0.8 }
    };
    variations.push(this.calculateLayout(smallerTemplate, content, canvasSize, brandKit));

    return variations;
  }
}

export const layoutEngine = LayoutEngine.getInstance();
