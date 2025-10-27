// src/pages/AdminDashboard.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUserCircle, faWonSign, faShoppingCart, 
    faUserPlus, faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import AdminSidebar from '../components/admin/AdminSidebar';
import { Product} from '../types'; 

const AdminDashboard: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]); // 상품 목록 상태
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ⭐️ 상품 목록 API 호출 로직 추가 (useEffect 사용)
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // ⭐️ 올바른 API 호출: Vercel 주소(API_BASE_URL)를 사용합니다.
                const response = await axios.get<Product[]>(`${API_BASE_URL}/admin/products`); 
                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setError("상품 데이터를 불러오는 데 실패했습니다.");
                setLoading(false);
            }
        };

        fetchProducts();
    }, []); // 컴포넌트 마운트 시 한 번만 실행

    // (현재는 데이터를 사용하는 부분이 없으므로, 로딩/에러 메시지만 추가)
    if (loading) return <div>상품 로딩 중...</div>;
    if (error) return <div>에러: {error}</div>;

    
    return (
        <div className="admin-wrapper">
            
            {/* 1. 사이드바 컴포넌트 포함 */}
            <AdminSidebar />

            <div className="admin-main-content">
                
                {/* 2. 상단 바 (Topbar) */}
                <header className="admin-topbar">
                    <div className="topbar-left">
                        <h1>대시보드</h1>
                    </div>
                    <div className="topbar-right">
                        <p>관리자님, 환영합니다!</p>
                        <a href="#" className="profile-icon">
                            <FontAwesomeIcon icon={faUserCircle} />
                        </a>
                    </div>
                </header>

                {/* 3. 대시보드 위젯 */}
                <main className="dashboard-widgets">
                    <div className="widget summary-card total-sales">
                        <FontAwesomeIcon icon={faWonSign} className="icon" />
                        <h3>오늘 매출</h3>
                        <p>1,250,000원</p>
                    </div>
                    <div className="widget summary-card new-orders">
                        <FontAwesomeIcon icon={faShoppingCart} className="icon" />
                        <h3>신규 주문</h3>
                        <p>15건</p>
                    </div>
                    <div className="widget summary-card new-users">
                        <FontAwesomeIcon icon={faUserPlus} className="icon" />
                        <h3>신규 가입</h3>
                        <p>23명</p>
                    </div>
                    <div className="widget summary-card stock-alerts">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="icon" />
                        <h3>재고 부족</h3>
                        <p>5개 상품</p>
                    </div>

                    {/* 4. 최근 주문 현황 테이블 */}
                    <div className="widget full-width-table">
                        <h3>최근 주문 현황</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>주문 번호</th>
                                    <th>고객명</th>
                                    <th>총 금액</th>
                                    <th>상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>#20251017-001</td>
                                    <td>김*희</td>
                                    <td>45,000원</td>
                                    <td><span className="status pending">결제 대기</span></td>
                                </tr>
                                <tr>
                                    <td>#20251017-002</td>
                                    <td>이*준</td>
                                    <td>123,000원</td>
                                    <td><span className="status shipping">배송 중</span></td>
                                </tr>
                                <tr>
                                    <td>#20251017-003</td>
                                    <td>박*영</td>
                                    <td>39,000원</td>
                                    <td><span className="status completed">배송 완료</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdminDashboard;
// TS1208 에러 방지
export {};