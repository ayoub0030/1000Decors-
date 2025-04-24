import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import React from 'react';

import Layout from '../components/common/Layout';
import HomePage from '../pages/HomePage';
import GalleryPage from '../pages/GalleryPage';
import ProductPage from '../pages/ProductPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';

// Admin pages
// Temporarily comment out admin routes to get the main site working
// import AdminLayout from '../components/admin/AdminLayout';
import AdminLoginPage from '../pages/admin/LoginPage';
// import AdminProductsPage from '../pages/admin/ProductsPage';
// import AdminProductFormPage from '../pages/admin/ProductFormPage';
// import AdminInquiriesPage from '../pages/admin/InquiriesPage';

// Auth check
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

// Router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'gallery', element: <GalleryPage /> },
      { path: 'product/:slug', element: <ProductPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
  },
  // Temporarily comment out admin routes to get the main site working
  /*
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/products" replace /> },
      { path: 'products', element: <AdminProductsPage /> },
      { path: 'products/new', element: <AdminProductFormPage /> },
      { path: 'products/:id/edit', element: <AdminProductFormPage /> },
      { path: 'inquiries', element: <AdminInquiriesPage /> },
    ],
  },
  */
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
]);

// Create Router component that uses the router configuration
export const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};
