# Social Media Maker

Uma plataforma em JavaScript para criar artes de social media em minutos, com foco em produtividade: templates inteligentes, variações automáticas, ajuste a múltiplos formatos (Instagram, Reels, Stories, TikTok, Facebook, LinkedIn), kits de marca, colaboração e exportação em alta qualidade.

## 🚀 Características

### MVP (Minimum Viable Product)
- **Editor Visual**: Canvas com camadas (texto, forma, imagem, ícone)
- **Templates Inteligentes**: Auto-layout baseado em DSL
- **Kit de Marca**: Cores, fontes e logos com aplicação automática
- **Auto-Resize**: Formatos pré-definidos para redes sociais
- **Variações Rápidas**: Mudança automática de paleta, fonte, grade
- **Exportação**: PNG/JPG/WebP/PDF com configurações avançadas
- **Histórico**: Undo/Redo e versionamento local

### Diferenciais
- **Motor de Layout**: Regras visuais consistentes e automáticas
- **DSL de Templates**: Linguagem simples para estruturas reutilizáveis
- **Brand Kits**: Aplicação inteligente de identidade visual
- **Exportação em Lote**: Múltiplos formatos simultaneamente

## 🛠️ Stack Técnica

### Frontend
- **Next.js 14** (App Router)
- **React 18** com TypeScript
- **Tailwind CSS** + shadcn/ui
- **Konva.js** para canvas
- **Zustand** para state management
- **TanStack Query** para cache
- **Zod** para validação

### Core
- **Layout Engine**: Motor de layout automático
- **Export Engine**: Sistema de exportação avançado
- **Brand Kit System**: Gerenciamento de identidade visual
- **Template DSL**: Linguagem para templates

### Ferramentas
- **TypeScript** para type safety
- **ESLint** + **Prettier** para código limpo
- **Jest** + **Playwright** para testes
- **Vite** para build rápido

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página inicial
│   └── editor/            # Editor de artes
│       └── page.tsx       # Página do editor
├── components/            # Componentes React
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── editor/           # Componentes específicos do editor
│   └── providers.tsx     # Providers da aplicação
├── lib/                  # Lógica de negócio
│   ├── layout-engine.ts  # Motor de layout
│   ├── export-engine.ts  # Sistema de exportação
│   ├── templates.ts      # Templates padrão
│   ├── brand-kits.ts     # Brand kits padrão
│   └── utils.ts          # Utilitários
├── store/                # State management
│   └── editor-store.ts   # Store principal do editor
├── types/                # Definições TypeScript
│   └── index.ts          # Tipos principais
├── hooks/                # Custom hooks
└── utils/                # Utilitários gerais
```

## 🎯 Funcionalidades Principais

### Editor Visual
- **Canvas Interativo**: Baseado em Konva.js
- **Camadas**: Texto, imagem, forma, ícone
- **Seleção Múltipla**: Alinhamento e distribuição
- **Snapping**: Guias e grades
- **Transformações**: Redimensionar, rotacionar, mover

### Templates Inteligentes
- **DSL Simples**: Descrição de slots e regras
- **Auto-Layout**: Posicionamento automático
- **Responsividade**: Adaptação a diferentes formatos
- **Hierarquia Visual**: Títulos, subtítulos, CTA

### Brand Kits
- **Paletas de Cores**: Primária, secundária, neutra
- **Tipografias**: Famílias e pesos
- **Logos**: Upload e aplicação automática
- **Aplicação Global**: Por slot ou página inteira

### Variações Automáticas
- **Cores**: Ciclagem de paletas
- **Layouts**: Diferentes grades e composições
- **Tipografia**: Alternância de fontes
- **Shuffle Controlado**: Reprodutível com seed

### Exportação Avançada
- **Formatos**: PNG, JPG, WebP, PDF
- **Qualidade**: Configurável (60% - 100%)
- **Escala**: 1x, 2x, 3x para retina
- **Redes Sociais**: Formatos pré-definidos
- **Lote**: Múltiplas páginas simultaneamente

## 🚀 Como Usar

### Instalação
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/social-media-maker.git
cd social-media-maker

# Instale as dependências
npm install

# Execute em desenvolvimento
npm run dev
```

### Desenvolvimento
```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Testes
npm run test
npm run test:e2e

# Linting
npm run lint
```

### Fluxo de Uso
1. **Criar Projeto**: Escolha formato e nome
2. **Selecionar Template**: Templates inteligentes pré-definidos
3. **Aplicar Brand Kit**: Cores e fontes da marca
4. **Editar Conteúdo**: Textos e imagens
5. **Gerar Variações**: Teste diferentes combinações
6. **Auto-Resize**: Adapte para outros formatos
7. **Exportar**: PNG, JPG, WebP ou PDF

## 📊 Métricas de Sucesso (MVP)

- **TMA**: Redução de 50% no tempo médio por arte
- **Variações**: 3+ variações geradas em <30s
- **Auto-Resize**: 30% dos projetos usando
- **NPS**: >40 dos primeiros 50 usuários

## 🛣️ Roadmap

### Fase 1 - Fundações (2-4 semanas)
- [x] Projeto Next.js configurado
- [x] Editor básico com canvas
- [x] Sistema de camadas
- [x] State management com Zustand
- [x] UI base com shadcn/ui

### Fase 2 - Diferenciais (3-5 semanas)
- [x] Motor de Layout
- [x] DSL de Templates
- [x] Sistema de Brand Kits
- [x] Auto-Resize
- [x] Variações automáticas
- [x] Exportação em lote

### Fase 3 - Polimento (2-3 semanas)
- [ ] Render server para alta resolução
- [ ] PDF export avançado
- [ ] Atalhos de teclado
- [ ] Onboarding guiado
- [ ] Performance otimizada

### Fase 4 - Team & AI (opcional)
- [ ] Colaboração em tempo real
- [ ] Comentários e versões
- [ ] Sugestões inteligentes
- [ ] Resumo automático de briefing

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

- **Email**: seu-email@exemplo.com
- **LinkedIn**: [Seu Nome](https://linkedin.com/in/seu-perfil)
- **GitHub**: [@seu-usuario](https://github.com/seu-usuario)

---

Desenvolvido com ❤️ para revolucionar a criação de artes para redes sociais.
