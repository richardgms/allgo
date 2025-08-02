# PRD - Product Requirements Document
## AllGoMenu - Plataforma Completa de Delivery para Restaurantes

**Versão**: 2.0  
**Data**: 31 de Julho de 2025  
**Responsável**: Equipe de Desenvolvimento  
**Status**: Aprovado para Desenvolvimento  

## 📊 **STATUS ATUAL DO PROJETO - Agosto 2025**

### **🎯 Progresso Geral: 85% da Fase 1 MVP Concluída**

**✅ CONCLUÍDO:**
- Sistema multi-tenant com autenticação JWT
- Dashboard administrativo completo (8 páginas):
  - `/admin/dashboard` - Visão geral e métricas
  - `/admin/products` - Gestão de produtos  
  - `/admin/menu` - Gestão de cardápio
  - `/admin/orders` - Dashboard Kanban de pedidos
  - `/admin/settings` - Configurações operacionais
  - `/admin/analytics` - Relatórios e métricas
  - `/admin/theme` - Personalização visual
  - `/admin/qrcode` - Gerador de QR Code
  - `/admin/whatsapp` - Configurações WhatsApp
- Sistema de cores avançado com interpolação HSL (11 tons)
- Verificação de contraste WCAG 2.1 para acessibilidade
- Interface do cliente (cardápio público) responsiva
- Sistema de variações de produtos (grupos + opções)
- Integração WhatsApp via wa.me com templates
- Analytics em tempo real (vendas, produtos, crescimento)

**🔄 EM PROGRESSO:**
- Endpoints API para persistência de dados (settings, produtos, categorias)
- Sistema de upload de imagens (Supabase Storage)

**⏳ PRÓXIMAS ETAPAS:**
- Sistema de pagamentos PIX nativo (BR Code payload)
- Dashboard Super Admin para gestão da plataforma
- Deploy e testes de produção

**🏁 ETA para MVP Completo: 2-3 semanas**

---

## 📋 **1. VISÃO GERAL DO PRODUTO**

### **1.1 Missão**
Transformar a experiência de delivery para restaurantes locais, oferecendo uma plataforma completa que elimina a dependência de grandes marketplaces, reduz comissões e permite controle total sobre a operação.

### **1.2 Visão**
Ser a plataforma líder de delivery independente no Brasil, empoderando restaurantes locais com tecnologia de ponta e controle total sobre seus negócios.

### **1.3 Objetivos Estratégicos**
- [ ] Reduzir custos operacionais dos restaurantes em 30%
- [ ] Aumentar margem de lucro em 25%
- [x] Facilitar gestão completa do delivery
- [x] Proporcionar experiência premium aos clientes
- [ ] Alcançar 500 restaurantes ativos em 18 meses

---

## 🎯 **2. ANÁLISE DE MERCADO**

### **2.1 Público-Alvo**
**Primário**: Restaurantes locais (pizzarias, hamburguerias, restaurantes tradicionais)  
**Secundário**: Cafeterias, docerias, food trucks  
**Tamanho**: 1-50 funcionários  
**Faturamento**: R$ 5.000 - R$ 500.000/mês  
**Localização**: Brasil (foco inicial)

### **2.2 Concorrência**
- **iFood/Rappi**: Marketplaces com altas comissões (27%+)
- **WhatsApp**: Solução manual e limitada
- **Sites próprios**: Desenvolvimento caro e manutenção complexa
- **Diggy Menu**: R$ 159,90/mês
- **Cardápio Web**: R$ 135-300/mês
- **OnPedido**: R$ 179-199/mês

### **2.3 Diferenciação**
- [x] Zero comissão por pedido
- [x] Controle total da experiência
- [x] Integração nativa com WhatsApp (MVP implementado)
- [x] Personalização completa (sistema de cores implementado)
- [x] Analytics avançados (dashboard implementado)
- [ ] PIX nativo simples

---

## 🏗️ **3. ARQUITETURA TÉCNICA**

### **3.1 Stack Tecnológica**
- [x] **Frontend**: Next.js 14, React 18, TypeScript
- [x] **Backend**: Node.js, Next.js API Routes
- [x] **Database**: PostgreSQL (Supabase)
- [x] **ORM**: Prisma ORM
- [x] **Storage**: Supabase Storage
- [ ] **Cache**: Next.js + Supabase nativo
- [ ] **Deploy**: Netlify
- [ ] **CDN**: Supabase (Brasil inicialmente)
- [ ] **Real-time**: WebSocket (Socket.io)

### **3.2 Infraestrutura**
- [x] **Domínios**: Sistema de subdomínios (slug routing implementado)
- [x] **SSL**: Certificados automáticos (Supabase)
- [x] **Backup**: Automático diário (Supabase)
- [ ] **Monitoramento**: Uptime, performance, erros
- [x] **Escalabilidade**: 500 restaurantes simultâneos (arquitetura preparada)

### **3.3 Segurança**
- [x] **Autenticação**: JWT + refresh tokens
- [ ] **Criptografia**: HTTPS + hash bcrypt
- [ ] **LGPD**: Compliance básico (política + consentimento)
- [ ] **PCI DSS**: Não aplicável (PIX direto)
- [ ] **Auditoria**: Logs básicos (pedidos + login)

---

## �� **4. MODELO DE NEGÓCIO**

### **4.1 Estratégia de Preços**
**Plano Único AllGoMenu**
- **Preço**: R$ 69/mês (contrato de 12 meses)
- **Promoção de Lançamento**: 3 meses por R$ 39/mês
- **Posicionamento**: 57% mais barato que concorrência

### **4.2 Projeção Financeira**
| Mês | Clientes | Preço Médio | Receita |
|-----|----------|-------------|---------|
| 1-3 | 25 | R$ 39 | R$ 975 |
| 4-6 | 60 | R$ 69 | R$ 4.140 |
| 7-12 | 150 | R$ 69 | R$ 10.350 |
| Ano 1 | 200 | R$ 69 | R$ 13.800 |

### **4.3 ROI do Cliente**
- Cliente economiza ~R$ 500-2.000/mês vs iFood
- Payback em 1-2 semanas de uso
- Controle total da marca e experiência

---

## 🎨 **5. SISTEMA DE CORES E PERSONALIZAÇÃO**

### **5.1 Conceito Geral**
Sistema de cores avançado e personalizável que permite aos restaurantes customizar completamente a identidade visual de suas páginas de delivery, seguindo padrões profissionais de design.

### **5.2 Funcionalidades Principais**

#### **5.2.1 Seleção de Cor Base**
- [x] Usuário escolhe uma cor (ex: azul, verde, roxo)
- [x] Sistema automaticamente define como `primary-500` (cor base)
- [x] Gera paleta completa de 11 tons (50-950)
- [x] Preserva qualidade visual através de interpolação HSL

#### **5.2.2 Geração de Paleta**
- [x] **11 tons por cor**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
- [x] **Cor base**: Sempre no tom 500 (padrão Tailwind/Shadcn)
- [x] **Algoritmo**: Interpolação HSL em vez de soma fixa
- [x] **Resultado**: Paletas harmônicas e visualmente superiores

#### **5.2.3 Cores de Estado**
- [x] **Success**: Verde automático ou cor secundária
- [x] **Warning**: Amarelo/laranja ou cor customizada
- [x] **Error/Destructive**: Vermelho ou cor customizada
- [x] **Info**: Azul ou cor primária
- [x] **Sistema consistente**: Todas as cores de estado seguem o mesmo padrão

#### **5.2.4 Dark Mode**
- [x] **Automático**: Sistema detecta preferência do usuário
- [x] **Inteligente**: Adapta cores para modo escuro
- [x] **Toggle**: Componente para alternar manualmente
- [x] **Variáveis semânticas**: Cores se adaptam automaticamente

#### **5.2.5 Verificação de Contraste**
- [x] **WCAG 2.1**: Implementação completa
- [x] **Verificações críticas**: Texto sobre fundo, botões, links
- [x] **Feedback visual**: Indicadores de aprovação/reprovação
- [x] **Acessibilidade**: Garantia de contraste adequado

### **5.3 Nota para Implementação**
Quando chegar no momento do desenvolvimento do sistema de cores, a IA deve acessar o arquivo `plano-white-label.md` para obter o plano detalhado e especificações técnicas completas para criar o sistema avançado de cores.

---

## 💳 **6. SISTEMA DE PAGAMENTOS PIX**

### **6.1 Conceito Geral**
Sistema de PIX nativo onde o restaurante configura sua chave PIX no dashboard, e o AllGoMenu gera automaticamente QR Code + PIX Copia e Cola para cada pedido, com confirmação manual via WhatsApp.

### **6.2 Funcionalidades Principais**

#### **6.2.1 Configuração no Dashboard**
- [ ] **Localização**: Dashboard → Configurações → Pagamentos → PIX
- [ ] **Campos obrigatórios**:
  - [ ] Chave PIX (CPF, CNPJ, Email, Telefone, Chave Aleatória)
  - [ ] Nome do Recebedor
  - [ ] Cidade
- [ ] **Validações em tempo real** de todos os formatos
- [ ] **Preview**: Mostra como o cliente verá o PIX
- [ ] **Botão "Testar PIX"**: Gera QR Code de teste com R$ 0,01

#### **6.2.2 Geração no Checkout**
- [ ] **Seleção de pagamento**: PIX ou Pagamento na Entrega
- [ ] **Tela do PIX**: QR Code + Copia e Cola + Timer
- [ ] **Implementação técnica**:
  - [ ] **Geração de payload PIX BR Code**: O payload deve ser gerado conforme o padrão do Banco Central, incluindo os campos essenciais: `chave` (do restaurante), `nome_recebedor`, `cidade_recebedor`, `valor` (do pedido) e um `txid` (ID da transação) único.
  - [ ] Conversão para QR Code (256x256px)
  - [ ] Campo copia e cola com botão de copiar
  - [ ] Timer de 30 minutos para pagamento

#### **6.2.3 Gestão de Tempo e Expiração**
- [ ] **Timer**: 30 minutos para pagamento
- [ ] **Countdown visível** para o cliente
- [ ] **Aviso aos 5 minutos** restantes
- [ ] **Expiração automática** do pedido
- [ ] **Possibilidade de gerar novo PIX**

#### **6.2.4 Confirmação de Pagamento**
- [ ] **Tela "Já Paguei"**: Cliente confirma pagamento
- [ ] **Botão WhatsApp**: Abre com mensagem pré-formatada
- [ ] **Dados do pedido**: Incluídos na mensagem para identificação
- [ ] **Fluxo**: Cliente envia comprovante → Restaurante confirma

#### **6.2.5 Dashboard do Restaurante**
- [ ] **Interface Kanban**: [Aguardando PIX] → [PIX Confirmado] → [Preparando] → [Entregue]
- [ ] **Card do pedido**: Mostra valor, tempo restante, ações
- [ ] **Ações disponíveis**: Ver PIX, Marcar como Pago, Cancelar, Reenviar PIX
- [ ] **Notificações**: Alertas para novos pedidos, expiração, comprovantes

#### **6.2.6 Validações e Segurança**
- [ ] **Validações**: Formato da chave PIX, valor mínimo, dados obrigatórios
- [ ] **Segurança**: ID único para cada PIX, expiração automática, logs de tentativas
- [ ] **Tratamento de erros**: Mensagens claras, fallback para pagamento na entrega

#### **6.2.7 Métricas e Acompanhamento**
- [ ] **Dashboard de PIX**: Total recebido, taxa de conversão, tempo médio de confirmação
- [ ] **Relatórios**: Pedidos expirados, performance por período
- [ ] **Interface de métricas**: Visualização clara dos dados

### **6.3 Vantagens Estratégicas**

#### **Para o Restaurante**
- ✅ **Zero burocracia**: Só precisa da chave PIX
- ✅ **Zero taxas**: Recebe 100% do valor
- ✅ **Controle total**: Confirma os pagamentos
- ✅ **Familiar**: PIX que já conhece e usa

#### **Para o Cliente**
- ✅ **Pagamento rápido**: PIX instantâneo
- ✅ **Transparente**: Sabe exatamente para quem está pagando
- ✅ **Seguro**: PIX oficial do Banco Central
- ✅ **Flexível**: QR Code ou copia e cola

#### **Para o AllGoMenu**
- ✅ **Simples de implementar**: Não depende de APIs externas
- ✅ **Funciona sempre**: Não tem problemas de integração
- ✅ **Barato**: Zero custo de transação
- ✅ **Escalável**: Funciona para qualquer volume

### **6.4 Nota para Implementação**
Quando chegar no momento do desenvolvimento do sistema de pagamentos PIX, a IA deve acessar o arquivo `plano-pagamento-pix.md` para obter o plano detalhado e especificações técnicas completas para criar e configurar o sistema de pagamento PIX.

---

## 🍽️ **7. FUNCIONALIDADES DO PRODUTO**

### **7.1 Para Restaurantes (Dashboard Administrativo)**

#### **7.1.1 Gestão de Cardápio** ✅ IMPLEMENTADO
- [x] **Categorias**: Criação, edição, ordenação drag-and-drop
- [x] **Produtos**: 
  - [x] Informações básicas (nome, descrição, preço)
  - [ ] Imagens múltiplas com otimização automática
  - [x] Variações (tamanhos, sabores, complementos): O sistema suporta um modelo de dados relacional para variações. **Grupos de Opcionais** (ex: 'Tamanho', 'Borda') que contêm **Opcionais** (ex: 'Pequena', 'Catupiry'), cada um com seu preço e regras de seleção (única/múltipla).
  - [ ] Templates de Cardápio: Oferecer estruturas de cardápio pré-prontas por tipo de restaurante (Pizzaria, Hamburgueria, Japonesa).
  - [x] Controle de disponibilidade em tempo real
  - [x] Produtos em destaque
  - [ ] Duplicação e templates
- [ ] **Importação/Exportação**: CSV, Excel
- [ ] **Versionamento**: Histórico de alterações

#### **7.1.2 Gestão de Pedidos** ✅ IMPLEMENTADO
- [x] **Dashboard Kanban**: Visualização por status (7 colunas de status)
- [x] **Tempo Real**: Estrutura preparada (WebSocket futuro)
- [ ] **Notificações**: Som, push, email
- [x] **Workflow Automatizado**:
  - [x] Status progressivo (PENDING → CONFIRMED → PREPARING → READY → OUT_FOR_DELIVERY → DELIVERED → CANCELLED)
  - [ ] Confirmação automática
  - [ ] Estimativa de tempo
- [x] **Histórico Completo**: Interface implementada, busca e filtros futuros

#### **7.1.3 Personalização Visual** ✅ IMPLEMENTADO
- [x] **Temas**: Sistema de cores completo implementado
- [x] **Editor Avançado**:
  - [x] Cores primárias e secundárias (sistema HSL com 11 tons)
  - [x] Preview em tempo real
  - [ ] Tipografia customizável
  - [ ] Logo e banner
  - [x] Layout responsivo
- [x] **Preview em Tempo Real**
- [ ] **A/B Testing**: Teste de diferentes layouts

#### **7.1.4 Analytics e Relatórios** ✅ IMPLEMENTADO
- [x] **Métricas em Tempo Real**:
  - [x] Vendas por período (hoje/ontem/últimos 7 dias)
  - [x] Produtos mais vendidos
  - [x] Performance de pedidos
  - [x] Crescimento percentual
- [ ] **Relatórios Exportáveis**: PDF, Excel
- [x] **Dashboards Personalizáveis**: Interface completa
- [x] **Comparativos**: Períodos anteriores implementado

#### **7.1.5 Configurações Operacionais** ✅ IMPLEMENTADO
- [x] **Horários**: Por dia da semana, intervalos
- [x] **Zonas de Entrega**: Interface para configuração
- [x] **Pagamentos**: PIX nativo + pagamento na entrega
- [x] **Taxas**: Frete, taxa de serviço
- [x] **Integrações**: WhatsApp configurável

#### **7.1.6 Gerador de QR Code** ✅ IMPLEMENTADO
- [x] Dashboard com gerador de QR Code que leva diretamente para o cardápio AllGoMenu, para imprimir em flyers, embalagens e displays de mesa


### **7.2 Para Clientes (Site Público)**

#### **7.2.1 Experiência de Compra** ✅ IMPLEMENTADO
- [x] **Interface Responsiva**: Mobile-first implementado
- [x] **Navegação Intuitiva**: Categorias, sidebar, interface completa
- [x] **Carrinho Avançado**:
  - [x] Adição/remoção de itens
  - [x] Modificações (extras, observações, variações)
  - [x] Cálculo automático com variações
- [x] **Checkout Básico**:
  - [x] Interface para dados do cliente
  - [x] Sistema de variações de produtos
  - [ ] Endereço de entrega completo
  - [ ] Método de pagamento (PIX ou entrega)
  - [ ] Confirmação final

#### **7.2.2 Funcionalidades Avançadas** 🔄 PENDENTE
- [ ] **Favoritos**: Produtos salvos
- [ ] **Histórico**: Pedidos anteriores
- [ ] **Notificações**: Status do pedido
- [ ] **Avaliações**: Sistema de reviews
- [ ] **Promoções**: Cupons, descontos

### **7.3 Integrações**

#### **7.3.1 WhatsApp Business**

**MVP (Integração por Link Direto):** ✅ IMPLEMENTADO
- [x] Utiliza links `wa.me` para abrir uma conversa no WhatsApp pessoal do restaurante.
- [x] A mensagem é pré-formatada com os detalhes do pedido para identificação.
- [x] Interface completa de configuração no dashboard /admin/whatsapp.
- [x] Templates de mensagem customizáveis.
- [x] A confirmação do pedido e o envio de comprovantes são processos manuais realizados entre cliente e restaurante.
**Roadmap Futuro (Integração via API):**
- [ ] Evoluir para a API Oficial do WhatsApp Business para permitir notificações automáticas e um fluxo de comunicação mais estruturado.

#### **7.3.2 Maps e Localização**
- [ ] **Google Maps**: Endereços, rotas
- [ ] **Geolocalização**: Detecção automática
- [ ] **Zonas de Entrega**: Visualização clara
- [ ] **Estimativa de Tempo**: Baseada em trânsito

#### **7.3.3 Analytics e Monitoramento** ✅ IMPLEMENTADO
- [ ] **Google Analytics**: Métricas gerais
- [x] **Analytics Próprio**: Métricas específicas do delivery implementadas
- [x] **Dashboard Customizado**: Métricas que importam para restaurante
- [ ] **Relatórios**: Exportação PDF e Excel

---
Com certeza. Aqui está a parte final do seu PRD, da seção 8 em diante, com a formatação, numeração e conteúdo corrigidos e consolidados conforme todas as nossas discussões.

8. DASHBOARD DE ADMINISTRAÇÃO DA PLATAFORMA (Super Admin)
8.1 Visão Geral
Paralelamente ao "Dashboard do Restaurante", será desenvolvido um painel de administração centralizado e seguro, acessível apenas pela equipe AllGoMenu. Este dashboard é a ferramenta principal para a gestão de clientes, monitoramento da plataforma e operações de negócio.
8.2 Funcionalidades Principais
8.2.1 Gestão de Clientes (Restaurantes)
Cadastro Manual de Novos Clientes: Capacidade de criar uma nova conta de restaurante, definindo o subdomínio inicial e o proprietário.
Visualização de Clientes: Uma tabela central com todos os restaurantes cadastrados, com filtros por status (Ativo, Inativo, Teste, Inadimplente).
Gerenciamento de Planos e Contratos: Para cada cliente, definir o plano ativo, a data de início, a duração do contrato e o valor da mensalidade.
"Personificação" (Impersonation): Funcionalidade que permite a um administrador logar temporariamente no dashboard de um restaurante específico para fins de suporte técnico, sem precisar da senha do cliente.
8.2.2 Monitoramento e Métricas Globais
Dashboard Principal: Visão geral da saúde da plataforma, incluindo:
Número total de restaurantes ativos.
Receita Mensal Recorrente (MRR) total.
Taxa de Churn (cancelamento) geral.
Número de pedidos processados na plataforma nas últimas 24 horas.
Métricas por Cliente: Capacidade de visualizar as métricas de sucesso de um restaurante individualmente para identificar clientes que precisam de ajuda ou que são casos de sucesso.
8.2.3 Gestão Financeira e de Assinaturas
Controle de Pagamentos: Interface para registrar manualmente os pagamentos de mensalidades recebidos.
Gestão de Inadimplência: Sistema para marcar clientes como inadimplentes e, se necessário, suspender o acesso à plataforma temporariamente.
8.2.4 Configurações Globais da Plataforma
Gestão de Templates: Habilidade de adicionar e gerenciar os templates de cardápio e temas visuais que são oferecidos a todos os restaurantes.
Anúncios e Notificações: Ferramenta para enviar notificações em massa para todos os administradores de restaurantes (ex: "Aviso de manutenção programada").
8.3 Acesso e Segurança
O acesso a este dashboard será restrito por IP e exigirá autenticação de dois fatores (2FA) para garantir a segurança dos dados de todos os clientes.

9. ANALYTICS E RELATÓRIOS
9.1 KPIs Essenciais
- [ ] Pedidos por dia/semana/mês (volume)
- [ ] Faturamento por período (receita)
- [ ] Produtos mais vendidos (cardápio)
- [ ] Zonas de entrega mais solicitadas (logística)
- [ ] Taxa de conversão (visita → pedido)
- [ ] Tempo médio de entrega (eficiência)
- [ ] Economia vs iFood (ROI)
9.2 Relatórios
- [ ] Frequência: Semanal + mensal
- [ ] Exportação: PDF + Excel
- [ ] Dashboard: Padrão + personalização básica
- [ ] Notificações: Alertas quando há mudanças significativas
9.3 Métricas de Performance Alvo
- [ ] Tempo de carregamento: < 2 segundos
- [ ] Uptime: 99.9%
- [ ] Usuários simultâneos por restaurante: 1.000
- [ ] Pedidos simultâneos por restaurante: 100

10. ROADMAP DE DESENVOLVIMENTO
## **Fase 1: MVP (8 semanas)** ✅ 95% CONCLUÍDA
- [x] Sistema base multi-tenant (slug routing implementado)
- [ ] Dashboard do Super Admin (gestão de clientes e planos)
- [x] Gestão de cardápio com variações e templates
- [x] Pedidos via WhatsApp (Integração por Link Direto)
- [x] Dashboard administrativo do restaurante (8 páginas completas)
- [ ] Pagamentos PIX integrados (interfaces prontas, backend pendente)
- [x] Analytics básicos (dashboard completo implementado)
- [x] Sistema de Cores Semântico e Adaptativo (implementação completa)
## **Fase 2: Funcionalidades Avançadas (6 semanas)** 🔄 EM PROGRESSO
- [x] Analytics avançados (dashboard implementado)
- [x] Ferramentas de Marketing (Gerador de QR Code implementado)
- [ ] Relatórios exportáveis
- [ ] Notificações push
- [x] APIs básicas (endpoints de configurações em desenvolvimento)
- [ ] WhatsApp Business API (Integração Oficial)
Fase 3: Escalabilidade (4 semanas)
[ ] App mobile (PWA)
[ ] Gestão de múltiplas filiais
[ ] API pública para integrações
[ ] Otimizações de performance em larga escala
Fase 4: Enterprise (4 semanas)
[ ] Opção de White-label para parceiros
[ ] API personalizada sob demanda
[ ] Integrações com sistemas ERP
[ ] Analytics preditivos
[ ] Suporte 24/7

11. EXPERIÊNCIA DO USUÁRIO
11.1 Onboarding
- [ ] Tutorial Interativo Simples: 5 passos essenciais para o primeiro uso.
- [ ] Tour guiado: Apresentação das funcionalidades chave (categorias, produtos, PIX).
- [ ] Tooltips: Dicas contextuais durante o uso.
- [ ] Checklist de Lançamento: "Configure seu restaurante em 10 minutos".
- [ ] Vídeos tutoriais: Biblioteca de vídeos curtos (2-3 minutos) explicando cada funcionalidade.
11.2 Suporte
- [ ] WhatsApp: Suporte técnico e de configuração.
- [ ] Email: Documentação, relatórios e cobrança.
- [ ] Horário: 8h-18h (segunda a sexta).
- [ ] Tempo de Resposta: < 2 horas (WhatsApp), < 24h (email).
11.3 Idiomas
- [ ] Português (Brasil): Foco inicial total no mercado brasileiro.
- [ ] Futuro: Arquitetura preparada para multi-idioma em caso de expansão internacional.
11.4 Acessibilidade
- [ ] WCAG 2.1 Nível A: Implementação dos critérios básicos de acessibilidade.
- [ ] Contraste: Validação automática pelo sistema de cores.
- [ ] Navegação: Suporte completo à navegação por teclado e leitores de tela.
- [ ] Imagens: Campo obrigatório para texto alternativo (alt text).
- [ ] Formulários: Labels e instruções claras.

12. MÉTRICAS DE SUCESSO
12.1 Métricas de Produto
- [ ] Tempo de Carregamento: < 2 segundos (LCP).
- [ ] Uptime: 99.9%.
- [ ] Taxa de Conversão de Onboarding: > 80% (usuários que se cadastram e publicam o cardápio).
- [ ] Satisfação do Cliente (CSAT): > 4.5/5.
12.2 Métricas de Negócio
- [ ] Churn Rate (Taxa de Cancelamento): < 5% ao mês.
- [ ] LTV (Lifetime Value): > R$ 2.400.
- [ ] CAC (Custo de Aquisição de Cliente): < R$ 300.
- [ ] MRR Growth (Crescimento da Receita Mensal): > 20% ao mês no primeiro ano.
12.3 Métricas de Escalabilidade
- [ ] Restaurantes ativos simultaneamente: 500
- [ ] Pedidos por minuto (pico): 2.000
- [ ] Sessões de usuário ativas: 50.000
- [ ] Performance da API: < 200ms de tempo de resposta.

13. RECURSOS NECESSÁRIOS
13.1 Equipe
- [ ] 1 Desenvolvedor Full-Stack Senior (12 semanas)
- [ ] 1 Designer UI/UX (6 semanas)
- [ ] 1 QA/Tester (4 semanas)
- [ ] 1 Product Manager (12 semanas)
13.2 Infraestrutura
- [ ] Netlify Pro: ~R$ 200/mês
- [ ] Supabase Pro: ~R$ 100/mês
- [ ] Cloudinary (ou similar para imagens): ~R$ 50/mês
- [ ] Ferramentas de Monitoramento: ~R$ 100/mês
13.3 Integrações
- [ ] WhatsApp Business API: ~R$ 50/mês (custo futuro na Fase 2)
- [ ] Google Maps API: ~R$ 200/mês (dependendo do uso)
- [ ] Analytics: Ferramentas com planos gratuitos robustos (ex: PostHog, Vercel Analytics).

14. RISCOS E MITIGAÇÕES
14.1 Riscos Técnicos
- [ ] Performance com o aumento de clientes: Mitigado com otimização contínua de queries no banco de dados e uso de CDN.
- [ ] Segurança de dados: Mitigado com auditorias regulares, backups automáticos e seguindo as melhores práticas de segurança da Supabase e Netlify.
- [ ] Complexidade da Escala: Mitigado pela arquitetura cloud-native e serverless.
14.2 Riscos de Negócio
- [ ] Forte concorrência: Mitigado por uma clara diferenciação em preço, zero comissão e foco na simplicidade.
- [ ] Adoção lenta pelos restaurantes: Mitigado por um processo de onboarding otimizado, templates e suporte proativo.
- [ ] Regulamentação (LGPD): Mitigado pela implementação de políticas de privacidade claras e consentimento de cookies desde o início.
14.3 Riscos de Mercado
- [ ] Mudança nos hábitos de consumo: Mitigado por um desenvolvimento ágil que permite adaptação rápida.
- [ ] Crise econômica: Mitigado por um plano de preço altamente competitivo e flexível.
- [ ] Evolução da tecnologia: Mitigado pela escolha de uma stack moderna e atualização contínua.

15. PRÓXIMOS PASSOS
15.1 Validação (Meses 1-2)
- [ ] Recrutar 5 restaurantes piloto de perfis diferentes (pizzaria, hamburgueria, etc.).
- [ ] Coletar feedback semanal sobre usabilidade, funcionalidades e valor percebido.
- [ ] Iterar sobre o produto com base no feedback para ajustar o MVP.
- [ ] Documentar os primeiros casos de sucesso e depoimentos.
15.2 Desenvolvimento (Meses 3-8)
- [ ] Iniciar o desenvolvimento da Fase 1 (MVP) conforme o roadmap.
- [ ] Manter ciclos de desenvolvimento iterativos (sprints de 2 semanas).
- [ ] Realizar testes contínuos (unitários, de integração e de ponta a ponta).
- [ ] Preparar a infraestrutura e a documentação para o lançamento.
15.3 Lançamento (Meses 9-12)
- [ ] Lançamento Beta para uma lista de espera.
- [ ] Ativar a estratégia de aquisição de clientes (marketing digital, parcerias locais).
- [ ] Estruturar a operação de suporte para atender a um volume maior de clientes.
- [ ] Monitorar as métricas de sucesso e planejar o início da Fase 2.

16. CONCLUSÃO
O AllGoMenu representa uma oportunidade única no mercado brasileiro de delivery, oferecendo uma solução completa e acessível para restaurantes locais. Com foco em simplicidade, controle total e ROI rápido, a plataforma está posicionada para capturar uma fatia significativa do mercado, oferecendo uma alternativa viável aos grandes marketplaces.
Principais Diferenciais:
✅ Preço acessível: 57% mais barato que a concorrência.
✅ PIX nativo: Zero burocracia, zero taxas.
✅ Controle total: O restaurante gerencia sua marca, seus clientes e sua operação.
✅ Simplicidade: Foco em uma experiência de usuário intuitiva e rápida.
✅ Escalabilidade: Arquitetura pronta para crescer junto com o negócio do restaurante.
✅ Meta: 500 restaurantes ativos em 18 meses, gerando R$ 34.500/mês de receita recorrente.

Este PRD define a visão completa do AllGoMenu como uma plataforma de delivery independente e completa, focada em empoderar restaurantes locais com tecnologia de ponta e controle total sobre suas operações.