import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInquiries, useUpdateInquiry, useDeleteInquiry } from '../../hooks/useInquiries';

const InquiriesPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { data: inquiries, isLoading: isPending } = useInquiries();
  const updateInquiry = useUpdateInquiry();
  const deleteInquiry = useDeleteInquiry();
  
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<{ show: boolean; id: string; name: string }>({
    show: false,
    id: '',
    name: '',
  });
  
  // Handle status change
  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateInquiry.mutateAsync({ id, status });
    } catch (error) {
      console.error('Error updating inquiry status:', error);
    }
  };
  
  // Open delete modal
  const openDeleteModal = (id: string, name: string) => {
    setShowDeleteModal({ show: true, id, name });
  };
  
  // Close delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal({ show: false, id: '', name: '' });
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      await deleteInquiry.mutateAsync(showDeleteModal.id);
      setShowDeleteModal({ show: false, id: '', name: '' });
    } catch (error) {
      console.error('Error deleting inquiry:', error);
    }
  };
  
  // Filter inquiries based on status
  const filteredInquiries = inquiries?.filter((inquiry) => {
    return !statusFilter || inquiry.status === statusFilter;
  });
  
  // Format date in locale
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    
    return new Date(dateString).toLocaleDateString(
      i18n.language === 'fr' ? 'fr-FR' : 'ar-MA',
      options
    );
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-gray-700">{t('admin.filterByStatus')}:</span>
          <button
            onClick={() => setStatusFilter(null)}
            className={`px-3 py-1 text-sm rounded-full ${
              statusFilter === null
                ? 'bg-turquoise text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            } transition-colors`}
          >
            {t('admin.allInquiries')}
          </button>
          <button
            onClick={() => setStatusFilter('new')}
            className={`px-3 py-1 text-sm rounded-full ${
              statusFilter === 'new'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            } transition-colors`}
          >
            {t('admin.statusNew')}
          </button>
          <button
            onClick={() => setStatusFilter('in-progress')}
            className={`px-3 py-1 text-sm rounded-full ${
              statusFilter === 'in-progress'
                ? 'bg-yellow-600 text-white'
                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
            } transition-colors`}
          >
            {t('admin.statusInProgress')}
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1 text-sm rounded-full ${
              statusFilter === 'completed'
                ? 'bg-green-600 text-white'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            } transition-colors`}
          >
            {t('admin.statusCompleted')}
          </button>
          <button
            onClick={() => setStatusFilter('archived')}
            className={`px-3 py-1 text-sm rounded-full ${
              statusFilter === 'archived'
                ? 'bg-gray-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            } transition-colors`}
          >
            {t('admin.statusArchived')}
          </button>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isPending ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-walnut"></div>
          </div>
        ) : filteredInquiries && filteredInquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.inquiryFrom')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.inquiryDate')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.message')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.product')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.status')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-walnut">{inquiry.name}</div>
                        <div className="text-sm text-gray-500">{inquiry.email}</div>
                        <div className="text-sm text-gray-500">{inquiry.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(inquiry.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-md truncate">
                        {inquiry.message.length > 100
                          ? `${inquiry.message.substring(0, 100)}...`
                          : inquiry.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {inquiry.product_id ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          {(inquiry as any).products?.name || t('admin.productNotFound')}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={inquiry.status}
                        onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                        className={`text-xs rounded-full px-2 py-1 font-medium ${getStatusColor(inquiry.status)} border-0 focus:outline-none focus:ring-2 focus:ring-turquoise`}
                      >
                        <option value="new">{t('admin.statusNew')}</option>
                        <option value="in-progress">{t('admin.statusInProgress')}</option>
                        <option value="completed">{t('admin.statusCompleted')}</option>
                        <option value="archived">{t('admin.statusArchived')}</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <a
                          href={`https://wa.me/${inquiry.phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-900"
                          title={t('admin.replyWhatsApp')}
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                            <path d="M12 1.5C6.201 1.5 1.5 6.201 1.5 12c0 1.868.487 3.618 1.339 5.143L1.5 22.5l5.572-1.313A10.426 10.426 0 0012 22.5c5.799 0 10.5-4.701 10.5-10.5S17.799 1.5 12 1.5zm0 19.5c-1.92 0-3.722-.56-5.24-1.519l-.377-.225-3.913.978.999-3.657-.247-.395C2.309 14.724 1.74 12.92 1.74 11c0-5.69 4.63-10.31 10.32-10.31 5.689 0 10.319 4.62 10.319 10.31 0 5.689-4.63 10.31-10.319 10.31z" />
                          </svg>
                        </a>
                        <a
                          href={`mailto:${inquiry.email}`}
                          className="text-blue-600 hover:text-blue-900"
                          title={t('admin.replyEmail')}
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </a>
                        <button
                          onClick={() => openDeleteModal(inquiry.id, inquiry.name)}
                          className="text-red-600 hover:text-red-900"
                          title={t('admin.delete')}
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">{t('admin.noInquiries')}</h3>
            <p className="mt-1 text-sm text-gray-500">{t('admin.noInquiriesDescription')}</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal.show && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{t('admin.deleteInquiry')}</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {t('admin.deleteInquiryConfirmation', { name: showDeleteModal.name })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeleteConfirm}
                >
                  {deleteInquiry.isPending ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('common.deleting')}
                    </div>
                  ) : (
                    t('common.delete')
                  )}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-turquoise sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeDeleteModal}
                >
                  {t('common.cancel')}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiriesPage;
