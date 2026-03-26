import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import LoginPage from '@/pages/LoginPage';
import ProductsPage from '@/pages/ProductsPage';
import OrdersPage from '@/pages/OrdersPage';
import { useAuthStore } from '@/hooks/useAuth';

export default function App() {
  const { token } = useAuthStore();
  if (!token) return <LoginPage />;
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/products" />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
    </Layout>
  );
}
