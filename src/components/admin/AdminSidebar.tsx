// src/components/admin/AdminSidebar.tsx

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTachometerAlt, faBoxOpen, faTruck, faUsers, 
    faCog, faHome
} from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';


// ⭐️ 1. 경로와 동적 제목 매핑 정의
const PAGE_TITLES: { [key: string]: string } = {
    '/admin/products': '상품 관리',
    '/admin/orders': '주문 관리',
    '/admin/customers': '회원 관리',
    '/admin/settings': '설정',
    '/admin': '대시보드', // 가장 짧은 경로를 맨 뒤에 두어, 하위 경로 매칭을 피합니다.
    '/': '쇼핑몰 홈',
};


const AdminSidebar: React.FC = () => {
    
    const location = useLocation();
    
    // ⭐️ 2. 동적 제목 결정 로직
    const getCurrentTitle = () => {
        const currentPath = location.pathname;
        
        // 경로의 길이가 긴 순서대로 정렬하여, 상세 페이지일 경우 정확한 상위 메뉴 이름을 찾습니다.
        const sortedKeys = Object.keys(PAGE_TITLES).sort((a, b) => b.length - a.length);

        for (const path of sortedKeys) {
            // 현재 경로가 매핑된 경로로 시작하는지 확인 (예: /admin/products/add -> /admin/products)
            if (currentPath.startsWith(path)) {
                return PAGE_TITLES[path];
            }
        }
        return '관리자 페이지'; // 매칭되는 경로가 없을 경우
    };

    // ⭐️ 3. 메뉴 활성화 로직 (대시보드 중복 활성화 방지 핵심)
    const isMenuActive = (path: string) => {
        
        // 대시보드는 정확히 '/admin' 또는 '/admin/'일 때만 활성화
        if (path === '/admin') {
            return location.pathname === '/admin' || location.pathname === '/admin/';
        }
        
        // 그 외 메뉴는 하위 경로도 활성화 (예: /admin/products가 /admin/products/add를 활성화)
        return location.pathname.startsWith(path);
    };
    

    const currentTitle = getCurrentTitle();
    
    // ⭐️ 4. JSX 렌더링
    return (
        <nav className="admin-sidebar">
            <div className="admin-logo">
                <h2>{currentTitle}</h2> 
            </div>
            <ul className="admin-menu">
                {/* 대시보드 LI: 정확한 경로 일치 시에만 active */}
                <li className={isMenuActive('/admin') ? 'active' : ''}>
                    <a href="/admin">
                        <FontAwesomeIcon icon={faTachometerAlt} /> 대시보드
                    </a>
                </li>
                {/* 상품 관리 LI: 하위 경로 포함하여 active */}
                <li className={isMenuActive('/admin/products') ? 'active' : ''}>
                    <a href="/admin/products">
                        <FontAwesomeIcon icon={faBoxOpen} /> 상품 관리
                    </a>
                </li>
                <li className={isMenuActive('/admin/orders') ? 'active' : ''}>
                    <a href="/admin/orders">
                        <FontAwesomeIcon icon={faTruck} /> 주문 관리
                    </a>
                </li>
                <li className={isMenuActive('/admin/customers') ? 'active' : ''}>
                    <a href="/admin/customers">
                        <FontAwesomeIcon icon={faUsers} /> 회원 관리
                    </a>
                </li>
                <li className={isMenuActive('/admin/settings') ? 'active' : ''}>
                    <a href="/admin/settings">
                        <FontAwesomeIcon icon={faCog} /> 설정
                    </a>
                </li>
                {/* 쇼핑몰 홈 링크는 관리자 메뉴가 아니므로 별도 처리 */}
                <li className="home-link"> 
                    <a href="/">
                        <FontAwesomeIcon icon={faHome} /> 쇼핑몰 홈
                    </a>
                </li>
            </ul>
        </nav>
    );
}

export default AdminSidebar;
// TS1208 에러 방지
export {};