PRD - Sistema Avançado de Cores White-Label com Shadcn/UI
Versão: 2.0
 Data: 31 de Julho de 2025
 Componente: Personalização Visual AllGoMenu

1. VISÃO GERAL DA FEATURE
1.1 Objetivo
Criar um sistema robusto de cores que permita personalização completa do site do cliente usando apenas 2-4 cores base, gerando automaticamente todas as variações tonais necessárias para um design profissional e acessível.
1.2 Problema Atual
Duas cores não são suficientes para criar uma paleta completa que mantenha:
- [ ] Contraste adequado (WCAG 2.1 AA)
- [ ] Hierarquia visual clara
- [ ] Estados de hover/focus/disabled
- [ ] Variações para diferentes contextos (sucesso, erro, aviso)
- [ ] Consistência com Shadcn/UI
- [ ] Suporte a modo escuro
1.3 Solução Proposta
Sistema automatizado que gera 19 variações tonais (8 mais claras + cor base + 10 mais escuras) para cada cor definida pelo usuário, seguindo o padrão Tailwind CSS onde a cor base sempre é a 500.

2. ESPECIFICAÇÕES TÉCNICAS
2.1 Geração Automática de Paleta
Input do Usuário:
- [ ] Cor Primária: Ex: #3B82F6 (Azul) - vai para primary-500
- [ ] Cor Secundária: Ex: #10B981 (Verde) - vai para secondary-500
- [ ] Cor de Erro (Opcional): Ex: #EF4444 (Vermelho) - vai para destructive-500
- [ ] Cor de Aviso (Opcional): Ex: #F59E0B (Laranja) - vai para warning-500
Output Automático por Cor:
- [ ] primary-50:  cor base + 90% direção ao branco (mais claro)
- [ ] primary-100: cor base + 80% direção ao branco
- [ ] primary-200: cor base + 70% direção ao branco
- [ ] primary-300: cor base + 60% direção ao branco
- [ ] primary-400: cor base + 50% direção ao branco
- [ ] primary-500: COR BASE ORIGINAL (definida pelo usuário)
- [ ] primary-600: cor base + 20% direção ao preto (mais escuro)
- [ ] primary-700: cor base + 40% direção ao preto
- [ ] primary-800: cor base + 60% direção ao preto
- [ ] primary-900: cor base + 80% direção ao preto
- [ ] primary-950: cor base + 90% direção ao preto (mais escuro)

2.2 Algoritmo de Geração de Tons
Função de Interpolação de Cores:
- [ ] Converter cor base (hex) para HSL
- [ ] Para tons mais claros (50-400): aumentar Lightness
- [ ] Para tons mais escuros (600-950): diminuir Lightness
- [ ] Manter Hue e Saturation constantes
- [ ] Converter de volta para hex
interface ColorVariations {
  50: string;   // +90% lighter
  100: string;  // +80% lighter
  200: string;  // +70% lighter
  300: string;  // +60% lighter
  400: string;  // +50% lighter
  500: string;  // BASE COLOR (cor definida pelo usuário)
  600: string;  // +20% darker
  700: string;  // +40% darker
  800: string;  // +60% darker
  900: string;  // +80% darker
  950: string;  // +90% darker
}

/**
 * Gera variações tonais usando interpolação HSL
 * @param baseColor Cor base em formato HEX (#RRGGBB)
 * @returns Objeto com todas as variações (50-950)
 */
const generateColorVariations = (baseColor: string): ColorVariations => {
  // Converter HEX para HSL
  const baseHsl = hexToHsl(baseColor);
  
  return {
    // Tons mais claros (interpolação em direção ao branco)
    50: interpolateToWhite(baseHsl, 0.9),   // 90% do caminho para branco
    100: interpolateToWhite(baseHsl, 0.8),  // 80% do caminho para branco
    200: interpolateToWhite(baseHsl, 0.7),  // 70% do caminho para branco
    300: interpolateToWhite(baseHsl, 0.6),  // 60% do caminho para branco
    400: interpolateToWhite(baseHsl, 0.5),  // 50% do caminho para branco
    
    // Cor base original
    500: baseColor,
    
    // Tons mais escuros (interpolação em direção ao preto)
    600: interpolateToBlack(baseHsl, 0.2),  // 20% do caminho para preto
    700: interpolateToBlack(baseHsl, 0.4),  // 40% do caminho para preto
    800: interpolateToBlack(baseHsl, 0.6),  // 60% do caminho para preto
    900: interpolateToBlack(baseHsl, 0.8),  // 80% do caminho para preto
    950: interpolateToBlack(baseHsl, 0.9),  // 90% do caminho para preto
  };
};

/**
 * Interpola uma cor HSL em direção ao branco (L=100%)
 * Preserva H e S, ajusta apenas L
 */
const interpolateToWhite = (hsl: HSL, factor: number): string => {
  const newLightness = hsl.l + (100 - hsl.l) * factor;
  return hslToHex({ ...hsl, l: newLightness });
};

/**
 * Interpola uma cor HSL em direção ao preto (L=0%)
 * Preserva H e S, ajusta apenas L
 */
const interpolateToBlack = (hsl: HSL, factor: number): string => {
  const newLightness = hsl.l - (hsl.l * factor);
  return hslToHex({ ...hsl, l: newLightness });
};

2.3 Estrutura de Variáveis CSS
CSS Custom Properties Geradas:
:root {
  /* =================== CORES PRIMÁRIAS =================== */
  --primary-50: #eff6ff;   /* 90% mais claro */
  --primary-100: #dbeafe;  /* 80% mais claro */
  --primary-200: #bfdbfe;  /* 70% mais claro */
  --primary-300: #93c5fd;  /* 60% mais claro */
  --primary-400: #60a5fa;  /* 50% mais claro */
  --primary-500: #3b82f6;  /* COR BASE DEFINIDA PELO USUÁRIO */
  --primary-600: #2563eb;  /* 20% mais escuro */
  --primary-700: #1d4ed8;  /* 40% mais escuro */
  --primary-800: #1e40af;  /* 60% mais escuro */
  --primary-900: #1e3a8a;  /* 80% mais escuro */
  --primary-950: #172554;  /* 90% mais escuro */
  
  /* =================== CORES SECUNDÁRIAS =================== */
  --secondary-50: #ecfdf5;
  --secondary-100: #d1fae5;
  --secondary-200: #a7f3d0;
  --secondary-300: #6ee7b7;
  --secondary-400: #34d399;
  --secondary-500: #10b981;  /* COR BASE DEFINIDA PELO USUÁRIO */
  --secondary-600: #059669;
  --secondary-700: #047857;
  --secondary-800: #065f46;
  --secondary-900: #064e3b;
  --secondary-950: #022c22;
  
  /* =================== CORES DE ESTADO =================== */
  /* Erro/Destrutivo */
  --destructive-50: #fef2f2;
  --destructive-100: #fee2e2;
  --destructive-200: #fecaca;
  --destructive-300: #fca5a5;
  --destructive-400: #f87171;
  --destructive-500: #ef4444;  /* COR BASE DEFINIDA PELO USUÁRIO */
  --destructive-600: #dc2626;
  --destructive-700: #b91c1c;
  --destructive-800: #991b1b;
  --destructive-900: #7f1d1d;
  --destructive-950: #450a0a;
  
  /* Aviso */
  --warning-50: #fffbeb;
  --warning-100: #fef3c7;
  --warning-200: #fde68a;
  --warning-300: #fcd34d;
  --warning-400: #fbbf24;
  --warning-500: #f59e0b;  /* COR BASE DEFINIDA PELO USUÁRIO */
  --warning-600: #d97706;
  --warning-700: #b45309;
  --warning-800: #92400e;
  --warning-900: #78350f;
  --warning-950: #451a03;
  
  /* =================== CORES SEMÂNTICAS =================== */
  /* Estas variáveis mudam automaticamente no modo escuro */
  --background: var(--primary-50);      /* Fundo principal da aplicação */
  --foreground: var(--primary-950);     /* Texto principal sobre o fundo */
  --card: var(--primary-50);            /* Fundo de cards */
  --card-foreground: var(--primary-950); /* Texto sobre cards */
  --popover: var(--primary-50);         /* Fundo de popovers */
  --popover-foreground: var(--primary-950); /* Texto sobre popovers */
  --muted: var(--primary-100);          /* Fundo para elementos silenciados */
  --muted-foreground: var(--primary-600); /* Texto para elementos silenciados */
  --accent: var(--secondary-100);       /* Fundo para elementos de acento */
  --accent-foreground: var(--secondary-900); /* Texto sobre elementos de acento */
  --border: var(--primary-200);         /* Cor padrão de bordas */
  --input: var(--primary-300);          /* Borda de inputs */
  --ring: var(--primary-600);           /* Anel de foco (outline) */
}

/* =================== MODO ESCURO =================== */
.dark {
  /* Inversão inteligente da paleta para modo escuro */
  --background: var(--primary-950);     /* Fundo escuro */
  --foreground: var(--primary-50);      /* Texto claro */
  --card: var(--primary-900);           /* Cards levemente mais claros que o fundo */
  --card-foreground: var(--primary-50); /* Texto claro sobre cards */
  --popover: var(--primary-900);        /* Popovers escuros */
  --popover-foreground: var(--primary-50); /* Texto claro sobre popovers */
  --muted: var(--primary-800);          /* Elementos silenciados em tom médio */
  --muted-foreground: var(--primary-400); /* Texto silenciado mais claro */
  --accent: var(--secondary-800);       /* Acento escuro */
  --accent-foreground: var(--secondary-50); /* Texto claro sobre acento */
  --border: var(--primary-700);         /* Bordas mais escuras */
  --input: var(--primary-700);          /* Inputs com bordas escuras */
  --ring: var(--primary-400);           /* Anel de foco mais claro */
}


3. CONFIGURAÇÃO MANUAL DE ELEMENTOS
3.1 Arquivo de Configuração de Design
Arquivo: theme-config.css
/* ============================================
   CONFIGURAÇÃO MANUAL DE CORES DOS ELEMENTOS
   ============================================
   
   IMPORTANTE: A cor base é sempre a 500!
   
   Como usar:
   - Cada elemento tem uma cor definida por número (50-950)
   - Números menores = mais claro (50 é quase branco)
   - Número 500 = cor original escolhida pelo usuário
   - Números maiores = mais escuro (950 é quase preto)
   
   Para ajustar: altere apenas o número final
   Exemplo: primary-800 → primary-700 (fica mais claro)
   Exemplo: primary-600 → primary-800 (fica mais escuro)
*/

/* =================== BOTÕES =================== */
.btn-primary {
  background-color: var(--primary-500);     /* Fundo: cor base original */
  border-color: var(--primary-500);         /* Borda: cor base original */
  color: var(--primary-50);                 /* Texto: muito claro para contraste */
}

.btn-primary:hover {
  background-color: var(--primary-600);     /* Hover: um tom mais escuro */
  border-color: var(--primary-600);
}

.btn-primary:active {
  background-color: var(--primary-700);     /* Clique: ainda mais escuro */
}

.btn-primary:disabled {
  background-color: var(--primary-300);     /* Desabilitado: mais claro e desbotado */
  border-color: var(--primary-300);
  color: var(--primary-600);                /* Texto com menos contraste */
}

.btn-secondary {
  background-color: var(--primary-100);     /* Fundo: bem claro */
  border-color: var(--primary-500);         /* Borda: cor base para destaque */
  color: var(--primary-700);                /* Texto: escuro para contraste */
}

.btn-secondary:hover {
  background-color: var(--primary-200);     /* Hover: um pouco mais escuro */
  border-color: var(--primary-600);         /* Borda mais escura */
}

.btn-destructive {
  background-color: var(--destructive-500); /* Fundo: cor de erro base */
  border-color: var(--destructive-500);
  color: var(--destructive-50);             /* Texto: claro para contraste */
}

.btn-destructive:hover {
  background-color: var(--destructive-600); /* Hover: mais escuro */
}

/* =================== TEXTOS =================== */
.text-primary {
  color: var(--primary-700);                /* Título principal: tom escuro legível */
}

.text-secondary {
  color: var(--primary-600);                /* Subtítulo: um pouco mais claro */
}

.text-muted {
  color: var(--primary-500);                /* Texto secundário: cor base suavizada */
}

.text-accent {
  color: var(--secondary-600);              /* Destaque: cor secundária */
}

.text-destructive {
  color: var(--destructive-600);            /* Texto de erro */
}

.text-warning {
  color: var(--warning-600);                /* Texto de aviso */
}

/* =================== BACKGROUNDS =================== */
.bg-primary {
  background-color: var(--primary-500);     /* Fundo principal: cor base */
}

.bg-primary-light {
  background-color: var(--primary-100);     /* Fundo claro */
}

.bg-primary-dark {
  background-color: var(--primary-800);     /* Fundo escuro */
}

.bg-secondary {
  background-color: var(--secondary-500);   /* Fundo secundário: cor base */
}

.bg-destructive {
  background-color: var(--destructive-100); /* Fundo de erro: claro */
}

.bg-warning {
  background-color: var(--warning-100);     /* Fundo de aviso: claro */
}

/* =================== CARDS =================== */
.card {
  background-color: var(--card);            /* Usa variável semântica */
  border-color: var(--border);              /* Borda padrão */
  color: var(--card-foreground);            /* Texto sobre card */
}

.card:hover {
  border-color: var(--primary-300);         /* Hover: borda mais visível */
  box-shadow: 0 4px 12px var(--primary-200); /* Sombra sutil com cor */
}

.card-header {
  background-color: var(--muted);           /* Cabeçalho: fundo silenciado */
  border-bottom-color: var(--border);       /* Divisor */
  color: var(--muted-foreground);           /* Texto silenciado */
}

/* =================== NAVEGAÇÃO =================== */
.navbar {
  background-color: var(--primary-800);     /* Fundo: escuro para destaque */
  border-bottom-color: var(--primary-900);  /* Borda mais escura */
}

.navbar-link {
  color: var(--primary-200);                /* Links: claros sobre fundo escuro */
}

.navbar-link:hover {
  color: var(--primary-50);                 /* Hover: quase branco */
  background-color: var(--primary-700);     /* Fundo de hover */
}

.navbar-link.active {
  color: var(--primary-50);                 /* Ativo: branco */
  background-color: var(--primary-600);     /* Fundo ativo: tom médio */
}

/* =================== FORMULÁRIOS =================== */
.form-input {
  background-color: var(--background);      /* Fundo: usa variável semântica */
  border-color: var(--input);               /* Borda: variável semântica */
  color: var(--foreground);                 /* Texto: variável semântica */
}

.form-input:focus {
  border-color: var(--primary-500);         /* Focus: cor base para destaque */
  box-shadow: 0 0 0 3px var(--primary-200); /* Glow claro */
}

.form-input:invalid {
  border-color: var(--destructive-500);     /* Erro: cor destrutiva */
  box-shadow: 0 0 0 3px var(--destructive-200); /* Glow de erro */
}

.form-label {
  color: var(--foreground);                 /* Label: texto principal */
}

.form-helper {
  color: var(--muted-foreground);           /* Texto de ajuda: silenciado */
}

/* =================== ESTADOS DE FEEDBACK =================== */
.alert-success {
  background-color: var(--secondary-100);   /* Sucesso: fundo claro da secundária */
  color: var(--secondary-800);              /* Texto: escuro para contraste */
  border-color: var(--secondary-400);       /* Borda: tom médio */
}

.alert-warning {
  background-color: var(--warning-100);     /* Aviso: fundo claro */
  color: var(--warning-800);                /* Texto: escuro */
  border-color: var(--warning-400);         /* Borda: tom médio */
}

.alert-error {
  background-color: var(--destructive-100); /* Erro: fundo claro */
  color: var(--destructive-800);            /* Texto: escuro */
  border-color: var(--destructive-400);     /* Borda: tom médio */
}

/* =================== BADGES E TAGS =================== */
.badge-primary {
  background-color: var(--primary-500);     /* Fundo: cor base */
  color: var(--primary-50);                 /* Texto: claro */
}

.badge-secondary {
  background-color: var(--primary-200);     /* Fundo: claro */
  color: var(--primary-800);                /* Texto: escuro */
}

.badge-success {
  background-color: var(--secondary-500);   /* Fundo: cor secundária */
  color: var(--secondary-50);               /* Texto: claro */
}

.badge-warning {
  background-color: var(--warning-500);     /* Fundo: cor de aviso */
  color: var(--warning-50);                 /* Texto: claro */
}

.badge-destructive {
  background-color: var(--destructive-500); /* Fundo: cor destrutiva */
  color: var(--destructive-50);             /* Texto: claro */
}

/* =================== LINKS =================== */
.link {
  color: var(--primary-600);                /* Cor: tom escuro */
}

.link:hover {
  color: var(--primary-500);                /* Hover: cor base */
  text-decoration-color: var(--primary-300); /* Sublinhado: tom claro */
}

.link:visited {
  color: var(--primary-700);                /* Visitado: mais escuro */
}

/* =================== DIVISORES =================== */
.divider {
  border-color: var(--border);              /* Linha: borda padrão */
}

.divider-strong {
  border-color: var(--primary-300);         /* Linha: mais visível */
}

/* =================== LOADING E SKELETON =================== */
.loading {
  background-color: var(--muted);
  background-image: linear-gradient(
    90deg,
    var(--muted) 0%,
    var(--primary-200) 50%,
    var(--muted) 100%
  );
}

.skeleton {
  background-color: var(--primary-200);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* =================== SCROLLBARS (Webkit) =================== */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: var(--muted);
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--primary-400);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--primary-500);
}

3.2 Guia de Uso para Desenvolvimento
Como Ajustar as Cores (Lembre-se: 500 = cor base):
Para deixar um elemento mais claro:
- [ ] Mude primary-600 para primary-400 ou primary-200
- [ ] Números menores = mais claro

Para deixar um elemento mais escuro:
- [ ] Mude primary-400 para primary-600 ou primary-800
- [ ] Números maiores = mais escuro

Para usar a cor original do usuário:
- [ ] Use sempre primary-500, secondary-500, etc.

Para contrastes adequados:
- [ ] Fundo escuro (primary-700+) + texto claro (primary-50-300)
- [ ] Fundo claro (primary-50-300) + texto escuro (primary-700+)
Exemplo de Ajuste:
/* Antes: botão muito claro e sem contraste */
.btn-primary {
  background-color: var(--primary-200);
  color: var(--primary-400);
}

/* Depois: botão com cor base do usuário */
.btn-primary {
  background-color: var(--primary-500); /* Cor escolhida pelo usuário */
  color: var(--primary-50);             /* Texto claro para contraste */
}

/* Resultado: botão com a identidade visual do restaurante */


4. INTEGRAÇÃO COM SHADCN/UI
4.1 Mapeamento Completo para Shadcn
Arquivo: tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // =================== CORES PRIMÁRIAS ===================
        primary: {
          50: 'var(--primary-50)',     // Tom mais claro
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)',   // COR BASE DO USUÁRIO
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)',
          950: 'var(--primary-950)',   // Tom mais escuro
          DEFAULT: 'var(--primary-500)', // Padrão para classes como 'bg-primary'
          foreground: 'var(--primary-50)', // Texto sobre cor primária
        },
        
        // =================== CORES SECUNDÁRIAS ===================
        secondary: {
          50: 'var(--secondary-50)',
          100: 'var(--secondary-100)',
          200: 'var(--secondary-200)',
          300: 'var(--secondary-300)',
          400: 'var(--secondary-400)',
          500: 'var(--secondary-500)',  // COR BASE DO USUÁRIO
          600: 'var(--secondary-600)',
          700: 'var(--secondary-700)',
          800: 'var(--secondary-800)',
          900: 'var(--secondary-900)',
          950: 'var(--secondary-950)',
          DEFAULT: 'var(--secondary-500)', // Padrão para classes como 'bg-secondary'
          foreground: 'var(--secondary-50)', // Texto sobre cor secundária
        },
        
        // =================== CORES DE ESTADO ===================
        destructive: {
          50: 'var(--destructive-50)',
          100: 'var(--destructive-100)',
          200: 'var(--destructive-200)',
          300: 'var(--destructive-300)',
          400: 'var(--destructive-400)',
          500: 'var(--destructive-500)', // COR BASE DE ERRO
          600: 'var(--destructive-600)',
          700: 'var(--destructive-700)',
          800: 'var(--destructive-800)',
          900: 'var(--destructive-900)',
          950: 'var(--destructive-950)',
          DEFAULT: 'var(--destructive-500)', // Cor para ações perigosas (ex: excluir)
          foreground: 'var(--destructive-50)', // Texto sobre cor destrutiva
        },
        
        warning: {
          50: 'var(--warning-50)',
          100: 'var(--warning-100)',
          200: 'var(--warning-200)',
          300: 'var(--warning-300)',
          400: 'var(--warning-400)',
          500: 'var(--warning-500)',     // COR BASE DE AVISO
          600: 'var(--warning-600)',
          700: 'var(--warning-700)',
          800: 'var(--warning-800)',
          900: 'var(--warning-900)',
          950: 'var(--warning-950)',
          DEFAULT: 'var(--warning-500)', // Cor para avisos
          foreground: 'var(--warning-50)', // Texto sobre cor de aviso
        },
        
        // =================== CORES SEMÂNTICAS SHADCN ===================
        border: 'var(--border)',           // Borda padrão dos elementos
        input: 'var(--input)',             // Borda de inputs
        ring: 'var(--ring)',               // Anel de foco (outline)
        
        background: 'var(--background)',   // Cor de fundo principal da aplicação
        foreground: 'var(--foreground)',   // Cor de texto principal sobre o 'background'
        
        card: {
          DEFAULT: 'var(--card)',          // Fundo de cards
          foreground: 'var(--card-foreground)', // Texto sobre cards
        },
        
        popover: {
          DEFAULT: 'var(--popover)',       // Fundo de popovers/dropdowns
          foreground: 'var(--popover-foreground)', // Texto sobre popovers
        },
        
        muted: {
          DEFAULT: 'var(--muted)',         // Fundo para elementos "silenciados"
          foreground: 'var(--muted-foreground)', // Texto para elementos "silenciados"
        },
        
        accent: {
          DEFAULT: 'var(--accent)',        // Fundo para elementos de "acento"
          foreground: 'var(--accent-foreground)', // Texto para elementos de "acento"
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],  // Fonte única do projeto
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

4.2 Classes Tailwind Personalizadas
Uso Direto no JSX:
// Componentes usando o sistema de cores
const Button = ({ variant = "primary" }) => {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary-600",
    secondary: "bg-primary-100 text-primary-700 border border-primary-500 hover:bg-primary-200",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive-600",
    warning: "bg-warning text-warning-foreground hover:bg-warning-600",
  };
  
  return (
    <button className={`px-4 py-2 rounded-md transition-colors ${variants[variant]}`}>
      Botão {variant}
    </button>
  );
};

const Card = ({ children }) => (
  <div className="bg-card text-card-foreground border border-border rounded-lg p-6 hover:border-primary-300 transition-colors">
    {children}
  </div>
);

const Alert = ({ variant = "info", children }) => {
  const variants = {
    success: "bg-secondary-100 text-secondary-800 border-secondary-400",
    warning: "bg-warning-100 text-warning-800 border-warning-400",
    error: "bg-destructive-100 text-destructive-800 border-destructive-400",
    info: "bg-primary-100 text-primary-800 border-primary-400",
  };
  
  return (
    <div className={`border rounded-lg p-4 ${variants[variant]}`}>
      {children}
    </div>
  );
};

const Badge = ({ variant = "primary", children }) => {
  const variants = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-primary-200 text-primary-800",
    success: "bg-secondary text-secondary-foreground",
    warning: "bg-warning text-warning-foreground",
    destructive: "bg-destructive text-destructive-foreground",
  };
  
  return (
    <span className={`px-2 py-1 rounded text-sm font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

4.3 Estratégia para Modo Escuro
O modo escuro será implementado via uma classe .dark no elemento <html>. As variáveis CSS serão remapeadas para usar a paleta de forma invertida, mantendo a hierarquia visual e os contrastes adequados.
Implementação do Dark Mode:
- [ ] Implementar classe .dark no elemento <html>
- [ ] Remapear variáveis CSS para modo escuro
- [ ] Manter hierarquia visual e contrastes adequados
- [ ] Criar toggle de modo escuro
/* =================== LIGHT MODE (PADRÃO) =================== */
:root {
  /* Variáveis semânticas que mudam entre modos */
  --background: var(--primary-50);         /* Fundo: quase branco */
  --foreground: var(--primary-950);        /* Texto: quase preto */
  --card: var(--primary-50);               /* Card: igual ao fundo */
  --card-foreground: var(--primary-950);   /* Texto do card: escuro */
  --popover: var(--primary-50);            /* Popover: claro */
  --popover-foreground: var(--primary-950); /* Texto popover: escuro */
  --muted: var(--primary-100);             /* Silenciado: levemente colorido */
  --muted-foreground: var(--primary-600);  /* Texto silenciado: tom médio */
  --accent: var(--secondary-100);          /* Acento: secundária clara */
  --accent-foreground: var(--secondary-900); /* Texto acento: secundária escura */
  --border: var(--primary-200);            /* Borda: sutil */
  --input: var(--primary-300);             /* Input: um pouco mais visível */
  --ring: var(--primary-600);              /* Foco: tom médio */
}

/* =================== DARK MODE =================== */
.dark {
  /* Inversão inteligente mantendo hierarquia */
  --background: var(--primary-950);        /* Fundo: quase preto */
  --foreground: var(--primary-50);         /* Texto: quase branco */
  --card: var(--primary-900);              /* Card: levemente mais claro que fundo */
  --card-foreground: var(--primary-50);    /* Texto do card: claro */
  --popover: var(--primary-900);           /* Popover: escuro mas diferenciado */
  --popover-foreground: var(--primary-50); /* Texto popover: claro */
  --muted: var(--primary-800);             /* Silenciado: tom médio escuro */
  --muted-foreground: var(--primary-400);  /* Texto silenciado: claro mas sutil */
  --accent: var(--secondary-800);          /* Acento: secundária escura */
  --accent-foreground: var(--secondary-50); /* Texto acento: secundária clara */
  --border: var(--primary-700);            /* Borda: mais escura mas visível */
  --input: var(--primary-700);             /* Input: igual à borda */
  --ring: var(--primary-400);              /* Foco: claro para destacar */
}

Toggle de Dark Mode:
const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    // Verificar preferência salva ou sistema
    const saved = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = saved === 'dark' || (!saved && systemPrefersDark);
    
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);
  
  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };
  
  return (
    <button 
      onClick={toggleDarkMode}
      className="p-2 rounded-md bg-muted hover:bg-accent transition-colors"
      aria-label="Alternar modo escuro"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};


5. INTERFACE DE CONFIGURAÇÃO
5.1 Dashboard para o Restaurante
Tela de Personalização Avançada:
- [ ] Seletores de cor base (primária, secundária, erro, aviso)
- [ ] Visualização das paletas geradas automaticamente
- [ ] Verificação de contraste WCAG 2.1 em tempo real
- [ ] Preview do site com as cores aplicadas
- [ ] Toggle de modo escuro para teste
- [ ] Botões para salvar e restaurar configurações
const ColorCustomization = () => {
  const [colors, setColors] = useState({
    primary: '#3B82F6',
    secondary: '#10B981',
    destructive: '#EF4444',
    warning: '#F59E0B'
  });
  
  const [contrastResults, setContrastResults] = useState({});
  
  // Gerar paletas automaticamente quando cores mudam
  const palettes = useMemo(() => ({
    primary: generateColorVariations(colors.primary),
    secondary: generateColorVariations(colors.secondary),
    destructive: generateColorVariations(colors.destructive),
    warning: generateColorVariations(colors.warning),
  }), [colors]);
  
  // Verificar contraste automaticamente
  useEffect(() => {
    const results = {};
    
    // Verificações críticas de contraste
    results.primaryButton = checkContrast(palettes.primary[500], palettes.primary[50]);
    results.primaryText = checkContrast(palettes.primary[50], palettes.primary[900]);
    results.secondaryButton = checkContrast(palettes.secondary[500], palettes.secondary[50]);
    results.destructiveButton = checkContrast(palettes.destructive[500], palettes.destructive[50]);
    
    setContrastResults(results);
  }, [palettes]);
  
  return (
    <div className="space-y-8">
      {/* Seletores de Cor Base */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Cor Principal
            <span className="text-muted-foreground ml-1">(Vai para primary-500)</span>
          </label>
          <ColorPicker 
            value={colors.primary}
            onChange={(color) => setColors(prev => ({ ...prev, primary: color }))}
          />
          {contrastResults.primaryButton?.ratio < 4.5 && (
            <p className="text-warning-600 text-xs mt-1">
              ⚠️ Contraste insuficiente para botões. Tente uma cor mais escura ou clara.
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Cor Secundária
            <span className="text-muted-foreground ml-1">(Vai para secondary-500)</span>
          </label>
          <ColorPicker 
            value={colors.secondary}
            onChange={(color) => setColors(prev => ({ ...prev, secondary: color }))}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Cor de Erro (Opcional)
            <span className="text-muted-foreground ml-1">(Vai para destructive-500)</span>
          </label>
          <ColorPicker 
            value={colors.destructive}
            onChange={(color) => setColors(prev => ({ ...prev, destructive: color }))}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Cor de Aviso (Opcional)
            <span className="text-muted-foreground ml-1">(Vai para warning-500)</span>
          </label>
          <ColorPicker 
            value={colors.warning}
            onChange={(color) => setColors(prev => ({ ...prev, warning: color }))}
          />
        </div>
      </div>
      
      {/* Visualização das Paletas Geradas */}
      <div className="space-y-6">
        {Object.entries(palettes).map(([colorName, palette]) => (
          <div key={colorName}>
            <h3 className="text-lg font-semibold mb-3 capitalize">
              Paleta {colorName === 'primary' ? 'Principal' : 
                     colorName === 'secondary' ? 'Secundária' :
                     colorName === 'destructive' ? 'de Erro' : 'de Aviso'}
            </h3>
            <div className="grid grid-cols-11 gap-2">
              {Object.entries(palette).map(([shade, color]) => (
                <div key={shade} className="text-center">
                  <div 
                    className="w-full h-16 rounded-lg border shadow-sm cursor-pointer"
                    style={{ backgroundColor: color }}
                    title={`${colorName}-${shade}: ${color}`}
                  />
                  <div className="mt-2 space-y-1">
                    <span className={`text-xs font-medium ${shade === '500' ? 'text-primary font-bold' : ''}`}>
                      {shade}
                      {shade === '500' && <span className="block text-[10px]">BASE</span>}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground block">
                      {color.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Verificação de Contraste */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Verificação de Contraste WCAG 2.1</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(contrastResults).map(([test, result]) => (
            <div key={test} className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${result?.passes ? 'bg-secondary-500' : 'bg-destructive-500'}`} />
              <span className="text-sm">
                {test}: {result?.ratio?.toFixed(2) || 'N/A'} 
                {result?.passes ? ' ✓' : ' ✗'}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Mínimo recomendado: 4.5:1 para texto normal, 3:1 para texto grande
        </p>
      </div>
      
      {/* Preview em Tempo Real */}
      <div className="border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Preview do Site</h3>
          <DarkModeToggle />
        </div>
        <StyleProvider palettes={palettes}>
          <SitePreview />
        </StyleProvider>
      </div>
      
      {/* Botões de Ação */}
      <div className="flex space-x-4">
        <button 
          onClick={() => saveColors(colors)}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary-600 transition-colors"
        >
          Salvar Personalização
        </button>
        <button 
          onClick={() => resetToDefaults()}
          className="bg-muted text-muted-foreground px-6 py-3 rounded-md hover:bg-accent transition-colors"
        >
          Restaurar Padrão
        </button>
      </div>
    </div>
  );
};

5.2 Aplicação Automática no Site
Sistema de Injeção de CSS:
- [ ] Gerar paletas para todas as cores do restaurante
- [ ] Injetar variáveis CSS dinamicamente
- [ ] Aplicar tema automaticamente no carregamento
- [ ] Suporte a mudança de tema em tempo real
const ThemeProvider = ({ children, restaurantTheme }) => {
  const cssVariables = useMemo(() => {
    // Gerar paletas para todas as cores do restaurante
    const primary = generateColorVariations(restaurantTheme.primaryColor);
    const secondary = generateColorVariations(restaurantTheme.secondaryColor);
    const destructive = generateColorVariations(restaurantTheme.destructiveColor || '#EF4444');
    const warning = generateColorVariations(restaurantTheme.warningColor || '#F59E0B');
    
    return {
      // Primárias (todas as variações 50-950)
      '--primary-50': primary[50],
      '--primary-100': primary[100],
      '--primary-200': primary[200],
      '--primary-300': primary[300],
      '--primary-400': primary[400],
      '--primary-500': primary[500],  // Cor base do usuário
      '--primary-600': primary[600],
      '--primary-700': primary[700],
      '--primary-800': primary[800],
      '--primary-900': primary[900],
      '--primary-950': primary[950],
      
      // Secundárias
      '--secondary-50': secondary[50],
      '--secondary-100': secondary[100],
      '--secondary-200': secondary[200],
      '--secondary-300': secondary[300],
      '--secondary-400': secondary[400],
      '--secondary-500': secondary[500], // Cor base do usuário
      '--secondary-600': secondary[600],
      '--secondary-700': secondary[700],
      '--secondary-800': secondary[800],
      '--secondary-900': secondary[900],
      '--secondary-950': secondary[950],
      
      // Destrutivas
      '--destructive-50': destructive[50],
      '--destructive-100': destructive[100],
      '--destructive-200': destructive[200],
      '--destructive-300': destructive[300],
      '--destructive-400': destructive[400],
      '--destructive-500': destructive[500],
      '--destructive-600': destructive[600],
      '--destructive-700': destructive[700],
      '--destructive-800': destructive[800],
      '--destructive-900': destructive[900],
      '--destructive-950': destructive[950],
      
      // Avisos
      '--warning-50': warning[50],
      '--warning-100': warning[100],
      '--warning-200': warning[200],
      '--warning-300': warning[300],
      '--warning-400': warning[400],
      '--warning-500': warning[500],
      '--warning-600': warning[600],
      '--warning-700': warning[700],
      '--warning-800': warning[800],
      '--warning-900': warning[900],
      '--warning-950': warning[950],
      
      // Variáveis semânticas (mudam no dark mode)
      '--background': primary[50],
      '--foreground': primary[950],
      '--card': primary[50],
      '--card-foreground': primary[950],
      '--popover': primary[50],
      '--popover-foreground': primary[950],
      '--muted': primary[100],
      '--muted-foreground': primary[600],
      '--accent': secondary[100],
      '--accent-foreground': secondary[900],
      '--border': primary[200],
      '--input': primary[300],
      '--ring': primary[600],
      
      // Raio das bordas
      '--radius': '0.5rem',
    };
  }, [restaurantTheme]);
  
  return (
    <div style={cssVariables} className="min-h-screen">
      {children}
    </div>
  );
};


6. VERIFICAÇÃO DE CONTRASTE
6.1 Implementação da Verificação WCAG 2.1
Função de Verificação de Contraste:
- [ ] Implementar função de cálculo de contraste WCAG 2.1
- [ ] Calcular luminância relativa das cores
- [ ] Verificar níveis AA e AAA de acessibilidade
- [ ] Retornar resultado estruturado com ratio e status
interface ContrastResult {
  ratio: number;
  passes: boolean;
  level: 'AA' | 'AAA' | 'fail';
}

/**
 * Calcula o contraste entre duas cores segundo WCAG 2.1
 * @param color1 Cor de fundo em HEX
 * @param color2 Cor do texto em HEX
 * @returns Resultado da verificação de contraste
 */
const checkContrast = (color1: string, color2: string): ContrastResult => {
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);
  
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  
  const ratio = (lighter + 0.05) / (darker + 0.05);
  
  return {
    ratio,
    passes: ratio >= 4.5, // WCAG AA para texto normal
    level: ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'fail'
  };
};

/**
 * Calcula a luminância relativa de uma cor
 */
const getLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex);
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

6.2 Verificações Automáticas Críticas
Combinações que Devem Ser Testadas:
- [ ] Botões primários (primary-500 com primary-50)
- [ ] Botões secundários (primary-100 com primary-700)
- [ ] Textos sobre fundos (background com foreground)
- [ ] Textos em cards (card com card-foreground)
- [ ] Estados de erro (destructive-500 com destructive-50)
- [ ] Estados de aviso (warning-500 com warning-50)
- [ ] Executar auditoria completa de contraste
const criticalContrastChecks = [
  // Botões primários
  { bg: 'primary-500', fg: 'primary-50', name: 'Botão Principal' },
  { bg: 'primary-500', fg: 'primary-foreground', name: 'Botão Principal (Shadcn)' },
  
  // Botões secundários
  { bg: 'primary-100', fg: 'primary-700', name: 'Botão Secundário' },
  
  // Textos sobre fundos
  { bg: 'background', fg: 'foreground', name: 'Texto Principal' },
  { bg: 'card', fg: 'card-foreground', name: 'Texto em Cards' },
  { bg: 'muted', fg: 'muted-foreground', name: 'Texto Silenciado' },
  
  // Estados de erro
  { bg: 'destructive-500', fg: 'destructive-50', name: 'Botão de Erro' },
  { bg: 'destructive-100', fg: 'destructive-800', name: 'Alert de Erro' },
  
  // Estados de aviso
  { bg: 'warning-500', fg: 'warning-50', name: 'Botão de Aviso' },
  { bg: 'warning-100', fg: 'warning-800', name: 'Alert de Aviso' },
];

/**
 * Executa todas as verificações críticas de contraste
 */
const runContrastAudit = (palettes: ColorPalettes) => {
  const results = {};
  
  criticalContrastChecks.forEach(check => {
    const bgColor = getColorFromPalette(palettes, check.bg);
    const fgColor = getColorFromPalette(palettes, check.fg);
    
    results[check.name] = checkContrast(bgColor, fgColor);
  });
  
  return results;
};


7. VANTAGENS DO SISTEMA ATUALIZADO
7.1 Para o Desenvolvedor
- [ ] Padrão Consistente: Cor base sempre na posição 500 (padrão Tailwind)
- [ ] Algoritmo Robusto: Interpolação HSL preserva qualidade das cores
- [ ] Integração Shadcn: Mapeamento completo e compatível
- [ ] Dark Mode Nativo: Suporte automático com variáveis semânticas
- [ ] Verificação de Contraste: Garantia de acessibilidade WCAG 2.1
- [ ] Cores de Estado: Sistema completo para todos os tipos de feedback
7.2 Para o Design
- [ ] Qualidade Superior: Paletas visualmente harmônicas
- [ ] Contraste Garantido: Verificação automática de legibilidade
- [ ] Hierarquia Clara: 11 tons por cor para qualquer necessidade
- [ ] Modo Escuro: Inversão inteligente mantendo usabilidade
- [ ] Consistência: Todas as cores seguem o mesmo padrão
7.3 Para o Cliente
- [ ] Simplicidade: Define 2-4 cores, recebe sistema completo
- [ ] Personalização Total: Cada elemento pode ter sua cor ajustada
- [ ] Qualidade Profissional: Resultado sempre polido e acessível
- [ ] Flexibilidade: Pode incluir cores de erro e aviso personalizadas

8. IMPLEMENTAÇÃO TÉCNICA
8.1 Estrutura de Arquivos Atualizada
- [ ] Criar theme-config.css para configuração manual de elementos
- [ ] Implementar globals.css com variáveis semânticas
- [ ] Desenvolver dark-mode.css específico para modo escuro
- [ ] Criar color-generator.ts para geração de paletas
- [ ] Implementar contrast-checker.ts para verificação WCAG 2.1
- [ ] Desenvolver color-utils.ts com funções auxiliares
- [ ] Criar componentes de UI (color-picker, theme-provider, etc.)
- [ ] Implementar hooks para gerenciamento de tema
src/
├── styles/
│   ├── theme-config.css      # Configuração manual de elementos
│   ├── globals.css           # CSS base com variáveis semânticas
│   └── dark-mode.css         # Específico para modo escuro
├── lib/
│   ├── color-generator.ts    # Geração de paletas com interpolação
│   ├── contrast-checker.ts   # Verificação WCAG 2.1
│   └── color-utils.ts        # Funções auxiliares (hex/hsl/rgb)
├── components/
│   ├── ui/                   # Componentes Shadcn
│   ├── color-picker.tsx      # Seletor de cores
│   ├── theme-provider.tsx    # Provider de tema
│   ├── color-preview.tsx     # Preview da paleta
│   └── contrast-indicator.tsx # Indicador de contraste
└── hooks/
    ├── use-theme.ts          # Hook para gerenciar tema
    └── use-contrast-check.ts # Hook para verificação de contraste

8.2 Fluxo de Dados Atualizado
- [ ] Usuário seleciona cores (2-4)
- [ ] Algoritmo de interpolação gera 44-88 variações
- [ ] Verificação automática de contraste
- [ ] CSS variables são criadas
- [ ] Aplicação em tempo real no preview
- [ ] Salvamento no banco de dados
- [ ] Carregamento automático no site público


9. CASOS DE USO ATUALIZADOS
9.1 Pizzaria Tradicional
Cores escolhidas:
- [ ] Principal: #DC2626 (Vermelho) → primary-500
- [ ] Secundária: #F59E0B (Amarelo) → secondary-500
- [ ] Erro: #EF4444 (Vermelho claro) → destructive-500

Resultado:
- [ ] Botões vermelhos (primary-500) com texto branco (primary-50)
- [ ] Hover vermelho escuro (primary-600)
- [ ] Badges amarelos para promoções (secondary-500)
- [ ] Alerts de erro em tom vermelho claro para diferenciação
- [ ] Modo escuro automático com tons escuros de vermelho
9.2 Restaurante Vegano
Cores escolhidas:
- [ ] Principal: #16A34A (Verde) → primary-500
- [ ] Secundária: #84CC16 (Verde claro) → secondary-500

Resultado:
- [ ] Interface em tons de verde naturais
- [ ] Botões na cor verde escolhida (primary-500)
- [ ] Destaque para ingredientes com verde claro (secondary-500)
- [ ] Modo escuro com verdes escuros mantendo identidade
- [ ] Contraste verificado automaticamente

10. CONCLUSÃO
Este sistema de cores atualizado resolve completamente os problemas identificados na análise, oferecendo:
Consistência Técnica:
- [ ] Cor base sempre na posição 500 (padrão da indústria)
- [ ] Algoritmo de interpolação robusto
- [ ] Integração perfeita com Shadcn/UI
- [ ] Suporte nativo ao modo escuro

Qualidade Visual:
- [ ] Paletas harmônicas e profissionais
- [ ] Contraste garantido por verificação automática
Hierarquia visual clara com 11 tons por cor
Cores de estado personalizáveis
Facilidade de Uso:
Interface intuitiva para restaurantes
Preview em tempo real
Ajustes manuais simples para desenvolvedores
Documentação clara e completa
O sistema mantém a simplicidade de configuração (2-4 cores) enquanto oferece sofisticação técnica máxima (44-88 variações automáticas), resultando em sites verdadeiramente únicos, acessíveis e profissionais para cada restaurante.


