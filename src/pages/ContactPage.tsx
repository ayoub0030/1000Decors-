import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useCreateInquiry } from '../hooks/useInquiries';
import WhatsAppButton from '../components/common/WhatsAppButton';

const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  const createInquiry = useCreateInquiry();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('contact.nameRequired');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('contact.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('contact.invalidEmail');
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = t('contact.phoneRequired');
    }
    
    if (!formData.message.trim()) {
      newErrors.message = t('contact.messageRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setFormStatus('submitting');
    
    try {
      await createInquiry.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        status: 'new',
      });
      
      setFormStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus('error');
      
      // Reset error message after 5 seconds
      setTimeout(() => {
        setFormStatus('idle');
      }, 5000);
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
    <div className="bg-parchment min-h-screen">
      {/* Hero Section */}
      <section className="bg-walnut text-white py-16">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-playfair mb-4">
              {t('contact.title')}
            </h1>
            <p className="text-xl text-sand max-w-2xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-2xl font-playfair text-walnut mb-6">
                {t('contact.getInTouch')}
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-turquoise text-white p-3 rounded-full mr-4">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-playfair text-walnut mb-1">
                      {t('contact.address')}
                    </h3>
                    <p className="text-walnut">
                      123 Rue des Artisans, <br />
                      Marrakech, Morocco
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-turquoise text-white p-3 rounded-full mr-4">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-playfair text-walnut mb-1">
                      {t('contact.phone')}
                    </h3>
                    <p className="text-walnut">+212 123 456 789</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-turquoise text-white p-3 rounded-full mr-4">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-playfair text-walnut mb-1">
                      {t('contact.email')}
                    </h3>
                    <p className="text-walnut">contact@1000decors.com</p>
                  </div>
                </div>
              </div>
              
              {/* Map placeholder */}
              <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13590.553690612911!2d-7.997512836816329!3d31.631624781271105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafee8d96179e51%3A0x5650b23803ba5085!2sMarrakech%2C%20Morocco!5e0!3m2!1sen!2sus!4v1650487314349!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="1000Decors Workshop Location"
                ></iframe>
              </div>
              
              {/* Working hours */}
              <div className="mt-8 p-6 bg-sand bg-opacity-20 rounded-lg">
                <h3 className="text-lg font-playfair text-walnut mb-4">
                  {t('contact.workingHours')}
                </h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-walnut">{t('contact.mondayFriday')}</span>
                    <span className="text-walnut font-medium">9:00 AM - 6:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-walnut">{t('contact.saturday')}</span>
                    <span className="text-walnut font-medium">10:00 AM - 4:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-walnut">{t('contact.sunday')}</span>
                    <span className="text-walnut font-medium">{t('contact.closed')}</span>
                  </li>
                </ul>
              </div>
            </motion.div>
            
            {/* Contact Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-playfair text-walnut mb-6">
                  {t('contact.sendMessage')}
                </h2>
                
                {/* Form status messages */}
                {formStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
                    {t('contact.successMessage')}
                  </div>
                )}
                
                {formStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
                    {t('contact.errorMessage')}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-walnut font-medium mb-2">
                      {t('contact.name')} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-md border ${
                        errors.name ? 'border-red-500' : 'border-sand'
                      } focus:outline-none focus:ring-2 focus:ring-turquoise`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-red-500 text-sm">{errors.name}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-walnut font-medium mb-2">
                      {t('contact.email')} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-md border ${
                        errors.email ? 'border-red-500' : 'border-sand'
                      } focus:outline-none focus:ring-2 focus:ring-turquoise`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-walnut font-medium mb-2">
                      {t('contact.phone')} *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-md border ${
                        errors.phone ? 'border-red-500' : 'border-sand'
                      } focus:outline-none focus:ring-2 focus:ring-turquoise`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-red-500 text-sm">{errors.phone}</p>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-walnut font-medium mb-2">
                      {t('contact.message')} *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-md border ${
                        errors.message ? 'border-red-500' : 'border-sand'
                      } focus:outline-none focus:ring-2 focus:ring-turquoise`}
                    ></textarea>
                    {errors.message && (
                      <p className="mt-1 text-red-500 text-sm">{errors.message}</p>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-turquoise text-white py-3 rounded-md font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={formStatus === 'submitting'}
                  >
                    {formStatus === 'submitting' ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('contact.submitting')}
                      </span>
                    ) : (
                      t('contact.submit')
                    )}
                  </button>
                </form>
              </div>
              
              {/* Alternative contact */}
              <div className="mt-8 p-6 bg-amazigh-red text-white rounded-lg">
                <div className="flex items-center">
                  <svg className="h-10 w-10 text-white mr-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 1.5C6.201 1.5 1.5 6.201 1.5 12c0 1.868.487 3.618 1.339 5.143L1.5 22.5l5.572-1.313A10.426 10.426 0 0012 22.5c5.799 0 10.5-4.701 10.5-10.5S17.799 1.5 12 1.5zm0 19.5c-1.92 0-3.722-.56-5.24-1.519l-.377-.225-3.913.978.999-3.657-.247-.395C2.309 14.724 1.74 12.92 1.74 11c0-5.69 4.63-10.31 10.32-10.31 5.689 0 10.319 4.62 10.319 10.31 0 5.689-4.63 10.31-10.319 10.31z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-playfair mb-1">
                      {t('common.preferWhatsApp')}
                    </h3>
                    <p className="text-white opacity-90 mb-2">
                      {t('common.instantResponses')}
                    </p>
                    <a
                      href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '+212XXXXXXXXX'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-white text-amazigh-red px-4 py-2 rounded font-medium hover:bg-sand transition-colors"
                    >
                      {t('common.chatOnWhatsApp')}
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* WhatsApp floating button */}
      <WhatsAppButton />
    </div>
  );
};

export default ContactPage;
