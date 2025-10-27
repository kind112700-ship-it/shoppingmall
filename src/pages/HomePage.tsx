// src/pages/HomePage.tsx

import React, { useState, useEffect, useCallback } from 'react';
// import SidebarMenu from '../components/SidebarMenu';
// import UtilityHeader from '../components/UtilityHeader';
// import CategoryNav from '../components/CategoryNav';
import ImageSlider from '../components/ImageSlider';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';
import { Product, Slide } from '../types'; 
import image1 from '../assets/shopping-mall-1.jpg';
import image2 from '../assets/shopping-mall-2.jpg';
import image3 from '../assets/shopping-mall-3.jpg';
import productImg1 from '../assets/product_1.jpg';
import productImg2 from '../assets/product_2.jpg';
import productImg3 from '../assets/product_3.jpg';
import productImg4 from '../assets/product_4.jpg';
import productImg5 from '../assets/product_5.jpg';
import productImg6 from '../assets/product_6.jpg';
import productImg7 from '../assets/product_7.jpg';
import productImg8 from '../assets/product_8.jpg';

function HomePage() {
    // // === 상태 관리 ===
    // const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    // const [isNavFixed, setIsNavFixed] = useState<boolean>(false); // 카테고리 고정 상태

    // // === 햄버거 메뉴 핸들러 ===
    // const openMenu = useCallback((): void => {
    //     setIsMenuOpen(true);
    // }, []);

    // const closeMenu = useCallback((): void => {
    //     setIsMenuOpen(false);
    // }, []);

    // // === 스크롤 Fixed 로직 (CategoryNav 고정) ===
    // useEffect(() => {
    //     const categoryNav = document.querySelector('.full-width-category-nav');
    //     if (!categoryNav) return;

    //     // 초기 offsetTop 계산
    //     const scrollTrigger = (categoryNav as HTMLElement).offsetTop; 

    //     const handleScroll = (): void => {
    //         const currentScroll: number = window.scrollY;
    //         setIsNavFixed(currentScroll >= scrollTrigger);
    //     };

    //     window.addEventListener('scroll', handleScroll);
    //     return () => window.removeEventListener('scroll', handleScroll);
    // }, []);

    // === 데이터 목업 ===
    const products: Product[] = [
        { 
        id: 1, name: "파스텔 니트", price: "39,000원", img: productImg1, description: "부드러운 파스텔톤의 니트입니다.", 
        options: { 
            size: ["S", "M", "L", "XL"], 
            color: [{ name: "아이보리", hex: "#f8f0e3" }, { name: "민트", hex: "#a8c0bf" }, { name: "핑크", hex: "#f0b8c6" }] 
        } 
    },
    { 
        id: 2, name: "세련된 셔츠", price: "54,000원", img: productImg2, description: "고급스러운 소재와 세련된 디자인으로 격식 있는 자리에 잘 어울립니다.", 
        options: { 
            size: ["S", "M", "L"], 
            color: [{ name: "화이트", hex: "#FFFFFF" }, { name: "블루", hex: "#6082B6" }] 
        } 
    },
    { 
        id: 3, name: "기본 티셔츠", price: "22,000원", img: productImg3, description: "어디에나 매치하기 쉬운 코튼 기본 티셔츠입니다.", 
        options: { 
            size: ["Free"], 
            color: [{ name: "화이트", hex: "#FFFFFF" }, { name: "블랙", hex: "#000000" }, { name: "그레이", hex: "#808080" }] 
        } 
    },
    { 
        id: 4, name: "트렌치 코트", price: "99,000원", img: productImg4, description: "클래식한 디자인의 가을 트렌치 코트입니다.", 
        options: { 
            size: ["M", "L"], 
            color: [{ name: "베이지", hex: "#F5F5DC" }, { name: "카키", hex: "#8FBC8F" }] 
        } 
    },
    { 
        id: 5, name: "스커트", price: "45,000원", img: productImg5, description: "A라인으로 떨어지는 미디 기장의 플레어 스커트입니다.", 
        options: { 
            size: ["S", "M"], 
            color: [{ name: "네이비", hex: "#000080" }, { name: "와인", hex: "#722F37" }] 
        } 
    },
    { 
        id: 6, name: "원피스", price: "68,000원", img: productImg6, description: "허리 라인을 잡아주는 여성스러운 원피스입니다.", 
        options: { 
            size: ["Free"], 
            color: [{ name: "블랙", hex: "#000000" }] 
        } 
    },
    { 
        id: 7, name: "가을 스커트", price: "45,000원", img: productImg7, description: "도톰한 소재로 제작되어 따뜻하게 착용 가능한 스커트입니다.", 
        options: { 
            size: ["S", "M", "L"], 
            color: [{ name: "브라운", hex: "#A52A2A" }, { name: "차콜", hex: "#36454F" }] 
        } 
    },
    { 
        id: 8, name: "롱 원피스", price: "68,000원", img: productImg8, description: "체형 커버에 좋은 플레어 롱 원피스입니다.", 
        options: { 
            size: ["Free"], 
            color: [{ name: "블루", hex: "#0000FF" }, { name: "머스타드", hex: "#FFDB58" }] 
        } 
    },
    ];
    
    const slides: Slide[] = [
        { id: 1, title: "✨ NEW 시즌 파스텔 컬렉션 20% 할인 ✨", imgSrc: image1 }, // ⭐️ 변수 사용
        { id: 2, title: "🎁 첫 구매 고객 전용 사은품 증정!", imgSrc: image2 }, // ⭐️ 변수 사용
        { id: 3, title: "🌈 여름 한정! 액세서리 30% 특가!", imgSrc: image3 }, // ⭐️ 변수 사용
    ];

    return (
        <>
            {/* <SidebarMenu 
                isMenuOpen={isMenuOpen} 
                closeMenu={closeMenu} 
            />
            
            <div id="page-container" style={{ marginLeft: isMenuOpen ? '250px' : '0' }}> */}
                
                

                {/* 2. Utility Header */}
                {/* <UtilityHeader openMenu={openMenu} /> */}
                
                {/* 3. Logo Bar */}
                <div className="logo-bar">
                    <h1 className="logo"><a href="#">Pastel Shop</a></h1>
                </div>

                {/* 4. Category Navigation */}
                {/* <CategoryNav isFixed={isNavFixed} /> */}
                
                {/* 5. Image Slider Section */}
                <ImageSlider slides={slides} />

                {/* 6. Main Content */}
                <main className="main-content-full">
                    <h2 style={{ marginTop: '50px' }}>오늘의 추천 상품</h2>
                    <ProductGrid products={products} />
                </main>

                {/* 7. Footer */}
                <Footer />
            {/* </div> */}
        </>
    );
}
export default HomePage; 