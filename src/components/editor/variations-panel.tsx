'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEditorStore } from '@/store/editor-store';
import { LayoutEngine } from '@/lib/layout-engine';
import { defaultBrandKits } from '@/lib/brand-kits';
import { Palette, Shuffle, RefreshCw, Download } from 'lucide-react';
import { useState } from 'react';

export function VariationsPanel() {
  const { currentPage, currentBrandKit, updatePage } = useEditorStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [variations, setVariations] = useState<any[]>([]);

  const handleGenerateVariations = async () => {
    if (!currentPage || !currentBrandKit) return;

    setIsGenerating(true);
    try {
      // Simular geração de variações
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const layoutEngine = LayoutEngine.getInstance();
      const generatedVariations = await layoutEngine.generateVariations(
        currentPage,
        currentBrandKit,
        {
          colorVariations: 3,
          layoutVariations: 2,
          typographyVariations: 2
        }
      );

      setVariations(generatedVariations);
    } catch (error) {
      console.error('Erro ao gerar variações:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyVariation = (variation: any) => {
    if (!currentPage) return;
    
    // Aplicar a variação à página atual
    updatePage(currentPage.id, {
      ...currentPage,
      layers: variation.layers
    });
  };

  const handleRandomVariation = () => {
    if (variations.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * variations.length);
    handleApplyVariation(variations[randomIndex]);
  };

  const handleQuickColorChange = () => {
    if (!currentPage || !currentBrandKit) return;

    // Alternar entre as cores do brand kit
    const colorIndex = Math.floor(Math.random() * currentBrandKit.colors.length);
    const newColor = currentBrandKit.colors[colorIndex];

    // Aplicar a nova cor aos elementos de texto
    const updatedLayers = currentPage.layers.map(layer => {
      if (layer.type === 'text') {
        return { ...layer, color: newColor };
      }
      return layer;
    });

    updatePage(currentPage.id, {
      ...currentPage,
      layers: updatedLayers
    });
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        <div>
          <h3 className="font-medium mb-4">Variações</h3>
          
          <div className="space-y-3">
            <Button
              onClick={handleGenerateVariations}
              disabled={isGenerating || !currentPage}
              className="w-full"
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Shuffle className="h-4 w-4 mr-2" />
              )}
              Gerar Variações
            </Button>

            <Button
              variant="outline"
              onClick={handleRandomVariation}
              disabled={variations.length === 0}
              className="w-full"
            >
              <Shuffle className="h-4 w-4 mr-2" />
              Variação Aleatória
            </Button>

            <Button
              variant="outline"
              onClick={handleQuickColorChange}
              disabled={!currentBrandKit}
              className="w-full"
            >
              <Palette className="h-4 w-4 mr-2" />
              Trocar Cores
            </Button>
          </div>
        </div>

        {variations.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Variações Geradas</h4>
            <div className="space-y-3">
              {variations.map((variation, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Variação {index + 1}</p>
                        <p className="text-xs text-muted-foreground">
                          {variation.type} • {variation.changes?.length || 0} mudanças
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleApplyVariation(variation)}
                      >
                        Aplicar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="font-medium mb-3">Brand Kits Disponíveis</h4>
          <div className="space-y-2">
            {defaultBrandKits.slice(0, 5).map((brandKit) => (
              <Card key={brandKit.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{brandKit.name}</p>
                      <div className="flex space-x-1 mt-1">
                        {brandKit.colors.slice(0, 4).map((color, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full border border-border"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // Aplicar brand kit
                        console.log('Aplicar brand kit:', brandKit.id);
                      }}
                    >
                      Usar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Dicas de Variação</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Use variações para testar diferentes combinações de cores</p>
            <p>• Experimente com diferentes layouts e tipografias</p>
            <p>• Mantenha a consistência com seu brand kit</p>
            <p>• Salve as variações que funcionam melhor</p>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
