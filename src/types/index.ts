// Tipos principais do sistema
export type BrandKit = {
  id: string;
  name: string;
  colors: string[]; // hex
  fonts: { family: string; weights: number[] }[];
  logos: string[]; // URLs
  createdAt: Date;
  updatedAt: Date;
};

export type Template = {
  id: string;
  name: string;
  format: "IG_SQUARE" | "IG_PORTRAIT" | "STORY" | "FB_LINK" | "YT_THUMB" | "CUSTOM";
  dsl: TemplateDSL;
  recommendedPalettes?: string[][]; // arrays de hex
  thumbnail?: string;
  category: "social" | "marketing" | "business" | "personal";
  tags: string[];
};

export type TemplateDSL = {
  grid: {
    cols: number;
    rows: number;
    gutter: number;
    margin: number;
  };
  slots: TemplateSlot[];
  rules: {
    typographyScale: number;
    contrastMin: number;
    safeAreas?: {
      story?: { top: number; bottom: number };
      reel?: { top: number; bottom: number };
    };
  };
};

export type TemplateSlot = {
  id: string;
  type: "text" | "image" | "shape" | "icon";
  area: { x: number; y: number; w: number; h: number };
  role?: "h1" | "h2" | "h3" | "body" | "cta" | "logo" | "bg";
  fit?: "cover" | "contain";
  defaultContent?: string;
  constraints?: {
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
  };
};

export type Project = {
  id: string;
  ownerId: string;
  name: string;
  brandKitId?: string;
  pages: Page[];
  createdAt: Date;
  updatedAt: Date;
  thumbnail?: string;
  tags: string[];
};

export type Page = {
  id: string;
  name: string;
  width: number;
  height: number;
  layers: Layer[];
  background?: string;
};

export type Layer =
  | TextLayer
  | ImageLayer
  | ShapeLayer
  | IconLayer;

export type BaseLayer = {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  name: string;
};

export type TextLayer = BaseLayer & {
  type: "text";
  content: string;
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  color: string;
  align: "left" | "center" | "right" | "justify";
  verticalAlign: "top" | "middle" | "bottom";
  textDecoration?: "underline" | "line-through" | "none";
  fontStyle?: "normal" | "italic";
  backgroundColor?: string;
  padding?: { top: number; right: number; bottom: number; left: number };
  borderRadius?: number;
  shadow?: {
    x: number;
    y: number;
    blur: number;
    color: string;
  };
};

export type ImageLayer = BaseLayer & {
  type: "image";
  src: string;
  fit: "cover" | "contain" | "fill" | "none";
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  filters?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    blur?: number;
  };
  mask?: {
    type: "circle" | "rounded" | "custom";
    radius?: number;
    path?: string;
  };
};

export type ShapeLayer = BaseLayer & {
  type: "shape";
  shape: "rect" | "circle" | "line" | "polygon" | "star";
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: number[];
  borderRadius?: number;
  points?: number[]; // para polígonos
  sides?: number; // para estrelas
  innerRadius?: number; // para estrelas
};

export type IconLayer = BaseLayer & {
  type: "icon";
  name: string;
  color?: string;
  size: number;
  library?: "lucide" | "heroicons" | "custom";
};

// Tipos para o motor de layout
export type LayoutEngine = {
  calculateLayout: (template: TemplateDSL, content: Record<string, any>, canvasSize: { width: number; height: number }) => LayoutResult;
};

export type LayoutResult = {
  positions: Record<string, { x: number; y: number; width: number; height: number }>;
  styles: Record<string, any>;
  warnings: string[];
};

// Tipos para variações
export type VariationConfig = {
  id: string;
  name: string;
  type: "color" | "typography" | "layout" | "composition";
  changes: VariationChange[];
};

export type VariationChange = {
  target: string; // layer id ou "global"
  property: string;
  value: any;
  interpolation?: "linear" | "ease" | "random";
};

// Tipos para exportação
export type ExportConfig = {
  format: "png" | "jpg" | "webp" | "pdf";
  quality: number;
  scale: number;
  background?: string;
  includeMetadata: boolean;
  filename: string;
};

export type ExportResult = {
  url: string;
  filename: string;
  size: number;
  format: string;
};

// Tipos para histórico (Undo/Redo)
export type HistoryAction = {
  id: string;
  type: "create" | "update" | "delete" | "move" | "resize" | "style";
  layerId?: string;
  pageId: string;
  before?: any;
  after?: any;
  timestamp: Date;
};

export type HistoryState = {
  actions: HistoryAction[];
  currentIndex: number;
  maxActions: number;
};

// Tipos para colaboração (futuro)
export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "owner" | "editor" | "viewer";
};

export type CollaborationSession = {
  id: string;
  projectId: string;
  users: User[];
  cursors: Record<string, { x: number; y: number; userId: string }>;
  selections: Record<string, string[]>; // userId -> layerIds
};

// Tipos para biblioteca de ativos
export type Asset = {
  id: string;
  name: string;
  type: "image" | "icon" | "shape" | "template" | "font";
  url: string;
  thumbnail?: string;
  tags: string[];
  category: string;
  size?: number;
  dimensions?: { width: number; height: number };
  createdAt: Date;
  updatedAt: Date;
};

// Tipos para configurações do usuário
export type UserSettings = {
  id: string;
  userId: string;
  theme: "light" | "dark" | "system";
  language: string;
  shortcuts: Record<string, string>;
  defaultFormats: string[];
  autoSave: boolean;
  gridSnap: boolean;
  guides: boolean;
  performance: "quality" | "speed" | "balanced";
};

// Tipos para analytics e métricas
export type ProjectMetrics = {
  projectId: string;
  timeSpent: number;
  layersCreated: number;
  variationsGenerated: number;
  exportsCount: number;
  lastActivity: Date;
};

// Tipos para notificações
export type Notification = {
  id: string;
  userId: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  action?: {
    label: string;
    url: string;
  };
};
