'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Image, 
  Type, 
  Square, 
  Upload,
  Plus
} from 'lucide-react';

export function AssetLibrary() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2 mb-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar ativos..." className="h-8" />
        </div>
        
        <Tabs defaultValue="images" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="images">Imagens</TabsTrigger>
            <TabsTrigger value="icons">Ícones</TabsTrigger>
            <TabsTrigger value="shapes">Formas</TabsTrigger>
            <TabsTrigger value="text">Texto</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Tabs defaultValue="images" className="w-full">
            <TabsContent value="images" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Imagens</h4>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="aspect-square bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                    >
                      <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="icons" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Ícones</h4>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div
                      key={i}
                      className="aspect-square bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                    >
                      <Square className="h-6 w-6 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="shapes" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Formas</h4>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="aspect-square bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                    >
                      <Square className="h-6 w-6 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="text" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Templates de Texto</h4>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {['Título Principal', 'Subtítulo', 'Corpo do Texto', 'CTA'].map((text, i) => (
                    <div
                      key={i}
                      className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                    >
                      <div className="text-sm font-medium">{text}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Clique para adicionar
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
