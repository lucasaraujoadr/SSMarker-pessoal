import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
import { 
  Project, 
  Page, 
  Layer, 
  TextLayer, 
  ImageLayer, 
  ShapeLayer, 
  IconLayer,
  HistoryAction,
  HistoryState,
  BrandKit,
  Template
} from '@/types';

interface EditorState {
  // Estado atual do projeto
  currentProject: Project | null;
  currentPageId: string | null;
  
  // Seleção e interação
  selectedLayerIds: string[];
  hoveredLayerId: string | null;
  
  // Modo de edição
  tool: 'select' | 'text' | 'image' | 'shape' | 'icon' | 'hand' | 'zoom';
  isDrawing: boolean;
  
  // Transformações
  isResizing: boolean;
  isRotating: boolean;
  isMoving: boolean;
  
  // Zoom e pan
  zoom: number;
  pan: { x: number; y: number };
  
  // Histórico
  history: HistoryState;
  
  // Brand kits e templates
  brandKits: BrandKit[];
  currentBrandKit: BrandKit | null;
  templates: Template[];
  
  // UI state
  sidebarOpen: boolean;
  propertiesPanelOpen: boolean;
  layersPanelOpen: boolean;
  assetsPanelOpen: boolean;
  
  // Loading states
  isLoading: boolean;
  isSaving: boolean;
  isExporting: boolean;
}

interface EditorActions {
  // Projeto
  createProject: (name: string, format: string) => void;
  loadProject: (project: Project) => void;
  saveProject: () => Promise<void>;
  duplicateProject: () => void;
  
  // Páginas
  addPage: (page: Omit<Page, 'id'>) => void;
  removePage: (pageId: string) => void;
  setCurrentPage: (pageId: string) => void;
  updatePage: (pageId: string, updates: Partial<Page>) => void;
  
  // Camadas
  addLayer: (layer: Omit<Layer, 'id'>) => void;
  removeLayer: (layerId: string) => void;
  updateLayer: (layerId: string, updates: Partial<Layer>) => void;
  duplicateLayer: (layerId: string) => void;
  moveLayer: (layerId: string, direction: 'up' | 'down' | 'top' | 'bottom') => void;
  
  // Seleção
  selectLayer: (layerId: string, addToSelection?: boolean) => void;
  selectMultipleLayers: (layerIds: string[]) => void;
  clearSelection: () => void;
  setHoveredLayer: (layerId: string | null) => void;
  
  // Ferramentas
  setTool: (tool: EditorState['tool']) => void;
  setIsDrawing: (isDrawing: boolean) => void;
  
  // Transformações
  setIsResizing: (isResizing: boolean) => void;
  setIsRotating: (isRotating: boolean) => void;
  setIsMoving: (isMoving: boolean) => void;
  
  // Zoom e pan
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  resetView: () => void;
  
  // Histórico
  addHistoryAction: (action: Omit<HistoryAction, 'id' | 'timestamp'>) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Brand kits
  setCurrentBrandKit: (brandKit: BrandKit | null) => void;
  applyBrandKit: (brandKit: BrandKit) => void;
  
  // UI
  setSidebarOpen: (open: boolean) => void;
  setPropertiesPanelOpen: (open: boolean) => void;
  setLayersPanelOpen: (open: boolean) => void;
  setAssetsPanelOpen: (open: boolean) => void;
  
  // Loading
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setExporting: (exporting: boolean) => void;
}

type EditorStore = EditorState & EditorActions;

const createHistoryAction = (
  type: HistoryAction['type'],
  pageId: string,
  layerId?: string,
  before?: any,
  after?: any
): HistoryAction => ({
  id: uuidv4(),
  type,
  pageId,
  layerId,
  before,
  after,
  timestamp: new Date(),
});

export const useEditorStore = create<EditorStore>()(
  immer((set, get) => ({
    // Estado inicial
    currentProject: null,
    currentPageId: null,
    selectedLayerIds: [],
    hoveredLayerId: null,
    tool: 'select',
    isDrawing: false,
    isResizing: false,
    isRotating: false,
    isMoving: false,
    zoom: 1,
    pan: { x: 0, y: 0 },
    history: {
      actions: [],
      currentIndex: -1,
      maxActions: 50,
    },
    brandKits: [],
    currentBrandKit: null,
    templates: [],
    sidebarOpen: true,
    propertiesPanelOpen: true,
    layersPanelOpen: true,
    assetsPanelOpen: false,
    isLoading: false,
    isSaving: false,
    isExporting: false,

    // Ações do projeto
    createProject: (name, format) => {
      const project: Project = {
        id: uuidv4(),
        ownerId: 'current-user', // TODO: implementar auth
        name,
        pages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [],
      };

      // Criar página inicial baseada no formato
      const page: Page = {
        id: uuidv4(),
        name: 'Página 1',
        width: format === 'IG_SQUARE' ? 1080 : format === 'STORY' ? 1080 : 1920,
        height: format === 'IG_SQUARE' ? 1080 : format === 'STORY' ? 1920 : 1080,
        layers: [],
      };

      project.pages.push(page);

      set((state) => {
        state.currentProject = project;
        state.currentPageId = page.id;
        state.selectedLayerIds = [];
        state.history = {
          actions: [],
          currentIndex: -1,
          maxActions: 50,
        };
      });

      // Adicionar ação ao histórico
      get().addHistoryAction({
        type: 'create',
        pageId: page.id,
        before: null,
        after: project,
      });
    },

    loadProject: (project) => {
      set((state) => {
        state.currentProject = project;
        state.currentPageId = project.pages[0]?.id || null;
        state.selectedLayerIds = [];
      });
    },

    saveProject: async () => {
      const { currentProject } = get();
      if (!currentProject) return;

      set((state) => {
        state.isSaving = true;
        if (state.currentProject) {
          state.currentProject.updatedAt = new Date();
        }
      });

      try {
        // TODO: implementar API call
        await new Promise(resolve => setTimeout(resolve, 1000));
      } finally {
        set((state) => {
          state.isSaving = false;
        });
      }
    },

    duplicateProject: () => {
      const { currentProject } = get();
      if (!currentProject) return;

      const duplicatedProject: Project = {
        ...currentProject,
        id: uuidv4(),
        name: `${currentProject.name} (Cópia)`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      set((state) => {
        state.currentProject = duplicatedProject;
      });
    },

    // Ações de páginas
    addPage: (pageData) => {
      const page: Page = {
        ...pageData,
        id: uuidv4(),
      };

      set((state) => {
        if (state.currentProject) {
          state.currentProject.pages.push(page);
          state.currentProject.updatedAt = new Date();
        }
      });

      get().addHistoryAction({
        type: 'create',
        pageId: page.id,
        before: null,
        after: page,
      });
    },

    removePage: (pageId) => {
      set((state) => {
        if (state.currentProject) {
          const pageIndex = state.currentProject.pages.findIndex(p => p.id === pageId);
          if (pageIndex !== -1) {
            const removedPage = state.currentProject.pages[pageIndex];
            state.currentProject.pages.splice(pageIndex, 1);
            state.currentProject.updatedAt = new Date();

            // Se a página removida era a atual, selecionar a primeira
            if (state.currentPageId === pageId) {
              state.currentPageId = state.currentProject.pages[0]?.id || null;
            }

            get().addHistoryAction({
              type: 'delete',
              pageId,
              before: removedPage,
              after: null,
            });
          }
        }
      });
    },

    setCurrentPage: (pageId) => {
      set((state) => {
        state.currentPageId = pageId;
        state.selectedLayerIds = [];
      });
    },

    updatePage: (pageId, updates) => {
      set((state) => {
        if (state.currentProject) {
          const page = state.currentProject.pages.find(p => p.id === pageId);
          if (page) {
            const before = { ...page };
            Object.assign(page, updates);
            state.currentProject.updatedAt = new Date();

            get().addHistoryAction({
              type: 'update',
              pageId,
              before,
              after: { ...page },
            });
          }
        }
      });
    },

    // Ações de camadas
    addLayer: (layerData) => {
      const layer: Layer = {
        ...layerData,
        id: uuidv4(),
      } as Layer;

      set((state) => {
        if (state.currentProject && state.currentPageId) {
          const page = state.currentProject.pages.find(p => p.id === state.currentPageId);
          if (page) {
            page.layers.push(layer);
            state.currentProject.updatedAt = new Date();
            state.selectedLayerIds = [layer.id];
          }
        }
      });

      get().addHistoryAction({
        type: 'create',
        pageId: get().currentPageId!,
        layerId: layer.id,
        before: null,
        after: layer,
      });
    },

    removeLayer: (layerId) => {
      set((state) => {
        if (state.currentProject && state.currentPageId) {
          const page = state.currentProject.pages.find(p => p.id === state.currentPageId);
          if (page) {
            const layerIndex = page.layers.findIndex(l => l.id === layerId);
            if (layerIndex !== -1) {
              const removedLayer = page.layers[layerIndex];
              page.layers.splice(layerIndex, 1);
              state.currentProject.updatedAt = new Date();
              state.selectedLayerIds = state.selectedLayerIds.filter(id => id !== layerId);

              get().addHistoryAction({
                type: 'delete',
                pageId: state.currentPageId!,
                layerId,
                before: removedLayer,
                after: null,
              });
            }
          }
        }
      });
    },

    updateLayer: (layerId, updates) => {
      set((state) => {
        if (state.currentProject && state.currentPageId) {
          const page = state.currentProject.pages.find(p => p.id === state.currentPageId);
          if (page) {
            const layer = page.layers.find(l => l.id === layerId);
            if (layer) {
              const before = { ...layer };
              Object.assign(layer, updates);
              state.currentProject.updatedAt = new Date();

              get().addHistoryAction({
                type: 'update',
                pageId: state.currentPageId!,
                layerId,
                before,
                after: { ...layer },
              });
            }
          }
        }
      });
    },

    duplicateLayer: (layerId) => {
      set((state) => {
        if (state.currentProject && state.currentPageId) {
          const page = state.currentProject.pages.find(p => p.id === state.currentPageId);
          if (page) {
            const originalLayer = page.layers.find(l => l.id === layerId);
            if (originalLayer) {
              const duplicatedLayer: Layer = {
                ...originalLayer,
                id: uuidv4(),
                x: originalLayer.x + 20,
                y: originalLayer.y + 20,
                name: `${originalLayer.name} (Cópia)`,
              };

              page.layers.push(duplicatedLayer);
              state.currentProject.updatedAt = new Date();
              state.selectedLayerIds = [duplicatedLayer.id];

              get().addHistoryAction({
                type: 'create',
                pageId: state.currentPageId!,
                layerId: duplicatedLayer.id,
                before: null,
                after: duplicatedLayer,
              });
            }
          }
        }
      });
    },

    moveLayer: (layerId, direction) => {
      set((state) => {
        if (state.currentProject && state.currentPageId) {
          const page = state.currentProject.pages.find(p => p.id === state.currentPageId);
          if (page) {
            const layerIndex = page.layers.findIndex(l => l.id === layerId);
            if (layerIndex !== -1) {
              const layer = page.layers[layerIndex];
              const before = { ...layer };

              switch (direction) {
                case 'up':
                  if (layerIndex < page.layers.length - 1) {
                    [page.layers[layerIndex], page.layers[layerIndex + 1]] = 
                    [page.layers[layerIndex + 1], page.layers[layerIndex]];
                  }
                  break;
                case 'down':
                  if (layerIndex > 0) {
                    [page.layers[layerIndex], page.layers[layerIndex - 1]] = 
                    [page.layers[layerIndex - 1], page.layers[layerIndex]];
                  }
                  break;
                case 'top':
                  page.layers.splice(layerIndex, 1);
                  page.layers.push(layer);
                  break;
                case 'bottom':
                  page.layers.splice(layerIndex, 1);
                  page.layers.unshift(layer);
                  break;
              }

              state.currentProject.updatedAt = new Date();

              get().addHistoryAction({
                type: 'move',
                pageId: state.currentPageId!,
                layerId,
                before,
                after: { ...layer },
              });
            }
          }
        }
      });
    },

    // Ações de seleção
    selectLayer: (layerId, addToSelection = false) => {
      set((state) => {
        if (addToSelection) {
          if (state.selectedLayerIds.includes(layerId)) {
            state.selectedLayerIds = state.selectedLayerIds.filter(id => id !== layerId);
          } else {
            state.selectedLayerIds.push(layerId);
          }
        } else {
          state.selectedLayerIds = [layerId];
        }
      });
    },

    selectMultipleLayers: (layerIds) => {
      set((state) => {
        state.selectedLayerIds = layerIds;
      });
    },

    clearSelection: () => {
      set((state) => {
        state.selectedLayerIds = [];
      });
    },

    setHoveredLayer: (layerId) => {
      set((state) => {
        state.hoveredLayerId = layerId;
      });
    },

    // Ações de ferramentas
    setTool: (tool) => {
      set((state) => {
        state.tool = tool;
        state.selectedLayerIds = [];
      });
    },

    setIsDrawing: (isDrawing) => {
      set((state) => {
        state.isDrawing = isDrawing;
      });
    },

    // Ações de transformação
    setIsResizing: (isResizing) => {
      set((state) => {
        state.isResizing = isResizing;
      });
    },

    setIsRotating: (isRotating) => {
      set((state) => {
        state.isRotating = isRotating;
      });
    },

    setIsMoving: (isMoving) => {
      set((state) => {
        state.isMoving = isMoving;
      });
    },

    // Ações de zoom e pan
    setZoom: (zoom) => {
      set((state) => {
        state.zoom = Math.max(0.1, Math.min(5, zoom));
      });
    },

    setPan: (pan) => {
      set((state) => {
        state.pan = pan;
      });
    },

    resetView: () => {
      set((state) => {
        state.zoom = 1;
        state.pan = { x: 0, y: 0 };
      });
    },

    // Ações de histórico
    addHistoryAction: (actionData) => {
      const action = createHistoryAction(
        actionData.type,
        actionData.pageId,
        actionData.layerId,
        actionData.before,
        actionData.after
      );

      set((state) => {
        // Remover ações futuras se estamos no meio do histórico
        if (state.history.currentIndex < state.history.actions.length - 1) {
          state.history.actions = state.history.actions.slice(0, state.history.currentIndex + 1);
        }

        state.history.actions.push(action);
        state.history.currentIndex = state.history.actions.length - 1;

        // Limitar número de ações
        if (state.history.actions.length > state.history.maxActions) {
          state.history.actions.shift();
          state.history.currentIndex--;
        }
      });
    },

    undo: () => {
      const { history, currentIndex } = get();
      if (currentIndex >= 0) {
        const action = history.actions[currentIndex];
        // TODO: implementar lógica de undo
        set((state) => {
          state.history.currentIndex--;
        });
      }
    },

    redo: () => {
      const { history, currentIndex } = get();
      if (currentIndex < history.actions.length - 1) {
        const action = history.actions[currentIndex + 1];
        // TODO: implementar lógica de redo
        set((state) => {
          state.history.currentIndex++;
        });
      }
    },

    canUndo: () => {
      const { history } = get();
      return history.currentIndex >= 0;
    },

    canRedo: () => {
      const { history } = get();
      return history.currentIndex < history.actions.length - 1;
    },

    // Ações de brand kit
    setCurrentBrandKit: (brandKit) => {
      set((state) => {
        state.currentBrandKit = brandKit;
      });
    },

    applyBrandKit: (brandKit) => {
      // TODO: implementar aplicação do brand kit
      set((state) => {
        state.currentBrandKit = brandKit;
      });
    },

    // Ações de UI
    setSidebarOpen: (open) => {
      set((state) => {
        state.sidebarOpen = open;
      });
    },

    setPropertiesPanelOpen: (open) => {
      set((state) => {
        state.propertiesPanelOpen = open;
      });
    },

    setLayersPanelOpen: (open) => {
      set((state) => {
        state.layersPanelOpen = open;
      });
    },

    setAssetsPanelOpen: (open) => {
      set((state) => {
        state.assetsPanelOpen = open;
      });
    },

    // Ações de loading
    setLoading: (loading) => {
      set((state) => {
        state.isLoading = loading;
      });
    },

    setSaving: (saving) => {
      set((state) => {
        state.isSaving = saving;
      });
    },

    setExporting: (exporting) => {
      set((state) => {
        state.isExporting = exporting;
      });
    },
  }))
);

// Selectors para performance
export const useCurrentPage = () => {
  const { currentProject, currentPageId } = useEditorStore();
  return currentProject?.pages.find(p => p.id === currentPageId) || null;
};

export const useSelectedLayers = () => {
  const { selectedLayerIds } = useEditorStore();
  const currentPage = useCurrentPage();
  return currentPage?.layers.filter(l => selectedLayerIds.includes(l.id)) || [];
};

export const useCanUndo = () => useEditorStore(state => state.canUndo());
export const useCanRedo = () => useEditorStore(state => state.canRedo());
