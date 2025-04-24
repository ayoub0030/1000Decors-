import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useProducts } from '../hooks/useProducts';

const GalleryPage: React.FC = () => {
  const { t } = useTranslation();
  const [category, setCategory] = useState<string | null>(null);
  const [motif, setMotif] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  
  const { data: products, isLoading } = useProducts({ 
    category: category || undefined,
  });

  // Sample categories for filtering
  const categories = [
    'Tables', 
    'Chairs', 
    'Cabinets', 
    'Decor', 
    'Beds'
  ];
  
  // Sample motifs for filtering
  const motifs = [
    'Geometric', 
    'Floral', 
    'Amazigh Symbols', 
    'Traditional',
    'Modern'
  ];
  
  // Sample sizes for filtering
  const sizes = [
    'Small', 
    'Medium', 
    'Large', 
    'Extra Large'
  ];

  const handleCategoryChange = (cat: string | null) => {
    setCategory(cat);
  };

  const handleMotifChange = (m: string | null) => {
    setMotif(m);
  };

  const handleSizeChange = (s: string | null) => {
    setSize(s);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="bg-parchment py-8 sm:py-12 md:py-16">
      <div className="container-custom px-4 sm:px-6">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeIn}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair text-walnut mb-3 sm:mb-4">
            {t('gallery.title')}
          </h1>
          <p className="text-walnut opacity-80 max-w-3xl mx-auto text-sm sm:text-base">
            {t('gallery.subtitle')}
          </p>
        </motion.div>

        {/* Filters */}
        <div className="mb-8 sm:mb-10">
          <h2 className="text-lg sm:text-xl font-playfair text-walnut mb-3 sm:mb-4">
            {t('gallery.filterBy')}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {/* Category filter */}
            <div>
              <h3 className="text-sm sm:text-base font-medium text-walnut mb-2">
                {t('gallery.category')}
              </h3>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handleCategoryChange(null)}
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm 
                    ${!category 
                      ? 'bg-turquoise text-white' 
                      : 'bg-sand bg-opacity-30 text-walnut hover:bg-opacity-50'
                    } transition-colors`}
                >
                  {t('gallery.allCategories')}
                </button>
                {categories.map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs sm:text-sm 
                      ${category === cat 
                        ? 'bg-turquoise text-white' 
                        : 'bg-sand bg-opacity-30 text-walnut hover:bg-opacity-50'
                      } transition-colors`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Motif filter */}
            <div>
              <h3 className="text-sm sm:text-base font-medium text-walnut mb-2">
                {t('gallery.motif')}
              </h3>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handleMotifChange(null)}
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm 
                    ${!motif 
                      ? 'bg-turquoise text-white' 
                      : 'bg-sand bg-opacity-30 text-walnut hover:bg-opacity-50'
                    } transition-colors`}
                >
                  {t('common.all', 'All Motifs')}
                </button>
                {motifs.map((m) => (
                  <button 
                    key={m}
                    onClick={() => handleMotifChange(m)}
                    className={`px-3 py-1.5 rounded-full text-xs sm:text-sm 
                      ${motif === m 
                        ? 'bg-turquoise text-white' 
                        : 'bg-sand bg-opacity-30 text-walnut hover:bg-opacity-50'
                      } transition-colors`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Size filter */}
            <div>
              <h3 className="text-sm sm:text-base font-medium text-walnut mb-2">
                {t('gallery.size')}
              </h3>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handleSizeChange(null)}
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm 
                    ${!size 
                      ? 'bg-turquoise text-white' 
                      : 'bg-sand bg-opacity-30 text-walnut hover:bg-opacity-50'
                    } transition-colors`}
                >
                  {t('common.all', 'All Sizes')}
                </button>
                {sizes.map((s) => (
                  <button 
                    key={s}
                    onClick={() => handleSizeChange(s)}
                    className={`px-3 py-1.5 rounded-full text-xs sm:text-sm 
                      ${size === s 
                        ? 'bg-turquoise text-white' 
                        : 'bg-sand bg-opacity-30 text-walnut hover:bg-opacity-50'
                      } transition-colors`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-walnut"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {products && products.map((product) => (
              <motion.div 
                key={product.id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <Link to={`/product/${product.slug}`}>
                  <div className="h-48 sm:h-56 md:h-64 overflow-hidden">
                    <img 
                      src={product.images[0] || '/assets/brand/placeholder.jpg'} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="font-playfair text-lg sm:text-xl text-walnut mb-2">
                      {product.name}
                    </h3>
                    <p className="text-walnut opacity-80 mb-4 line-clamp-2 text-sm sm:text-base">
                      {product.short_desc}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-amazigh-red text-xs sm:text-sm">
                        {product.category}
                      </span>
                      <span className="text-turquoise text-xs sm:text-sm">
                        {product.dimensions}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Load more button */}
        {products && products.length > 0 && (
          <div className="text-center mt-8 sm:mt-10">
            <button className="btn-secondary text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3">
              {t('gallery.loadMore')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
