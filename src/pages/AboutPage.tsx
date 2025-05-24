import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  // Timeline data
  const timelineEvents = [
    {
      year: '1500s',
      title: 'The Beginning',
      description: 'The first generation of our family artisans began crafting wooden wares in the Atlas Mountains.'
    },
    {
      year: '1750',
      title: 'Royal Recognition',
      description: 'Our ancestors became recognized by the royal court for their exquisite craftsmanship.'
    },
    {
      year: '1920',
      title: 'Workshop Established',
      description: 'The modern workshop was established in Marrakech, expanding techniques and designs.'
    },
    {
      year: '1980',
      title: 'International Recognition',
      description: 'Our artisans began exhibiting internationally, bringing Amazigh craftsmanship to the world stage.'
    },
    {
      year: '2010',
      title: 'Combining Tradition & Innovation',
      description: 'We began incorprinciples while preserving traditional techniques.'
    },
    {
      year: '2025',
      title: '1000Decors Launch',
      description: 'We launched 1000Decors to bring our heritage craftsmanship to homes around the world.'
    }
  ];

  // Artisans data
  const artisans = [
    {
      name: 'Hamid Berber',
      role: 'Master Craftsman',
      image: '/assets/brand/artisan1.jpg'
    },
    {
      name: 'Fatima Ouazzani',
      role: 'Design Specialist',
      image: '/assets/brand/artisan2.jpg'
    },
    {
      name: 'Omar Elmourabit',
      role: 'Wood Carving Expert',
      image: '/assets/brand/artisan3.jpg'
    }
  ];

  return (
    <div className="bg-parchment min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-walnut opacity-80"></div>
          <div className="absolute inset-0 bg-[url('/assets/brand/wood-grain-bg.jpg')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        </div>
        
        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="text-4xl md:text-5xl font-playfair text-parchment mb-6">
              {t('about.title')}
            </h1>
            <p className="text-xl text-sand max-w-2xl mx-auto">
              {t('about.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-playfair text-walnut mb-4">
              {t('about.timeline')}
            </h2>
            <div className="h-1 w-24 bg-amazigh-red mx-auto"></div>
          </motion.div>

          {/* Timeline visualization */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-sand"></div>

            {/* Timeline events */}
            {timelineEvents.map((event, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className={`relative mb-12 flex ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div className="w-1/2"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/4">
                  <div className="h-8 w-8 rounded-full bg-turquoise border-4 border-sand flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className={`w-1/2 ${
                  index % 2 === 0 ? 'pl-12' : 'pr-12'
                }`}>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-amazigh-red font-bold mb-2">{event.year}</div>
                    <h3 className="text-xl font-playfair text-walnut mb-2">{event.title}</h3>
                    <p className="text-walnut">{event.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Craft Section */}
      <section className="py-16 bg-walnut text-parchment">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl font-playfair mb-6">
                {t('about.craftTitle')}
              </h2>
              <p className="text-lg text-sand mb-6">
                {t('about.craftText')}
              </p>
              <p className="text-sand mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis felis euismod, condimentum magna ut, tincidunt eros. Nunc vehicula ligula ac libero venenatis, id commodo lectus sollicitudin. Cras semper sem quis ex mollis efficitur.
              </p>
              <Link 
                to="/gallery" 
                className="text-turquoise hover:underline"
              >
                {t('common.exploreGallery')} →
              </Link>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="relative h-80 md:h-96 rounded-lg overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('/assets/brand/craft-process.jpg')] bg-cover bg-center">
                <div className="absolute inset-0 bg-walnut opacity-20"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Artisans Section */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-playfair text-walnut mb-4">
              {t('about.artisansTitle')}
            </h2>
            <div className="h-1 w-24 bg-amazigh-red mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {artisans.map((artisan, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="bg-white rounded-lg overflow-hidden shadow-md"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={artisan.image}
                    alt={artisan.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/brand/artisan-placeholder.jpg';
                    }}
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-playfair text-walnut mb-1">{artisan.name}</h3>
                  <p className="text-amazigh-red">{artisan.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="py-16 bg-sand bg-opacity-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="relative h-80 md:h-96 rounded-lg overflow-hidden order-2 md:order-1"
            >
              <div className="absolute inset-0 bg-[url('/assets/brand/sustainable-wood.jpg')] bg-cover bg-center">
                <div className="absolute inset-0 bg-turquoise opacity-10"></div>
              </div>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="order-1 md:order-2"
            >
              <h2 className="text-3xl font-playfair text-walnut mb-6">
                {t('about.sustainabilityTitle')}
              </h2>
              <p className="text-walnut mb-6">
                {t('about.sustainabilityText')}
              </p>
              <p className="text-walnut mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisis luctus nisi, et faucibus nulla ultrices quis. Suspendisse consectetur elementum tellus, quis luctus purus gravida vel. Integer ut risus enim.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-turquoise text-white flex items-center justify-center mr-3">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-walnut">Sustainable Sourcing</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-turquoise text-white flex items-center justify-center mr-3">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-walnut">Eco-friendly Finishes</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-turquoise text-white flex items-center justify-center mr-3">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-walnut">Zero-waste Workshop</span>
                </div>
              </div>
            </motion.div>
          </div>
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

export default AboutPage;
