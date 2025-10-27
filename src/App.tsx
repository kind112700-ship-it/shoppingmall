import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import './styles/Main.css'; // 전역 스타일 임포트
import './styles/Admin.css'; // 관리자 페이지 스타일 임포트
import './styles/AdminStyles.css';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import ProductDetailPage from './pages/ProductDetailPage';
import MyPage from './pages/MyPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderCompletePage from './pages/OrderCompletePage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';

// ⭐️ 관리자 페이지 컴포넌트 임포트
import AdminDashboard from './pages/AdminDashboard'; 
import AdminProducts from './pages/AdminProducts';    // 상품 관리
import AdminOrders from './pages/AdminOrders';      // 주문 관리
import AdminCustomers from './pages/AdminCustomers';  // 회원 관리
import AdminSettings from './pages/AdminSettings';    // 설정
import AdminProductAdd from './pages/AdminProductAdd';
import AdminProductEdit from './pages/AdminProductEdit';

// 임시 페이지 컴포넌트 (나중에 실제 컴포넌트로 대체될 것입니다)




function App() {
    // ⭐️ 핵심 수정: <Router> 태그를 제거했습니다. 이제 <Routes>만 남습니다.
    return (
        <>
            <Routes>
                
                {/* =================================================== */}
                {/* 1. 사용자 페이지 (Layout 적용) */}
                {/* =================================================== */}
                <Route path="/" element={<Layout />}> 
                    
                    {/* 메인 페이지 */}
                    <Route index element={<HomePage />} /> 
                    
                    {/* 사용자/쇼핑 관련 페이지 */}
                    <Route path="login" element={<LoginPage />} />
                    <Route path="mypage" element={<MyPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="product/:id" element={<ProductDetailPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    
                    {/* 주문 및 마이페이지 상세 */}
                    <Route path="order-complete/:orderId" element={<OrderCompletePage />} />
                    <Route path="my-orders" element={<MyOrdersPage />} />
                    <Route path="my-orders/:orderId" element={<OrderDetailPage />} />
                </Route>

                {/* =================================================== */}
                {/* 2. 관리자 페이지 (Layout 미적용 - 독립적 UI) */}
                {/* =================================================== */}
                {/* 관리자 대시보드 페이지 */}
                <Route path="admin" element={<AdminDashboard />} /> 
                
                {/* ⭐️ 관리자 페이지 라우트 (경로에서 '/'를 제거하여 통일했습니다) */}
                <Route path="admin/products" element={<AdminProducts />} />
                <Route path="admin/orders" element={<AdminOrders />} />
                <Route path="admin/customers" element={<AdminCustomers />} />
                <Route path="admin/settings" element={<AdminSettings />} />
                <Route path="admin/products/add" element={<AdminProductAdd />} />
                <Route path="admin/products/edit/:id" element={<AdminProductEdit />} />
                
                {/* 3. 404 Not Found 페이지 - 컴포넌트가 없으므로 임시 주석 처리 */}
                {/* <Route path="*" element={<NotFoundPage />} /> */}

            </Routes>
        </>
    );
};
 
export default App;