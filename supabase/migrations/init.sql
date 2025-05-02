-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_desc TEXT NOT NULL,
  long_desc TEXT NOT NULL,
  price_estimate DECIMAL,
  dimensions JSONB,
  material TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  name_ar TEXT,
  short_desc_ar TEXT,
  long_desc_ar TEXT,
  featured BOOLEAN DEFAULT FALSE
);

-- Create RLS policies for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to read products
CREATE POLICY "Allow anonymous read access to products" 
ON public.products FOR SELECT 
USING (true);

-- Allow anonymous users to create, update and delete products (for admin section with password protection in the app)
CREATE POLICY "Allow anonymous users to insert products" 
ON public.products FOR INSERT 
TO anon 
WITH CHECK (true);

CREATE POLICY "Allow anonymous users to update products" 
ON public.products FOR UPDATE 
TO anon 
USING (true);

CREATE POLICY "Allow anonymous users to delete products" 
ON public.products FOR DELETE 
TO anon 
USING (true);
