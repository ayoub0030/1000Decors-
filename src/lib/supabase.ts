import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Image helpers
export const uploadProductImage = async (file: File, productId: string): Promise<string | null> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${productId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${productId}/${fileName}`;

  const { error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, { upsert: true });

  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }

  const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
  return data.publicUrl;
};

export const deleteProductImage = async (imageUrl: string): Promise<boolean> => {
  // Extract the path from the full URL
  const urlParts = imageUrl.split('product-images/');
  if (urlParts.length < 2) return false;
  
  const path = urlParts[1];
  
  try {
    const { error } = await supabase.storage.from('product-images').remove([path]);
    
    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};
