import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';

import Layout from '../components/common/Layout';
import HomePage from '../pages/HomePage';
import GalleryPage from '../pages/GalleryPage';
import ProductPage from '../pages/ProductPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import NotFoundPage from '../pages/NotFoundPage';

// Admin pages
import AdminLayout from '../components/admin/AdminLayout';
import AdminLoginPage from '../pages/admin/LoginPage';
import ProductsPage from '../pages/admin/ProductsPage';
import InquiriesPage from '../pages/admin/InquiriesPage';
import ProductFormPage from '../pages/admin/ProductFormPage';

// Auth check
import { useAuth } from '../hooks/useAuth';

// Using this component to protect admin routes
function ProtectedRouteWrapper() {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <AdminLayout><Outlet /></AdminLayout>;
}

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
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/admin',
    element: <ProtectedRouteWrapper />,
    children: [
      { index: true, element: <Navigate to="/admin/products" replace /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'inquiries', element: <InquiriesPage /> },
      { path: 'products/new', element: <ProductFormPage /> },
      { path: 'products/:id', element: <ProductFormPage /> },
    ],
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
