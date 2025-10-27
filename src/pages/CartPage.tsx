import React, { useState, useMemo, useCallback,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItemType } from '../types';
// import { getCartItems, saveCartItems } from '../utils/cart';
import '../styles/Cart.css';


// ----------------------------------------------------
// ⭐️ 서버 통신 함수들을 위한 타입 정의 (서버 응답과 일치해야 함)
interface ServerCartItem {
    productId: string; // 서버가 문자열 ID를 사용한다고 가정
    name: string;
    price: number; // 서버가 단가(unitPrice)를 price로 보낸다고 가정
    option: string;
    quantity: number;
}
// ----------------------------------------------------


// 숫자를 콤마 형식으로 변환하는 함수
const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const MIN_FREE_SHIPPING = 50000;
const STANDARD_SHIPPING_FEE = 3000;


const CartPage: React.FC = () => {
    const [items, setItems] = useState<CartItemType[]>([]);
    const [isLoading, setIsLoading] = useState(true); 
    const navigate = useNavigate();

    // ----------------------------------------------------
    // ⭐️ 핵심 수정 1: 서버에서 장바구니 데이터 로드 및 이미지 경로 수정
    // ----------------------------------------------------
    const fetchCartItems = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/cart');
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || '장바구니 정보를 불러오는 데 실패했습니다.');
            }

            // 서버 데이터를 클라이언트 CartItemType에 맞게 매핑
            const mappedItems: CartItemType[] = data.cart.map((item: ServerCartItem) => {
                const imageId = item.productId; // '1', '2', ... 문자열 ID
                
                // ⭐️ 수정 완료: 이미지를 public/images 폴더로 옮겼다고 가정하고 최상위 경로를 사용합니다.
                const finalImageSrc = `/images/product_${imageId}.jpg`;

                return {
                    id: Number(imageId), 
                    name: item.name,
                    option: item.option,
                    unitPrice: item.price,
                    quantity: item.quantity,
                    // ⭐️ public 폴더 기준 경로로 변경
                    imageSrc: finalImageSrc, 
                };
            });
            
            setItems(mappedItems);
            window.dispatchEvent(new Event('cartUpdated')); 
            
        } catch (error) {
            console.error("장바구니 로드 오류:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCartItems();
    }, [fetchCartItems]);


    // useMemo를 사용하여 상품 금액, 배송비, 최종 금액을 효율적으로 계산 (유지)
    const { subtotal, shippingFee, finalTotal, totalQuantity } = useMemo(() => {
        const currentSubtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
        const currentTotalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

        const currentShippingFee = (currentSubtotal > 0 && currentSubtotal < MIN_FREE_SHIPPING) 
            ? STANDARD_SHIPPING_FEE 
            : 0;
            
        const currentFinalTotal = currentSubtotal + currentShippingFee;

        return {
            subtotal: currentSubtotal,
            shippingFee: currentShippingFee,
            finalTotal: currentFinalTotal,
            totalQuantity: currentTotalQuantity,
        };
    }, [items]); 


    // ----------------------------------------------------
    // ⭐️ 핵심 수정 2: 수량 조절 핸들러 (서버 API 호출)
    // ----------------------------------------------------
    const handleQuantityChange = useCallback(async (productId: number, option: string, delta: number) => {
        const currentItem = items.find(item => item.id === productId && item.option === option);
        if (!currentItem) return;

        const newQuantity = Math.max(1, currentItem.quantity + delta);

        if (newQuantity === currentItem.quantity) return; 

        try {
            const response = await fetch('/api/cart/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: String(productId),
                    option: option,
                    quantity: newQuantity,
                }),
            });
            const result = await response.json();

            if (result.success) {
                fetchCartItems(); 
            } else {
                alert('수량 변경에 실패했습니다: ' + result.message);
            }
        } catch (error) {
            console.error('수량 변경 API 통신 오류:', error);
            alert('수량 변경 중 오류가 발생했습니다. 서버를 확인하세요.');
        }
    }, [items, fetchCartItems]);

    // ----------------------------------------------------
    // ⭐️ 핵심 수정 3: 상품 삭제 핸들러 (서버 API 호출)
    // ----------------------------------------------------
    const handleRemoveItem = useCallback(async (productId: number, option: string) => {
        if (!window.confirm('장바구니에서 해당 상품을 삭제하시겠습니까?')) {
            return;
        }

        try {
            const response = await fetch('/api/cart/remove', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: String(productId),
                    option: option,
                }),
            });
            const result = await response.json();

            if (result.success) {
                fetchCartItems(); 
            } else {
                alert('상품 삭제에 실패했습니다: ' + result.message);
            }
        } catch (error) {
            console.error('상품 삭제 API 통신 오류:', error);
            alert('상품 삭제 중 오류가 발생했습니다. 서버를 확인하세요.');
        }
    }, [fetchCartItems]);


    const handleCheckout = () => {
        if (subtotal === 0) {
            alert('장바구니에 상품이 없습니다. 상품을 담아주세요.');
            return;
        }
        navigate('/checkout', { state: { itemsToPurchase: items, isDirectPurchase: false } }); 
    };

    const handleContinueShopping = () => {
        navigate('/'); 
    };


    // 장바구니 항목 렌더링
    const CartItem = ({ item }: { item: CartItemType }) => (
        <div className="cart-item" data-price={item.unitPrice}>
            <div className="product-info">
                <img 
                    src={item.imageSrc} 
                    alt={item.name} 
                    className="product-image" 
                    // ⭐️ 이미지 로드 실패 시 대체 이미지 표시 (URL 대신)
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; 
                        target.src = `https://via.placeholder.com/100?text=${item.name.substring(0, 1)}`;
                        target.alt = "이미지 로드 실패";
                    }}
                />
                <div className="details">
                    <span className="product-name">{item.name}</span>
                    <span className="product-option">{item.option}</span>
                </div>
            </div>
            
            <div className="quantity-control">
                <button 
                    className="quantity-btn minus" 
                    onClick={() => handleQuantityChange(item.id, item.option, -1)}
                    disabled={item.quantity <= 1} 
                >
                    -
                </button>
                <input type="text" value={item.quantity} className="quantity-input" readOnly />
                <button 
                    className="quantity-btn plus" 
                    onClick={() => handleQuantityChange(item.id, item.option, 1)}
                >
                    +
                </button>
            </div>

            <div className="price-row">
                <div className="price">
                    <span className="unit-price">{formatNumber(item.unitPrice)}</span>원
                </div>
                <div className="item-total-price">
                    <span className="total-price-value">{formatNumber(item.unitPrice * item.quantity)}</span>원
                </div>
            </div>

            <button 
                className="remove-btn" 
                onClick={() => handleRemoveItem(item.id, item.option)}
            >
                삭제
            </button>
        </div>
    );

    if (isLoading) {
        return <div className="loading-message">장바구니 정보를 불러오는 중입니다...</div>;
    }


    return (
        <div className="cart-container">
            <h1 className="cart-header">나의 장바구니</h1>

            {/* 장바구니 항목 리스트 */}
            <div className="cart-items">
                {items.length === 0 ? (
                    <div className="empty-cart text-center py-10 text-gray-500 text-lg border border-dashed border-gray-300 rounded-md">
                        장바구니에 담긴 상품이 없습니다.
                    </div>
                ) : (
                    items.map((item, index) => (
                        <CartItem key={`${item.id}-${item.option}`} item={item} /> 
                    ))
                )}
            </div>

            
            {/* 요약 섹션 */}
            {items.length > 0 && (
                <div className="cart-summary-wrapper"> 
                    <div className="cart-summary">
                        <h2 className="text-xl font-semibold mb-3">결제 예상 금액</h2>
                        <div className="summary-line">
                        <span>상품 수량</span>
                        <span className="summary-value product-subtotal font-medium">
                            {formatNumber(totalQuantity)}개
                        </span>
                    </div>
                        <div className="summary-line">
                            <span>상품 금액</span>
                            <span className="summary-value product-subtotal font-medium">
                                {formatNumber(subtotal)}원
                            </span>
                        </div>
                        <div className="summary-line">
                            <span>배송비</span>
                            <span className="summary-value shipping-fee font-medium">
                                {shippingFee === 0 ? '무료' : `${formatNumber(shippingFee)}원`}
                            </span>
                        </div>
                        <div className="summary-total">
                            <span>총 결제 금액</span>
                            <span className="summary-value final-total">
                                {formatNumber(finalTotal)}원
                            </span>
                        </div>
                        <button className="checkout-btn" onClick={handleCheckout}>
                             주문하기
                           </button>
                    </div>
                </div>
            )}


            {/* 계속 쇼핑하기 링크 */}
            <div className="continue-shopping">
                <button onClick={handleContinueShopping}>
                    계속 쇼핑하기
                </button>
            </div>
        </div>
    );
}

export default CartPage;