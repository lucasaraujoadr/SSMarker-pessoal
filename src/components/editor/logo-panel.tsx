'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { 
  Upload, 
  Image as ImageIcon, 
  Plus, 
  Trash2,
  RotateCw,
  Move,
  Maximize2
} from 'lucide-react';
import { useEditorStore, useSelectedLayers } from '@/store/editor-store';
import toast from 'react-hot-toast';

export function LogoPanel() {
  const { addLayer, updateLayer, selectedLayerIds } = useEditorStore();
  const selectedLayers = useSelectedLayers();
  const selectedLogoLayer = selectedLayers.find(layer => layer.type === 'image' && layer.name?.includes('Logo')) as any;

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione um arquivo de imagem');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      toast.error('Arquivo muito grande. Máximo 10MB');
      return;
    }

    setIsUploading(true);
    try {
      // Simular upload (em produção, seria enviado para servidor)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const imageUrl = URL.createObjectURL(file);
      
      addLayer({
        type: 'image',
        x: 50,
        y: 50,
        width: 100,
        height: 100,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
        name: `Logo - ${file.name}`,
        src: imageUrl,
        fit: 'contain',
      } as any);

      toast.success('Logo adicionado ao canvas!');
    } catch (error) {
      toast.error('Erro ao carregar logo');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const updateSelectedLogo = (updates: any) => {
    if (selectedLogoLayer) {
      updateLayer(selectedLogoLayer.id, updates);
    }
  };

  const handleSizeChange = (value: number[]) => {
    const size = value[0];
    updateSelectedLogo({ 
      width: size, 
      height: size 
    });
  };

  const handleOpacityChange = (value: number[]) => {
    const opacity = value[0] / 100;
    updateSelectedLogo({ opacity });
  };

  const handleRotationChange = (value: number[]) => {
    const rotation = value[0];
    updateSelectedLogo({ rotation });
  };

  const removeLogo = () => {
    if (selectedLogoLayer) {
      // TODO: implementar remoção de layer
      toast.success('Logo removido');
    }
  };

  const logos = [
    { name: 'Logo 1', url: 'https://picsum.photos/100/100?random=1' },
    { name: 'Logo 2', url: 'https://picsum.photos/100/100?random=2' },
    { name: 'Logo 3', url: 'https://picsum.photos/100/100?random=3' },
    { name: 'Logo 4', url: 'https://picsum.photos/100/100?random=4' },
  ];

  const addPresetLogo = (logo: typeof logos[0]) => {
    addLayer({
      type: 'image',
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      name: `Logo - ${logo.name}`,
      src: logo.url,
      fit: 'contain',
    } as any);

    toast.success('Logo adicionado ao canvas!');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Logo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload de logo */}
        <div className="space-y-2">
          <Label>Upload de Logo</Label>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                  Carregando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Selecionar Logo
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              PNG, JPG, SVG até 10MB
            </p>
          </div>
        </div>

        {/* Logos pré-definidos */}
        <div className="space-y-2">
          <Label>Logos Pré-definidos</Label>
          <div className="grid grid-cols-2 gap-2">
            {logos.map((logo, index) => (
              <div
                key={index}
                className="border rounded-lg p-2 cursor-pointer hover:border-primary transition-colors"
                onClick={() => addPresetLogo(logo)}
              >
                <img
                  src={logo.url}
                  alt={logo.name}
                  className="w-full h-16 object-contain"
                />
                <p className="text-xs text-center mt-1 text-muted-foreground">
                  {logo.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Editar logo selecionado */}
        {selectedLogoLayer && (
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium text-sm">Editar Logo Selecionado</h4>
            
            <div className="space-y-2">
              <Label>Tamanho: {Math.round(selectedLogoLayer.width)}px</Label>
              <Slider
                value={[selectedLogoLayer.width]}
                onValueChange={handleSizeChange}
                min={20}
                max={300}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Opacidade: {Math.round(selectedLogoLayer.opacity * 100)}%</Label>
              <Slider
                value={[selectedLogoLayer.opacity * 100]}
                onValueChange={handleOpacityChange}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Rotação: {Math.round(selectedLogoLayer.rotation)}°</Label>
              <Slider
                value={[selectedLogoLayer.rotation]}
                onValueChange={handleRotationChange}
                min={0}
                max={360}
                step={1}
                className="w-full"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateSelectedLogo({ rotation: 0 })}
                className="flex-1"
              >
                <RotateCw className="h-4 w-4 mr-2" />
                Resetar Rotação
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateSelectedLogo({ width: 100, height: 100 })}
                className="flex-1"
              >
                <Maximize2 className="h-4 w-4 mr-2" />
                Tamanho Padrão
              </Button>
            </div>

            <Button
              variant="destructive"
              size="sm"
              onClick={removeLogo}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remover Logo
            </Button>
          </div>
        )}

        {/* Dicas */}
        <div className="bg-muted/50 rounded-lg p-3">
          <h4 className="font-medium text-sm mb-2">💡 Dicas para logos:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Use PNG com fundo transparente para melhor resultado</li>
            <li>• Mantenha o logo em tamanho adequado (não muito grande)</li>
            <li>• Posicione em áreas que não interfiram no texto principal</li>
            <li>• Considere a opacidade para não competir com outros elementos</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
