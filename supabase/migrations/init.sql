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
  long_desc_ar TEXT
);

-- Create RLS policies for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to read products
CREATE POLICY "Allow anonymous read access to products" 
ON public.products FOR SELECT 
USING (true);

-- Allow only authenticated users to create, update and delete products
CREATE POLICY "Allow authenticated users to insert products" 
ON public.products FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update products" 
ON public.products FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to delete products" 
ON public.products FOR DELETE 
TO authenticated 
USING (true);

-- Create inquiries table
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  product_id UUID REFERENCES public.products(id),
  status TEXT DEFAULT 'new'
);

-- Create RLS policies for inquiries
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to create inquiries
CREATE POLICY "Allow anonymous users to insert inquiries" 
ON public.inquiries FOR INSERT 
TO anon 
WITH CHECK (true);

-- Allow only authenticated users to read, update and delete inquiries
CREATE POLICY "Allow authenticated users to select inquiries" 
ON public.inquiries FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to update inquiries" 
ON public.inquiries FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to delete inquiries" 
ON public.inquiries FOR DELETE 
TO authenticated 
USING (true);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at automatically
CREATE TRIGGER update_products_updated_at 
BEFORE UPDATE ON public.products 
FOR EACH ROW EXECUTE FUNCTION update_modified_column();
