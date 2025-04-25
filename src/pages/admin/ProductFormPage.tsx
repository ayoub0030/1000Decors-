import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase, uploadProductImage, deleteProductImage } from '../../lib/supabase';

// Define product schema for validation
const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  short_desc: z.string().min(10, 'Short description must be at least 10 characters'),
  long_desc: z.string().min(20, 'Long description must be at least 20 characters'),
  price_estimate: z.string().optional(),
  category: z.string().nullable().optional(),
  material: z.string().nullable().optional(),
  dimensions: z.any().optional(), // Simplified for now
  name_ar: z.string().optional(),
  short_desc_ar: z.string().optional(),
  long_desc_ar: z.string().optional(),
  featured: z.boolean().optional().default(false),
  tags: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
});

type ProductFormValues = z.infer<typeof productSchema>;

const ProductFormPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);
  
  // Set up form
  const { 
    register, 
    handleSubmit, 
    reset,
    setValue,
    formState: { errors, isSubmitting } 
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      featured: false,
      tags: [],
      images: [],
    }
  });

  // Fetch product data if in edit mode
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: isEditMode,
    onSuccess: (data) => {
      if (data) {
        // Populate form with product data
        Object.entries(data).forEach(([key, value]) => {
          if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
            setValue(key as any, value);
          }
        });
      }
    }
  });

  // Save product
  const saveProductMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      if (isEditMode && id) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(data)
          .eq('id', id);
        
        if (error) throw error;
        return id;
      } else {
        // Create new product
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert([data])
          .select()
          .single();
        
        if (error) throw error;
        return newProduct.id;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate('/admin/products');
    }
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      await saveProductMutation.mutateAsync(data);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-walnut"></div>
      </div>
    );
  }

  return (
    <div className="bg-parchment p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-playfair text-walnut mb-6">
        {isEditMode ? t('admin.products.edit') : t('admin.products.create')}
      </h1>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              {t('admin.products.nameLabel')}
            </label>
            <input
              type="text"
              id="name"
              className="form-input"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-amazigh-red text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          
          {/* Slug */}
          <div className="form-group">
            <label htmlFor="slug" className="form-label">
              {t('admin.products.slugLabel')}
            </label>
            <input
              type="text"
              id="slug"
              className="form-input"
              {...register('slug')}
            />
            {errors.slug && (
              <p className="text-amazigh-red text-sm mt-1">{errors.slug.message}</p>
            )}
          </div>
          
          {/* More form fields would go here */}
          
          <div className="col-span-2 mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? t('common.saving') : t('common.save')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="btn-secondary ml-4"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;
