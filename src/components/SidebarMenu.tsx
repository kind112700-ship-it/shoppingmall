// src/components/SidebarMenu.tsx

import React from 'react';
import { Link } from 'react-router-dom'; // ⭐️ Link 컴포넌트 import
import { SidebarMenuProps } from '../types'; 

const SidebarMenu: React.FC<SidebarMenuProps> = ({ isMenuOpen, closeMenu }) => {
    
    // 메뉴 열림 상태에 따라 너비를 설정하는 스타일 객체
    const menuStyle: React.CSSProperties = {
        width: isMenuOpen ? '250px' : '0',
    };

    return (
        <div className="sidebar-menu" id="sidebarMenu" style={menuStyle}>
            <button className="close-btn" onClick={closeMenu}>×</button>
            
           {/* 메뉴 헤더 (유틸리티 링크) */}
            <div className="menu-header">
                                             
                {/* ⭐️ 수정: 관리자 링크 */}
                <Link to="/admin" className="admin-link-mobile" onClick={closeMenu}>
                    [관리자]
                </Link>

                {/* ⭐️ 수정: 로그인/회원가입 링크 */}
                <Link to="/login" className='LoginPage' onClick={closeMenu}>
                    로그인 / 회원가입
                </Link>
                <br />
                {/* ⭐️ 수정: 마이페이지 링크 */}
                <Link to="/mypage" className='MyPage' onClick={closeMenu}>
                    마이페이지
                </Link>
                <br />
                <Link to="/cart" className='CartPage' onClick={closeMenu}>
                    장바구니
                </Link>

                
            </div>

            {/* 메인 카테고리 메뉴 */}
            <ul className="main-menu-vertical">
                <li><a href="#">NEW ARRIVAL</a></li>
                <li><a href="#">BEST ITEM</a></li>
                <li><a href="#">TOP </a></li>
                <li><a href="#">BOTTOM </a></li>
                <li><a href="#">OUTER </a></li>
                <li><a href="#">ACC</a></li>
                <li><a href="#">SALE</a></li>
            </ul>

            {/* 메뉴 푸터 (고객센터 정보 등) */}
            <div className="menu-footer">
                <p>고객센터: 070-1234-5678</p>
                <p>평일 10:00 ~ 17:00</p>
            </div>
        </div>
    );
}

export default SidebarMenu;
export {};