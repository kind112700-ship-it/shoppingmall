// src/pages/AdminDashboard.tsx

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUserCircle, faWonSign, faShoppingCart, 
    faUserPlus, faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminDashboard: React.FC = () => {
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