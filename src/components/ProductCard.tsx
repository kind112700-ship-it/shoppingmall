// src/components/ProductCard.tsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product, ProductCardProps, CartItemType } from '../types';
import { getCartItems, saveCartItems } from '../utils/cart';
// -----------------------------------------------------------
// ⭐️ 이미지 파일 Import (반드시 실제 경로와 파일명을 사용해야 합니다.)
// -----------------------------------------------------------
import productImg1 from '../assets/product_1.jpg';
import productImg2 from '../assets/product_2.jpg';
import productImg3 from '../assets/product_3.jpg';
import productImg4 from '../assets/product_4.jpg';
import productImg5 from '../assets/product_5.jpg';
import productImg6 from '../assets/product_6.jpg';
import productImg7 from '../assets/product_7.jpg';
import productImg8 from '../assets/product_8.jpg';



const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const navigate = useNavigate();
    
    // 상세 페이지로 이동
    const goToDetailPage = () => {
        navigate(`/product/${product.id}`);
    }
    
    // 장바구니에 상품을 추가하는 로직
    const handleAddToCart = () => {
        // 가격 문자열에서 숫자만 추출
        const unitPrice = parseInt(product.price.replace(/[^0-9]/g, ''));
        const defaultOption = "기본 / 기본"; // 카드에서는 옵션 선택이 불가능하므로 기본값 사용

        const newItem: CartItemType = {
            id: product.id,
            name: product.name,
            option: defaultOption,
            unitPrice: unitPrice,
            quantity: 1, // 카드에서는 수량을 1개로 고정
            imageSrc: product.img,
        };

        // ⭐️ 수정: cart 변수에 명시적으로 CartItemType[] 타입을 지정하여 findIndex의 item 타입을 추론하게 합니다.
        const cart: CartItemType[] = getCartItems();
        
        // 장바구니에 동일한 상품(ID와 옵션이 같은)이 있는지 확인
        const existingItemIndex = cart.findIndex(item => 
            item.id === newItem.id &&
            item.option === newItem.option 
        );

        if (existingItemIndex > -1) {
            // 있으면 수량만 1 증가
            cart[existingItemIndex].quantity += 1;
            alert(`${product.name}의 장바구니 수량이 1개 증가되었습니다.`);
        } else {
            // 없으면 새로 추가
            cart.push(newItem);
            alert(`${product.name}이(가) 장바구니에 담겼습니다.`);
        }

        saveCartItems(cart); // Local Storage에 저장

    window.dispatchEvent(new Event('cartUpdated')); }

    return (
        <div className="product-card">
            {/* 상품 클릭 영역: 상세 페이지로 연결 */}
            <Link to={`/product/${product.id}`}>
                {/* product.img에 저장된 이미지를 사용 */}
                <img 
                    src={product.img} 
                    alt={product.name} 
                    className="product-image"
                />
                <p className="product-name">{product.name}</p>
                <p className="product-price">{product.price}</p>
            </Link>

            {/* 액션 버튼 영역 */}
            <div className="product-actions">
                {/* 상세페이지 이동 버튼 */}
                <button 
                    onClick={goToDetailPage} 
                    className="cta-button detail-button"
                >
                    상세 보기
                </button>
                
                {/* 장바구니 '담기' 버튼 */}
                <button 
                    onClick={handleAddToCart} 
                    className="cta-button cart-button"
                >
                    담기
                </button>
            </div>
        </div>
    );
}

export default ProductCard;