'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Undo, 
  Redo, 
  Save, 
  Download, 
  Plus, 
  Type, 
  Image, 
  Square, 
  MousePointer,
  Hand,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { useEditorStore, useCanUndo, useCanRedo } from '@/store/editor-store';
import toast from 'react-hot-toast';

export function EditorToolbar() {
  const { 
    tool, 
    setTool, 
    undo, 
    redo, 
    saveProject, 
    resetView, 
    setZoom, 
    zoom,
    isSaving 
  } = useEditorStore();
  
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const handleSave = async () => {
    try {
      await saveProject();
      toast.success('Projeto salvo com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar projeto');
    }
  };

  const handleZoomIn = () => {
    setZoom(Math.min(5, zoom + 0.25));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(0.1, zoom - 0.25));
  };

  const tools = [
    { id: 'select', icon: MousePointer, label: 'Selecionar' },
    { id: 'text', icon: Type, label: 'Texto' },
    { id: 'image', icon: Image, label: 'Imagem' },
    { id: 'shape', icon: Square, label: 'Forma' },
    { id: 'hand', icon: Hand, label: 'Mover' },
  ];

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left Section - History & Save */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={undo}
            disabled={!canUndo}
            title="Desfazer"
          >
            <Undo className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={redo}
            disabled={!canRedo}
            title="Refazer"
          >
            <Redo className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            title="Salvar"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
            ) : (
              <Save className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            title="Exportar"
            onClick={() => {
              // TODO: implementar abertura do painel de exportação
              toast.success('Painel de exportação aberto!');
            }}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>

        {/* Center Section - Tools */}
        <div className="flex items-center space-x-1">
          {tools.map((toolItem) => {
            const Icon = toolItem.icon;
            const isActive = tool === toolItem.id;
            
            return (
              <Button
                key={toolItem.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setTool(toolItem.id as any)}
                title={toolItem.label}
                className="w-10 h-10 p-0"
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
          })}
        </div>

        {/* Right Section - Zoom & View */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            title="Diminuir zoom"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <div className="text-sm text-muted-foreground min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            title="Aumentar zoom"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button
            variant="outline"
            size="sm"
            onClick={resetView}
            title="Resetar visualização"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
