import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-walnut text-parchment pt-8 sm:pt-10 md:pt-12 pb-4 sm:pb-6">
      <div className="container-custom px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-6 md:mb-8">
          {/* Logo and brief */}
          <div>
            <Link to="/" className="inline-block mb-3 sm:mb-4">
              <img 
                src="/src/assets/1000Decors-logo.png" 
                alt="1000Decors" 
                className="h-10 sm:h-12 w-auto"
                onError={(e) => { 
                  (e.target as HTMLImageElement).src = '/src/assets/1000Decors-logo.png';
                }}
              />
            </Link>
            <p className="text-sand opacity-80 mb-4 sm:mb-6 text-sm sm:text-base">
              {t('about.subtitle')}
            </p>
            <div className="flex space-x-4">
              {/* Social media icons */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="transform hover:scale-110 transition-transform">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-sand hover:text-turquoise transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transform hover:scale-110 transition-transform">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-sand hover:text-turquoise transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="transform hover:scale-110 transition-transform">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-sand hover:text-turquoise transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div className="mt-2 sm:mt-0">
            <h4 className="text-base sm:text-lg font-playfair mb-3 sm:mb-4">{t('common.home')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sand hover:text-turquoise transition-colors text-sm sm:text-base">
                  {t('common.home')}
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-sand hover:text-turquoise transition-colors text-sm sm:text-base">
                  {t('common.gallery')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sand hover:text-turquoise transition-colors text-sm sm:text-base">
                  {t('common.about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sand hover:text-turquoise transition-colors text-sm sm:text-base">
                  {t('common.contact')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact info */}
          <div className="mt-2 sm:mt-0">
            <h4 className="text-base sm:text-lg font-playfair mb-3 sm:mb-4">{t('common.contactUs')}</h4>
            <address className="not-italic">
              <p className="flex items-start mb-2">
                <svg className="h-5 w-5 text-turquoise mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sand text-sm sm:text-base">123 Rue des Artisans, Marrakech, Morocco</span>
              </p>
              <p className="flex items-start mb-2">
                <svg className="h-5 w-5 text-turquoise mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sand text-sm sm:text-base">+212 123 456 789</span>
              </p>
              <p className="flex items-start mb-2">
                <svg className="h-5 w-5 text-turquoise mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sand text-sm sm:text-base">contact@1000decors.com</span>
              </p>
            </address>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-sand border-opacity-20 pt-4 mt-6 text-center">
          <p className="text-sand opacity-70 text-xs sm:text-sm">
            &copy; {currentYear} 1000Decors. {t('common.allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
