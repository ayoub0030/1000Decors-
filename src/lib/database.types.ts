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
      products: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          slug: string
          short_desc: string
          long_desc: string
          price_estimate: number | null
          dimensions: Json | null
          material: string | null
          category: string | null
          tags: string[]
          images: string[]
          name_ar: string | null
          short_desc_ar: string | null
          long_desc_ar: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          slug: string
          short_desc: string
          long_desc: string
          price_estimate?: number | null
          dimensions?: Json | null
          material?: string | null
          category?: string | null
          tags?: string[]
          images?: string[]
          name_ar?: string | null
          short_desc_ar?: string | null
          long_desc_ar?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          slug?: string
          short_desc?: string
          long_desc?: string
          price_estimate?: number | null
          dimensions?: Json | null
          material?: string | null
          category?: string | null
          tags?: string[]
          images?: string[]
          name_ar?: string | null
          short_desc_ar?: string | null
          long_desc_ar?: string | null
        }
      }
      inquiries: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          phone: string
          message: string
          product_id: string | null
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          phone: string
          message: string
          product_id?: string | null
          status?: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          phone?: string
          message?: string
          product_id?: string | null
          status?: string
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
