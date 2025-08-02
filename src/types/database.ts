export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Perfis de usuários (proprietários de restaurantes)
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
      }
      
      // Restaurantes (multi-tenant core)
      restaurants: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          phone: string
          whatsapp: string
          email: string | null
          address: string
          neighborhood: string
          city: string
          state: string
          zip_code: string
          logo_url: string | null
          banner_url: string | null
          owner_id: string
          is_active: boolean
          primary_color: string
          secondary_color: string
          theme_data: Json | null
          pix_key: string | null
          pix_key_type: string | null
          pix_name: string | null
          pix_city: string | null
          delivery_fee: number
          delivery_radius: number
          min_order_value: number
          preparation_time: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          phone: string
          whatsapp: string
          email?: string | null
          address: string
          neighborhood: string
          city: string
          state: string
          zip_code: string
          logo_url?: string | null
          banner_url?: string | null
          owner_id: string
          is_active?: boolean
          primary_color?: string
          secondary_color?: string
          theme_data?: Json | null
          pix_key?: string | null
          pix_key_type?: string | null
          pix_name?: string | null
          pix_city?: string | null
          delivery_fee?: number
          delivery_radius?: number
          min_order_value?: number
          preparation_time?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          phone?: string
          whatsapp?: string
          email?: string | null
          address?: string
          neighborhood?: string
          city?: string
          state?: string
          zip_code?: string
          logo_url?: string | null
          banner_url?: string | null
          owner_id?: string
          is_active?: boolean
          primary_color?: string
          secondary_color?: string
          theme_data?: Json | null
          pix_key?: string | null
          pix_key_type?: string | null
          pix_name?: string | null
          pix_city?: string | null
          delivery_fee?: number
          delivery_radius?: number
          min_order_value?: number
          preparation_time?: number
          updated_at?: string
        }
      }

      // Categorias de produtos
      categories: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          description: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          name: string
          description?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          name?: string
          description?: string | null
          display_order?: number
          is_active?: boolean
          updated_at?: string
        }
      }

      // Produtos
      products: {
        Row: {
          id: string
          restaurant_id: string
          category_id: string
          name: string
          description: string | null
          price: number
          image_url: string | null
          is_active: boolean
          is_featured: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          category_id: string
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          category_id?: string
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          display_order?: number
          updated_at?: string
        }
      }

      // Grupos de variações (ex: Tamanho, Borda)
      variation_groups: {
        Row: {
          id: string
          restaurant_id: string
          product_id: string
          name: string
          is_required: boolean
          max_selections: number
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          product_id: string
          name: string
          is_required?: boolean
          max_selections?: number
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          product_id?: string
          name?: string
          is_required?: boolean
          max_selections?: number
          display_order?: number
          updated_at?: string
        }
      }

      // Opções das variações (ex: Pequena, Grande, Catupiry)
      variation_options: {
        Row: {
          id: string
          restaurant_id: string
          variation_group_id: string
          name: string
          price_modifier: number
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          variation_group_id: string
          name: string
          price_modifier?: number
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          variation_group_id?: string
          name?: string
          price_modifier?: number
          display_order?: number
          updated_at?: string
        }
      }

      // Pedidos
      orders: {
        Row: {
          id: string
          restaurant_id: string
          customer_name: string
          customer_phone: string
          customer_email: string | null
          delivery_address: string | null
          delivery_neighborhood: string | null
          delivery_type: 'delivery' | 'pickup'
          payment_method: 'pix' | 'cash'
          payment_status: 'pending' | 'confirmed' | 'expired' | 'cancelled'
          order_status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
          subtotal: number
          delivery_fee: number
          total: number
          notes: string | null
          pix_data: Json | null
          pix_expires_at: string | null
          confirmed_at: string | null
          delivered_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          customer_name: string
          customer_phone: string
          customer_email?: string | null
          delivery_address?: string | null
          delivery_neighborhood?: string | null
          delivery_type: 'delivery' | 'pickup'
          payment_method: 'pix' | 'cash'
          payment_status?: 'pending' | 'confirmed' | 'expired' | 'cancelled'
          order_status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
          subtotal: number
          delivery_fee?: number
          total: number
          notes?: string | null
          pix_data?: Json | null
          pix_expires_at?: string | null
          confirmed_at?: string | null
          delivered_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          customer_name?: string
          customer_phone?: string
          customer_email?: string | null
          delivery_address?: string | null
          delivery_neighborhood?: string | null
          delivery_type?: 'delivery' | 'pickup'
          payment_method?: 'pix' | 'cash'
          payment_status?: 'pending' | 'confirmed' | 'expired' | 'cancelled'
          order_status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
          subtotal?: number
          delivery_fee?: number
          total?: number
          notes?: string | null
          pix_data?: Json | null
          pix_expires_at?: string | null
          confirmed_at?: string | null
          delivered_at?: string | null
          updated_at?: string
        }
      }

      // Itens do pedido
      order_items: {
        Row: {
          id: string
          restaurant_id: string
          order_id: string
          product_id: string
          product_name: string
          product_price: number
          quantity: number
          variations: Json | null
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          order_id: string
          product_id: string
          product_name: string
          product_price: number
          quantity: number
          variations?: Json | null
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          order_id?: string
          product_id?: string
          product_name?: string
          product_price?: number
          quantity?: number
          variations?: Json | null
          total_price?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}