'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Layers, 
} from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import { AIGenerationPanel } from './ai-generation-panel';
import { TextPanel } from './text-panel';
import { LogoPanel } from './logo-panel';

export function EditorSidebar() {
  const { sidebarOpen, setSidebarOpen } = useEditorStore();

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
        <Tabs defaultValue="ai" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ai">IA</TabsTrigger>
            <TabsTrigger value="text">Texto</TabsTrigger>
            <TabsTrigger value="logo">Logo</TabsTrigger>
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
          </div>
        </Tabs>
      </div>
    </div>
  );
}
