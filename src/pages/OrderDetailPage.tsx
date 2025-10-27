import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faClipboardList, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import '../styles/MyOrders.css'; // MyOrdersPage의 CSS를 재활용하거나 새로운 CSS를 만듭니다.

// 🚨 주문 상세 정보 타입 (MyOrdersPage의 Order 타입보다 상세해야 함)
interface OrderDetailItem {
    id: string; // productId
    productName: string; // 상세 페이지에는 상품 이름이 필요함
    option: string;
    quantity: number;
    unitPrice: number;
    subTotal: number;
}

interface OrderDetail {
    orderId: string;
    items: OrderDetailItem[];
    shippingInfo: {
        receiverName: string;
        address: string;
        phone: string;
        request: string;
    };
    finalTotal: number;
    totalProductsPrice: number;
    shippingFee: number;
    paymentMethod: string;
    date: string;
    status: string;
}

// 숫자를 콤마 형식으로 변환하는 함수 (재사용)
const formatNumber = (num: number | undefined | null) => {
    // ⭐️ num이 유효한 숫자가 아닐 경우 0으로 대체합니다.
    const validNum = num === undefined || num === null || isNaN(Number(num)) ? 0 : Number(num);
    return validNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// 주문 상태에 따른 레이블 및 스타일 (재사용)
const getStatusLabel = (status: string) => {
    switch (status) {
        case '결제 완료': return '결제 완료';
        case '배송 준비 중': return '상품 준비 중';
        case '배송 중': return '배송 중';
        case '배송 완료': return '배송 완료';
        case '주문 취소': return '주문 취소';
        default: return status;
    }
};

const getStatusClasses = (status: string) => {
    switch (status) {
        case '결제 완료':
        case '배송 준비 중':
            return 'status-badge bg-green-100 text-green-700'; 
        case '배송 중':
            return 'status-badge bg-yellow-100 text-yellow-700'; 
        case '배송 완료':
            return 'status-badge bg-green-100 text-green-700 delivered'; 
        case '주문 취소':
            return 'status-badge bg-gray-100 text-gray-700 canceled';
        default:
            return 'status-badge bg-gray-100 text-gray-700';
    }
};

const OrderDetailPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    
    const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // ⭐️ 주문 취소 로딩 상태 추가
    const [isCancelling, setIsCancelling] = useState(false); 

    // ⭐️ 서버에서 주문 상세 정보를 불러오는 함수 (로직 유지)
    const fetchOrderDetail = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/orders/${id}`); 
            const data = await response.json();

            if (!response.ok || !data.success || !data.order) {
                throw new Error(data.message || '주문 상세 정보를 찾을 수 없습니다.');
            }

            // 🚨 데이터 매핑 로직 (유지)
            const mappedOrder: OrderDetail = {
                ...data.order,
                items: data.order.items.map((item: any) => ({
                    ...item,
                    productName: `상품 이름 ${item.id}`, // Mock 상품 이름
                    unitPrice: Number(item.unitPrice) || 0, // 안정적인 숫자 파싱
                    quantity: Number(item.quantity) || 0,
                    subTotal: (Number(item.unitPrice) || 0) * (Number(item.quantity) || 0),
                })),
                finalTotal: Number(data.order.finalTotal) || 0, // 최종 금액
                totalProductsPrice: Number(data.order.totalProductsPrice) || 0, // 상품 총액
                shippingFee: Number(data.order.shippingFee) || 0, // 배송비
                paymentMethod: data.order.paymentMethod || '카드결제',
            };

            setOrderDetail(mappedOrder);
        } catch (err) {
            console.error("주문 상세 로드 오류:", err);
            setError("주문 상세 정보를 불러오는 중 오류가 발생했습니다. (ID: " + id + ")");
        } finally {
            setIsLoading(false);
        }
    }, []);


    // ⭐️ 주문 취소 요청 핸들러 구현
    const handleCancelOrder = useCallback(async () => {
        if (!orderId || !window.confirm(`주문 번호 ${orderId}를 정말로 취소하시겠습니까?`)) {
            return;
        }

        setIsCancelling(true);
        setError(null);

        try {
            // Mock 서버에 구현된 주문 취소 API 호출 (POST)
            const response = await fetch(`/api/orders/${orderId}/cancel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();

            if (!response.ok || !data.success) {
                // 서버에서 취소 불가 메시지를 반환한 경우 처리
                throw new Error(data.message || '주문 취소에 실패했습니다.');
            }

            alert(data.message);
            
            // 취소 성공 시, 업데이트된 주문 상세 정보를 다시 불러와 화면을 갱신합니다.
            fetchOrderDetail(orderId); 

        } catch (err) {
            console.error("주문 취소 오류:", err);
            // 취소 불가능할 때 서버 메시지 표시
            setError(`취소 처리 중 오류가 발생했습니다: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
        } finally {
            setIsCancelling(false);
        }
    }, [orderId, fetchOrderDetail]);


    useEffect(() => {
        if (orderId) {
            fetchOrderDetail(orderId);
        } else {
            navigate('/my-orders', { replace: true });
        }
    }, [orderId, fetchOrderDetail, navigate]);

    // ----------------------------------------------------
    // 로딩 및 에러 처리 JSX (유지)
    // ----------------------------------------------------
    if (isLoading) {
        return <div className="loading-message">주문 상세 정보를 불러오는 중입니다...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!orderDetail) {
        return null;
    }

    // ----------------------------------------------------
    // ⭐️ 메인 렌더링 (주문 상세 정보 표시)
    // ----------------------------------------------------
    return (
        <div className="my-orders-container">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="main-title">
                    주문 상세 내역
                </h1>
                
                <div className="detail-page-wrapper">
                    
                    {/* 섹션 1: 주문 요약 및 상태 */}
                    <div className="detail-section order-summary-box">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="section-title">주문 번호: {orderDetail.orderId}</h2>
                            <span className={getStatusClasses(orderDetail.status)}>
                                {getStatusLabel(orderDetail.status)}
                            </span>
                        </div>
                        <p className="summary-text">주문 일자: {new Date(orderDetail.date).toLocaleDateString()}</p>
                        <p className="summary-text final-total-display">
                            총 결제 금액: 
                            <span className="total-amount-value">{formatNumber(orderDetail.finalTotal)}원</span>
                        </p>
                    </div>

                    {/* 섹션 2: 주문 상품 목록 */}
                    <div className="detail-section product-list-box">
                        <h2 className="section-title"><FontAwesomeIcon icon={faClipboardList} className="icon-pink" /> 주문 상품 ({orderDetail.items.length}종)</h2>
                        <ul className="product-list">
                            {orderDetail.items.map((item) => (
                                <li key={item.id} className="product-item">
                                    <div className="product-info">
                                        <p className="product-name">{item.productName} ({item.option})</p>
                                        <p className="product-qty">{formatNumber(item.unitPrice)}원 x {item.quantity}개</p>
                                    </div>
                                    <p className="product-subtotal">{formatNumber(item.subTotal)}원</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 섹션 3: 배송 및 결제 정보 */}
                    <div className="info-grid">
                        <div className="detail-section shipping-box">
                            <h2 className="section-title"><FontAwesomeIcon icon={faTruck} className="icon-pink" /> 배송 정보</h2>
                            <dl className="info-dl">
                                <dt>수령인</dt><dd>{orderDetail.shippingInfo.receiverName}</dd>
                                <dt>연락처</dt><dd>{orderDetail.shippingInfo.phone}</dd>
                                <dt>주소</dt><dd>{orderDetail.shippingInfo.address}</dd>
                                <dt>배송 요청 사항</dt><dd>{orderDetail.shippingInfo.request || '없음'}</dd>
                            </dl>
                        </div>

                        <div className="detail-section payment-box">
                            <h2 className="section-title"><FontAwesomeIcon icon={faMoneyBillWave} className="icon-pink" /> 결제 정보</h2>
                            <dl className="info-dl">
                                <dt>상품 금액</dt><dd>{formatNumber(orderDetail.totalProductsPrice)}원</dd>
                                <dt>배송비</dt><dd>{formatNumber(orderDetail.shippingFee)}원</dd>
                                <dt className="final-total-dt">총 결제 금액</dt>
                                <dd className="final-total-dd">{formatNumber(orderDetail.finalTotal)}원</dd>
                            </dl>
                            <p className="payment-method-p">
                                결제 수단: <span className="method-highlight">{orderDetail.paymentMethod}</span>
                            </p>
                        </div>
                    </div>

                    {/* 액션 버튼 */}
                    <div className="order-actions mt-10">
                        <button
                            onClick={() => navigate('/my-orders')}
                            className="go-to-list-btn"
                        >
                            &larr; 주문 내역 목록으로 돌아가기
                        </button>
                        {orderDetail.status !== '주문 취소' && (
                            <button
                                onClick={handleCancelOrder}
                                className="cancel-order-btn"
                          disabled={isCancelling} // ⭐️ 로딩 중 비활성화
                            >
                                {isCancelling ? '취소 처리 중...' : '주문 취소'}
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default OrderDetailPage;