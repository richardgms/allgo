-- AllGoMenu - Dados de Teste
-- Script de seed para desenvolvimento

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