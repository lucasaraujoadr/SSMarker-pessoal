'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Palette, 
  Type, 
  Layers,
  X,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import { PropertiesPanel } from './properties-panel';
import { VariationsPanel } from './variations-panel';
import { ExportPanel } from './export-panel';
import { AIGenerationPanel } from './ai-generation-panel';
import { TextPanel } from './text-panel';
import { LogoPanel } from './logo-panel';

export function EditorPanels() {
  const { 
    propertiesPanelOpen, 
    setPropertiesPanelOpen,
    layersPanelOpen,
    setLayersPanelOpen,
    assetsPanelOpen,
    setAssetsPanelOpen
  } = useEditorStore();

  if (!propertiesPanelOpen && !layersPanelOpen && !assetsPanelOpen) {
    return (
      <div className="flex flex-col space-y-2 p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPropertiesPanelOpen(true)}
        >
          <Settings className="h-4 w-4 mr-2" />
          Propriedades
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLayersPanelOpen(true)}
        >
          <Layers className="h-4 w-4 mr-2" />
          Camadas
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAssetsPanelOpen(true)}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          IA & Templates
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 border-l bg-background flex flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Painéis</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setPropertiesPanelOpen(false);
              setLayersPanelOpen(false);
              setAssetsPanelOpen(false);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="ai" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="ai">IA</TabsTrigger>
            <TabsTrigger value="text">Texto</TabsTrigger>
            <TabsTrigger value="logo">Logo</TabsTrigger>
            <TabsTrigger value="properties">Propriedades</TabsTrigger>
            <TabsTrigger value="variations">Variações</TabsTrigger>
            <TabsTrigger value="export">Exportar</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="ai" className="h-full m-0">
              <AIGenerationPanel />
            </TabsContent>

            <TabsContent value="text" className="h-full m-0">
              <TextPanel />
            </TabsContent>

            <TabsContent value="logo" className="h-full m-0">
              <LogoPanel />
            </TabsContent>

            <TabsContent value="properties" className="h-full m-0">
              <PropertiesPanel />
            </TabsContent>

            <TabsContent value="variations" className="h-full m-0">
              <VariationsPanel />
            </TabsContent>

            <TabsContent value="export" className="h-full m-0">
              <ExportPanel />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
