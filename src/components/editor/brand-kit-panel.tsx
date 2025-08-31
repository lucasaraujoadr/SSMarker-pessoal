'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { defaultBrandKits } from '@/lib/brand-kits';
import { useEditorStore } from '@/store/editor-store';
import { Palette, Type, Upload } from 'lucide-react';

export function BrandKitPanel() {
  const { currentBrandKit, setCurrentBrandKit } = useEditorStore();

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-medium mb-3">Brand Kit</h3>
        
        {currentBrandKit ? (
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium">{currentBrandKit.name}</h4>
              <p className="text-xs text-muted-foreground">
                {currentBrandKit.colors.length} cores, {currentBrandKit.fonts.length} fontes
              </p>
            </div>
            
            <div className="flex space-x-1">
              {currentBrandKit.colors.slice(0, 5).map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full border border-border"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Palette className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Nenhum brand kit selecionado</p>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Brand Kits Disponíveis</h4>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Importar
            </Button>
          </div>

          <div className="space-y-2">
            {defaultBrandKits.map((brandKit) => (
              <div
                key={brandKit.id}
                className={`
                  p-3 rounded-lg border cursor-pointer transition-colors
                  ${currentBrandKit?.id === brandKit.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                  }
                `}
                onClick={() => setCurrentBrandKit(brandKit)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium">{brandKit.name}</h5>
                  {currentBrandKit?.id === brandKit.id && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
                
                <div className="flex space-x-1 mb-2">
                  {brandKit.colors.slice(0, 4).map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Type className="h-3 w-3" />
                  <span>{brandKit.fonts.length} fontes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
