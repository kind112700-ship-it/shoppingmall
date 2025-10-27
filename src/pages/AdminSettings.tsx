// src/pages/AdminSettings.tsx

import React from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminSettings: React.FC = () => {
    return (
        <div className="admin-wrapper">
            <AdminSidebar />
            <div className="admin-main-content">
                <header className="admin-topbar">
                    <div className="topbar-left">
                        <h1>설정</h1>
                    </div>
                </header>
                
                <main className="admin-page-content settings-layout">
                    <h2>일반 설정</h2>
                    <div className="setting-section">
                        <h4>쇼핑몰 이름</h4>
                        <input type="text" defaultValue="[내 쇼핑몰 이름]" />
                    </div>
                    <div className="setting-section">
                        <h4>배송 정책</h4>
                        <label>기본 배송비: <input type="number" defaultValue={3000} /> 원</label><br />
                        <label>무료 배송 기준: <input type="number" defaultValue={50000} /> 원</label>
                    </div>

                    <div style={{ marginTop: '40px' }}>
                        <h2>결제 설정</h2>
                        <div className="setting-section">
                            <h4>PG사 연동</h4>
                            <p>현재 연동 상태: **활성** (K-Payment)</p>
                            <button className="btn btn-secondary">PG 설정 변경</button>
                        </div>
                    </div>
                    
                    <button className="btn btn-primary save-button">설정 저장</button>
                </main>
            </div>
        </div>
    );
}

export default AdminSettings;
// TS1208 에러 방지
export {};