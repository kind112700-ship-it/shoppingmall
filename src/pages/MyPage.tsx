// src/components/MyPage.tsx (또는 src/pages/MyPage.tsx)
import React from 'react';
import '../styles/MyPage.css';


const MyPage: React.FC = () => {
    return (
        <>
            <header>
                <h1>My Service</h1>
            </header>
            <div className="my-page-container">
                <aside className="sidebar">
                    <div className="user-profile">
                        <div className="profile-image"></div>
                        <p className="user-name">김재민님</p>
                        <p className="user-level">GOLD 회원</p>
                        <a href="#" className="logout-btn">로그아웃</a>
                    </div>
                    <nav className="menu-list">
                        <ul>
                            {/* React에서는 <a> 태그 대신 <Link> (react-router-dom 사용 시) 또는 onClick 이벤트로 처리하는 것이 일반적입니다. */}
                            <li><a href="#" className="active">🏠 대시보드</a></li>
                            <li><a href="#">👤 회원 정보 수정</a></li>
                            <li><a href="#">📦 주문/예약 내역</a></li>
                            <li><a href="#">💖 위시리스트</a></li>
                            <li><a href="#">💰 포인트 / 쿠폰</a></li>
                            <li><a href="#">💬 1:1 문의 내역</a></li>
                        </ul>
                    </nav>
                </aside>
                <main className="main-content">
                    <h2>대시보드</h2>

                    <section className="summary-card-group">
                        <div className="summary-card">
                            <h3>총 주문 건수</h3>
                            <p className="data-value">5 건</p>
                            <p className="data-detail">최근 3개월</p>
                        </div>
                        <div className="summary-card">
                            <h3>가용 포인트</h3>
                            <p className="data-value">12,500 P</p>
                            <p className="data-detail">소멸 예정 포인트: 500P (10/31)</p>
                        </div>
                        <div className="summary-card">
                            <h3>다운로드 쿠폰</h3>
                            <p className="data-value">3 장</p>
                            <p className="data-detail">만료 임박 쿠폰 1장</p>
                        </div>
                    </section>

                    <section className="recent-orders">
                        <h3>최근 주문 내역 (3건)</h3>
                        <div className="order-list">
                            <div className="order-item">
                                <p className="order-date">2025.10.20</p>
                                <p className="order-name">상품 A 외 1건</p>
                                <p className="order-price">75,000원</p>
                                <span className="order-status">배송 중</span>
                                <a href="#" className="detail-link">상세 보기 &gt;</a>
                            </div>
                            {/* 추가 주문 내역 항목이 있다면 여기에 반복 */}
                        </div>
                    </section>

                </main>
            </div>
            <footer>
                <p>&copy; 2025 My Service. All rights reserved.</p>
            </footer>
        </>
    );
};

export default MyPage;