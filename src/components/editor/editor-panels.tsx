'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Palette, 
  Type, 
  Layers,
  X
} from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import { PropertiesPanel } from './properties-panel';
import { VariationsPanel } from './variations-panel';
import { ExportPanel } from './export-panel';

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
        <Tabs defaultValue="properties" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="properties">Propriedades</TabsTrigger>
            <TabsTrigger value="variations">Variações</TabsTrigger>
            <TabsTrigger value="export">Exportar</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
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
