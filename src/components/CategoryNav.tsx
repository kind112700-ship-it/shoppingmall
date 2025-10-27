import React from 'react';
import { CategoryNavProps } from '../types'; 

const CategoryNav: React.FC<CategoryNavProps> = ({ isFixed }) => {
    
    // isFixed 상태에 따라 클래스 이름을 동적으로 생성
    const navClass: string = `full-width-category-nav ${isFixed ? 'fixed' : ''}`;

    return (
        <nav className={navClass}>
            <ul>
                {/* 실제 카테고리 목록 */}
                <li><a href="#">NEW ARRIVAL</a></li>
                <li><a href="#">BEST</a></li>
                <li><a href="#">TOP</a></li>
                <li><a href="#">BOTTOM</a></li>
                <li><a href="#">ACC</a></li>
                <li><a href="#">SALE</a></li>
            </ul>
        </nav>
    );
}

export default CategoryNav;