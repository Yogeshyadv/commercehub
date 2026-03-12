import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { SocketProvider } from './context/SocketContext';
import DashboardLayout from './components/layout/DashboardLayout';

import CatalogueList from './pages/vendor/catalogues/CatalogueList';
import TemplateSelect from './pages/vendor/catalogues/TemplateSelect';
import CatalogueEditor from './pages/vendor/catalogues/CatalogueEditor';
import ProductPicker from './pages/vendor/catalogues/ProductPicker';
import ProductCardStyles from './pages/vendor/catalogues/ProductCardStyles';
import PublishModal from './pages/vendor/catalogues/PublishModal';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import EmailVerification from './pages/EmailVerification';
import Dashboard from './pages/Dashboard';
import PlaceholderPage from './pages/PlaceholderPage';
import PricingPage from './pages/PricingPage';
import EnterprisePage from './pages/EnterprisePage';
import ComparePage from './pages/ComparePage';
import FreeToolsPage from './pages/FreeToolsPage';
import EmailMarketingPage from './pages/EmailMarketingPage';
import SocialMediaPage from './pages/SocialMediaPage';
import SEOToolsPage from './pages/SEOToolsPage';
import MarketingAnalyticsPage from './pages/MarketingAnalyticsPage';
import AboutUsPage from './pages/AboutUsPage';
import CareersPage from './pages/CareersPage';
import PressMediaPage from './pages/PressMediaPage';
import InvestorsPage from './pages/InvestorsPage';
import MerchantSupportPage from './pages/MerchantSupportPage';
import CommunityForumsPage from './pages/CommunityForumsPage';
import HirePartnerPage from './pages/HirePartnerPage';
import BlogPage from './pages/BlogPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import AccessibilityPage from './pages/AccessibilityPage';
import B2BEnterprisePage from './pages/B2BEnterprisePage';
import CatalogueEcommercePage from './pages/CatalogueEcommercePage';
import NativeAppPage from './pages/NativeAppPage';
import CataloguingPage from './pages/CataloguingPage';
import LiveAnalyticsPage from './pages/LiveAnalyticsPage';
import CustomersPage from './pages/CustomersPage';
import Products from './pages/Products';
import ProductForm from './pages/ProductForm';
import AuditLog from './pages/AuditLog';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import Analytics from './pages/Analytics';
import NotFound from './pages/NotFound';
import Loader from './components/common/Loader';
import CatalogPublic from './pages/CatalogPublic';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import VendorProductDetail from './pages/VendorProductDetail';
import CatalogDetail from './pages/CatalogDetail';
import ThemeEditor from './pages/ThemeEditor';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import OrderDetail from './pages/OrderDetail';
import MyAccount from './pages/MyAccount';
import Wishlist from './pages/Wishlist';

const qc = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } } });

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Loader text="Checking auth..." fullScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Loader fullScreen />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

function VendorOnly({ children }) {
  const { user } = useAuth();
  if (user?.role === 'customer') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">This page is only available for vendors. Contact support if you need access.</p>
        </div>
      </div>
    );
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      
        {/* === TEMPORARY TESTING ROUTES FOR NEW CATALOG MODULE === */}
        <Route path="/test/catalogues" element={<CatalogueList />} />
        <Route path="/test/templates" element={<TemplateSelect />} />
        <Route path="/test/editor" element={<CatalogueEditor />} />
        <Route path="/test/picker" element={<ProductPicker isOpen={true} onClose={() => window.history.back()} />} />
        <Route path="/test/cards" element={<ProductCardStyles />} />
        <Route path="/test/publish" element={<PublishModal isOpen={true} onClose={() => window.history.back()} />} />
        {/* ========================================================= */}
  

        {/* Public landing page */}
      <Route path="/" element={<Home />} />
      
      {/* Auth routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/reset-password/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />
      <Route path="/verify-email/:token" element={<EmailVerification />} />
        {/* Full-screen Theme Editor (Outside Dashboard Layout) */}
        <Route path="/dashboard/catalogs/:id/theme" element={<ProtectedRoute><VendorOnly><ThemeEditor /></VendorOnly></ProtectedRoute>} />
      {/* Protected dashboard routes */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="account" element={<MyAccount />} />
        <Route path="products" element={<VendorOnly><Products /></VendorOnly>} />
        <Route path="products/new" element={<VendorOnly><ProductForm /></VendorOnly>} />
        <Route path="products/edit/:id" element={<VendorOnly><ProductForm /></VendorOnly>} />
        <Route path="products/:id" element={<VendorOnly><VendorProductDetail /></VendorOnly>} />
        <Route path="audit-log" element={<VendorOnly><AuditLog /></VendorOnly>} />
        <Route path="catalogs" element={<CatalogueList />} />
        <Route path="catalogs/templates" element={<TemplateSelect />} />
        <Route path="catalogs/:id/edit" element={<CatalogueEditor />} />
        <Route path="catalogs/:id" element={<CatalogDetail />} />
        <Route path="orders" element={<Orders />} />
        <Route path="inventory" element={<VendorOnly><Inventory /></VendorOnly>} />
        <Route path="customers" element={<VendorOnly><Customers /></VendorOnly>} />
        <Route path="customers/:id" element={<VendorOnly><CustomerDetail /></VendorOnly>} />
        <Route path="analytics" element={<VendorOnly><Analytics /></VendorOnly>} />
        <Route path="settings" element={<Navigate to="account" replace />} />
      </Route>

      {/* Public catalog viewer */}
      <Route path="/catalog/:shareableLink" element={<CatalogPublic />} />

      {/* Customer Store Routes */}
      <Route path="/store" element={<Store />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
      <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
      <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />

      {/* Marketing / Auxiliary routes */}
        <Route path="/product/catalogue" element={<CatalogueEcommercePage />} />
        <Route path="/product/native-app" element={<NativeAppPage />} />
        <Route path="/product/cataloguing" element={<CataloguingPage />} />
        <Route path="/product/analytics" element={<LiveAnalyticsPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/b2b" element={<B2BEnterprisePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/enterprise" element={<EnterprisePage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/tools" element={<FreeToolsPage />} />
        <Route path="/marketing/email" element={<EmailMarketingPage />} />
        <Route path="/marketing/social" element={<SocialMediaPage />} />
        <Route path="/marketing/seo" element={<SEOToolsPage />} />
        <Route path="/analytics" element={<MarketingAnalyticsPage />} />
        <Route path="/knowledge-center" element={<PlaceholderPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/press" element={<PressMediaPage />} />
        <Route path="/investors" element={<InvestorsPage />} />
        <Route path="/partners" element={<HirePartnerPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/community" element={<CommunityForumsPage />} />
        <Route path="/support" element={<MerchantSupportPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/cookies" element={<CookiePolicyPage />} />
        <Route path="/accessibility" element={<AccessibilityPage />} />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={qc}>
        <AuthProvider>
          <SocketProvider>
            <CartProvider>
              <Router><ScrollToTop /><AppRoutes /></Router>
              <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#333', color: '#fff', borderRadius: '12px', padding: '14px 20px', boxShadow: '0 10px 40px rgba(0,0,0,0.12)', fontSize: '14px' } }} />
            </CartProvider>
          </SocketProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}



