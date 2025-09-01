import { ExportConfig, ExportResult, Project, Page, Layer } from '@/types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export class ExportEngine {
  private static instance: ExportEngine;

  static getInstance(): ExportEngine {
    if (!ExportEngine.instance) {
      ExportEngine.instance = new ExportEngine();
    }
    return ExportEngine.instance;
  }

  /**
   * Exporta uma página do projeto
   */
  async exportPage(
    page: Page,
    config: ExportConfig,
    canvasElement?: HTMLElement
  ): Promise<ExportResult> {
    try {
      switch (config.format) {
        case 'png':
          return await this.exportToPNG(page, config, canvasElement);
        case 'jpg':
          return await this.exportToJPG(page, config, canvasElement);
        case 'webp':
          return await this.exportToWebP(page, config, canvasElement);
        case 'pdf':
          return await this.exportToPDF(page, config, canvasElement);
        default:
          throw new Error(`Formato não suportado: ${config.format}`);
      }
    } catch (error) {
      console.error('Erro na exportação:', error);
      throw error;
    }
  }

  /**
   * Exporta múltiplas páginas do projeto
   */
  async exportProject(
    project: Project,
    config: ExportConfig,
    canvasElement?: HTMLElement
  ): Promise<ExportResult[]> {
    const results: ExportResult[] = [];

    for (const page of project.pages) {
      const pageConfig = {
        ...config,
        filename: `${config.filename}_${page.name || page.id}`
      };
      
      const result = await this.exportPage(page, pageConfig, canvasElement);
      results.push(result);
    }

    return results;
  }

  /**
   * Exporta para PNG
   */
  private async exportToPNG(
    page: Page,
    config: ExportConfig,
    canvasElement?: HTMLElement
  ): Promise<ExportResult> {
    if (!canvasElement) {
      throw new Error('Elemento canvas é necessário para exportação PNG');
    }

    const options = {
      scale: config.scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: config.background || '#ffffff',
      width: page.width,
      height: page.height,
      scrollX: 0,
      scrollY: 0
    };

    const canvas = await html2canvas(canvasElement, options);
    
    // Converter para blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve({
              url,
              filename: `${config.filename}.png`,
              size: blob.size,
              format: 'png'
            });
          } else {
            reject(new Error('Falha ao criar blob PNG'));
          }
        },
        'image/png',
        config.quality
      );
    });
  }

  /**
   * Exporta para JPG
   */
  private async exportToJPG(
    page: Page,
    config: ExportConfig,
    canvasElement?: HTMLElement
  ): Promise<ExportResult> {
    if (!canvasElement) {
      throw new Error('Elemento canvas é necessário para exportação JPG');
    }

    const options = {
      scale: config.scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: config.background || '#ffffff',
      width: page.width,
      height: page.height,
      scrollX: 0,
      scrollY: 0
    };

    const canvas = await html2canvas(canvasElement, options);
    
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve({
              url,
              filename: `${config.filename}.jpg`,
              size: blob.size,
              format: 'jpg'
            });
          } else {
            reject(new Error('Falha ao criar blob JPG'));
          }
        },
        'image/jpeg',
        config.quality
      );
    });
  }

  /**
   * Exporta para WebP
   */
  private async exportToWebP(
    page: Page,
    config: ExportConfig,
    canvasElement?: HTMLElement
  ): Promise<ExportResult> {
    if (!canvasElement) {
      throw new Error('Elemento canvas é necessário para exportação WebP');
    }

    const options = {
      scale: config.scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: config.background || '#ffffff',
      width: page.width,
      height: page.height,
      scrollX: 0,
      scrollY: 0
    };

    const canvas = await html2canvas(canvasElement, options);
    
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve({
              url,
              filename: `${config.filename}.webp`,
              size: blob.size,
              format: 'webp'
            });
          } else {
            reject(new Error('Falha ao criar blob WebP'));
          }
        },
        'image/webp',
        config.quality
      );
    });
  }

  /**
   * Exporta para PDF
   */
  private async exportToPDF(
    page: Page,
    config: ExportConfig,
    canvasElement?: HTMLElement
  ): Promise<ExportResult> {
    if (!canvasElement) {
      throw new Error('Elemento canvas é necessário para exportação PDF');
    }

    const options = {
      scale: config.scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: config.background || '#ffffff',
      width: page.width,
      height: page.height,
      scrollX: 0,
      scrollY: 0
    };

    const canvas = await html2canvas(canvasElement, options);
    
    // Calcular dimensões do PDF
    const imgWidth = page.width;
    const imgHeight = page.height;
    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = (imgHeight * pdfWidth) / imgWidth;
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Adicionar imagem ao PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    // Adicionar metadados se configurado
    if (config.includeMetadata) {
      pdf.setProperties({
        title: config.filename,
        subject: 'Social Media Design',
        author: 'Social Media Maker',
        creator: 'Social Media Maker'
      });
    }
    
    // Gerar blob do PDF
    const pdfBlob = pdf.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    
    return {
      url,
      filename: `${config.filename}.pdf`,
      size: pdfBlob.size,
      format: 'pdf'
    };
  }

  /**
   * Exporta em lote com diferentes formatos
   */
  async exportBatch(
    page: Page,
    formats: ExportConfig[],
    canvasElement?: HTMLElement
  ): Promise<ExportResult[]> {
    const results: ExportResult[] = [];

    for (const config of formats) {
      try {
        const result = await this.exportPage(page, config, canvasElement);
        results.push(result);
      } catch (error) {
        console.error(`Erro ao exportar ${config.format}:`, error);
        // Continuar com outros formatos mesmo se um falhar
      }
    }

    return results;
  }

  /**
   * Exporta com redimensionamento automático para diferentes formatos
   */
  async exportForSocialMedia(
    page: Page,
    config: ExportConfig,
    canvasElement?: HTMLElement
  ): Promise<ExportResult[]> {
    const socialFormats = [
      { name: 'instagram-square', width: 1080, height: 1080 },
      { name: 'instagram-story', width: 1080, height: 1920 },
      { name: 'instagram-portrait', width: 1080, height: 1350 },
      { name: 'facebook-post', width: 1200, height: 630 },
      { name: 'twitter-post', width: 1200, height: 675 },
      { name: 'linkedin-post', width: 1200, height: 627 },
      { name: 'youtube-thumbnail', width: 1280, height: 720 }
    ];

    const results: ExportResult[] = [];

    for (const format of socialFormats) {
      try {
        const formatConfig = {
          ...config,
          filename: `${config.filename}_${format.name}`,
          scale: 1 // Usar escala 1 para redimensionamento automático
        };

        // TODO: Implementar redimensionamento do canvas para o formato específico
        const result = await this.exportPage(page, formatConfig, canvasElement);
        results.push(result);
      } catch (error) {
        console.error(`Erro ao exportar ${format.name}:`, error);
      }
    }

    return results;
  }

  /**
   * Gera preview de baixa qualidade para preview
   */
  async generatePreview(
    page: Page,
    canvasElement?: HTMLElement
  ): Promise<string> {
    if (!canvasElement) {
      throw new Error('Elemento canvas é necessário para preview');
    }

    const options = {
      scale: 0.5, // Preview em baixa qualidade
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: page.width,
      height: page.height,
      scrollX: 0,
      scrollY: 0
    };

    const canvas = await html2canvas(canvasElement, options);
    return canvas.toDataURL('image/jpeg', 0.7);
  }

  /**
   * Calcula tamanho estimado do arquivo
   */
  estimateFileSize(
    page: Page,
    format: string,
    quality: number = 0.8
  ): number {
    const pixels = page.width * page.height;
    const bytesPerPixel = format === 'png' ? 4 : format === 'jpg' ? 3 : 4;
    const compressionRatio = format === 'png' ? 0.8 : format === 'jpg' ? quality : 0.7;
    
    return Math.round(pixels * bytesPerPixel * compressionRatio);
  }

  /**
   * Valida configuração de exportação
   */
  validateExportConfig(config: ExportConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.filename || config.filename.trim().length === 0) {
      errors.push('Nome do arquivo é obrigatório');
    }

    if (config.quality < 0.1 || config.quality > 1) {
      errors.push('Qualidade deve estar entre 0.1 e 1');
    }

    if (config.scale < 0.1 || config.scale > 5) {
      errors.push('Escala deve estar entre 0.1 e 5');
    }

    const supportedFormats = ['png', 'jpg', 'webp', 'pdf'];
    if (!supportedFormats.includes(config.format)) {
      errors.push(`Formato não suportado. Use: ${supportedFormats.join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Limpa URLs criadas para evitar vazamento de memória
   */
  cleanupUrls(urls: string[]): void {
    urls.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
  }

  /**
   * Download de arquivo
   */
  downloadFile(result: ExportResult): void {
    const link = document.createElement('a');
    link.href = result.url;
    link.download = result.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Download múltiplos arquivos
   */
  downloadFiles(results: ExportResult[]): void {
    results.forEach(result => {
      this.downloadFile(result);
    });
  }
}

export const exportEngine = ExportEngine.getInstance();
