// src/pages/AdminOrders.tsx

import React from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminOrders: React.FC = () => {
    return (
        <div className="admin-wrapper">
            <AdminSidebar />
            <div className="admin-main-content">
                <header className="admin-topbar">
                    <div className="topbar-left">
                        <h1>주문 관리</h1>
                    </div>
                    <div className="topbar-right">
                        <p>오늘 처리할 주문: 15건</p>
                    </div>
                </header>
                
                <main className="admin-page-content">
                    {/* 주문 상태 필터링 */}
                    <div className="order-filter-bar">
                        <select>
                            <option>전체</option>
                            <option>결제 대기</option>
                            <option>결제 완료</option>
                            <option>배송 준비 중</option>
                            <option>배송 중</option>
                            <option>배송 완료</option>
                        </select>
                        <button className="btn btn-secondary">선택 주문 일괄 처리</button>
                    </div>

                    {/* 주문 목록 테이블 */}
                    <div className="widget full-width-table">
                        <h3>전체 주문 현황</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>주문 번호</th>
                                    <th>고객명</th>
                                    <th>주문일</th>
                                    <th>총 금액</th>
                                    <th>상태</th>
                                    <th>액션</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* 여기에 실제 주문 데이터가 매핑되어 표시됩니다. */}
                                <tr>
                                    <td>#20251017-004</td>
                                    <td>최*호</td>
                                    <td>2025-10-27</td>
                                    <td>88,000원</td>
                                    <td><span className="status shipping">배송 중</span></td>
                                    <td><button className="btn btn-sm">상세 보기</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdminOrders;
// TS1208 에러 방지
export {};