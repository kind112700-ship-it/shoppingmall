// src/components/Layout.tsx

import React, { useState,useEffect } from 'react';
import { Outlet } from 'react-router-dom'; // 라우팅된 페이지 내용을 표시하는 역할
import UtilityHeader from './UtilityHeader'; // 현재 작성하신 헤더 컴포넌트
import SidebarMenu from './SidebarMenu';
import CategoryNav from './CategoryNav';

const Layout: React.FC = () => {
    const SIDEBAR_WIDTH = 250; 
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // ⭐️ 1. CategoryNav 고정을 위한 상태 추가 ⭐️
    const [isNavFixed, setIsNavFixed] = useState<boolean>(false); 

    const openMenu = () => { setIsMenuOpen(true); };
    const closeMenu = () => { setIsMenuOpen(false); };

    // ⭐️ 2. CategoryNav 고정 로직을 Layout으로 이동 ⭐️
    useEffect(() => {
        // 컴포넌트가 렌더링된 후 CategoryNav 요소를 찾습니다.
        const categoryNav = document.querySelector('.full-width-category-nav');
        if (!categoryNav) return;

        // 초기 offsetTop 계산
        // (주의: Header가 고정되어 있으면 이 offsetTop이 스크롤에 따라 변할 수 있습니다. 
        //  CategoryNav의 원래 위치를 기준으로 고정 로직을 유지합니다.)
        const scrollTrigger = (categoryNav as HTMLElement).offsetTop; 

        const handleScroll = (): void => {
            const currentScroll: number = window.scrollY;
            setIsNavFixed(currentScroll >= scrollTrigger);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []); 

    return (
        <div className="app-layout">
            {/* 1. Top Announcement Bar */}
                <div className="top-announcement-bar">
                    <a href="#">
                        <p> 🎁5만원 이상 구매 시 10% 쿠폰 즉시 지급!🎁 </p>
                    </a>
                </div>
            {/* SidebarMenu (전역 기능 유지) */}
            <SidebarMenu 
                isMenuOpen={isMenuOpen} 
                closeMenu={closeMenu} 
            />
            
            {/* UtilityHeader (전역 기능 유지) */}
            <UtilityHeader openMenu={openMenu} />
            
            {/* ⭐️ 3. CategoryNav 통합 및 isFixed prop 연결 ⭐️ */}
            <CategoryNav isFixed={isNavFixed} /> 
            
            {/* Main Content Wrapper: 사이드바 열림/닫힘 기능 유지 */}
            <div 
                id="page-content-wrapper" 
                style={{ 
                    transform: isMenuOpen ? `translateX(${SIDEBAR_WIDTH}px)` : 'translateX(0)', 
                    transition: 'transform 0.3s ease-in-out'
                }}
            >
                
                {/* Outlet: 모든 페이지의 내용이 여기에 렌더링 */}
                <main className="main-content">
                    <Outlet />
                </main>
            
            </div>
            
            {/* 메뉴 오버레이 */}
            {isMenuOpen && (
                <div 
                    className="menu-overlay" 
                    onClick={closeMenu}
                    style={{ 
                        position: 'fixed', 
                        top: 0, 
                        left: 0, 
                        right: 0, 
                        bottom: 0, 
                        backgroundColor: 'rgba(0, 0, 0, 0.4)', 
                        zIndex: 999 
                    }}
                ></div>
            )}
            
        </div>
    );
}

export default Layout;