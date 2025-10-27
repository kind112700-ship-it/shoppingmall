// src/types/index.ts (수정 및 통합 완료된 버전)

// -----------------------------------------------------------
// 1. 공통 데이터 인터페이스 (가장 상세한 버전으로 통일)
// -----------------------------------------------------------

// ⭐️ Product 데이터 구조 (이미지, 옵션 등 모든 상세 정보 포함)
export interface Product {
    id: number;
    name: string;
    price: string;
    img: string; // ProductCard에 필요
    description: string;
    options: {
        size: string[];
        color: { name: string; hex: string }[];
    };
}
// ⭐️ 새로운 인터페이스 추가: ProductDetail
// Product의 모든 속성을 상속받고, subImages만 추가합니다.
export interface ProductDetail extends Product {
    subImages: string[];
}

// ⭐️ CartItem 데이터 구조
export interface CartItemType {
    id: number;
    name: string;
    option: string;
    unitPrice: number;
    quantity: number;
    imageSrc: string;
}

// ⭐️ Slide 데이터 구조
export interface Slide {
    id: number;
    title: string;
    imgSrc: string;
}

// -----------------------------------------------------------
// 2. 컴포넌트 Props 인터페이스 (중복 제거 및 구조 수정)
// -----------------------------------------------------------

// UtilityHeader 컴포넌트 Props
export interface UtilityHeaderProps {
    openMenu: () => void; // 햄버거 메뉴 열기 함수
}

// SidebarMenu 컴포넌트 Props
export interface SidebarMenuProps {
    isMenuOpen: boolean;
    closeMenu: () => void;
}

// CategoryNav 컴포넌트 Props
export interface CategoryNavProps {
    isFixed: boolean; // 스크롤 위치에 따라 fixed 클래스를 적용할지 결정하는 상태
}

// ImageSlider 컴포넌트 Props
export interface ImageSliderProps {
    slides: Slide[];
}

// ⭐️ ProductCard 컴포넌트 Props (Product 객체 하나를 받습니다.)
export interface ProductCardProps {
    product: Product; 
}

// ⭐️ ProductGrid 컴포넌트 Props (Product 배열을 받습니다.)
export interface ProductGridProps {
    products: Product[];
}

// ⭐️ OrderItem (주문 내 개별 상품)
export interface OrderItem {
    name: string;
    option: string;
    quantity: number;
    price: number;
}

// ⭐️ Order 데이터 구조 (서버에서 받아올 최종 주문 목록의 각 요소)
export interface Order {
    orderId: string;
    totalAmount: number; // 최종 결제 금액
    orderDate: string;   // 주문 날짜
    status: 'pending' | 'shipped' | 'delivered' | 'canceled'; // 주문 상태
    items: OrderItem[]; // 주문한 상품 목록
    shippingInfo: {
        receiverName: string;
        address: string;
        phone: string;
    };
}