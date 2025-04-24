import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useProducts } from '../hooks/useProducts';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { data: featuredProducts, isLoading } = useProducts({ featured: true });

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="bg-parchment">
      {/* Hero Section */}
      <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Hero background - replace with actual video in production */}
          <div className="absolute inset-0 bg-walnut opacity-60"></div>
          <div className="absolute inset-0 bg-[url('/src/assets/1000Decors-logo.png')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        </div>
        
        <div className="container-custom relative z-10 text-center px-4 sm:px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-playfair text-parchment mb-4 md:mb-6">
              {t('home.heroTitle')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-sand max-w-2xl mx-auto mb-6 md:mb-8">
              {t('home.heroSubtitle')}
            </p>
            <Link 
              to="/gallery" 
              className="btn-primary inline-block text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3"
            >
              {t('common.gallery')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Brand Story Strip */}
      <section className="py-16 bg-sand bg-opacity-10">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-playfair text-walnut mb-6">
              {t('home.storyTitle')}
            </h2>
            <p className="text-lg text-walnut mb-6">
              {t('home.storyText')}
            </p>
            <Link to="/about" className="text-amazigh-red hover:underline">
              {t('common.readMore')} →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Carousel */}
      <section className="py-10 sm:py-12 md:py-16">
        <div className="container-custom px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-2xl sm:text-3xl font-playfair text-walnut mb-6 sm:mb-10 text-center">
              {t('home.featuredTitle')}
            </h2>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-walnut"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {featuredProducts && featuredProducts.map((product) => (
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
                          <span className="text-amazigh-red text-sm sm:text-base">
                            {product.category}
                          </span>
                          <span className="inline-block text-turquoise text-sm sm:text-base">
                            {t('common.viewDetails')} →
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="text-center mt-8 sm:mt-10">
              <Link 
                to="/gallery" 
                className="btn-secondary inline-block text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3"
              >
                {t('common.viewAllProducts')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Workshop Video Snippet */}
      <section className="py-10 sm:py-12 md:py-16 bg-walnut text-parchment">
        <div className="container-custom px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <motion.div 
              className="w-full md:w-1/2 rounded-lg overflow-hidden"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              {/* Replace with actual video in production */}
              <div className="relative pt-[56.25%] bg-black">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-16 h-16 text-parchment opacity-80" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z" />
                  </svg>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="w-full md:w-1/2 pt-6 md:pt-0"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <h2 className="text-2xl sm:text-3xl font-playfair mb-4 sm:mb-6">
                {t('home.workshopTitle')}
              </h2>
              <p className="text-sand opacity-90 mb-6 text-sm sm:text-base">
                {t('common.workshopDesc', 'Our artisans work with traditional techniques passed down through generations, creating unique pieces that blend ancestral craftsmanship with contemporary design.')}
              </p>
              <Link 
                to="/about" 
                className="inline-block px-4 py-2 sm:px-6 sm:py-3 border border-sand rounded hover:bg-sand hover:bg-opacity-20 transition-colors text-sm sm:text-base"
              >
                {t('common.discoverOurCraft')}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-playfair text-walnut mb-10 text-center">
              {t('home.testimonialsTitle')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <svg className="w-12 h-12 text-sand" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-playfair text-lg">Ahmed K.</h3>
                    <p className="text-walnut opacity-70">Rabat</p>
                  </div>
                </div>
                <p className="text-walnut">
                  "The craftsmanship is absolutely stunning. The attention to detail and traditional motifs make each piece a true work of art."
                </p>
              </div>
              
              {/* Testimonial 2 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <svg className="w-12 h-12 text-sand" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-playfair text-lg">Sophie M.</h3>
                    <p className="text-walnut opacity-70">Paris</p>
                  </div>
                </div>
                <p className="text-walnut">
                  "I purchased a custom dining table, and it has become the centerpiece of our home. The quality of the wood and the finish are exceptional."
                </p>
              </div>
              
              {/* Testimonial 3 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <svg className="w-12 h-12 text-sand" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-playfair text-lg">Omar B.</h3>
                    <p className="text-walnut opacity-70">Casablanca</p>
                  </div>
                </div>
                <p className="text-walnut">
                  "The team at 1000Decors was extremely helpful in designing a custom cabinet for my office. The result combines traditional style with modern functionality."
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-amazigh-red text-white">
        <div className="container-custom text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-playfair mb-6">
              {t('home.ctaTitle')}
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <Link
              to="/contact"
              className="bg-white text-amazigh-red px-8 py-3 rounded font-semibold hover:bg-opacity-90 transition-colors"
            >
              {t('home.ctaButton')}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
