import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface WhatsAppButtonProps {
  productSlug?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ productSlug }) => {
  const { t } = useTranslation();
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '+212XXXXXXXXX';
  
  const baseMessage = encodeURIComponent(t('common.inquireViaWhatsApp'));
  const productMessage = productSlug 
    ? encodeURIComponent(`${t('common.inquireViaWhatsApp')} - ${productSlug}`) 
    : baseMessage;
  
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${productSlug ? productMessage : baseMessage}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white rounded-full p-3 shadow-lg flex items-center justify-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      aria-label={t('common.inquireViaWhatsApp')}
    >
      <svg 
        className="h-8 w-8" 
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 1.5C6.201 1.5 1.5 6.201 1.5 12c0 1.868.487 3.618 1.339 5.143L1.5 22.5l5.572-1.313A10.426 10.426 0 0012 22.5c5.799 0 10.5-4.701 10.5-10.5S17.799 1.5 12 1.5zm0 19.5c-1.92 0-3.722-.56-5.24-1.519l-.377-.225-3.913.978.999-3.657-.247-.395C2.309 14.724 1.74 12.92 1.74 11c0-5.69 4.63-10.31 10.32-10.31 5.689 0 10.319 4.62 10.319 10.31 0 5.689-4.63 10.31-10.319 10.31z" />
      </svg>
    </motion.a>
  );
};

export default WhatsAppButton;
