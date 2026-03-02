import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import DashboardLayout from './components/layout/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import EmailVerification from './pages/EmailVerification';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductForm from './pages/ProductForm';
import Catalogs from './pages/Catalogs';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import Customers from './pages/Customers';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Loader from './components/common/Loader';
import CatalogPublic from './pages/CatalogPublic';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import CatalogDetail from './pages/CatalogDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';

const qc = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } } });

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
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-500 mt-2">This page is only available for vendors.</p>
        </div>
      </div>
    );
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public landing page */}
      <Route path="/" element={<Home />} />
      
      {/* Auth routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/verify-email/:token" element={<EmailVerification />} />

      {/* Protected dashboard routes */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<VendorOnly><Products /></VendorOnly>} />
        <Route path="products/new" element={<VendorOnly><ProductForm /></VendorOnly>} />
        <Route path="products/edit/:id" element={<VendorOnly><ProductForm /></VendorOnly>} />
        <Route path="catalogs" element={<Catalogs />} />
        <Route path="catalogs/:id" element={<CatalogDetail />} />
        <Route path="orders" element={<Orders />} />
        <Route path="inventory" element={<VendorOnly><Inventory /></VendorOnly>} />
        <Route path="customers" element={<VendorOnly><Customers /></VendorOnly>} />
        <Route path="analytics" element={<VendorOnly><Analytics /></VendorOnly>} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Public catalog viewer */}
      <Route path="/catalog/:shareableLink" element={<CatalogPublic />} />

      {/* Customer Store Routes */}
      <Route path="/store" element={<Store />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />

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
          <CartProvider>
            <Router><AppRoutes /></Router>
            <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#333', color: '#fff', borderRadius: '12px', padding: '14px 20px', boxShadow: '0 10px 40px rgba(0,0,0,0.12)', fontSize: '14px' } }} />
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}