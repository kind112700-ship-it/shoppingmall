import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import '../styles/OrderComplete.css';


// ---------------------------------------------
// ⭐️ 타입 정의 (CheckoutPage에서 전달받는 State 구조)
// ---------------------------------------------
interface OrderCompleteState {
    orderId: string;
    finalTotal: number;
    // CheckoutPage에서 전달한 상세 정보 (배송 정보, 상품 리스트)
    orderDetails: {
        items: any[];
        shippingInfo: {
            receiverName: string;
            address: string;
            phone: string;
            request: string;
        };
        paymentMethod: string;
    };
}

// ---------------------------------------------
// 상수 정의 및 유틸 함수
// ---------------------------------------------
const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
// ---------------------------------------------


const OrderCompletePage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId: paramOrderId } = useParams<{ orderId: string }>(); // URL에서 주문 ID를 받습니다.
    
    // ⭐️ location.state에서 필요한 데이터 추출 (키 이름을 CheckoutPage에 맞게 조정)
    const state = location.state as OrderCompleteState | undefined;
    
    // state가 없거나 유효하지 않을 때 서버 통신을 위한 로직을 추가합니다.
    const [orderInfo, setOrderInfo] = useState<OrderCompleteState | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // ----------------------------------------------------
    // ⭐️ 핵심 수정: 데이터 로드 useEffect
    // ----------------------------------------------------
    useEffect(() => {
        setIsLoading(true);
        
        // 1. navigate state를 통해 주문 정보가 전달된 경우 (새로고침이 없는 경우)
        if (state && state.orderId && state.finalTotal) {
            setOrderInfo(state);
            setIsLoading(false);
            return;
        }

        // 2. state가 없지만 URL에 orderId가 있는 경우 (새로고침 또는 외부 접근)
        if (paramOrderId) {
            // 🚨 이전 답변에서 제안한 서버 API 호출 로직을 사용합니다.
            // 서버에서 주문 상세 정보를 가져오는 API를 호출해야 합니다.
            fetch(`/api/orders/${paramOrderId}`) // 👈 서버 API 호출!
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.order) {
                        // 서버에서 받은 데이터를 OrderCompleteState 형식으로 변환하여 저장
                        setOrderInfo({
                            orderId: data.order.orderId,
                            finalTotal: data.order.finalTotal,
                            orderDetails: data.order // 서버 응답 구조에 맞게 매핑 필요
                        });
                    } else {
                        // 서버에서 주문을 찾지 못한 경우
                        alert('잘못된 접근입니다. 주문 내역이 확인되지 않습니다.');
                        navigate('/', { replace: true });
                    }
                })
                .catch(error => {
                    console.error('주문 상세 조회 중 오류:', error);
                    alert('주문 정보를 불러오는 데 실패했습니다. 서버를 확인해주세요.');
                    navigate('/', { replace: true });
                })
                .finally(() => {
                    setIsLoading(false);
                });
            return;
        }

        // 3. orderId도 없고 state도 없는 경우 (잘못된 접근)
        alert('잘못된 접근입니다. 주문 내역이 확인되지 않습니다.');
        navigate('/', { replace: true });

    }, [state, paramOrderId, navigate]); // 의존성 배열에 모든 외부 변수를 포함

    // ----------------------------------------------------
    // ⭐️ 로딩 및 에러 처리 JSX
    // ----------------------------------------------------
    if (isLoading) {
        return <div className="loading-message text-center py-20">주문 정보를 확인 중입니다...</div>;
    }
    
    // orderInfo가 null이면 이미 navigate로 리디렉션되었거나 리디렉션될 예정입니다.
    if (!orderInfo) {
        return null;
    }

    // ----------------------------------------------------
    // ⭐️ 메인 렌더링 (데이터 바인딩 수정)
    // ----------------------------------------------------
    return (
        <div className="bg-white min-h-screen py-16 font-sans">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="p-10 border border-green-200 bg-green-50 rounded-xl shadow-lg">
                    <FontAwesomeIcon 
                        icon={faCheckCircle} 
                        className="w-20 h-20 text-green-500 mx-auto mb-6"
                    />
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                        주문이 성공적으로 완료되었습니다!
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        고객님의 주문이 정상적으로 접수되었습니다. 감사합니다.
                    </p>

                    {/* 주문 정보 요약 */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200 mb-10 text-left">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">주문 정보</h2>
                        <div className="space-y-3">
                            {/* 주문 번호 */}
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-600">주문 번호</span>
                                <span className="font-bold text-lg text-indigo-600">{orderInfo.orderId}</span>
                            </div>
                            
                            {/* 총 결제 금액 */}
                            <div className="flex justify-between pt-2">
                                <span className="text-gray-600 text-xl">최종 결제 금액</span>
                                <span className="font-extrabold text-2xl text-red-600">{formatNumber(orderInfo.finalTotal)}원</span>
                            </div>

                            {/* 배송 정보 요약 */}
                            <div className="mt-6 border-t pt-4">
                                <h3 className="text-xl font-medium mb-2">배송 정보</h3>
                                <p>수령인: {orderInfo.orderDetails.shippingInfo.receiverName}</p>
                                <p>연락처: {orderInfo.orderDetails.shippingInfo.phone}</p>
                                <p>주소: {orderInfo.orderDetails.shippingInfo.address}</p>
                            </div>
                            
                            {/* 결제 수단 요약 */}
                            <div className="mt-4 border-t pt-4">
                                <h3 className="text-xl font-medium mb-2">결제 수단</h3>
                                <p>{orderInfo.orderDetails.paymentMethod === 'card' ? '신용카드/체크카드' : orderInfo.orderDetails.paymentMethod}</p>
                            </div>

                            {/* 상품 정보 리스트 (선택 사항) */}
                            <div className="mt-4 border-t pt-4">
                                <h3 className="text-xl font-medium mb-2">주문 상품</h3>
                                {orderInfo.orderDetails.items.map((item: any, index: number) => (
                                    <p key={index} className="text-sm text-gray-700">
                                        {item.name} ({item.option}) x {item.quantity}개 - {formatNumber(item.price * item.quantity)}원
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex justify-center space-x-4">
                        <button 
                            onClick={() => navigate('/my-orders')}
                            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
                        >
                            나의 주문 내역 보기
                        </button>
                        <button 
                            onClick={() => navigate('/')}
                            className="px-8 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition duration-200"
                        >
                            메인 페이지로 돌아가기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderCompletePage;