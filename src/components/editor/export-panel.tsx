'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useEditorStore } from '@/store/editor-store';
import { ExportEngine } from '@/lib/export-engine';
import { Download, Image, FileText, Settings, Smartphone, Monitor } from 'lucide-react';
import { useState } from 'react';

const socialMediaFormats = [
  { id: 'instagram-square', name: 'Instagram Square', width: 1080, height: 1080, icon: Smartphone },
  { id: 'instagram-portrait', name: 'Instagram Portrait', width: 1080, height: 1350, icon: Smartphone },
  { id: 'instagram-story', name: 'Instagram Story', width: 1080, height: 1920, icon: Smartphone },
  { id: 'instagram-reel', name: 'Instagram Reel', width: 1080, height: 1920, icon: Smartphone },
  { id: 'facebook-post', name: 'Facebook Post', width: 1200, height: 630, icon: Monitor },
  { id: 'facebook-story', name: 'Facebook Story', width: 1080, height: 1920, icon: Monitor },
  { id: 'twitter-post', name: 'Twitter Post', width: 1200, height: 675, icon: Monitor },
  { id: 'linkedin-post', name: 'LinkedIn Post', width: 1200, height: 627, icon: Monitor },
  { id: 'youtube-thumbnail', name: 'YouTube Thumbnail', width: 1280, height: 720, icon: Monitor },
  { id: 'tiktok-video', name: 'TikTok Video', width: 1080, height: 1920, icon: Smartphone },
];

export function ExportPanel() {
  const { currentPage, currentProject } = useEditorStore();
  const [isExporting, setIsExporting] = useState(false);
  const [exportConfig, setExportConfig] = useState({
    format: 'png',
    quality: 90,
    includeBackground: true,
    scale: 1,
    fileName: currentProject?.name || 'arte-social-media'
  });

  const handleExport = async (type: 'single' | 'batch' | 'social') => {
    if (!currentPage) return;

    setIsExporting(true);
    try {
      const exportEngine = ExportEngine.getInstance();

      switch (type) {
        case 'single':
          await exportEngine.exportPage(currentPage, {
            format: exportConfig.format as any,
            quality: exportConfig.quality,
            includeBackground: exportConfig.includeBackground,
            scale: exportConfig.scale,
            fileName: exportConfig.fileName
          });
          break;

        case 'batch':
          if (currentProject) {
            await exportEngine.exportProject(currentProject, {
              format: exportConfig.format as any,
              quality: exportConfig.quality,
              includeBackground: exportConfig.includeBackground,
              scale: exportConfig.scale,
              fileName: exportConfig.fileName
            });
          }
          break;

        case 'social':
          await exportEngine.exportForSocialMedia(currentPage, {
            format: exportConfig.format as any,
            quality: exportConfig.quality,
            includeBackground: exportConfig.includeBackground,
            scale: exportConfig.scale,
            fileName: exportConfig.fileName
          });
          break;
      }
    } catch (error) {
      console.error('Erro na exportação:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleQuickExport = async (format: any) => {
    if (!currentPage) return;

    setIsExporting(true);
    try {
      const exportEngine = ExportEngine.getInstance();
      await exportEngine.exportPage(currentPage, {
        format: 'png',
        quality: 90,
        includeBackground: true,
        scale: 1,
        fileName: `${exportConfig.fileName}-${format.id}`
      });
    } catch (error) {
      console.error('Erro na exportação rápida:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        <div>
          <h3 className="font-medium mb-4">Exportar</h3>
          
          <div className="space-y-3">
            <Button
              onClick={() => handleExport('single')}
              disabled={isExporting || !currentPage}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar Página Atual
            </Button>

            {currentProject && currentProject.pages.length > 1 && (
              <Button
                variant="outline"
                onClick={() => handleExport('batch')}
                disabled={isExporting}
                className="w-full"
              >
                <FileText className="h-4 w-4 mr-2" />
                Exportar Todas as Páginas
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => handleExport('social')}
              disabled={isExporting || !currentPage}
              className="w-full"
            >
              <Image className="h-4 w-4 mr-2" />
              Exportar para Redes Sociais
            </Button>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Configurações</h4>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fileName">Nome do arquivo</Label>
              <Input
                id="fileName"
                value={exportConfig.fileName}
                onChange={(e) => setExportConfig(prev => ({ ...prev, fileName: e.target.value }))}
                placeholder="Nome do arquivo..."
              />
            </div>

            <div>
              <Label htmlFor="format">Formato</Label>
              <Select
                value={exportConfig.format}
                onValueChange={(value) => setExportConfig(prev => ({ ...prev, format: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpg">JPG</SelectItem>
                  <SelectItem value="webp">WebP</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quality">Qualidade</Label>
              <Select
                value={exportConfig.quality.toString()}
                onValueChange={(value) => setExportConfig(prev => ({ ...prev, quality: Number(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">Máxima (100%)</SelectItem>
                  <SelectItem value="90">Alta (90%)</SelectItem>
                  <SelectItem value="80">Média (80%)</SelectItem>
                  <SelectItem value="60">Baixa (60%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="scale">Escala</Label>
              <Select
                value={exportConfig.scale.toString()}
                onValueChange={(value) => setExportConfig(prev => ({ ...prev, scale: Number(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1x (Padrão)</SelectItem>
                  <SelectItem value="2">2x (Retina)</SelectItem>
                  <SelectItem value="3">3x (Alta resolução)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="includeBackground"
                checked={exportConfig.includeBackground}
                onCheckedChange={(checked) => setExportConfig(prev => ({ ...prev, includeBackground: checked }))}
              />
              <Label htmlFor="includeBackground">Incluir fundo</Label>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Formatos de Redes Sociais</h4>
          <div className="space-y-2">
            {socialMediaFormats.map((format) => {
              const IconComponent = format.icon;
              return (
                <Card key={format.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{format.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {format.width} × {format.height}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuickExport(format)}
                        disabled={isExporting}
                      >
                        Exportar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Dicas de Exportação</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Use PNG para transparência</p>
            <p>• JPG para melhor compressão</p>
            <p>• WebP para web (menor tamanho)</p>
            <p>• 2x para dispositivos retina</p>
            <p>• Verifique as dimensões da rede social</p>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
