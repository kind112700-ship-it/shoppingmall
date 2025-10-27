// src/pages/AdminCustomers.tsx

import React from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminCustomers: React.FC = () => {
    return (
        <div className="admin-wrapper">
            <AdminSidebar />
            <div className="admin-main-content">
                <header className="admin-topbar">
                    <div className="topbar-left">
                        <h1>회원 관리</h1>
                    </div>
                    <div className="topbar-right">
                        <p>총 가입 회원: 1,200명</p>
                    </div>
                </header>
                
                <main className="admin-page-content">
                    {/* 회원 검색 및 등급 필터링 */}
                    <div className="customer-filter-bar">
                        <select>
                            <option>전체 회원</option>
                            <option>일반</option>
                            <option>VIP</option>
                            <option>블랙리스트</option>
                        </select>
                        <input type="text" placeholder="이름 또는 이메일 검색" />
                    </div>

                    {/* 회원 목록 테이블 */}
                    <div className="widget full-width-table">
                        <h3>회원 목록</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>회원번호</th>
                                    <th>이름</th>
                                    <th>이메일</th>
                                    <th>가입일</th>
                                    <th>등급</th>
                                    <th>액션</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* 여기에 실제 회원 데이터가 매핑되어 표시됩니다. */}
                                <tr>
                                    <td>C00150</td>
                                    <td>정*훈</td>
                                    <td>j***@example.com</td>
                                    <td>2024-05-01</td>
                                    <td>VIP</td>
                                    <td><button className="btn btn-sm">정보 수정</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdminCustomers;
// TS1208 에러 방지
export {};