'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Trash2, 
  Copy,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useEditorStore, useCurrentPage } from '@/store/editor-store';
import { Layer } from '@/types';

export function LayerList() {
  const { 
    selectedLayerIds, 
    selectLayer, 
    removeLayer, 
    duplicateLayer,
    updateLayer 
  } = useEditorStore();
  const currentPage = useCurrentPage();

  if (!currentPage) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Nenhuma página selecionada
      </div>
    );
  }

  const handleToggleVisibility = (layer: Layer) => {
    updateLayer(layer.id, { visible: !layer.visible });
  };

  const handleToggleLock = (layer: Layer) => {
    updateLayer(layer.id, { locked: !layer.locked });
  };

  const handleDelete = (layerId: string) => {
    removeLayer(layerId);
  };

  const handleDuplicate = (layerId: string) => {
    duplicateLayer(layerId);
  };

  const getLayerIcon = (layer: Layer) => {
    switch (layer.type) {
      case 'text':
        return 'T';
      case 'image':
        return '🖼️';
      case 'shape':
        return '⬜';
      case 'icon':
        return '🔷';
      default:
        return '📄';
    }
  };

  const getLayerName = (layer: Layer) => {
    if (layer.name) return layer.name;
    
    switch (layer.type) {
      case 'text':
        return `Texto: ${layer.content?.substring(0, 20)}${layer.content?.length > 20 ? '...' : ''}`;
      case 'image':
        return 'Imagem';
      case 'shape':
        return `${layer.shape.charAt(0).toUpperCase() + layer.shape.slice(1)}`;
      case 'icon':
        return `Ícone: ${layer.name}`;
      default:
        return 'Camada';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-medium">Camadas ({currentPage.layers.length})</h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {currentPage.layers.map((layer) => {
            const isSelected = selectedLayerIds.includes(layer.id);
            const isVisible = layer.visible;
            const isLocked = layer.locked;

            return (
              <div
                key={layer.id}
                className={`
                  group flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors
                  ${isSelected 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'hover:bg-muted/50'
                  }
                  ${!isVisible ? 'opacity-50' : ''}
                `}
                onClick={() => selectLayer(layer.id)}
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <div className="w-6 h-6 flex items-center justify-center text-xs bg-muted rounded">
                    {getLayerIcon(layer)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {getLayerName(layer)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {layer.type}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleVisibility(layer);
                    }}
                    title={isVisible ? 'Ocultar' : 'Mostrar'}
                  >
                    {isVisible ? (
                      <Eye className="h-3 w-3" />
                    ) : (
                      <EyeOff className="h-3 w-3" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleLock(layer);
                    }}
                    title={isLocked ? 'Desbloquear' : 'Bloquear'}
                  >
                    {isLocked ? (
                      <Lock className="h-3 w-3" />
                    ) : (
                      <Unlock className="h-3 w-3" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicate(layer.id);
                    }}
                    title="Duplicar"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(layer.id);
                    }}
                    title="Excluir"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {currentPage.layers.length === 0 && (
        <div className="p-4 text-center text-muted-foreground">
          <p className="text-sm">Nenhuma camada criada</p>
          <p className="text-xs mt-1">Use as ferramentas para adicionar conteúdo</p>
        </div>
      )}
    </div>
  );
}
