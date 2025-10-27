// src/pages/CheckoutPage.tsx (수정된 전체 코드 - 섹션 분리 적용)

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartItemType } from '../types';
// import { getCartItems, saveCartItems } from '../utils/cart'; 
import '../styles/Checkout.css';

// ---------------------------------------------
// ⭐️ 상수 정의
// ---------------------------------------------
const formatNumber = (num: number): string => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const MIN_FREE_SHIPPING = 50000;
const STANDARD_SHIPPING_FEE = 3000;
// ---------------------------------------------


const CheckoutPage: React.FC = () => {
    const [items, setItems] = useState<CartItemType[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDirectPurchase, setIsDirectPurchase] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // 💡 결제 정보 상태 정의
    const [orderInfo, setOrderInfo] = useState({
        receiverName: '',
        address: '',
        phone: '',
        request: '',
    });

    // ⭐️ 결제 수단 상태 정의
    const [selectedPayment, setSelectedPayment] = useState<'card' | 'bank' | 'kakao' | 'naver'>('card');
    
    // ----------------------------------------------------
    // ⭐️ 수정 1: 컴포넌트 마운트 시 데이터 로드 로직 (Local Storage 제거)
    // ----------------------------------------------------
    useEffect(() => {
        const state = location.state as { itemsToPurchase?: CartItemType[], isDirectPurchase?: boolean } | undefined;
        let purchaseItems: CartItemType[] = [];
        let directPurchaseFlag = false;

        if (state && state.itemsToPurchase) {
            purchaseItems = state.itemsToPurchase;
            directPurchaseFlag = !!state.isDirectPurchase; // 바로 구매 플래그 설정
        } 
        // 🚨 장바구니 페이지에서 state로 데이터를 전달받지 못하면 오류이므로, 
        // Local Storage 대신 바로 navigate합니다.
        else {
             alert('주문할 상품 정보가 없습니다. 장바구니로 이동합니다.');
             navigate('/cart');
             return;
        }
        
        if (purchaseItems.length === 0) {
            alert('주문할 상품이 없습니다. 장바구니로 이동합니다.');
            navigate('/cart');
            return;
        }
        
        setItems(purchaseItems);
        setIsDirectPurchase(directPurchaseFlag);
    }, [navigate, location.state]);

    // 2. 금액 및 수량 계산 (유지)
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

    // 3. 폼 입력 핸들러 (유지)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setOrderInfo(prev => ({ ...prev, [name]: value }));
    };

    // 4. 결제 수단 변경 핸들러 (유지)
    const handlePaymentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPayment(e.target.value as 'card' | 'bank' | 'kakao' | 'naver');
    }, []);

    // ----------------------------------------------------
    // ⭐️ 핵심 수정 2: 결제(주문) 완료 핸들러 (서버 API 호출)
    // ----------------------------------------------------
    const handleOrderSubmit = async () => {
        // 1. 필수 입력값 검증
        if (!orderInfo.receiverName || !orderInfo.address || !orderInfo.phone) {
            alert('필수 주문 정보를 모두 입력해주세요.');
            return;
        }
        
        setIsSubmitting(true);
        
        // 서버로 보낼 주문 데이터 구성 (서버의 세션 장바구니 구조와 비슷하게 매핑)
        const orderData = {
            // 서버는 ID를 문자열로 사용하므로 변환
            items: items.map(item => ({ 
                productId: String(item.id), 
                name: item.name,
                price: item.unitPrice,
                option: item.option,
                quantity: item.quantity
            })),
            shippingInfo: orderInfo,
            paymentMethod: selectedPayment,
            finalTotal: finalTotal, 
        };

        try {
            // 2. 서버의 주문 API (/api/order) 호출
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            const result = await response.json();

            if (result.success) {
                // 3. 주문 성공 처리 및 주문 완료 페이지로 이동
                alert(`✅ 주문이 완료되었습니다! 총 ${formatNumber(result.orderTotal)}원 결제 (주문 번호: ${result.orderId})`);
                
                // 4. 주문 완료 페이지로 이동 (주문 번호와 상세 정보를 전달)
                navigate(`/order-complete/${result.orderId}`, { 
                    state: { 
                        orderDetails: orderData, 
                        orderId: result.orderId,
                        finalTotal: finalTotal 
                    } 
                });

                // 🚨 서버에서 장바구니를 비웠으므로 클라이언트의 로컬 상태는 무시합니다.
                // window.dispatchEvent(new Event('cartUpdated')); // 헤더 카트 아이콘 업데이트용으로 필요하다면 유지
                
            } else {
                alert('주문 처리 중 문제가 발생했습니다: ' + result.message);
            }
        } catch (error) {
            console.error("주문 API 통신 오류:", error);
            alert('주문 처리 중 서버 통신에 실패했습니다. 서버를 확인해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };


    if (items.length === 0) {
        return <div className="checkout-loading">주문 정보를 준비 중입니다...</div>;
    }
    
    // ----------------------------------------------------
    // ⭐️ JSX 부분 (handleOrderSubmit 연결) - 그대로 유지
    // ----------------------------------------------------
    return (
        <div className="checkout-container">
            <h1 className="checkout-header">
                주문/결제 ({isDirectPurchase ? '바로 구매' : '장바구니 전체 구매'})
            </h1>

            <div className="checkout-content">
                
                {/* ⭐️ [좌측 영역] 배송 정보, 주문 상품, 결제 수단 */}
                <div className="main-order-info-area">
                    
                    {/* 1. 주문자/배송지 정보 입력 영역 (유지) */}
                    <div className="shipping-info-area section-box">
                        <h2>배송 정보 입력</h2>
                        <form className="order-form">
                            <div className="form-group"><label>수령인 이름 *</label><input type="text" name="receiverName" value={orderInfo.receiverName} onChange={handleInputChange} required /></div>
                            <div className="form-group"><label>연락처 *</label><input type="text" name="phone" value={orderInfo.phone} onChange={handleInputChange} required /></div>
                            <div className="form-group"><label>배송 주소 *</label><input type="text" name="address" value={orderInfo.address} onChange={handleInputChange} required /></div>
                            <div className="form-group"><label>배송 요청 사항</label><textarea name="request" value={orderInfo.request} onChange={handleInputChange} rows={3} /></div>
                        </form>
                    </div>
                    
                    {/* ⭐️ [추가 섹션 1] 주문 상품 정보 (독립) */}
                    <div className="product-list-area section-box">
                        <h2>주문 상품 정보 ({totalQuantity}개)</h2>
                        <div className="summary-details">
                            {items.map(item => (
                                <div key={`${item.id}-${item.option}`} className="summary-item">
                                    <span className="item-name">{item.name} ({item.option})</span>
                                    <span className="item-qty">x {item.quantity}</span>
                                    <span className="item-price">{formatNumber(item.unitPrice * item.quantity)}원</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ⭐️ [추가 섹션 2] 결제 수단 선택 (독립) */}
                    <div className="payment-method-area section-box">
                        <h2>결제 수단 선택</h2>
                        <div className="payment-options">
                            <label><input type="radio" name="payment" value="card" checked={selectedPayment === 'card'} onChange={handlePaymentChange} /> 신용카드 / 체크카드</label>
                            <label><input type="radio" name="payment" value="bank" checked={selectedPayment === 'bank'} onChange={handlePaymentChange} /> 무통장 입금</label>
                            <label><input type="radio" name="payment" value="kakao" checked={selectedPayment === 'kakao'} onChange={handlePaymentChange} /> 카카오페이</label>
                            <label><input type="radio" name="payment" value="naver" checked={selectedPayment === 'naver'} onChange={handlePaymentChange} /> 네이버페이</label>
                        </div>
                        
                        {/* 무통장 입금 선택 시 정보 표시 */}
                        {selectedPayment === 'bank' && (
                            <div className="bank-info-details">
                                <p>입금 계좌: **국민은행 123456-04-789012 (주)샵네임**</p>
                                <p className="warning-text">주문 후 3일 이내 미입금 시 자동 취소됩니다.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ⭐️ [우측 영역] 금액 요약 및 결제 버튼 */}
                <div className="order-summary-area summary-only-box">
                    <h2>최종 결제 금액</h2>
                    
                    {/* 금액 계산 요약 (유지) */}
                    <div className="summary-calculation">
                        <div className="calculation-line">
                            <span>상품 금액</span>
                            <span className="value">{formatNumber(subtotal)}원</span>
                        </div>
                        <div className="calculation-line">
                            <span>배송비</span>
                            <span className="value">{shippingFee === 0 ? '무료' : `${formatNumber(shippingFee)}원`}</span>
                        </div>
                    </div>
                    
                    <div className="final-total-box">
                        <span className="label">총 결제 금액</span>
                        <span className="final-value">{formatNumber(finalTotal)}원</span>
                    </div>

                    <button 
                        className="payment-btn" 
                        onClick={handleOrderSubmit} // ⭐️ 서버 API 호출 함수 연결
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? '결제 진행 중...' : `${formatNumber(finalTotal)}원 결제하기`}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;