import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-parchment min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-6xl font-playfair text-walnut mb-6">404</h1>
        <h2 className="text-2xl font-playfair text-walnut mb-4">
          {t('notFound.title', 'Page Not Found')}
        </h2>
        <p className="text-walnut opacity-80 mb-8">
          {t('notFound.message', 'The page you are looking for does not exist or has been moved.')}
        </p>
        <Link 
          to="/" 
          className="btn-primary inline-block"
        >
          {t('notFound.returnHome', 'Return to Home')}
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
