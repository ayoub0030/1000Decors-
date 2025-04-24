import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { 
  useProduct, 
  useCreateProduct, 
  useUpdateProduct, 
  generateSlug,
  type Product 
} from '../../hooks/useProducts';
import { supabase, uploadProductImage, deleteProductImage } from '../../lib/supabase';

// Form validation schema
const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  short_desc: z.string().min(10, 'Short description must be at least 10 characters'),
  long_desc: z.string().min(20, 'Long description must be at least 20 characters'),
  price_estimate: z.string().optional().transform(val => val ? parseFloat(val) : null),
  category: z.string().optional().nullable(),
  material: z.string().optional().nullable(),
  dimensions: z.object({
    width: z.string().optional().transform(val => val ? parseFloat(val) : 0),
    height: z.string().optional().transform(val => val ? parseFloat(val) : 0),
    depth: z.string().optional().transform(val => val ? parseFloat(val) : 0),
  }).optional().nullable(),
  name_ar: z.string().optional().nullable(),
  short_desc_ar: z.string().optional().nullable(),
  long_desc_ar: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
});

type ProductFormValues = z.infer<typeof productSchema>;

const ProductFormPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  
  // Queries and mutations
  const { data: existingProduct, isLoading: isLoadingProduct } = useProduct(id);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  
  // State for managing images
  const [images, setImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tagInput, setTagInput] = useState('');
  
  // Form setup
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      slug: '',
      short_desc: '',
      long_desc: '',
      price_estimate: '',
      category: '',
      material: '',
      dimensions: {
        width: '',
        height: '',
        depth: '',
      },
      name_ar: '',
      short_desc_ar: '',
      long_desc_ar: '',
      tags: [],
    },
  });
  
  // Watch name field to auto-generate slug
  const nameValue = watch('name');
  
  // Populate form with existing product data
  useEffect(() => {
    if (isEditMode && existingProduct) {
      reset({
        name: existingProduct.name,
        slug: existingProduct.slug,
        short_desc: existingProduct.short_desc,
        long_desc: existingProduct.long_desc,
        price_estimate: existingProduct.price_estimate?.toString() || '',
        category: existingProduct.category,
        material: existingProduct.material,
        dimensions: existingProduct.dimensions as any,
        name_ar: existingProduct.name_ar,
        short_desc_ar: existingProduct.short_desc_ar,
        long_desc_ar: existingProduct.long_desc_ar,
        tags: existingProduct.tags,
      });
      setImages(existingProduct.images || []);
    }
  }, [isEditMode, existingProduct, reset]);
  
  // Auto-generate slug from name if name changes and slug hasn't been manually modified
  useEffect(() => {
    if (nameValue && !isEditMode) {
      setValue('slug', generateSlug(nameValue));
    }
  }, [nameValue, setValue, isEditMode]);
  
  // Handle image file selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
    
    // Preview images
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          // This is temporary for preview only, these aren't the actual Supabase URLs
          setImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input
    e.target.value = '';
  };
  
  // Handle image drop
  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      setNewImages(prev => [...prev, ...files]);
      
      // Preview images
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setImages(prev => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  // Handle image removal
  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    
    // If it's a new image, remove from newImages as well
    if (index >= (existingProduct?.images.length || 0)) {
      const newImageIndex = index - (existingProduct?.images.length || 0);
      setNewImages(prev => prev.filter((_, i) => i !== newImageIndex));
    }
  };
  
  // Handle image drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  // Handle tag input
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };
  
  // Add tag
  const handleAddTag = () => {
    if (tagInput.trim()) {
      const currentTags = watch('tags') || [];
      setValue('tags', [...currentTags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  // Remove tag
  const handleRemoveTag = (index: number) => {
    const currentTags = watch('tags') || [];
    setValue('tags', currentTags.filter((_, i) => i !== index));
  };
  
  // Handle form submission
  const onSubmit = async (data: ProductFormValues) => {
    try {
      setUploading(true);
      
      // Keep track of successful uploads to update images array
      let uploadedImageUrls: string[] = [];
      
      // If editing, start with existing images
      if (isEditMode && existingProduct) {
        uploadedImageUrls = [...existingProduct.images];
      }
      
      // Upload new images if any
      if (newImages.length > 0) {
        const totalImages = newImages.length;
        let completedUploads = 0;
        
        for (const file of newImages) {
          const productId = isEditMode ? id : 'temp-' + Date.now();
          const imageUrl = await uploadProductImage(file, productId);
          
          if (imageUrl) {
            uploadedImageUrls.push(imageUrl);
          }
          
          completedUploads++;
          setUploadProgress(Math.round((completedUploads / totalImages) * 100));
        }
      }
      
      // Prepare product data
      const productData = {
        name: data.name,
        slug: data.slug,
        short_desc: data.short_desc,
        long_desc: data.long_desc,
        price_estimate: data.price_estimate,
        category: data.category,
        material: data.material,
        dimensions: data.dimensions,
        name_ar: data.name_ar,
        short_desc_ar: data.short_desc_ar,
        long_desc_ar: data.long_desc_ar,
        tags: data.tags,
        images: uploadedImageUrls,
      };
      
      // Create or update product
      if (isEditMode && id) {
        await updateProduct.mutateAsync({ id, product: productData });
      } else {
        await createProduct.mutateAsync(productData);
      }
      
      // Redirect to products list
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };
  
  // Loading state
  if (isEditMode && isLoadingProduct) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-walnut"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column - basic info */}
          <div>
            <h2 className="text-xl font-playfair text-walnut mb-6">
              {t('admin.basicInfo')}
            </h2>
            
            {/* Product Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.productName')} *
              </label>
              <input
                id="name"
                {...register('name')}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-turquoise`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
            
            {/* Product Slug */}
            <div className="mb-4">
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.productSlug')} *
              </label>
              <input
                id="slug"
                {...register('slug')}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.slug ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-turquoise`}
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
              )}
            </div>
            
            {/* Short Description */}
            <div className="mb-4">
              <label htmlFor="short_desc" className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.shortDescription')} *
              </label>
              <textarea
                id="short_desc"
                {...register('short_desc')}
                rows={3}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.short_desc ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-turquoise`}
              ></textarea>
              {errors.short_desc && (
                <p className="mt-1 text-sm text-red-600">{errors.short_desc.message}</p>
              )}
            </div>
            
            {/* Long Description */}
            <div className="mb-4">
              <label htmlFor="long_desc" className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.longDescription')} *
              </label>
              <textarea
                id="long_desc"
                {...register('long_desc')}
                rows={6}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.long_desc ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-turquoise`}
              ></textarea>
              {errors.long_desc && (
                <p className="mt-1 text-sm text-red-600">{errors.long_desc.message}</p>
              )}
            </div>
            
            {/* Price Estimate */}
            <div className="mb-4">
              <label htmlFor="price_estimate" className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.priceEstimate')}
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  MAD
                </span>
                <input
                  id="price_estimate"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register('price_estimate')}
                  className={`flex-1 px-4 py-2 rounded-r-md border ${
                    errors.price_estimate ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-turquoise`}
                />
              </div>
              {errors.price_estimate && (
                <p className="mt-1 text-sm text-red-600">{errors.price_estimate.message}</p>
              )}
            </div>
            
            {/* Category */}
            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.category')}
              </label>
              <input
                id="category"
                {...register('category')}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-turquoise"
              />
            </div>
            
            {/* Material */}
            <div className="mb-4">
              <label htmlFor="material" className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.material')}
              </label>
              <input
                id="material"
                {...register('material')}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-turquoise"
              />
            </div>
          </div>
          
          {/* Right column - additional info, Arabic translations, images */}
          <div>
            <h2 className="text-xl font-playfair text-walnut mb-6">
              {t('admin.additionalInfo')}
            </h2>
            
            {/* Dimensions */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.dimensions')}
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="width" className="block text-xs text-gray-500 mb-1">
                    {t('admin.width')} (cm)
                  </label>
                  <input
                    id="width"
                    type="number"
                    min="0"
                    step="0.1"
                    {...register('dimensions.width')}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-turquoise"
                  />
                </div>
                <div>
                  <label htmlFor="height" className="block text-xs text-gray-500 mb-1">
                    {t('admin.height')} (cm)
                  </label>
                  <input
                    id="height"
                    type="number"
                    min="0"
                    step="0.1"
                    {...register('dimensions.height')}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-turquoise"
                  />
                </div>
                <div>
                  <label htmlFor="depth" className="block text-xs text-gray-500 mb-1">
                    {t('admin.depth')} (cm)
                  </label>
                  <input
                    id="depth"
                    type="number"
                    min="0"
                    step="0.1"
                    {...register('dimensions.depth')}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-turquoise"
                  />
                </div>
              </div>
            </div>
            
            {/* Arabic Translations */}
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <h3 className="text-lg font-medium text-walnut mb-4">
                {t('admin.arabicTranslation')}
              </h3>
              
              {/* Arabic Name */}
              <div className="mb-4">
                <label htmlFor="name_ar" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.productNameArabic')}
                </label>
                <input
                  id="name_ar"
                  dir="rtl"
                  {...register('name_ar')}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-turquoise"
                />
              </div>
              
              {/* Arabic Short Description */}
              <div className="mb-4">
                <label htmlFor="short_desc_ar" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.shortDescriptionArabic')}
                </label>
                <textarea
                  id="short_desc_ar"
                  dir="rtl"
                  {...register('short_desc_ar')}
                  rows={3}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-turquoise"
                ></textarea>
              </div>
              
              {/* Arabic Long Description */}
              <div className="mb-4">
                <label htmlFor="long_desc_ar" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.longDescriptionArabic')}
                </label>
                <textarea
                  id="long_desc_ar"
                  dir="rtl"
                  {...register('long_desc_ar')}
                  rows={6}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-turquoise"
                ></textarea>
              </div>
            </div>
            
            {/* Tags */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.tags')}
              </label>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  className="flex-1 px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-turquoise"
                  placeholder={t('admin.enterTag')}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-turquoise text-white rounded-r-md hover:bg-opacity-90 transition-colors"
                >
                  {t('admin.addTag')}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {watch('tags')?.map((tag, index) => (
                  <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                    <span className="text-gray-800 text-sm">{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      className="ml-2 text-gray-500 hover:text-red-500"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.productImages')}
              </label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                onDrop={handleImageDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-sm text-gray-600">{t('admin.dragImagesHere')}</p>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
              
              {/* Image Previews */}
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-md bg-gray-200">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Upload Progress */}
              {uploading && uploadProgress > 0 && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-turquoise h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 text-center mt-2">
                    {t('admin.uploading')}: {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="mt-8 border-t border-gray-200 pt-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className="px-6 py-2.5 bg-turquoise text-white rounded-md shadow-sm text-sm font-medium hover:bg-opacity-90 disabled:bg-opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting || uploading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('common.saving')}
              </div>
            ) : (
              isEditMode ? t('common.update') : t('common.create')
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;
