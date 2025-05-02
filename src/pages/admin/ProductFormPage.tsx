import React, { useState } from 'react';
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Set up form
  const { 
    register, 
    handleSubmit, 
    reset,
    watch,
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

  const images = watch('images') || [];

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
      
      if (error) {
        console.error('Error fetching product:', error);
        throw error;
      }
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
      // Convert price_estimate to number if it exists
      const formattedData: any = { ...data };
      
      // Handle numeric fields properly - convert to number or null
      if (formattedData.price_estimate) {
        formattedData.price_estimate = parseFloat(formattedData.price_estimate);
      } else {
        // If empty string or undefined, set to null for database compatibility
        formattedData.price_estimate = null;
      }
      
      // Ensure we're only sending fields that match the database schema
      const validFields = [
        'name', 'slug', 'short_desc', 'long_desc', 'price_estimate',
        'category', 'material', 'dimensions', 'name_ar', 'short_desc_ar',
        'long_desc_ar', 'featured', 'tags', 'images'
      ];
      
      const dataToSubmit = Object.keys(formattedData)
        .filter(key => validFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = formattedData[key];
          return obj;
        }, {} as any);
      
      if (isEditMode && id) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(dataToSubmit)
          .eq('id', id);
        
        if (error) {
          console.error('Error updating product:', error);
          throw error;
        }
        return id;
      } else {
        // Create new product
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert([dataToSubmit])
          .select()
          .single();
        
        if (error) {
          console.error('Error creating product:', error);
          throw error;
        }
        return newProduct.id;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate('/admin/products');
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      alert(t('admin.errorSavingProduct', 'Error saving product. Please try again.'));
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prevFiles => [...prevFiles, ...filesArray]);
    }
  };

  const handleImageUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const productId = id || 'new-product-' + Date.now();
      const uploadPromises = selectedFiles.map(file => uploadProductImage(file, productId));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      const successfulUploads = uploadedUrls.filter(Boolean) as string[];
      if (successfulUploads.length > 0) {
        setValue('images', [...images, ...successfulUploads]);
        setSelectedFiles([]);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      setUploadError(t('admin.errorUploadingImages', 'Error uploading images. Please try again.'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageToRemove = images[index];
    try {
      const newImages = [...images];
      newImages.splice(index, 1);
      setValue('images', newImages);
      
      // If this is an existing image (not a preview), delete it from storage
      if (imageToRemove.startsWith('http')) {
        await deleteProductImage(imageToRemove);
      }
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      await saveProductMutation.mutateAsync(data);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  // Handle tag input
  const [tagInput, setTagInput] = useState('');
  
  const handleAddTag = () => {
    if (tagInput.trim()) {
      const currentTags = watch('tags') || [];
      setValue('tags', [...currentTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    const currentTags = watch('tags') || [];
    const newTags = [...currentTags];
    newTags.splice(index, 1);
    setValue('tags', newTags);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-playfair text-walnut">
          {isEditMode ? t('admin.productsEdit') : t('admin.productsCreate')}
        </h1>
        
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="text-turquoise hover:underline flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          {t('admin.backToProducts')}
        </button>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-walnut mb-4">{t('admin.basicInformation')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                {t('admin.productsNameLabel')} *
              </label>
              <input
                type="text"
                id="name"
                className={`form-input bg-white border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-transparent ${errors.name ? 'border-amazigh-red ring-1 ring-amazigh-red' : ''}`}
                {...register('name')}
              />
              {errors.name && (
                <p className="text-amazigh-red text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
            
            {/* Slug */}
            <div className="form-group">
              <label htmlFor="slug" className="form-label">
                {t('admin.productsSlugLabel')} *
              </label>
              <input
                type="text"
                id="slug"
                className={`form-input bg-white border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-transparent ${errors.slug ? 'border-amazigh-red ring-1 ring-amazigh-red' : ''}`}
                {...register('slug')}
              />
              {errors.slug && (
                <p className="text-amazigh-red text-sm mt-1">{errors.slug.message}</p>
              )}
            </div>
            
            {/* Short Description */}
            <div className="form-group col-span-2">
              <label htmlFor="short_desc" className="form-label">
                {t('admin.shortDescription')} *
              </label>
              <textarea
                id="short_desc"
                rows={2}
                className={`form-input bg-white border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-transparent ${errors.short_desc ? 'border-amazigh-red ring-1 ring-amazigh-red' : ''}`}
                {...register('short_desc')}
              />
              {errors.short_desc && (
                <p className="text-amazigh-red text-sm mt-1">{errors.short_desc.message}</p>
              )}
            </div>
            
            {/* Long Description */}
            <div className="form-group col-span-2">
              <label htmlFor="long_desc" className="form-label">
                {t('admin.longDescription')} *
              </label>
              <textarea
                id="long_desc"
                rows={4}
                className={`form-input bg-white border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-transparent ${errors.long_desc ? 'border-amazigh-red ring-1 ring-amazigh-red' : ''}`}
                {...register('long_desc')}
              />
              {errors.long_desc && (
                <p className="text-amazigh-red text-sm mt-1">{errors.long_desc.message}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Arabic Content */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-walnut mb-4">{t('admin.arabicContent')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Arabic Name */}
            <div className="form-group">
              <label htmlFor="name_ar" className="form-label">
                {t('admin.nameArabic')}
              </label>
              <input
                type="text"
                id="name_ar"
                className="form-input bg-white border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-transparent"
                {...register('name_ar')}
                dir="rtl"
              />
            </div>
            
            {/* Arabic Short Description */}
            <div className="form-group col-span-2">
              <label htmlFor="short_desc_ar" className="form-label">
                {t('admin.shortDescriptionArabic')}
              </label>
              <textarea
                id="short_desc_ar"
                rows={2}
                className="form-input bg-white border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-transparent"
                {...register('short_desc_ar')}
                dir="rtl"
              />
            </div>
            
            {/* Arabic Long Description */}
            <div className="form-group col-span-2">
              <label htmlFor="long_desc_ar" className="form-label">
                {t('admin.longDescriptionArabic')}
              </label>
              <textarea
                id="long_desc_ar"
                rows={4}
                className="form-input bg-white border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-transparent"
                {...register('long_desc_ar')}
                dir="rtl"
              />
            </div>
          </div>
        </div>
        
        {/* Product Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-walnut mb-4">{t('admin.productDetails')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category */}
            <div className="form-group">
              <label htmlFor="category" className="form-label">
                {t('admin.category')}
              </label>
              <input
                type="text"
                id="category"
                className="form-input bg-white border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-transparent"
                {...register('category')}
              />
            </div>
            
            {/* Material */}
            <div className="form-group">
              <label htmlFor="material" className="form-label">
                {t('admin.material')}
              </label>
              <input
                type="text"
                id="material"
                className="form-input bg-white border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-transparent"
                {...register('material')}
              />
            </div>
            
            {/* Price Estimate */}
            <div className="form-group">
              <label htmlFor="price_estimate" className="form-label">
                {t('admin.priceEstimate')}
              </label>
              <input
                type="number"
                id="price_estimate"
                className="form-input bg-white border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-transparent"
                {...register('price_estimate')}
              />
            </div>
            
            {/* Tags */}
            <div className="form-group col-span-3">
              <label className="form-label">{t('admin.tags')}</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="form-input flex-1 bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-transparent"
                  placeholder={t('admin.enterTag')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="ml-2 px-4 py-2 bg-turquoise text-white rounded-md hover:bg-opacity-90"
                >
                  {t('admin.add')}
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {watch('tags')?.map((tag, index) => (
                  <div 
                    key={index} 
                    className="bg-sand text-walnut px-3 py-1 rounded-full flex items-center text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      className="ml-1 text-amazigh-red"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Images */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-walnut mb-4">{t('admin.images')}</h2>
          
          <div className="space-y-4">
            {/* Image upload */}
            <div className="form-group">
              <label className="form-label">{t('admin.uploadImages')}</label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="image-upload"
                />
                <label 
                  htmlFor="image-upload"
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  {t('admin.selectFiles')}
                </label>
                
                <button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={selectedFiles.length === 0 || isUploading}
                  className="btn-primary"
                >
                  {isUploading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('admin.uploading')}
                    </div>
                  ) : (
                    t('admin.upload')
                  )}
                </button>
              </div>
              
              {selectedFiles.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  {selectedFiles.length} {t('admin.filesSelected')}
                </div>
              )}
              
              {uploadError && (
                <div className="mt-2 text-amazigh-red text-sm">
                  {uploadError}
                </div>
              )}
            </div>
            
            {/* Image preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {images.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={imageUrl} 
                    alt={`Product ${index}`} 
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-amazigh-red text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Submit Buttons */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {t('common.cancel')}
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('common.saving')}
              </div>
            ) : (
              t('common.save')
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;
