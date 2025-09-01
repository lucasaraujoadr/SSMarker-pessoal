'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Download, 
  Image as ImageIcon, 
  FileText,
  Settings,
  Check,
  X
} from 'lucide-react';
import { useEditorStore, useCurrentPage } from '@/store/editor-store';
import toast from 'react-hot-toast';

export function ExportPanel() {
  const { currentProject, setExporting } = useEditorStore();
  const currentPage = useCurrentPage();
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'png' | 'jpg' | 'webp' | 'pdf'>('png');
  const [quality, setQuality] = useState(90);
  const [scale, setScale] = useState(2);
  const [filename, setFilename] = useState('');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [background, setBackground] = useState('#ffffff');

  const formats = [
    { value: 'png', label: 'PNG', description: 'Transparência, alta qualidade' },
    { value: 'jpg', label: 'JPG', description: 'Menor tamanho, boa qualidade' },
    { value: 'webp', label: 'WebP', description: 'Moderno, otimizado' },
    { value: 'pdf', label: 'PDF', description: 'Vetorial, para impressão' },
  ];

  const presetSizes = [
    { name: 'Instagram Square', width: 1080, height: 1080 },
    { name: 'Instagram Portrait', width: 1080, height: 1350 },
    { name: 'Instagram Story', width: 1080, height: 1920 },
    { name: 'Facebook Post', width: 1200, height: 630 },
    { name: 'Twitter Post', width: 1200, height: 675 },
    { name: 'YouTube Thumbnail', width: 1280, height: 720 },
    { name: 'LinkedIn Post', width: 1200, height: 627 },
  ];

  const generateFilename = () => {
    const projectName = currentProject?.name || 'arte';
    const timestamp = new Date().toISOString().slice(0, 10);
    return `${projectName}-${timestamp}`;
  };

  const handleExport = async () => {
    if (!currentPage) {
      toast.error('Nenhuma página para exportar');
      return;
    }

    setIsExporting(true);
    setExporting(true);

    try {
      // Simular processo de exportação
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Em produção, aqui seria feita a exportação real do canvas
      const finalFilename = filename || generateFilename();
      
      // Simular download
      const link = document.createElement('a');
      link.href = `data:text/plain;charset=utf-8,${encodeURIComponent('Arte exportada com sucesso!')}`;
      link.download = `${finalFilename}.${exportFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Arte exportada como ${finalFilename}.${exportFormat}`);
    } catch (error) {
      toast.error('Erro ao exportar arte');
      console.error(error);
    } finally {
      setIsExporting(false);
      setExporting(false);
    }
  };

  const exportMultipleFormats = async () => {
    if (!currentPage) {
      toast.error('Nenhuma página para exportar');
      return;
    }

    setIsExporting(true);
    setExporting(true);

    try {
      const formatsToExport = ['png', 'jpg', 'webp'];
      const finalFilename = filename || generateFilename();

      for (const format of formatsToExport) {
        // Simular exportação de cada formato
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const link = document.createElement('a');
        link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(`Arte exportada em ${format}`)}`;
        link.download = `${finalFilename}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast.success('Artes exportadas em múltiplos formatos!');
    } catch (error) {
      toast.error('Erro ao exportar artes');
      console.error(error);
    } finally {
      setIsExporting(false);
      setExporting(false);
    }
  };

  const exportForSocialMedia = async () => {
    if (!currentPage) {
      toast.error('Nenhuma página para exportar');
      return;
    }

    setIsExporting(true);
    setExporting(true);

    try {
      const finalFilename = filename || generateFilename();

      for (const preset of presetSizes) {
        // Simular exportação para cada formato de rede social
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const link = document.createElement('a');
        link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(`Arte para ${preset.name}`)}`;
        link.download = `${finalFilename}-${preset.name.replace(/\s+/g, '-').toLowerCase()}.${exportFormat}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast.success('Artes exportadas para todas as redes sociais!');
    } catch (error) {
      toast.error('Erro ao exportar artes');
      console.error(error);
    } finally {
      setIsExporting(false);
      setExporting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Exportar Arte
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Configurações básicas */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="filename">Nome do arquivo</Label>
            <Input
              id="filename"
              placeholder={generateFilename()}
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="format">Formato</Label>
            <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {formats.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{format.label}</span>
                      <span className="text-xs text-muted-foreground">{format.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quality">Qualidade: {quality}%</Label>
            <Slider
              id="quality"
              value={[quality]}
              onValueChange={(value) => setQuality(value[0])}
              min={10}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="scale">Escala: {scale}x</Label>
            <Slider
              id="scale"
              value={[scale]}
              onValueChange={(value) => setScale(value[0])}
              min={1}
              max={4}
              step={0.5}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="background">Cor de fundo</Label>
            <div className="flex items-center gap-2">
              <input
                id="background"
                type="color"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                className="w-10 h-10 rounded border cursor-pointer"
              />
              <Input
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="metadata"
              checked={includeMetadata}
              onCheckedChange={setIncludeMetadata}
            />
            <Label htmlFor="metadata">Incluir metadados</Label>
          </div>
        </div>

        {/* Botões de exportação */}
        <div className="space-y-2">
          <Button 
            onClick={handleExport}
            disabled={isExporting}
            className="w-full"
            size="lg"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Exportar Arte
              </>
            )}
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={exportMultipleFormats}
              disabled={isExporting}
              size="sm"
            >
              <FileText className="h-4 w-4 mr-2" />
              Múltiplos Formatos
            </Button>
            <Button
              variant="outline"
              onClick={exportForSocialMedia}
              disabled={isExporting}
              size="sm"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Redes Sociais
            </Button>
          </div>
        </div>

        {/* Informações da exportação */}
        {currentPage && (
          <div className="bg-muted/50 rounded-lg p-3">
            <h4 className="font-medium text-sm mb-2">📊 Informações da Exportação:</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Tamanho original: {currentPage.width} × {currentPage.height}px</div>
              <div>Tamanho final: {currentPage.width * scale} × {currentPage.height * scale}px</div>
              <div>Formato: {exportFormat.toUpperCase()}</div>
              <div>Qualidade: {quality}%</div>
              <div>Camadas: {currentPage.layers.length}</div>
            </div>
          </div>
        )}

        {/* Formatos de rede social */}
        <div className="space-y-2">
          <Label>Formatos para Redes Sociais</Label>
          <div className="grid grid-cols-1 gap-2">
            {presetSizes.map((preset) => (
              <div
                key={preset.name}
                className="flex items-center justify-between p-2 border rounded text-sm"
              >
                <span>{preset.name}</span>
                <span className="text-muted-foreground">
                  {preset.width} × {preset.height}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
