# Social Media Maker

Um editor de artes para redes sociais com geração de imagens por IA, templates personalizáveis e exportação em múltiplos formatos.

## 🚀 Status Atual

O projeto está **funcionando** com as seguintes funcionalidades implementadas:

### ✅ Funcionalidades Implementadas

1. **Editor de Canvas Interativo**
   - Canvas com Konva.js para manipulação de camadas
   - Ferramentas de seleção, texto, imagem, formas
   - Zoom, pan e transformações
   - Sistema de camadas com drag & drop

2. **Geração de Imagens por IA** (Modo Simulado)
   - Interface para prompts de geração
   - Seleção de estilos e proporções
   - Upload de templates
   - Preview de imagens geradas
   - Integração preparada para APIs reais

3. **Editor de Texto**
   - Adição de textos ao canvas
   - Controles de fonte, tamanho, cor, alinhamento
   - Estilos (negrito, itálico, sublinhado)
   - Textos rápidos pré-definidos

4. **Gerenciamento de Logos**
   - Upload de logos personalizados
   - Logos pré-definidos
   - Controles de tamanho, opacidade e rotação
   - Posicionamento livre no canvas

5. **Sistema de Projetos**
   - Criação de projetos com diferentes formatos
   - Múltiplas páginas por projeto
   - Sistema de histórico (Undo/Redo)
   - Salvamento automático

6. **Exportação**
   - Múltiplos formatos (PNG, JPG, WebP, PDF)
   - Controles de qualidade e escala
   - Presets para redes sociais
   - Metadados personalizáveis

7. **Interface Moderna**
   - Design responsivo com Tailwind CSS
   - Componentes shadcn/ui
   - Painéis colapsáveis
   - Tema claro/escuro

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI**: Tailwind CSS, shadcn/ui, Radix UI
- **Canvas**: Konva.js, React Konva
- **Estado**: Zustand com Immer
- **IA**: Serviço simulado (preparado para APIs reais)
- **Exportação**: html2canvas, jsPDF

## 📦 Instalação

```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd social-media-maker

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev
```

O aplicativo estará disponível em `http://localhost:3000`

## 🤖 Configuração das APIs de IA

Atualmente o projeto está usando um **serviço simulado** para geração de imagens. Para usar APIs reais:

### 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# OpenAI DALL-E
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-openai-api-key-here

# Stability AI (Stable Diffusion)
NEXT_PUBLIC_STABILITY_API_KEY=sk-your-stability-api-key-here

# Replicate
NEXT_PUBLIC_REPLICATE_API_KEY=r8-your-replicate-api-key-here
```

### 2. Ativar APIs Reais

Edite o arquivo `src/lib/ai-service.ts` e descomente o código das APIs reais:

```typescript
async generateImage(request: AIGenerationRequest): Promise<AIGenerationResponse> {
  // Comentar esta linha:
  // return await simulatedProvider!.generateImage(request);
  
  // Descomentar este bloco:
  const configuredProviders = this.providers.filter(provider => 
    provider.isConfigured() && provider.name !== 'Simulado (Demo)'
  );

  if (configuredProviders.length > 0) {
    const provider = configuredProviders[0];
    console.log(`Usando provedor: ${provider.name}`);
    return await provider.generateImage(request);
  }

  // Fallback para simulação
  const simulatedProvider = this.providers.find(p => p.name === 'Simulado (Demo)');
  return await simulatedProvider!.generateImage(request);
}
```

### 3. APIs Suportadas

- **OpenAI DALL-E**: Geração de imagens de alta qualidade
- **Stable Diffusion**: Geração rápida e customizável
- **Replicate**: Acesso a múltiplos modelos de IA

## 🎨 Como Usar

1. **Criar um Projeto**
   - Acesse o editor
   - Escolha o formato (Instagram, Story, etc.)
   - Digite o nome do projeto

2. **Gerar Imagem de Fundo**
   - Vá para a aba "IA"
   - Digite um prompt descritivo
   - Escolha estilo e proporção
   - Clique em "Gerar Imagem"
   - Adicione ao canvas

3. **Adicionar Texto**
   - Vá para a aba "Texto"
   - Digite o conteúdo
   - Configure fonte, tamanho, cor
   - Clique em "Adicionar Texto"

4. **Adicionar Logo**
   - Vá para a aba "Logo"
   - Faça upload ou escolha um logo pré-definido
   - Ajuste tamanho e posição

5. **Exportar**
   - Use o botão "Exportar" na toolbar
   - Escolha formato e qualidade
   - Baixe a imagem final

## 🔧 Estrutura do Projeto

```
src/
├── app/                    # Páginas Next.js
├── components/             # Componentes React
│   ├── editor/            # Componentes do editor
│   └── ui/                # Componentes de UI
├── lib/                   # Utilitários e serviços
│   ├── ai-service.ts      # Serviço de IA
│   ├── export-engine.ts   # Motor de exportação
│   └── ...
├── store/                 # Estado global (Zustand)
├── types/                 # Definições TypeScript
└── styles/                # Estilos globais
```

## 🚧 Próximas Funcionalidades

- [ ] Integração com APIs de IA reais
- [ ] Sistema de templates avançado
- [ ] Biblioteca de ativos expandida
- [ ] Animações e transições
- [ ] Sistema de plugins
- [ ] Analytics e métricas
- [ ] Exportação em lote
- [ ] Integração com redes sociais

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, leia o guia de contribuição antes de submeter um pull request.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

**Desenvolvido com ❤️ para criadores de conteúdo**
