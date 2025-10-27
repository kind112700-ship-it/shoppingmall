// src/pages/ProductDetailPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductDetail } from '../types'; // Product 인터페이스 import
import { CartItemType } from '../types';
// import { getCartItems, saveCartItems } from '../utils/cart';
import '../styles//ProductDetail.css';

// -----------------------------------------------------------
// ⭐️ 이미지 파일 Import (반드시 실제 경로와 파일명을 사용해야 합니다.)
// 예시: 상품1의 이미지들
import productImg1 from '../assets/product_1.jpg';
import productImg2 from '../assets/product_2.jpg';
import productImg3 from '../assets/product_3.jpg';
import productImg4 from '../assets/product_4.jpg';
import productImg5 from '../assets/product_5.jpg';
import productImg6 from '../assets/product_6.jpg';
import productImg7 from '../assets/product_7.jpg';
import productImg8 from '../assets/product_8.jpg';


// ... (다른 상품 이미지들도 동일하게 import) ...
// -----------------------------------------------------------

const SUB_IMAGE_PLACEHOLDER = 'https://via.placeholder.com/150';
// -----------------------------------------------------------
// ⭐️ 데이터 목업 (subImages 속성 추가)
// -----------------------------------------------------------
const allProducts: ProductDetail[] = [
    { 
        id: 1, name: "파스텔 니트", price: "39,000원", 
        img: productImg1,
        subImages: [productImg2, productImg3, SUB_IMAGE_PLACEHOLDER], // 다른 이미지를 썸네일로 사용
        description: "부드러운 파스텔톤으로 제작된 고급 니트입니다. 봄/가을에 착용하기 좋습니다.", 
        options: { 
            size: ["S", "M", "L", "XL"], 
            color: [{ name: "아이보리", hex: "#f8f0e3" }, { name: "민트", hex: "#a8c0bf" }, { name: "핑크", hex: "#f0b8c6" }] 
        } 
    },
    { 
        id: 2, name: "세련된 셔츠", price: "54,000원", 
        img: productImg2,
        subImages: [productImg3, productImg4],
        description: "고급스러운 소재와 세련된 디자인으로 오피스룩에 완벽합니다. 주름이 잘 가지 않습니다.", 
        options: { 
            size: ["S", "M", "L"], 
            color: [{ name: "화이트", hex: "#FFFFFF" }, { name: "블루", hex: "#6082B6" }, { name: "네이비", hex: "#000080" }] 
        } 
    },
    { 
        id: 3, name: "기본 티셔츠", price: "22,000원", 
        img: productImg3,
        subImages: [productImg4, productImg5],
        description: "데일리룩의 필수템, 100% 코튼 소재의 베이직 티셔츠입니다. 여러 색상을 소장해보세요.", 
        options: { 
            size: ["Free"], 
            color: [{ name: "화이트", hex: "#FFFFFF" }, { name: "블랙", hex: "#000000" }, { name: "그레이", hex: "#808080" }] 
        } 
    },
    { 
        id: 4, name: "트렌치 코트", price: "99,000원", 
        img: productImg4,
        subImages: [productImg5, productImg6, productImg7],
        description: "클래식한 디자인의 가을 트렌치 코트입니다. 방수 처리되어 실용적입니다.", 
        options: { 
            size: ["M", "L"], 
            color: [{ name: "베이지", hex: "#F5F5DC" }, { name: "카키", hex: "#8FBC8F" }] 
        } 
    },
    { 
        id: 5, name: "플리츠 스커트", price: "45,000원", 
        img: productImg5,
        subImages: [productImg6],
        description: "활동성이 좋은 플리츠 디테일의 미디 스커트입니다. 캐주얼/포멀 모두 가능합니다.", 
        options: { 
            size: ["S", "M"], 
            color: [{ name: "블랙", hex: "#000000" }, { name: "차콜", hex: "#36454F" }] 
        } 
    },
    { 
        id: 6, name: "도트 원피스", price: "68,000원", 
        img: productImg6,
        subImages: [productImg7, productImg8],
        description: "발랄한 도트 패턴이 돋보이는 롱 원피스입니다. 허리 라인이 강조되어 날씬해 보입니다.", 
        options: { 
            size: ["Free"], 
            color: [{ name: "블랙도트", hex: "#000000" }, { name: "네이비도트", hex: "#000080" }] 
        } 
    },
    { 
        id: 7, name: "데님 팬츠", price: "49,000원", 
        img: productImg7,
        subImages: [productImg1, productImg2],
        description: "레귤러 핏의 편안한 데님 팬츠입니다. 사계절 활용 가능하며 튼튼한 원단입니다.", 
        options: { 
            size: ["26", "28", "30", "32"], 
            color: [{ name: "중청", hex: "#5D8AA8" }, { name: "진청", hex: "#1560BD" }] 
        } 
    },
    { 
        id: 8, name: "루즈핏 가디건", price: "63,000원", 
        img: productImg8,
        subImages: [productImg3, productImg4],
        description: "부드러운 촉감의 루즈핏 가디건입니다. 간절기에 가볍게 걸치기 좋습니다.", 
        options: { 
            size: ["Free"], 
            color: [{ name: "아이보리", hex: "#f8f0e3" }, { name: "베이지", hex: "#F5F5DC" }, { name: "브라운", hex: "#A52A2A" }] 
        } 
    },
];

// -----------------------------------------------------------

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); 
    const navigate = useNavigate();
    
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    
    // ⭐️ 추가: 현재 메인으로 표시될 이미지 URL
    const [currentMainImage, setCurrentMainImage] = useState<string>('');


    useEffect(() => {
        const productId = Number(id);
        const foundProduct = allProducts.find(p => p.id === productId);

        if (foundProduct) {
            setProduct(foundProduct);
            setSelectedSize(foundProduct.options.size[0] || null);
            setSelectedColor(foundProduct.options.color[0]?.name || null);
            
            // ⭐️ 초기 메인 이미지는 상품의 대표 이미지로 설정
            setCurrentMainImage(foundProduct.img); 
        } else {
            alert('상품을 찾을 수 없습니다.');
            navigate('/');
        }
    }, [id, navigate]);

    // ⭐️ 누락된 함수 1: 수량 조절 핸들러 (TS2304 해결)
    const handleQuantityChange = (delta: number) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    // ⭐️ 수정: handlePurchase를 독립적인 함수로 분리했습니다.
    const handlePurchase = () => {
        if (!product || !selectedSize || !selectedColor) {
            alert("옵션을 모두 선택해주세요.");
            return;
        }
       // 1. 단일 상품 정보 구성 (handleAddToCart와 동일)
        const unitPrice = parseInt(product.price.replace(/[^0-9]/g, ''));
        const itemOptionString = `${selectedSize} / ${selectedColor}`;

        const singleItem: CartItemType = { 
            id: product.id,
            name: product.name,
            option: itemOptionString,
            unitPrice: unitPrice,
            quantity: quantity,
            imageSrc: product.img,
        };

        // 2. navigate의 state를 이용해 단일 상품 정보와 플래그를 전달
        navigate('/checkout', { 
            state: { 
                itemsToPurchase: [singleItem], 
                isDirectPurchase: true // ⭐️ 이게 중요! 바로 구매임을 CheckoutPage에 알려줍니다.
            } 
        });
    }

    // ⭐️ 핵심 수정: 장바구니에 담기 핸들러 (Local Storage -> Server API 호출)
    const handleAddToCart = () => {
        if (!product || !selectedSize || !selectedColor) {
            alert("옵션을 모두 선택해주세요.");
            return;
        }
        
        // 1. 서버로 보낼 데이터 준비
        const unitPrice = parseInt(product.price.replace(/[^0-9]/g, ''));
        const itemOptionString = `${selectedSize} / ${selectedColor}`;

        const itemDataToSend = { 
            productId: String(product.id), // 서버의 목업 데이터는 ID를 문자열로 사용하므로 통일
            name: product.name,
            price: unitPrice,
            option: itemOptionString,
            quantity: quantity,
        };

        // 2. 서버 (server.js)의 API 엔드포인트로 POST 요청 전송
        fetch('/api/cart/add', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                // 주의: CORS 문제가 발생하면 package.json에 "proxy": "http://localhost:4000" 설정이 필요합니다.
            },
            body: JSON.stringify(itemDataToSend), 
        })
        .then(res => {
            if (!res.ok) {
                // HTTP 오류 상태 (4xx, 5xx) 처리
                return res.json().then(errorData => {
                    throw new Error(errorData.message || `HTTP 오류: ${res.status}`);
                });
            }
            return res.json();
        })
        .then(result => {
            // 서버(server.js)에서 보낸 성공 응답 처리
            if (result.success) {
                alert(result.message);
                
                // 장바구니 페이지 이동 확인
                if (window.confirm("장바구니에 상품을 담았습니다. 지금 장바구니로 이동하시겠습니까?")) {
                    navigate('/cart');
                }
            } else {
                // 서버 로직에서 실패(result.success = false)를 보냈을 경우
                alert('장바구니 추가 실패: ' + result.message);
            }
        })
        .catch(error => {
            // 네트워크 오류, JSON 파싱 오류 등 모든 통신 오류 처리
            console.error('API 통신 오류:', error);
            alert(`장바구니 추가 중 오류가 발생했습니다. 서버 상태를 확인하세요. (${error.message})`);
        });
    };

    // 썸네일 클릭 시 메인 이미지 변경 핸들러 (유지)
    const handleThumbnailClick = (imageSrc: string) => {
        setCurrentMainImage(imageSrc);
    };


    if (!product) {
        return <div className="product-detail-loading">상품 정보를 불러오는 중...</div>;
    }

    const unitPrice = parseInt(product.price.replace(/[^0-9]/g, ''));
    const totalPrice = unitPrice * quantity;
    const formattedPrice = totalPrice.toLocaleString('ko-KR');

    return (
        <div className="product-detail-container">
            
            <div className="product-info-top">
                {/* 1. 상품 이미지 영역 (메인 + 썸네일) */}
                <div className="product-image-area">
                    {/* ⭐️ 메인 이미지 (currentMainImage 상태 사용) */}
                    <img src={currentMainImage} alt={product.name} className="main-product-image" />
                    
                    {/* ⭐️ 썸네일 이미지 목록 */}
                    <div className="thumbnail-gallery">
                        {/* 대표 이미지도 썸네일에 포함하고 싶다면 추가 */}
                        <img 
                            src={product.img} 
                            alt={`${product.name} - 썸네일`} 
                            className={`thumbnail-image ${currentMainImage === product.img ? 'selected' : ''}`}
                            onClick={() => handleThumbnailClick(product.img)}
                        />
                        {product.subImages.map((subImg, index) => (
                            <img
                                key={index}
                                src={subImg}
                                alt={`${product.name} - 추가 이미지 ${index + 1}`}
                                className={`thumbnail-image ${currentMainImage === subImg ? 'selected' : ''}`}
                                onClick={() => handleThumbnailClick(subImg)}
                            />
                        ))}
                    </div>
                </div>
                {/* 2. 상품 상세 정보 및 옵션 선택 영역 */}
                <div className="product-details-area">
                    <h1 className="productarea-name">{product.name}</h1>
                    <p className="productarea-price">{product.price}</p>
                    <p className="product-description">{product.description}</p>
                    <hr />

                    {/* 3. 옵션 선택 */}
                    <div className="product-options">
                        
                        {/* 3-1. 사이즈 옵션 */}
                        <div className="option-group">
                            <label>사이즈: {selectedSize}</label>
                            <div className="size-buttons">
                                {product.options.size.map(size => (
                                    <button
                                        key={size}
                                        className={`option-button ${selectedSize === size ? 'selected' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3-2. 색상 옵션 */}
                        <div className="option-group">
                            <label>색상: {selectedColor}</label>
                            <div className="color-swatches">
                                {product.options.color.map(color => (
                                    <button
                                        key={color.name}
                                        className={`color-swatch-button ${selectedColor === color.name ? 'selected' : ''}`}
                                        style={{ backgroundColor: color.hex }}
                                        title={color.name}
                                        onClick={() => setSelectedColor(color.name)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* 3-3. 수량 조절 */}
                        <div className="quantity-control-detail">
                            <label>수량:</label>
                            <div className="input-group">
                                <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>-</button>
                                <input type="text" value={quantity} readOnly />
                                <button onClick={() => handleQuantityChange(1)}>+</button>
                            </div>
                        </div>

                    </div>
                    <hr />

                    {/* 4. 최종 금액 및 액션 버튼 */}
                    <div className="final-price-area">
                        <span>총 상품 금액:</span>
                        <span className="final-price-value">{formattedPrice}원</span>
                    </div>

                    <div className="action-buttons">
                        <button onClick={handleAddToCart} className="add-to-cart-btn">장바구니 담기</button>
                        <button onClick={handlePurchase} className="buy-now-btn">바로 구매</button>
                    </div>

                </div>
            </div>

            {/* 5. 상품 상세 설명 (하단 영역) */}
            <div className="product-description-bottom">
                <h2>상세 정보</h2>
                <p>{product.description}</p>
                {/* 여기에 이미지/HTML 상세 내용이 들어갈 수 있습니다. */}
            </div>

        </div>
    );
}

export default ProductDetailPage;