import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MyOrders.css';


// 🚨 임시 타입 정의 (서버 응답 구조와 일치해야 합니다)
interface OrderItem {
    id: string; // productId
    option: string;
    quantity: number;
    unitPrice: number;
}

interface Order {
    orderId: string;
    items: OrderItem[];
    shippingInfo: any; // 배송 정보
    finalTotal: number;
    date: string;
    status: string; // '결제 완료', '배송 중', '배송 완료' 등의 한글 상태
}

// 숫자를 콤마 형식으로 변환하는 함수
const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// ----------------------------------------------------
// 주문 상태에 따라 적절한 클래스를 반환하는 유틸리티 함수
// ----------------------------------------------------
const getStatusClasses = (status: string) => {
    switch (status) {
        case '결제 완료':
        case '배송 준비 중':
            return 'bg-green-100 text-green-700'; // 핑크 계열로 매핑될 클래스
        case '배송 중':
            return 'bg-yellow-100 text-yellow-700'; // 골드 계열로 매핑될 클래스
        case '배송 완료':
            return 'bg-green-100 text-green-700 delivered'; // 완료 시 다른 색상으로
        case '주문 취소':
            return 'bg-gray-100 text-gray-700 canceled';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const MyOrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // ⭐️ 서버에서 주문 내역을 불러오는 함수
    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // 실제 서버 API 호출
            const response = await fetch('/api/orders'); 
            const data = await response.json();

            if (!response.ok || !data.success) {
                // 로그인 세션 만료 등의 에러 처리
                if (response.status === 401) {
                    alert("로그인이 필요합니다.");
                    navigate('/login');
                    return;
                }
                throw new Error(data.message || '주문 내역을 불러오는 데 실패했습니다.');
            }

            // 🚨 임시: 서버에서 이름 정보가 없으므로 Mock 데이터를 활용하여 상품 이름 추가
            const updatedOrders = data.orders.map((order: any) => ({
                ...order,
                items: order.items.map((item: any) => ({
                    ...item,
                    // Mock 상품 이름 (실제로는 서버에서 가져와야 함)
                    productName: `상품 이름 ${item.id}`,
                })),
            }));

            setOrders(updatedOrders);
        } catch (err) {
            console.error("주문 내역 로드 오류:", err);
            setError("주문 내역을 불러오는 중 오류가 발생했습니다. 서버 상태를 확인해주세요.");
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // 로딩 및 오류 상태 처리
    if (isLoading) {
        return <div className="loading-message">주문 내역을 불러오는 중입니다...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }


    // 주문 항목을 간략히 표시하는 함수
    const getOrderTitle = (order: Order) => {
        if (order.items.length === 0) return "주문 상품 없음";
        
        const firstItem: any = order.items[0]; // productName이 추가된 항목
        const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
        
        const productName = firstItem.productName || `상품 ID ${firstItem.id}`; 
        
        if (order.items.length === 1) {
            return `${productName} (${firstItem.option}) / ${firstItem.quantity}개`;
        }
        return `${productName} 외 ${order.items.length - 1}개 (${totalItems}개 상품)`;
    };


    return (
        <div className="my-orders-container">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="main-title">
                    나의 주문 내역 ({orders.length}건)
                </h1>

                {orders.length === 0 ? (
                    <div className="empty-orders">
                        <p>최근 주문 내역이 없습니다.</p>
                        <button 
                            onClick={() => navigate('/')} 
                            className="go-to-main-btn"
                        >
                            쇼핑하러 가기
                        </button>
                    </div>
                ) : (
                    <div className="order-list-grid">
                        {orders.map((order) => (
                            <div 
                                key={order.orderId} 
                                className="order-card" // ⭐️ CSS 파일에서 스타일 관리
                            >
                                <div className="order-header-info">
                                    <div>
                                        <p className="order-date-label">
                                            주문 일자: {new Date(order.date).toLocaleDateString()}
                                        </p>
                                        <p className="order-id-display">
                                            주문 번호: {order.orderId}
                                        </p>
                                    </div>
                                    <span 
                                        className={`status-badge ${getStatusClasses(order.status).split(' ')[0]} ${getStatusClasses(order.status).split(' ')[1]}`}
                                    >
                                        {order.status}
                                    </span>
                                </div>

                                <div className="order-body">
                                    <p className="item-title">
                                        {getOrderTitle(order)}
                                    </p>
                                    <div className="total-info">
                                        <p className="total-label">총 결제 금액</p>
                                        <p className="total-amount-value">
                                            {formatNumber(order.finalTotal)}원
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="order-actions">
                                    <button
                                        onClick={() => navigate(`/my-orders/${order.orderId}`)} // ⭐️ 상세 페이지 라우트
                                        className="detail-button"
                                    >
                                        주문 상세 보기 &rarr;
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyOrdersPage;