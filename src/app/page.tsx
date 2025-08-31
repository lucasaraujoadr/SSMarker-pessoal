'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Image, 
  Instagram, 
  Facebook, 
  Youtube, 
  Twitter, 
  Linkedin,
  Clock,
  TrendingUp,
  Star,
  Download,
  Palette,
  Type,
  Sparkles
} from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import { defaultTemplates } from '@/lib/templates';
import { defaultBrandKits } from '@/lib/brand-kits';
import toast from 'react-hot-toast';

export default function HomePage() {
  const router = useRouter();
  const { createProject } = useEditorStore();
  const [isCreating, setIsCreating] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('IG_SQUARE');

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      toast.error('Digite um nome para o projeto');
      return;
    }

    setIsCreating(true);
    try {
      createProject(projectName, selectedFormat);
      toast.success('Projeto criado com sucesso!');
      router.push('/editor');
    } catch (error) {
      toast.error('Erro ao criar projeto');
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const formatOptions = [
    { value: 'IG_SQUARE', label: 'Instagram Square', icon: Instagram },
    { value: 'IG_PORTRAIT', label: 'Instagram Portrait', icon: Instagram },
    { value: 'STORY', label: 'Instagram Story', icon: Instagram },
    { value: 'FB_LINK', label: 'Facebook Link', icon: Facebook },
    { value: 'YT_THUMB', label: 'YouTube Thumbnail', icon: Youtube },
    { value: 'CUSTOM', label: 'Personalizado', icon: Image },
  ];

  const recentTemplates = defaultTemplates.slice(0, 6);
  const popularBrandKits = defaultBrandKits.slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold">Social Media Maker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                Entrar
              </Button>
              <Button size="sm">
                Começar Grátis
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Crie artes de{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              social media
            </span>{' '}
            em minutos
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Templates inteligentes, variações automáticas e exportação em alta qualidade. 
            Tudo que você precisa para criar conteúdo visual incrível.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => document.getElementById('create-project')?.scrollIntoView({ behavior: 'smooth' })}>
              <Plus className="mr-2 h-5 w-5" />
              Criar Projeto
            </Button>
            <Button variant="outline" size="lg">
              Ver Templates
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                <Palette className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Templates Inteligentes</CardTitle>
              <CardDescription>
                Templates otimizados para cada plataforma com layout automático
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                <Type className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Variações Automáticas</CardTitle>
              <CardDescription>
                Gere múltiplas variações com um clique usando IA
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                <Download className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Exportação em Alta</CardTitle>
              <CardDescription>
                Exporte em múltiplos formatos com qualidade profissional
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Create Project Section */}
      <section id="create-project" className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Criar Novo Projeto</h2>
            <p className="text-muted-foreground mt-2">
              Escolha um formato e comece a criar sua arte
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Configurações do Projeto</CardTitle>
              <CardDescription>
                Configure as opções básicas do seu novo projeto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Nome do Projeto</Label>
                <Input
                  id="project-name"
                  placeholder="Ex: Campanha Instagram Março"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="format">Formato</Label>
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um formato" />
                  </SelectTrigger>
                  <SelectContent>
                    {formatOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4" />
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={handleCreateProject}
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-5 w-5" />
                    Criar Projeto
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Templates and Brand Kits */}
      <section className="container mx-auto px-4 py-16">
        <Tabs defaultValue="templates" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="templates">Templates Populares</TabsTrigger>
            <TabsTrigger value="brand-kits">Brand Kits</TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentTemplates.map((template) => (
                <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                    <div className="text-muted-foreground text-sm">
                      {template.name}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{template.name}</h3>
                      <Badge variant="secondary">{template.format}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {template.tags.slice(0, 3).join(', ')}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="brand-kits" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularBrandKits.map((brandKit) => (
                <Card key={brandKit.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">{brandKit.name}</h3>
                    <div className="flex space-x-1 mb-3">
                      {brandKit.colors.slice(0, 5).map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-full border border-border"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {brandKit.fonts.length} fontes
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary">50+</div>
            <div className="text-muted-foreground">Templates</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">10k+</div>
            <div className="text-muted-foreground">Projetos Criados</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">5min</div>
            <div className="text-muted-foreground">Tempo Médio</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">4.9★</div>
            <div className="text-muted-foreground">Avaliação</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 Social Media Maker. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
