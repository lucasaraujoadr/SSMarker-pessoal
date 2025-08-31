'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useEditorStore, useSelectedLayers } from '@/store/editor-store';
import { Layer } from '@/types';

export function PropertiesPanel() {
  const selectedLayers = useSelectedLayers();
  const { updateLayer } = useEditorStore();

  if (selectedLayers.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p className="text-sm">Nenhuma camada selecionada</p>
        <p className="text-xs mt-1">Selecione uma camada para ver suas propriedades</p>
      </div>
    );
  }

  if (selectedLayers.length > 1) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p className="text-sm">{selectedLayers.length} camadas selecionadas</p>
        <p className="text-xs mt-1">Selecione apenas uma camada para editar propriedades</p>
      </div>
    );
  }

  const layer = selectedLayers[0];

  const handleUpdateLayer = (updates: Partial<Layer>) => {
    updateLayer(layer.id, updates);
  };

  const renderLayerProperties = () => {
    switch (layer.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="content">Conteúdo</Label>
              <Input
                id="content"
                value={layer.content}
                onChange={(e) => handleUpdateLayer({ content: e.target.value })}
                placeholder="Digite o texto..."
              />
            </div>

            <div>
              <Label htmlFor="fontFamily">Fonte</Label>
              <Select
                value={layer.fontFamily}
                onValueChange={(value) => handleUpdateLayer({ fontFamily: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Open Sans">Open Sans</SelectItem>
                  <SelectItem value="Poppins">Poppins</SelectItem>
                  <SelectItem value="Montserrat">Montserrat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fontSize">Tamanho da fonte</Label>
              <Input
                id="fontSize"
                type="number"
                value={layer.fontSize}
                onChange={(e) => handleUpdateLayer({ fontSize: Number(e.target.value) })}
                min="8"
                max="200"
              />
            </div>

            <div>
              <Label htmlFor="color">Cor</Label>
              <Input
                id="color"
                type="color"
                value={layer.color}
                onChange={(e) => handleUpdateLayer({ color: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="align">Alinhamento</Label>
              <Select
                value={layer.align}
                onValueChange={(value: any) => handleUpdateLayer({ align: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Esquerda</SelectItem>
                  <SelectItem value="center">Centro</SelectItem>
                  <SelectItem value="right">Direita</SelectItem>
                  <SelectItem value="justify">Justificado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="src">URL da imagem</Label>
              <Input
                id="src"
                value={layer.src}
                onChange={(e) => handleUpdateLayer({ src: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label htmlFor="fit">Ajuste</Label>
              <Select
                value={layer.fit}
                onValueChange={(value: any) => handleUpdateLayer({ fit: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cover">Cobrir</SelectItem>
                  <SelectItem value="contain">Conter</SelectItem>
                  <SelectItem value="fill">Preencher</SelectItem>
                  <SelectItem value="none">Nenhum</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'shape':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="shape">Forma</Label>
              <Select
                value={layer.shape}
                onValueChange={(value: any) => handleUpdateLayer({ shape: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rect">Retângulo</SelectItem>
                  <SelectItem value="circle">Círculo</SelectItem>
                  <SelectItem value="line">Linha</SelectItem>
                  <SelectItem value="polygon">Polígono</SelectItem>
                  <SelectItem value="star">Estrela</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fill">Preenchimento</Label>
              <Input
                id="fill"
                type="color"
                value={layer.fill || '#000000'}
                onChange={(e) => handleUpdateLayer({ fill: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="stroke">Contorno</Label>
              <Input
                id="stroke"
                type="color"
                value={layer.stroke || '#000000'}
                onChange={(e) => handleUpdateLayer({ stroke: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="strokeWidth">Espessura do contorno</Label>
              <Input
                id="strokeWidth"
                type="number"
                value={layer.strokeWidth || 1}
                onChange={(e) => handleUpdateLayer({ strokeWidth: Number(e.target.value) })}
                min="0"
                max="20"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 text-center text-muted-foreground">
            <p className="text-sm">Propriedades não disponíveis</p>
          </div>
        );
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        <div>
          <h3 className="font-medium mb-4">Propriedades</h3>
          <div className="space-y-2">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={layer.name}
                onChange={(e) => handleUpdateLayer({ name: e.target.value })}
                placeholder="Nome da camada..."
              />
            </div>

            <div>
              <Label htmlFor="opacity">Opacidade</Label>
              <Slider
                value={[layer.opacity * 100]}
                onValueChange={([value]) => handleUpdateLayer({ opacity: value / 100 })}
                max={100}
                min={0}
                step={1}
                className="mt-2"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {Math.round(layer.opacity * 100)}%
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Posição e Tamanho</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="x">X</Label>
              <Input
                id="x"
                type="number"
                value={Math.round(layer.x)}
                onChange={(e) => handleUpdateLayer({ x: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="y">Y</Label>
              <Input
                id="y"
                type="number"
                value={Math.round(layer.y)}
                onChange={(e) => handleUpdateLayer({ y: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="width">Largura</Label>
              <Input
                id="width"
                type="number"
                value={Math.round(layer.width)}
                onChange={(e) => handleUpdateLayer({ width: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="height">Altura</Label>
              <Input
                id="height"
                type="number"
                value={Math.round(layer.height)}
                onChange={(e) => handleUpdateLayer({ height: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Propriedades Específicas</h4>
          {renderLayerProperties()}
        </div>
      </div>
    </ScrollArea>
  );
}
