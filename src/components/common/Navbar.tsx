import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'ar' : 'fr';
    i18n.changeLanguage(newLang);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { to: '/', label: t('common.home') },
    { to: '/gallery', label: t('common.gallery') },
    { to: '/about', label: t('common.about') },
    { to: '/contact', label: t('common.contact') },
  ];

  return (
    <header className="bg-parchment shadow-sm sticky top-0 z-50">
      <nav className="container-custom py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src="/src/assets/1000Decors-logo.png" 
            alt="1000Decors" 
            className="h-8 sm:h-10 w-auto" 
            onError={(e) => { 
              (e.target as HTMLImageElement).src = "1000Decors-logo.png";
            }}
          />
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.to} 
              to={link.to} 
              className="text-walnut hover:text-amazigh-red transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Language switch and admin link */}
        <div className="hidden md:flex items-center space-x-4">
          <button 
            onClick={toggleLanguage}
            className="px-2 py-1 rounded border border-sand hover:bg-sand hover:bg-opacity-20 transition-colors"
          >
            {i18n.language === 'fr' ? 'عربي' : 'Français'}
          </button>
          <Link 
            to="/admin" 
            className="text-turquoise hover:underline"
          >
            {t('common.admin')}
          </Link>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-walnut"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? t('common.close') : t('common.menu')}
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-parchment border-t border-sand shadow-md absolute w-full z-50"
          >
            <div className="container-custom py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.to} 
                  to={link.to} 
                  className="text-walnut hover:text-amazigh-red transition-colors py-3 text-lg font-medium border-b border-sand border-opacity-30"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center justify-between py-3 pt-4">
                <button 
                  onClick={toggleLanguage}
                  className="px-3 py-2 rounded border border-sand hover:bg-sand hover:bg-opacity-20 transition-colors text-sm"
                >
                  {i18n.language === 'fr' ? 'عربي' : 'Français'}
                </button>
                <Link 
                  to="/admin" 
                  className="text-turquoise hover:underline px-3 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('common.admin')}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
