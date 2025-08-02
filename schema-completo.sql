-- AllGoMenu Multi-tenant Database Schema
-- Generated from Prisma schema for manual application

-- ===== USER MANAGEMENT =====
CREATE TABLE IF NOT EXISTS "profiles" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- ===== RESTAURANT MANAGEMENT =====
CREATE TABLE IF NOT EXISTS "restaurants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "pixKey" TEXT,
    "pixKeyType" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#3B82F6',
    "secondaryColor" TEXT NOT NULL DEFAULT '#10B981',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deliveryFee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "minOrder" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "restaurants_pkey" PRIMARY KEY ("id")
);

-- ===== MENU MANAGEMENT =====
CREATE TABLE IF NOT EXISTS "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "restaurantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "restaurantId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- ===== PRODUCT VARIATIONS =====
CREATE TABLE IF NOT EXISTS "variation_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "multiple" BOOLEAN NOT NULL DEFAULT false,
    "minSelections" INTEGER NOT NULL DEFAULT 0,
    "maxSelections" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "variation_groups_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "variation_options" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "priceChange" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "variationGroupId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "variation_options_pkey" PRIMARY KEY ("id")
);

-- ===== ENUMS =====
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED');
CREATE TYPE "DeliveryMethod" AS ENUM ('DELIVERY', 'PICKUP');
CREATE TYPE "PaymentMethod" AS ENUM ('PIX', 'CASH', 'CARD');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- ===== ORDER MANAGEMENT =====
CREATE TABLE IF NOT EXISTS "orders" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerEmail" TEXT,
    "deliveryAddress" TEXT,
    "deliveryMethod" "DeliveryMethod" NOT NULL DEFAULT 'DELIVERY',
    "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'PIX',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "subtotal" DECIMAL(10,2) NOT NULL,
    "deliveryFee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL,
    "pixPayload" TEXT,
    "pixExpiresAt" TIMESTAMP(3),
    "restaurantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "order_items" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "notes" TEXT,
    "productId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "order_item_options" (
    "id" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "variationOptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_item_options_pkey" PRIMARY KEY ("id")
);

-- ===== INDEXES =====
CREATE UNIQUE INDEX IF NOT EXISTS "profiles_email_key" ON "profiles"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "restaurants_slug_key" ON "restaurants"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "orders_orderNumber_key" ON "orders"("orderNumber");
CREATE UNIQUE INDEX IF NOT EXISTS "order_item_options_orderItemId_variationOptionId_key" ON "order_item_options"("orderItemId", "variationOptionId");

-- ===== FOREIGN KEYS =====
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "categories" ADD CONSTRAINT "categories_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "products" ADD CONSTRAINT "products_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "variation_groups" ADD CONSTRAINT "variation_groups_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "variation_options" ADD CONSTRAINT "variation_options_variationGroupId_fkey" FOREIGN KEY ("variationGroupId") REFERENCES "variation_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "orders" ADD CONSTRAINT "orders_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "order_item_options" ADD CONSTRAINT "order_item_options_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "order_item_options" ADD CONSTRAINT "order_item_options_variationOptionId_fkey" FOREIGN KEY ("variationOptionId") REFERENCES "variation_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ===============================================
-- DADOS DE TESTE - EXECUTE APÓS O SCHEMA ACIMA
-- ===============================================

-- ===== USUÁRIO DE TESTE =====
INSERT INTO "profiles" ("id", "email", "name", "createdAt", "updatedAt") VALUES 
('clm1a2b3c4d5e6f7g8h9i0j1', 'dono@pizzariaexemplo.com', 'João Silva', NOW(), NOW());

-- ===== RESTAURANTE DE TESTE =====
INSERT INTO "restaurants" (
    "id", "name", "slug", "description", "phone", "email", 
    "address", "city", "state", "zipCode", 
    "pixKey", "pixKeyType", "primaryColor", "secondaryColor",
    "deliveryFee", "minOrder", "ownerId", "createdAt", "updatedAt"
) VALUES (
    'rest_clm1a2b3c4d5e6f7g8h9i0j1', 
    'Pizzaria do João', 
    'pizzaria-do-joao',
    'A melhor pizzaria da região! Pizzas artesanais com ingredientes frescos e selecionados.',
    '(11) 99999-9999',
    'contato@pizzariadojoao.com',
    'Rua das Flores, 123',
    'São Paulo',
    'SP',
    '01234-567',
    '71799688461',
    'CPF',
    '#E53E3E',
    '#38A169',
    5.00,
    25.00,
    'clm1a2b3c4d5e6f7g8h9i0j1',
    NOW(), 
    NOW()
);

-- ===== CATEGORIAS =====
INSERT INTO "categories" ("id", "name", "description", "sortOrder", "restaurantId", "createdAt", "updatedAt") VALUES 
('cat_pizzas', 'Pizzas', 'Nossas deliciosas pizzas artesanais', 1, 'rest_clm1a2b3c4d5e6f7g8h9i0j1', NOW(), NOW()),
('cat_bebidas', 'Bebidas', 'Refrigerantes e sucos naturais', 2, 'rest_clm1a2b3c4d5e6f7g8h9i0j1', NOW(), NOW()),
('cat_sobremesas', 'Sobremesas', 'Doces e sobremesas especiais', 3, 'rest_clm1a2b3c4d5e6f7g8h9i0j1', NOW(), NOW());

-- ===== PRODUTOS =====
INSERT INTO "products" (
    "id", "name", "description", "price", "isActive", "isFeatured", 
    "sortOrder", "restaurantId", "categoryId", "createdAt", "updatedAt"
) VALUES 
-- Pizzas
('prod_margherita', 'Pizza Margherita', 'Molho de tomate, mussarela, manjericão fresco e azeite', 32.90, true, true, 1, 'rest_clm1a2b3c4d5e6f7g8h9i0j1', 'cat_pizzas', NOW(), NOW()),
('prod_pepperoni', 'Pizza Pepperoni', 'Molho de tomate, mussarela e pepperoni', 36.90, true, true, 2, 'rest_clm1a2b3c4d5e6f7g8h9i0j1', 'cat_pizzas', NOW(), NOW()),
('prod_quattro', 'Pizza Quattro Queijos', 'Mussarela, gorgonzola, parmesão e provolone', 39.90, true, false, 3, 'rest_clm1a2b3c4d5e6f7g8h9i0j1', 'cat_pizzas', NOW(), NOW()),
('prod_portuguesa', 'Pizza Portuguesa', 'Presunto, ovos, cebola, azeitona e orégano', 34.90, true, false, 4, 'rest_clm1a2b3c4d5e6f7g8h9i0j1', 'cat_pizzas', NOW(), NOW()),
-- Bebidas
('prod_coca_lata', 'Coca-Cola Lata', 'Refrigerante Coca-Cola 350ml', 4.50, true, false, 1, 'rest_clm1a2b3c4d5e6f7g8h9i0j1', 'cat_bebidas', NOW(), NOW()),
('prod_suco_laranja', 'Suco de Laranja', 'Suco natural de laranja 500ml', 8.90, true, false, 2, 'rest_clm1a2b3c4d5e6f7g8h9i0j1', 'cat_bebidas', NOW(), NOW()),
-- Sobremesas
('prod_pudim', 'Pudim de Leite', 'Pudim caseiro com calda de caramelo', 12.90, true, false, 1, 'rest_clm1a2b3c4d5e6f7g8h9i0j1', 'cat_sobremesas', NOW(), NOW());

-- ===== GRUPOS DE VARIAÇÃO =====
INSERT INTO "variation_groups" (
    "id", "name", "required", "multiple", "minSelections", "maxSelections", 
    "sortOrder", "productId", "createdAt", "updatedAt"
) VALUES 
-- Tamanhos para pizzas
('vg_tamanho_margherita', 'Tamanho', true, false, 1, 1, 1, 'prod_margherita', NOW(), NOW()),
('vg_tamanho_pepperoni', 'Tamanho', true, false, 1, 1, 1, 'prod_pepperoni', NOW(), NOW()),
('vg_tamanho_quattro', 'Tamanho', true, false, 1, 1, 1, 'prod_quattro', NOW(), NOW()),
('vg_tamanho_portuguesa', 'Tamanho', true, false, 1, 1, 1, 'prod_portuguesa', NOW(), NOW()),
-- Borda para pizzas
('vg_borda_margherita', 'Borda', false, false, 0, 1, 2, 'prod_margherita', NOW(), NOW()),
('vg_borda_pepperoni', 'Borda', false, false, 0, 1, 2, 'prod_pepperoni', NOW(), NOW());

-- ===== OPÇÕES DE VARIAÇÃO =====
INSERT INTO "variation_options" (
    "id", "name", "priceChange", "isDefault", "sortOrder", 
    "variationGroupId", "createdAt", "updatedAt"
) VALUES 
-- Tamanhos
('vo_pequena_margherita', 'Pequena (25cm)', -3.00, false, 1, 'vg_tamanho_margherita', NOW(), NOW()),
('vo_media_margherita', 'Média (30cm)', 0.00, true, 2, 'vg_tamanho_margherita', NOW(), NOW()),
('vo_grande_margherita', 'Grande (35cm)', 5.00, false, 3, 'vg_tamanho_margherita', NOW(), NOW()),

('vo_pequena_pepperoni', 'Pequena (25cm)', -3.00, false, 1, 'vg_tamanho_pepperoni', NOW(), NOW()),
('vo_media_pepperoni', 'Média (30cm)', 0.00, true, 2, 'vg_tamanho_pepperoni', NOW(), NOW()),
('vo_grande_pepperoni', 'Grande (35cm)', 5.00, false, 3, 'vg_tamanho_pepperoni', NOW(), NOW()),

('vo_pequena_quattro', 'Pequena (25cm)', -4.00, false, 1, 'vg_tamanho_quattro', NOW(), NOW()),
('vo_media_quattro', 'Média (30cm)', 0.00, true, 2, 'vg_tamanho_quattro', NOW(), NOW()),
('vo_grande_quattro', 'Grande (35cm)', 6.00, false, 3, 'vg_tamanho_quattro', NOW(), NOW()),

('vo_pequena_portuguesa', 'Pequena (25cm)', -3.00, false, 1, 'vg_tamanho_portuguesa', NOW(), NOW()),
('vo_media_portuguesa', 'Média (30cm)', 0.00, true, 2, 'vg_tamanho_portuguesa', NOW(), NOW()),
('vo_grande_portuguesa', 'Grande (35cm)', 5.00, false, 3, 'vg_tamanho_portuguesa', NOW(), NOW()),

-- Bordas
('vo_sem_borda_margherita', 'Sem Borda', 0.00, true, 1, 'vg_borda_margherita', NOW(), NOW()),
('vo_catupiry_margherita', 'Borda de Catupiry', 8.00, false, 2, 'vg_borda_margherita', NOW(), NOW()),
('vo_cheddar_margherita', 'Borda de Cheddar', 6.00, false, 3, 'vg_borda_margherita', NOW(), NOW()),

('vo_sem_borda_pepperoni', 'Sem Borda', 0.00, true, 1, 'vg_borda_pepperoni', NOW(), NOW()),
('vo_catupiry_pepperoni', 'Borda de Catupiry', 8.00, false, 2, 'vg_borda_pepperoni', NOW(), NOW()),
('vo_cheddar_pepperoni', 'Borda de Cheddar', 6.00, false, 3, 'vg_borda_pepperoni', NOW(), NOW());