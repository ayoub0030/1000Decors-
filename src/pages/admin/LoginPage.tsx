import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage({
        type: 'error',
        text: t('admin.emailRequired'),
      });
      return;
    }
    
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      const { error } = await signIn(email);
      
      if (error) {
        setMessage({
          type: 'error',
          text: error.message,
        });
      } else {
        setMessage({
          type: 'success',
          text: t('admin.checkEmail'),
        });
        setEmail('');
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: t('admin.loginError'),
      });
    } finally {
      setIsSubmitting(false);
    }
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
    <div className="min-h-screen bg-parchment flex items-center justify-center px-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden"
      >
        <div className="bg-walnut text-white p-6 text-center">
          <Link to="/" className="inline-block mb-4">
            <img 
              src="/assets/brand/logo-light.svg" 
              alt="1000Decors" 
              className="h-12 w-auto mx-auto"
              onError={(e) => { 
                (e.target as HTMLImageElement).src = '/assets/brand/logo-light-fallback.png';
              }}
            />
          </Link>
          <h1 className="text-2xl font-playfair">{t('admin.loginTitle')}</h1>
          <p className="text-sand mt-2">{t('admin.loginSubtitle')}</p>
        </div>
        
        <div className="p-6">
          {message && (
            <div 
              className={`p-4 mb-6 rounded-md ${
                message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-walnut font-medium mb-2">
                {t('common.email')}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('admin.emailPlaceholder')}
                className="w-full px-4 py-2 rounded-md border border-sand focus:outline-none focus:ring-2 focus:ring-turquoise"
                disabled={isSubmitting}
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-turquoise text-white py-3 rounded-md font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('common.processing')}
                </span>
              ) : (
                t('admin.sendLoginLink')
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link to="/" className="text-turquoise hover:underline">
              {t('common.backToHome')}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
