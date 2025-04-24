import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

const AdminLayout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Navigation items
  const navItems = [
    {
      label: t('admin.products'),
      path: '/admin/products',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m-8-4l8 4m8 0l-8 4m8-4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      label: t('admin.inquiries'),
      path: '/admin/inquiries',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'ar' : 'fr';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full w-64 bg-walnut text-white z-30 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 border-b border-white border-opacity-10">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/assets/brand/logo-light.svg" 
              alt="1000Decors" 
              className="h-8"
              onError={(e) => { 
                (e.target as HTMLImageElement).src = '/assets/brand/logo-light-fallback.png';
              }}
            />
            <span className="text-lg font-playfair">1000Decors</span>
          </Link>
        </div>
        
        <nav className="mt-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-3 hover:bg-walnut hover:bg-opacity-80 transition-colors ${
                    location.pathname.startsWith(item.path) ? 'bg-turquoise bg-opacity-20 border-r-4 border-turquoise' : ''
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="border-t border-white border-opacity-10 mt-6 pt-6 px-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 w-full px-2 py-2 rounded hover:bg-walnut hover:bg-opacity-80 transition-colors mb-4"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span>{i18n.language === 'fr' ? 'عربي' : 'Français'}</span>
            </button>
            
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 w-full px-2 py-2 rounded hover:bg-walnut hover:bg-opacity-80 transition-colors text-left"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>{t('common.logout')}</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <button
                className="lg:hidden text-walnut"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="ml-4 text-xl font-playfair text-walnut">
                {location.pathname.includes('/products/new')
                  ? t('admin.newProduct')
                  : location.pathname.includes('/products/') && location.pathname.includes('/edit')
                  ? t('admin.editProduct')
                  : location.pathname.includes('/products')
                  ? t('admin.products')
                  : location.pathname.includes('/inquiries')
                  ? t('admin.inquiries')
                  : t('admin.dashboard')}
              </h1>
            </div>
            
            <div className="flex items-center">
              <Link
                to="/"
                className="text-walnut hover:text-turquoise transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {t('common.viewSite')}
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <motion.main 
          className="flex-1 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.main>

        {/* Footer */}
        <footer className="bg-white p-4 border-t border-gray-200 text-center text-walnut text-sm">
          &copy; {new Date().getFullYear()} 1000Decors Admin Panel
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
