// src/components/Footer.tsx

import React from 'react';

// Footer는 특별한 Props를 받지 않으므로 React.FC<object> 또는 React.FC로 정의
const Footer: React.FC = () => {
    return (
        <footer className="footer-container">
            {/* 나의 쇼핑/고객센터 위젯 영역 */}
            <div className="my-shopping-section">
                  
                {/* 최근 본 상품 위젯 (목업) */}
                <div className="shopping-widget">
                    <h2>최근 본 상품</h2>
                    <div className="mini-product">[상품 1]</div>
                    <div className="mini-product">[상품 2]</div>
                </div>



                {/* 고객센터 위젯 */}
                <div className="shopping-widget">
                    <h2>고객센터</h2>
                    <p className="phone-number">070-1234-5678</p>
                    <p>평일 10:00 ~ 17:00 (점심 12:00 ~ 13:00)</p>
                    <p>주말/공휴일 휴무</p>
                </div>

                {/* 계좌 정보 위젯 */}
                <div className="shopping-widget">
                    <h2>계좌 정보</h2>
                    <p>은행: 국민은행 1234-56-78901</p>
                    <p>예금주: 파스텔샵(Pastel Shop)</p>
                </div>
              
                {/* 회사 정보 위젯 */}
                <div className="shopping-widget">
                    <h2>회사 정보</h2>
                    <p>상호: (주)파스텔패션</p>
                    <p>대표: 김파스텔</p>
                    <p>주소: 서울특별시 강남구 가나다로 123</p>
                    <p>사업자등록번호: 123-45-67890</p>
                </div>
            </div>
            
            {/* 저작권 표시 */}
            <div className="footer">
                <p>&copy; 2024 Pastel Shop. All Rights Reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;