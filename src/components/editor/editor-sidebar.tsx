'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Layers, 
  Image, 
  Type, 
  Square, 
  Palette, 
  FolderOpen,
  Plus,
  Eye,
  EyeOff,
  Lock,
  Unlock
} from 'lucide-react';
import { useEditorStore, useCurrentPage } from '@/store/editor-store';
import { LayerList } from './layer-list';
import { AssetLibrary } from './asset-library';
import { BrandKitPanel } from './brand-kit-panel';

export function EditorSidebar() {
  const { sidebarOpen, setSidebarOpen } = useEditorStore();
  const currentPage = useCurrentPage();

  if (!sidebarOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="absolute left-4 top-4 z-10"
        onClick={() => setSidebarOpen(true)}
      >
        <Layers className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="w-80 border-r bg-background flex flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Painel</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
          >
            <Layers className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="layers" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="layers">Camadas</TabsTrigger>
            <TabsTrigger value="assets">Ativos</TabsTrigger>
            <TabsTrigger value="brand">Marca</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="layers" className="h-full m-0">
              <LayerList />
            </TabsContent>

            <TabsContent value="assets" className="h-full m-0">
              <AssetLibrary />
            </TabsContent>

            <TabsContent value="brand" className="h-full m-0">
              <BrandKitPanel />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Quick Actions */}
      <div className="border-t p-4">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
          <Button variant="outline" size="sm">
            <FolderOpen className="h-4 w-4 mr-2" />
            Importar
          </Button>
        </div>
      </div>
    </div>
  );
}
