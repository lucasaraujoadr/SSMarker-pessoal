'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Upload, 
  Sparkles, 
  Image as ImageIcon, 
  Download,
  RefreshCw,
  Palette,
  Type
} from 'lucide-react';
import { useEditorStore, useCurrentPage } from '@/store/editor-store';
import { aiService } from '@/lib/ai-service';
import toast from 'react-hot-toast';

interface AIGenerationPanelProps {
  onImageGenerated?: (imageUrl: string) => void;
}

export function AIGenerationPanel({ onImageGenerated }: AIGenerationPanelProps) {
  const { addLayer, currentProject } = useEditorStore();
  const currentPage = useCurrentPage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('modern');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [referenceUrl, setReferenceUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [footer, setFooter] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const styles = [
    { value: 'modern', label: 'Moderno' },
    { value: 'vintage', label: 'Vintage' },
    { value: 'minimalist', label: 'Minimalista' },
    { value: 'bold', label: 'Ousado' },
    { value: 'elegant', label: 'Elegante' },
    { value: 'playful', label: 'Divertido' },
  ];

  const aspectRatios = [
    { value: '1:1', label: 'Quadrado (1:1)', width: 1080, height: 1080 },
    { value: '4:5', label: 'Portrait (4:5)', width: 1080, height: 1350 },
    { value: '16:9', label: 'Landscape (16:9)', width: 1920, height: 1080 },
    { value: '9:16', label: 'Story (9:16)', width: 1080, height: 1920 },
  ];

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleStyleChange = (value: string) => {
    setStyle(value);
  };

  const handleAspectRatioChange = (value: string) => {
    setAspectRatio(value);
  };

  const generateImage = async (applyToCanvas: boolean = false) => {
    if (!prompt.trim()) {
      toast.error('Digite um prompt para gerar a imagem');
      return;
    }

    setIsGenerating(true);
    try {
      const selectedRatio = aspectRatios.find(ratio => ratio.value === aspectRatio);
      const { width, height } = selectedRatio || { width: 1080, height: 1080 };

      const response = await aiService.generateImage({
        prompt,
        style,
        width,
        height,
        quality: 90,
        referenceImageUrl: referenceUrl || undefined,
        instructions: prompt,
      });

      if (response.success && response.imageUrl) {
        setGeneratedImage(response.imageUrl);
        if (applyToCanvas) {
          // aplica direto ao canvas
          applyImageToCanvas(response.imageUrl, width, height);
          onImageGenerated?.(response.imageUrl);
        }
        toast.success('Imagem gerada com sucesso!');
      } else {
        toast.error(response.error || 'Erro ao gerar imagem');
      }
    } catch (error) {
      toast.error('Erro ao gerar imagem');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione um arquivo de imagem');
      return;
    }

    setIsUploading(true);
    try {
      // Simular upload (em produção, seria enviado para servidor)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const imageUrl = URL.createObjectURL(file);
      setReferenceUrl(imageUrl); // usar como referência (não substitui a gerada)
      
      toast.success('Template carregado com sucesso!');
    } catch (error) {
      toast.error('Erro ao carregar template');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const applyImageToCanvas = (imageUrl: string, genW: number, genH: number) => {
    if (!currentProject || !currentPage) return;

    // imagem como fundo do tamanho da página selecionada
    addLayer({
      type: 'image',
      x: 0,
      y: 0,
      width: currentPage.width,
      height: currentPage.height,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      name: 'Imagem Gerada',
      src: imageUrl,
      fit: 'cover',
    } as any);

    const baseX = 60;
    const baseY = 60;
    const maxW = Math.max(240, Math.floor(width / 3));

    if (title.trim()) {
      addLayer({
        type: 'text',
        x: baseX,
        y: baseY,
        width: maxW,
        height: 60,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
        name: 'Título',
        content: title,
        fontFamily: 'Inter',
        fontWeight: 700,
        fontSize: 32,
        lineHeight: 36,
        letterSpacing: 0,
        color: '#ffffff',
        align: 'left',
        verticalAlign: 'top',
        shadow: { x: 0, y: 2, blur: 8, color: 'rgba(0,0,0,0.35)' },
      } as any);
    }

    if (subtitle.trim()) {
      addLayer({
        type: 'text',
        x: baseX,
        y: baseY + 70,
        width: maxW,
        height: 48,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
        name: 'Subtítulo',
        content: subtitle,
        fontFamily: 'Inter',
        fontWeight: 500,
        fontSize: 18,
        lineHeight: 24,
        letterSpacing: 0,
        color: '#ffffff',
        align: 'left',
        verticalAlign: 'top',
        shadow: { x: 0, y: 2, blur: 6, color: 'rgba(0,0,0,0.35)' },
      } as any);
    }

    if (footer.trim()) {
      addLayer({
        type: 'text',
        x: baseX,
        y: baseY + 70 + 56,
        width: maxW,
        height: 40,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
        name: 'Rodapé',
        content: footer,
        fontFamily: 'Inter',
        fontWeight: 500,
        fontSize: 14,
        lineHeight: 18,
        letterSpacing: 0,
        color: '#ffffff',
        align: 'left',
        verticalAlign: 'top',
        shadow: { x: 0, y: 2, blur: 6, color: 'rgba(0,0,0,0.35)' },
      } as any);
    }

    toast.success('Imagem adicionada ao canvas!');
    onImageGenerated?.(generatedImage);
  };

  const regenerateImage = () => {
    if (prompt.trim()) {
      generateImage();
    }
  };

  const addImageToCanvas = () => {
    if (!generatedImage) return;
    const selectedRatio = aspectRatios.find(ratio => ratio.value === aspectRatio);
    const { width, height } = selectedRatio || { width: 1080, height: 1080 };
    applyImageToCanvas(generatedImage, width, height);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Geração de Imagens
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Prompt</TabsTrigger>
            <TabsTrigger value="upload">Enviar Modelo</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Descreva tudo aqui (modelo, formato, textos, estilo)</Label>
              <Textarea
                id="prompt"
                placeholder="Ex: 'Use o modelo enviado como referência e gere um Story moderno com o texto X...'"
                value={prompt}
                onChange={handlePromptChange}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="style">Estilo</Label>
                <Select value={style} onValueChange={handleStyleChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {styles.map((styleOption) => (
                      <SelectItem key={styleOption.value} value={styleOption.value}>
                        {styleOption.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aspect-ratio">Proporção</Label>
                <Select value={aspectRatio} onValueChange={handleAspectRatioChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {aspectRatios.map((ratio) => (
                      <SelectItem key={ratio.value} value={ratio.value}>
                        {ratio.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Textos rápidos para compor automaticamente */}
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-2">
                <Label>Título (opcional)</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Promoção imperdível" />
              </div>
              <div className="space-y-2">
                <Label>Subtítulo (opcional)</Label>
                <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Ex: Somente hoje • Frete grátis" />
              </div>
              <div className="space-y-2">
                <Label>Rodapé (opcional)</Label>
                <Input value={footer} onChange={(e) => setFooter(e.target.value)} placeholder="Ex: @minhamarca" />
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => generateImage(false)} 
                disabled={isGenerating || !prompt.trim()}
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Gerar Imagem
                  </>
                )}
              </Button>
              
              {generatedImage && (
                <Button 
                  variant="outline" 
                  onClick={regenerateImage}
                  disabled={isGenerating}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
              <Button 
                onClick={() => generateImage(true)} 
                disabled={isGenerating || !prompt.trim()}
                className="flex-1"
              >
                Gerar e Aplicar
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-2">
              <Label>Upload de Template</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Carregando...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Selecionar Arquivo
                    </>
                  )}
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  PNG, JPG, SVG até 10MB
                </p>
              </div>
              {referenceUrl && (
                <div className="mt-3 text-left">
                  <Label>Modelo selecionado</Label>
                  <div className="mt-2 w-full aspect-square bg-muted rounded overflow-hidden">
                    <img src={referenceUrl} alt="Modelo" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Preview da imagem gerada */}
        {generatedImage && (
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={generatedImage}
                alt="Imagem gerada"
                className="w-full h-full object-cover"
              />
            </div>
            <Button 
              onClick={addImageToCanvas}
              className="w-full"
              size="sm"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Adicionar ao Canvas
            </Button>
          </div>
        )}

        {/* Dicas de prompt */}
        <div className="bg-muted/50 rounded-lg p-3">
          <h4 className="font-medium text-sm mb-2">💡 Dicas para prompts eficazes:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Seja específico sobre cores, estilo e elementos</li>
            <li>• Mencione o público-alvo e contexto</li>
            <li>• Inclua palavras como "moderno", "elegante", "bold"</li>
            <li>• Especifique se quer texto, logos ou elementos gráficos</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
