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
    return (
      <Router>
            
            <Routes>
                {/* ⭐️ 1. Layout을 최상위 Route로 설정합니다. */}
                <Route path="/" element={<Layout />}> 
                    
                    {/* 2. 모든 실제 페이지를 Layout의 자식 Route로 배치합니다. */}
                    {/* path="/" 는 메인 페이지이므로 index={true} 또는 path="/" 로 설정 */}
                    <Route index element={<HomePage />} />                  
                   
                    
                    {/* 로그인/회원가입 페이지 */}
                    <Route path="login" element={<LoginPage />} />
                    
                    {/* 마이페이지 */}
                    <Route path="mypage" element={<MyPage />} />
                    
                    {/* 장바구니 */}
                    <Route path="cart" element={<CartPage />} />
                    
                    {/* ⭐️ 상품 상세 페이지 경로 추가 (ID를 매개변수로 받음) */}
                    <Route path="product/:id" element={<ProductDetailPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    {/* ⭐️ 1. 주문 완료 페이지 (단건 확인) */}
                     <Route path="order-complete/:orderId" element={<OrderCompletePage />} />
                     {/* ⭐️ 2. 나의 주문 내역 페이지 (목록 조회) */}
                    <Route path="my-orders" element={<MyOrdersPage />} />
                    {/* 2. 주문 상세 페이지 (OrderDetailPage) - 주문 ID를 파라미터로 받음 */}
                    <Route path="my-orders/:orderId" element={<OrderDetailPage />} />
                </Route>

                {/* =================================================== */}
                {/* 2. 관리자 페이지 (Layout 미적용 - 독립적 UI) */}
                {/* =================================================== */}
                {/* AdminDashboard는 원래 Layout 안에 있었지만, 독립적인 UI를 위해 밖으로 꺼냅니다. */}
                {/* 관리자 대시보드 페이지 */}
                    <Route path="admin" element={<AdminDashboard />} /> 
                
                {/* ⭐️ 추가된 관리자 페이지 라우트 */}
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/customers" element={<AdminCustomers />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/products/add" element={<AdminProductAdd />} />
                <Route path="/admin/products/edit/:id" element={<AdminProductEdit />} />
                
                {/* 만약 Header가 없는 특별한 페이지(예: 전체화면 결제 페이지)가 필요하다면
                   Layout 밖에 별도의 Route로 정의할 수 있습니다. */}

            </Routes>
        </Router>

    );
};
  
export default App;