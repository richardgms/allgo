-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (users who own restaurants)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create restaurants table (multi-tenant core)
CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    phone VARCHAR(20) NOT NULL,
    whatsapp VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT NOT NULL,
    neighborhood VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    logo_url TEXT,
    banner_url TEXT,
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    is_active BOOLEAN DEFAULT true,
    primary_color VARCHAR(7) DEFAULT '#3B82F6',
    secondary_color VARCHAR(7) DEFAULT '#10B981',
    theme_data JSONB,
    pix_key VARCHAR(255),
    pix_key_type VARCHAR(20) CHECK (pix_key_type IN ('cpf', 'cnpj', 'email', 'phone', 'random')),
    pix_name VARCHAR(255),
    pix_city VARCHAR(100),
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    delivery_radius INTEGER DEFAULT 5000, -- em metros
    min_order_value DECIMAL(10,2) DEFAULT 0,
    preparation_time INTEGER DEFAULT 30, -- em minutos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create variation_groups table (e.g., Size, Toppings)
CREATE TABLE variation_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    is_required BOOLEAN DEFAULT false,
    max_selections INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create variation_options table (e.g., Small, Large, Pepperoni)
CREATE TABLE variation_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    variation_group_id UUID NOT NULL REFERENCES variation_groups(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price_modifier DECIMAL(10,2) DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
    delivery_address TEXT,
    delivery_neighborhood VARCHAR(100),
    delivery_type VARCHAR(10) NOT NULL CHECK (delivery_type IN ('delivery', 'pickup')),
    payment_method VARCHAR(10) NOT NULL CHECK (payment_method IN ('pix', 'cash')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'confirmed', 'expired', 'cancelled')),
    order_status VARCHAR(20) DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    notes TEXT,
    pix_data JSONB,
    pix_expires_at TIMESTAMP WITH TIME ZONE,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    variations JSONB,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_restaurants_slug ON restaurants(slug);
CREATE INDEX idx_restaurants_owner_id ON restaurants(owner_id);
CREATE INDEX idx_categories_restaurant_id ON categories(restaurant_id);
CREATE INDEX idx_products_restaurant_id ON products(restaurant_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_variation_groups_restaurant_id ON variation_groups(restaurant_id);
CREATE INDEX idx_variation_groups_product_id ON variation_groups(product_id);
CREATE INDEX idx_variation_options_restaurant_id ON variation_options(restaurant_id);
CREATE INDEX idx_orders_restaurant_id ON orders(restaurant_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_order_items_restaurant_id ON order_items(restaurant_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Create functions to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON restaurants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_variation_groups_updated_at BEFORE UPDATE ON variation_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_variation_options_updated_at BEFORE UPDATE ON variation_options FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE variation_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE variation_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies for multi-tenant data isolation
-- Profiles: Users can only see their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid()::text = id::text);

-- Restaurants: Users can only access restaurants they own
CREATE POLICY "Restaurant owners can view their restaurants" ON restaurants FOR SELECT USING (owner_id::text = auth.uid()::text);
CREATE POLICY "Restaurant owners can update their restaurants" ON restaurants FOR UPDATE USING (owner_id::text = auth.uid()::text);
CREATE POLICY "Anyone can view active restaurants for public display" ON restaurants FOR SELECT USING (is_active = true);

-- Categories: Restaurant-scoped access
CREATE POLICY "Categories are restaurant-scoped" ON categories FOR ALL USING (
    restaurant_id IN (SELECT id FROM restaurants WHERE owner_id::text = auth.uid()::text)
);

-- Products: Restaurant-scoped access
CREATE POLICY "Products are restaurant-scoped" ON products FOR ALL USING (
    restaurant_id IN (SELECT id FROM restaurants WHERE owner_id::text = auth.uid()::text)
);

-- Variation groups: Restaurant-scoped access
CREATE POLICY "Variation groups are restaurant-scoped" ON variation_groups FOR ALL USING (
    restaurant_id IN (SELECT id FROM restaurants WHERE owner_id::text = auth.uid()::text)
);

-- Variation options: Restaurant-scoped access
CREATE POLICY "Variation options are restaurant-scoped" ON variation_options FOR ALL USING (
    restaurant_id IN (SELECT id FROM restaurants WHERE owner_id::text = auth.uid()::text)
);

-- Orders: Restaurant-scoped access
CREATE POLICY "Orders are restaurant-scoped" ON orders FOR ALL USING (
    restaurant_id IN (SELECT id FROM restaurants WHERE owner_id::text = auth.uid()::text)
);

-- Order items: Restaurant-scoped access
CREATE POLICY "Order items are restaurant-scoped" ON order_items FOR ALL USING (
    restaurant_id IN (SELECT id FROM restaurants WHERE owner_id::text = auth.uid()::text)
);

-- Public access policies for customer-facing features
-- Allow public read access to restaurants and their data by slug
CREATE POLICY "Public can view restaurant by slug" ON restaurants FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view categories of active restaurants" ON categories FOR SELECT USING (
    restaurant_id IN (SELECT id FROM restaurants WHERE is_active = true) AND is_active = true
);
CREATE POLICY "Public can view products of active restaurants" ON products FOR SELECT USING (
    restaurant_id IN (SELECT id FROM restaurants WHERE is_active = true) AND is_active = true
);
CREATE POLICY "Public can view variation groups of active restaurants" ON variation_groups FOR SELECT USING (
    restaurant_id IN (SELECT id FROM restaurants WHERE is_active = true)
);
CREATE POLICY "Public can view variation options of active restaurants" ON variation_options FOR SELECT USING (
    restaurant_id IN (SELECT id FROM restaurants WHERE is_active = true)
);

-- Allow public to create orders (customers placing orders)
CREATE POLICY "Public can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can create order items" ON order_items FOR INSERT WITH CHECK (true);