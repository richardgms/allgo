# Componentes shadcn/ui - AllGoMenu

**Versão**: 1.0  
**Data**: 01 de Agosto de 2025  
**Responsável**: Equipe de Desenvolvimento  
**Objetivo**: Lista completa de componentes shadcn/ui para implementação premium do AllGoMenu

---

## 📋 **VISÃO GERAL**

Este documento define todos os componentes shadcn/ui que serão utilizados na implementação do AllGoMenu, organizados por funcionalidade e nível de sofisticação para criar uma experiência verdadeiramente premium.

---

## 🏠 **LAYOUT PRINCIPAL E NAVEGAÇÃO**

### **Layout Multi-tenant**
- **Sidebar**: Dashboard administrativo do restaurante (sidebar-01, sidebar-07)
- **Navigation-menu**: Navegação principal do site público
- **Breadcrumb**: Navegação hierárquica no dashboard
- **Separator**: Divisores entre seções
- **Resizable**: Painéis redimensionáveis no dashboard admin

### **Autenticação**
- **Login-01**: Tela de login para proprietários de restaurante
- **Form**: Formulários de cadastro e autenticação
- **Button**: Botões de login/logout
- **Input**: Campos de email/senha
- **Label**: Labels dos formulários
- **Input-otp**: Verificação de códigos para 2FA

---

## 🎨 **SISTEMA DE CORES E PERSONALIZAÇÃO**

### **Interface de Personalização**
- **Card**: Container para seletores de cores
- **Form**: Formulário de configuração de cores
- **Input**: Color pickers para cores base
- **Label**: Labels para cada cor (Primária, Secundária, etc.)
- **Button**: Botões "Salvar" e "Testar PIX"
- **Alert**: Avisos de contraste WCAG
- **Progress**: Indicador de contraste
- **Badge**: Indicadores de aprovação/reprovação de contraste
- **Tabs**: Abas para diferentes seções de cores
- **Switch**: Toggle para modo escuro
- **Slider**: Ajustes finos de luminosidade e saturação
- **Toggle-group**: Seleção múltipla de estilos predefinidos

### **Preview em Tempo Real**
- **Dialog**: Modal de preview do site
- **Aspect-ratio**: Container para visualização responsiva
- **Skeleton**: Loading states durante geração de paletas
- **Hover-card**: Preview de cores no hover
- **Tooltip**: Dicas sobre valores de contraste

---

## 🍽️ **GESTÃO DE CARDÁPIO**

### **Estrutura de Categorias**
- **Accordion**: Categorias expansíveis no cardápio
- **Card**: Cards de produtos individuais
- **Badge**: Tags de categorias e preços
- **Button**: Botões de ação (editar, excluir)
- **Separator**: Divisores entre categorias
- **Collapsible**: Seções recolhíveis de categorias
- **Drag-and-drop**: (custom) Reordenação de categorias

### **Produtos e Variações**
- **Dialog**: Modal de edição de produtos
- **Form**: Formulário de produto
- **Input**: Campos de nome, descrição, preço
- **Textarea**: Descrição detalhada
- **Select**: Seleção de categoria
- **Checkbox**: Opções disponíveis
- **Radio-group**: Seleção de variações obrigatórias
- **Switch**: Produto ativo/inativo
- **Carousel**: Galeria de imagens de produtos
- **Hover-card**: Preview de produtos no hover
- **Command**: Busca avançada de produtos

### **Templates de Cardápio**
- **Command**: Busca e seleção de templates
- **Card**: Visualização de templates por categoria
- **Button**: Aplicar template
- **Badge**: Categorização de templates (Pizzaria, Hamburgueria, etc.)
- **Popover**: Detalhes do template no hover

---

## 💳 **SISTEMA PIX**

### **Configuração PIX**
- **Card**: Container de configuração
- **Form**: Formulário de dados PIX
- **Input**: Campos de chave PIX, nome, cidade
- **Alert**: Validações em tempo real
- **Button**: "Salvar" e "Testar PIX"
- **Badge**: Status de validação da chave PIX
- **Tooltip**: Ajuda contextual para tipos de chave

### **Checkout e Pagamento**
- **Radio-group**: Seleção PIX vs Pagamento na Entrega
- **Card**: Container do QR Code
- **Input**: Campo "Copia e Cola"
- **Button**: Botão "Copiar" e "Já Paguei"
- **Progress**: Timer de 30 minutos com countdown visual
- **Alert**: Avisos de expiração
- **Dialog**: Modal de confirmação de pagamento
- **Sonner**: Notificações de status de pagamento

### **Confirmação de Pagamento**
- **Card**: Container de confirmação
- **Badge**: Status do pedido
- **Button**: Botão WhatsApp
- **Alert**: Instruções para o cliente
- **Separator**: Divisores entre seções de informação

---

## 📊 **DASHBOARD E PEDIDOS**

### **Gestão de Pedidos (Kanban)**
- **Card**: Cards de pedidos individuais
- **Badge**: Status dos pedidos (Aguardando PIX, Confirmado, etc.)
- **Button**: Ações (Ver PIX, Marcar como Pago, Cancelar)
- **Alert**: Notificações de novos pedidos
- **Progress**: Countdown de expiração
- **Hover-card**: Detalhes do pedido no hover
- **Context-menu**: Menu de ações rápidas por clique direito
- **Popover**: Detalhes expandidos do pedido

### **Analytics e Relatórios**
- **Dashboard-01**: Layout completo de métricas executivas
- **Chart**: Gráficos de vendas (integração com Recharts)
- **Card**: Containers de métricas com gradientes
- **Badge**: Indicadores de performance
- **Table**: Tabelas de relatórios com sorting e filtros
- **Pagination**: Navegação de relatórios
- **Command**: Busca avançada em relatórios
- **Calendar**: Seleção de períodos para análise
- **Hover-card**: Detalhes de métricas no hover
- **Tooltip**: Explicações de KPIs complexos

### **Super Admin Dashboard**
- **Sidebar**: Navegação administrativa (sidebar-07 ou sidebar-12)
- **Table**: Lista de restaurantes com ações
- **Badge**: Status dos clientes (Ativo, Inadimplente, Teste)
- **Dialog**: Modal de impersonation
- **Form**: Cadastro de novos clientes
- **Select**: Filtros de status e categorias
- **Command**: Busca rápida de restaurantes
- **Alert-dialog**: Confirmações de ações críticas
- **Progress**: Indicadores de saúde da plataforma

---

## 🛍️ **SITE PÚBLICO DO CLIENTE**

### **Cardápio Online**
- **Products-01**: Layout de produtos premium
- **Card**: Cards de produtos com hover effects
- **Badge**: Preços, promoções e tags especiais
- **Button**: Adicionar ao carrinho com ripple effect
- **Dialog**: Modal de customização de produto
- **Checkbox**: Opcionais/complementos
- **Radio-group**: Variações obrigatórias (tamanho, sabor)
- **Carousel**: Galeria de imagens com transições suaves
- **Hover-card**: Preview rápido de produtos
- **Command**: Busca inteligente com sugestões
- **Aspect-ratio**: Imagens responsivas de produtos

### **Carrinho de Compras**
- **Sheet**: Carrinho lateral deslizante
- **Card**: Itens do carrinho com imagens
- **Button**: Aumentar/diminuir quantidade
- **Separator**: Divisores entre seções
- **Badge**: Total do carrinho e contador de itens
- **Scroll-area**: Área rolável para muitos itens
- **Alert**: Avisos sobre disponibilidade

### **Checkout**
- **Form**: Formulário de dados do cliente
- **Input**: Campos de contato e endereço
- **Textarea**: Observações especiais
- **Radio-group**: Tipo de entrega (balcão/delivery)
- **Button**: Finalizar pedido
- **Progress**: Indicador de progresso do checkout
- **Alert**: Validações em tempo real
- **Select**: Seleção de endereços salvos

---

## 🔧 **CONFIGURAÇÕES E UTILITÁRIOS**

### **Configurações Operacionais**
- **Tabs**: Seções de configuração organizadas
- **Form**: Formulários de configuração diversos
- **Switch**: Ativar/desativar funcionalidades
- **Input**: Horários de funcionamento
- **Select**: Zonas de entrega
- **Slider**: Raio de entrega e valores de frete
- **Calendar**: Configuração de horários especiais
- **Time-picker**: (custom) Seleção de horários

### **Gerador de QR Code**
- **Card**: Container para QR Code gerado
- **Button**: Gerar e baixar QR Code
- **Dialog**: Preview do QR Code
- **Badge**: Status de geração
- **Tooltip**: Instruções de uso

---

## 🌟 **COMPONENTES PREMIUM AVANÇADOS**

### **Interações Sofisticadas**
- **Hover-card**: Cards interativos com preview
- **Popover**: Tooltips ricos e contextuais
- **Command**: Busca avançada com filtros inteligentes
- **Combobox**: Seletores com busca e autocomplete
- **Context-menu**: Menus de contexto por clique direito
- **Menubar**: Barra de menu estilo desktop

### **Animações e Transições**
- **Collapsible**: Seções com animações fluidas
- **Accordion**: Expansão suave de categorias
- **Carousel**: Transições elegantes entre slides
- **Resizable**: Painéis redimensionáveis
- **Drawer**: Painéis deslizantes para mobile
- **Sheet**: Modais laterais com blur backdrop

### **Componentes de Dados Avançados**
- **Table**: Tabelas empresariais com sorting, filtros, export
- **Chart**: Dashboard executivo com múltiplos gráficos
- **Calendar**: Calendários interativos e configuráveis
- **Input-otp**: Verificação segura com códigos
- **Slider**: Controles de valores com precisão

---

## 💎 **RECURSOS PREMIUM ESPECÍFICOS**

### **Dashboard Ultra-Premium**
```typescript
// Combinações avançadas para experiência executiva
Sidebar + Resizable + Navigation-menu     // Layout triplo adaptável
Chart + Hover-card + Tooltip              // Gráficos interativos detalhados  
Table + Command + Pagination              // Tabelas empresariais completas
Calendar + Badge + Progress               // Timeline de metas visual
Card + Separator + Collapsible            // Métricas hierárquicas organizadas
```

### **Cardápio Interativo Premium**
```typescript
// Experiência de produto sofisticada
Card + Hover-card + Carousel              // Preview de produtos multimídia
Command + Badge + Select                  // Sistema de filtros avançado
Dialog + Form + Slider                    // Customização complexa inline
Sheet + Progress + Sonner                 // Checkout com feedback em tempo real
Popover + Checkbox + Radio-group          // Configuração de variações fluida
```

### **Sistema PIX Ultra-Refinado**
```typescript
// Interface de pagamento de classe empresarial
Dialog + Progress + Alert                 // Modal PIX com timer visual elegante
Input + Button + Sonner                   // Copia e cola com feedback premium
Card + Badge + Hover-card                 // Status visual sofisticado
Command + Select + Popover                // Busca de métodos alternativos
Form + Alert + Tooltip                    // Validações contextuais inteligentes
```

---

## 🎯 **CASOS DE USO ESPECÍFICOS**

### **Onboarding Sofisticado**
- **Progress**: Barra de progresso multi-etapas
- **Tabs**: Navegação entre etapas
- **Command**: Busca de templates e configurações
- **Carousel**: Tour guiado interativo
- **Card**: Containers de etapas com ícones
- **Button**: Navegação entre etapas
- **Alert**: Dicas e avisos contextuais

### **Personalização Avançada**
- **Slider**: Ajustes finos de design
- **Toggle-group**: Seleção de estilos predefinidos
- **Color-picker**: (custom) Interface profissional de cores
- **Preview-panel**: (custom) Visualização em tempo real
- **Tabs**: Organização de configurações
- **Switch**: Ativação de recursos avançados

### **Gestão Empresarial**
- **Kanban-board**: (Cards + DnD) Board de pedidos avançado
- **Real-time-updates**: (Toast + Badge) Notificações live
- **Bulk-actions**: (Checkbox + Button) Ações em massa
- **Advanced-filters**: (Command + Select) Filtros empresariais
- **Export-tools**: (Button + Progress) Exportação de dados

---

## 💫 **DETALHES PREMIUM**

### **Micro-interações**
- **Ripple effects** em botões
- **Lift animations** em cards no hover  
- **Smart validation** visual em forms
- **Row highlight** suaves em tables
- **Backdrop blur** em modals
- **Smooth transitions** entre estados

### **Componentes de Feedback**
- **Sonner**: Sistema de notificações elegante
- **Alert**: Mensagens contextuais
- **Progress**: Indicadores visuais sofisticados
- **Skeleton**: Loading states customizados
- **Tooltip**: Dicas inteligentes
- **Badge**: Indicadores de status coloridos

### **Responsividade Premium**
- **Drawer**: Navegação mobile elegante
- **Sheet**: Modais adaptáveis
- **Collapsible**: Seções recolhíveis em mobile
- **Scroll-area**: Scrolling otimizado
- **Aspect-ratio**: Imagens sempre perfeitas

---

## 🚀 **IMPLEMENTAÇÃO TÉCNICA**

### **Estrutura de Arquivos**
```
src/components/
├── ui/                     # Componentes shadcn base
├── premium/               # Componentes customizados premium
├── layout/                # Layouts complexos
├── dashboard/             # Componentes específicos do dashboard
├── restaurant/            # Componentes do site público
├── admin/                 # Componentes do super admin
└── shared/                # Componentes compartilhados
```

### **Integração com Sistema de Cores**
Todos os componentes devem utilizar as variáveis CSS do sistema de cores avançado:
- Suporte completo ao modo escuro
- Paletas de 11 tons automáticas
- Verificação de contraste WCAG
- Adaptação inteligente de cores

### **Performance Premium**
- **Lazy loading** com skeletons customizados
- **Optimistic UI** updates
- **Smooth scrolling** nativo
- **Preloading** inteligente
- **Cache strategies** visuais

---

## ✅ **CHECKLIST DE IMPLEMENTAÇÃO**

### **Fase 1: Componentes Essenciais**
- [ ] Button, Input, Label, Form (base)
- [ ] Card, Badge, Alert, Progress
- [ ] Sidebar, Navigation-menu, Breadcrumb
- [ ] Dialog, Sheet, Popover
- [ ] Table, Select, Checkbox, Radio-group

### **Fase 2: Componentes Avançados**
- [ ] Command, Hover-card, Tooltip
- [ ] Carousel, Accordion, Collapsible
- [ ] Chart, Calendar, Slider
- [ ] Context-menu, Menubar
- [ ] Sonner, Input-otp

### **Fase 3: Componentes Premium**
- [ ] Dashboard-01, Products-01, Login-01
- [ ] Resizable, Drawer, Aspect-ratio
- [ ] Toggle-group, Combobox
- [ ] Scroll-area, Skeleton customizado
- [ ] Micro-animações e transições

### **Fase 4: Integração e Otimização**
- [ ] Sistema de cores completo
- [ ] Modo escuro em todos os componentes
- [ ] Responsividade premium
- [ ] Performance optimization
- [ ] Testes de acessibilidade

---

## 🎨 **CONCLUSÃO**

Esta implementação com shadcn/ui transformará o AllGoMenu em uma plataforma de **classe empresarial premium**, competindo visualmente com as melhores soluções SaaS internacionais. A combinação estratégica de componentes básicos com recursos avançados criará uma experiência de usuário excepcional tanto para restaurantes quanto para seus clientes.

**Resultado esperado**: Interface premium que justifica um posicionamento de mercado superior, aumentando a percepção de valor e permitindo pricing premium no segmento de delivery independente brasileiro.