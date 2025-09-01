'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Type, 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Palette,
  Plus,
  Trash2
} from 'lucide-react';
import { useEditorStore, useSelectedLayers } from '@/store/editor-store';
import toast from 'react-hot-toast';

export function TextPanel() {
  const { addLayer, updateLayer, selectedLayerIds } = useEditorStore();
  const selectedLayers = useSelectedLayers();
  const selectedTextLayer = selectedLayers.find(layer => layer.type === 'text') as any;

  const [newText, setNewText] = useState('');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [fontSize, setFontSize] = useState(24);
  const [fontWeight, setFontWeight] = useState(400);
  const [color, setColor] = useState('#000000');
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right' | 'justify'>('left');

  const fonts = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Playfair Display', label: 'Playfair Display' },
    { value: 'Merriweather', label: 'Merriweather' },
  ];

  const fontWeights = [
    { value: 100, label: 'Thin' },
    { value: 300, label: 'Light' },
    { value: 400, label: 'Regular' },
    { value: 500, label: 'Medium' },
    { value: 600, label: 'Semi Bold' },
    { value: 700, label: 'Bold' },
    { value: 900, label: 'Black' },
  ];

  const addTextLayer = () => {
    if (!newText.trim()) {
      toast.error('Digite um texto para adicionar');
      return;
    }

    addLayer({
      type: 'text',
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      name: 'Texto',
      content: newText,
      fontFamily,
      fontWeight,
      fontSize,
      lineHeight: 1.2,
      letterSpacing: 0,
      color,
      align: alignment,
      verticalAlign: 'top',
    } as any);

    setNewText('');
    toast.success('Texto adicionado ao canvas!');
  };

  const updateSelectedText = (updates: any) => {
    if (selectedTextLayer) {
      updateLayer(selectedTextLayer.id, updates);
    }
  };

  const handleFontFamilyChange = (value: string) => {
    setFontFamily(value);
    updateSelectedText({ fontFamily: value });
  };

  const handleFontSizeChange = (value: number[]) => {
    const size = value[0];
    setFontSize(size);
    updateSelectedText({ fontSize: size });
  };

  const handleFontWeightChange = (value: string) => {
    const weight = parseInt(value);
    setFontWeight(weight);
    updateSelectedText({ fontWeight: weight });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    updateSelectedText({ color: newColor });
  };

  const handleAlignmentChange = (value: string) => {
    const align = value as 'left' | 'center' | 'right' | 'justify';
    setAlignment(align);
    updateSelectedText({ align });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateSelectedText({ content: e.target.value });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="h-5 w-5" />
          Texto
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Adicionar novo texto */}
        <div className="space-y-2">
          <Label htmlFor="new-text">Adicionar Texto</Label>
          <Textarea
            id="new-text"
            placeholder="Digite seu texto aqui..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            rows={2}
          />
          <Button 
            onClick={addTextLayer}
            disabled={!newText.trim()}
            className="w-full"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Texto
          </Button>
        </div>

        {/* Editar texto selecionado */}
        {selectedTextLayer && (
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium text-sm">Editar Texto Selecionado</h4>
            
            <div className="space-y-2">
              <Label htmlFor="text-content">Conteúdo</Label>
              <Textarea
                id="text-content"
                value={selectedTextLayer.content}
                onChange={handleContentChange}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="font-family">Fonte</Label>
                <Select value={selectedTextLayer.fontFamily} onValueChange={handleFontFamilyChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fonts.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-weight">Peso</Label>
                <Select value={selectedTextLayer.fontWeight.toString()} onValueChange={handleFontWeightChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontWeights.map((weight) => (
                      <SelectItem key={weight.value} value={weight.value.toString()}>
                        {weight.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="font-size">Tamanho da Fonte: {selectedTextLayer.fontSize}px</Label>
              <Slider
                id="font-size"
                value={[selectedTextLayer.fontSize]}
                onValueChange={handleFontSizeChange}
                min={8}
                max={200}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="text-color">Cor do Texto</Label>
              <div className="flex items-center gap-2">
                <input
                  id="text-color"
                  type="color"
                  value={selectedTextLayer.color}
                  onChange={handleColorChange}
                  className="w-10 h-10 rounded border cursor-pointer"
                />
                <Input
                  value={selectedTextLayer.color}
                  onChange={handleColorChange}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Alinhamento</Label>
              <div className="flex gap-1">
                <Button
                  variant={selectedTextLayer.align === 'left' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleAlignmentChange('left')}
                  className="flex-1"
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant={selectedTextLayer.align === 'center' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleAlignmentChange('center')}
                  className="flex-1"
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                  variant={selectedTextLayer.align === 'right' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleAlignmentChange('right')}
                  className="flex-1"
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
                <Button
                  variant={selectedTextLayer.align === 'justify' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleAlignmentChange('justify')}
                  className="flex-1"
                >
                  <AlignJustify className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Estilos de texto */}
            <div className="space-y-2">
              <Label>Estilos</Label>
              <div className="flex gap-2">
                <Button
                  variant={selectedTextLayer.fontWeight >= 700 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateSelectedText({ 
                    fontWeight: selectedTextLayer.fontWeight >= 700 ? 400 : 700 
                  })}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  variant={selectedTextLayer.fontStyle === 'italic' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateSelectedText({ 
                    fontStyle: selectedTextLayer.fontStyle === 'italic' ? 'normal' : 'italic' 
                  })}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  variant={selectedTextLayer.textDecoration === 'underline' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateSelectedText({ 
                    textDecoration: selectedTextLayer.textDecoration === 'underline' ? 'none' : 'underline' 
                  })}
                >
                  <Underline className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Textos rápidos */}
        <div className="space-y-2">
          <Label>Textos Rápidos</Label>
          <div className="grid grid-cols-2 gap-2">
            {[
              'Título Principal',
              'Subtítulo',
              'Call to Action',
              'Descrição',
              'Preço',
              'Desconto'
            ].map((quickText) => (
              <Button
                key={quickText}
                variant="outline"
                size="sm"
                onClick={() => setNewText(quickText)}
                className="text-xs"
              >
                {quickText}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
