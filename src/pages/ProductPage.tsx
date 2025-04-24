import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useProduct, useProducts } from '../hooks/useProducts';
import WhatsAppButton from '../components/common/WhatsAppButton';

const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const { data: product, isLoading, error } = useProduct(slug || '');
  const { data: relatedProducts } = useProducts();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-walnut"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-parchment py-16">
        <div className="container-custom text-center">
          <h1 className="text-3xl font-playfair text-walnut mb-4">
            {t('product.notFound')}
          </h1>
          <p className="text-walnut mb-8">
            {t('product.notFoundDescription')}
          </p>
          <Link to="/gallery" className="btn-primary">
            {t('common.backToGallery')}
          </Link>
        </div>
      </div>
    );
  }

  // Format price if available
  const formatPrice = (price: number | null) => {
    if (!price) return '';
    return new Intl.NumberFormat(i18n.language === 'fr' ? 'fr-FR' : 'ar-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Get at most 3 related products from the same category
  const filtered = relatedProducts
    ?.filter(
      (p) => p.category === product.category && p.id !== product.id
    )
    .slice(0, 3);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="bg-parchment min-h-screen pb-16">
      {/* Product Detail */}
      <section className="pt-8 pb-16">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10"
          >
            {/* Image Gallery */}
            <div>
              {product.images.length > 0 ? (
                <>
                  <div className="bg-white p-2 rounded-lg shadow-md mb-4 aspect-w-4 aspect-h-3 overflow-hidden">
                    <img
                      src={product.images[currentImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`bg-white p-1 rounded-md overflow-hidden border-2 ${
                            index === currentImageIndex
                              ? 'border-turquoise'
                              : 'border-transparent'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${product.name} thumbnail ${index + 1}`}
                            className="w-full h-16 object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white p-4 rounded-lg shadow-md aspect-w-4 aspect-h-3 flex items-center justify-center">
                  <div className="text-walnut opacity-50">
                    {t('product.noImagesAvailable')}
                  </div>
                </div>
              )}
            </div>

            {/* Product Information */}
            <div>
              {/* Breadcrumbs */}
              <div className="mb-4 text-sm">
                <Link to="/" className="text-walnut opacity-70 hover:text-turquoise">
                  {t('common.home')}
                </Link>
                <span className="mx-2">/</span>
                <Link to="/gallery" className="text-walnut opacity-70 hover:text-turquoise">
                  {t('common.gallery')}
                </Link>
                <span className="mx-2">/</span>
                <span className="text-amazigh-red">{product.name}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-playfair text-walnut mb-4">
                {i18n.language === 'ar' && product.name_ar ? product.name_ar : product.name}
              </h1>

              <p className="text-lg text-walnut mb-6">
                {i18n.language === 'ar' && product.short_desc_ar 
                  ? product.short_desc_ar 
                  : product.short_desc}
              </p>

              {/* Product Details Table */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="font-playfair text-xl mb-4 text-walnut">
                  {t('product.details')}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {product.category && (
                    <div>
                      <h3 className="text-sm font-semibold text-walnut opacity-70">
                        {t('product.category')}
                      </h3>
                      <p className="text-walnut">{product.category}</p>
                    </div>
                  )}
                  {product.material && (
                    <div>
                      <h3 className="text-sm font-semibold text-walnut opacity-70">
                        {t('product.material')}
                      </h3>
                      <p className="text-walnut">{product.material}</p>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="col-span-2">
                      <h3 className="text-sm font-semibold text-walnut opacity-70">
                        {t('product.dimensions')}
                      </h3>
                      <p className="text-walnut">
                        {typeof product.dimensions === 'object' && product.dimensions !== null
                          ? `${(product.dimensions as any).width || 0}cm × ${
                              (product.dimensions as any).height || 0
                            }cm × ${(product.dimensions as any).depth || 0}cm`
                          : String(product.dimensions)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Long Description */}
              <div className="mb-8">
                <h2 className="font-playfair text-xl mb-4 text-walnut">
                  {t('product.description')}
                </h2>
                <div className="prose prose-walnut max-w-none">
                  <p className="text-walnut">
                    {i18n.language === 'ar' && product.long_desc_ar 
                      ? product.long_desc_ar 
                      : product.long_desc}
                  </p>
                </div>
              </div>

              {/* Price Estimate & CTA */}
              <div className="bg-amazigh-red text-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0">
                    <h3 className="font-playfair text-xl">
                      {t('product.priceEstimate')}
                    </h3>
                    <p className="text-2xl font-playfair">
                      {product.price_estimate ? formatPrice(product.price_estimate) : t('product.contactForPrice')}
                    </p>
                  </div>
                  <Link
                    to={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '+212XXXXXXXXX'}?text=${encodeURIComponent(
                      `${t('product.inquire')}: ${product.name} (${slug})`
                    )}`}
                    className="bg-white text-amazigh-red px-6 py-3 rounded-lg font-semibold hover:bg-sand hover:text-amazigh-red transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('product.inquire')}
                  </Link>
                </div>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mt-6">
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-sand bg-opacity-30 text-walnut px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Products */}
      {filtered && filtered.length > 0 && (
        <section className="pb-16">
          <div className="container-custom">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-2xl font-playfair text-walnut mb-8">
                {t('product.relatedProducts')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filtered.map((relatedProduct) => (
                  <motion.div
                    key={relatedProduct.id}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all"
                  >
                    <Link to={`/product/${relatedProduct.slug}`}>
                      <div className="h-48 overflow-hidden">
                        <img
                          src={relatedProduct.images[0] || '/assets/brand/placeholder.jpg'}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-playfair text-lg text-walnut mb-2 line-clamp-1">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-walnut opacity-80 text-sm mb-2 line-clamp-2">
                          {relatedProduct.short_desc}
                        </p>
                        <span className="text-turquoise text-sm">
                          {t('common.viewDetails')} →
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* WhatsApp Button with product info */}
      <WhatsAppButton productSlug={product.name} />
    </div>
  );
};

export default ProductPage;
