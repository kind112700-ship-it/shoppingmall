import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom'; // ⭐️ useNavigate import
// 필요한 아이콘을 import 합니다.
import { faBars, faUser, faShoppingCart, faSearch } from '@fortawesome/free-solid-svg-icons';
import { UtilityHeaderProps } from '../types';
import { getCartItems } from '../utils/cart';

// TypeScript 컴포넌트 정의
const UtilityHeader: React.FC<UtilityHeaderProps> = ({ openMenu }) => {
    const navigate = useNavigate(); // ⭐️ useNavigate 훅 사용

    
    // ⭐️ 추가: 로그인 페이지로 이동하는 함수

    // ⭐️ 추가: 장바구니 상품 수량을 저장할 상태
    const [cartCount, setCartCount] = useState<number>(0); // ⭐️ 추가: 장바구니 수량을 업데이트하는 함수
    const updateCartCount = () => {
        const cartItems = getCartItems();
        // 모든 상품의 quantity를 합산합니다.
        const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalCount);
    };
    // ⭐️ 추가: 컴포넌트 마운트 시 수량을 로드하고, 업데이트 이벤트를 구독합니다.
    useEffect(() => {
        updateCartCount(); // 1. 초기 로드

        // 2. 장바구니 내용 변경 시 업데이트하기 위한 커스텀 이벤트 리스너 등록
        // ProductDetailPage 등에서 장바구니를 변경한 후 window.dispatchEvent(new Event('cartUpdated'))를 호출해야 합니다.
        window.addEventListener('cartUpdated', updateCartCount);

        // 클린업 함수: 컴포넌트 언마운트 시 리스너 제거
        return () => {
            window.removeEventListener('cartUpdated', updateCartCount);
        };
    }, []);



    // 관리자 페이지로 이동하는 함수
    const goToAdmin = () => {
        navigate('/admin');
    };

    const goToLogin = () => {
        navigate('/login');
    };

    const goToCart =() => {
        navigate('/cart');
    }
    return (
        
        <header className="utility-bar">
            
            {/* 좌측 유틸리티 영역 */}
            <nav className="nav-left-utility">
                {/* 햄버거 버튼 클릭 시 openMenu 함수 실행 */}
                <button className="hamburger-btn" onClick={openMenu}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
                
                {/* ⭐️ [관리자] 링크 수정: a 태그 대신 button을 사용하여 onClick 이벤트 처리 */}
                <button
                    className="nav-link admin-link-desktop utility-item"
                    onClick={goToAdmin}
                    // a 태그처럼 보이도록 기본 버튼 스타일 제거
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', textAlign: 'left' }}
                >
                    [관리자]
                </button>
                
               {/* ⭐️ 연결 완료: 버튼과 goToLogin 함수를 연결하여 '/login' 경로로 이동 */}
                <button 
                    onClick={goToLogin} 
                    className="nav-link utility-item"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', textAlign: 'left' }}
                >
                    <FontAwesomeIcon icon={faUser} /> 로그인
                </button>

                <button
                    onClick={goToCart}
                    className="nav-link cart-link utility-item"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', textAlign: 'left' }}
                >
                    <FontAwesomeIcon icon={faShoppingCart} /> 
                    <span className="cart-count">{cartCount}</span> {/* 장바구니 카운트는 나중에 상태로 관리 */}
                    </button>   
                    
                            
             
            </nav>

            

            {/* 중앙 검색 바 영역 */}
            <div className="search-bar-container utility-item">
                <input type="text" placeholder="검색어를 입력하세요" className="search-input" />
                <button className="search-btn"><FontAwesomeIcon icon={faSearch} /></button>
            </div>

            {/* 우측 스페이서 */}
            <div className="nav-right-spacer"></div>
        </header>
    );
}

export default UtilityHeader;