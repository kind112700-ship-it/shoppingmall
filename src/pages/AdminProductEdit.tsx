// src/pages/AdminProductEdit.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';

// -----------------------------------------------------------
// 1. 상품 상세 정보 타입 정의
// -----------------------------------------------------------
interface ProductDetailType {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    status: '판매 중' | '재고 부족' | '품절' | '단종';
    // 이미지 URL이나 옵션 등 추가 필드를 여기에 정의할 수 있습니다.
}

// 초기 폼 상태 (API 로드 전/실패 시 사용)
const initialProductState: ProductDetailType = {
    id: '',
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    status: '판매 중',
};

// -----------------------------------------------------------
// 2. 상품 수정 컴포넌트
// -----------------------------------------------------------
const AdminProductEdit: React.FC = () => {
    // URL에서 상품 ID를 가져옵니다.
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    // 폼 데이터와 UI 상태 관리
    const [product, setProduct] = useState<ProductDetailType>(initialProductState);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    // 카테고리 옵션 (실제로는 API로 로드할 수 있습니다)
    const categoryOptions = ['의류', '잡화', '전자제품', '식품', '기타'];

    // -----------------------------------------------------------
    // 3. 상품 상세 정보 로드 (Mount 시점)
    // -----------------------------------------------------------
    useEffect(() => {
        const fetchProductDetail = async () => {
            if (!id) {
                setError('상품 ID가 유효하지 않습니다.');
                setLoading(false);
                return;
            }
            
          try {
                // 🟢 수정된 부분: 서버 포트 4000을 명시합니다.
                const SERVER_URL = 'http://localhost:4000';
                const response = await fetch(`${SERVER_URL}/api/admin/products/${id}`);
                if (!response.ok) {
                    throw new Error('상품 상세 정보를 불러오는 데 실패했습니다. (404)');
                }
                const data = await response.json();
                
                // 로드된 데이터를 폼 상태에 설정
                setProduct(data.product || initialProductState);
                setError('');
            } catch (err) {
                console.error("상품 로드 오류:", err);
                setError(`상품 정보를 불러오지 못했습니다: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetail();
    }, [id]);

    // -----------------------------------------------------------
    // 4. 폼 입력값 변경 핸들러
    // -----------------------------------------------------------
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        setProduct(prev => ({
            ...prev,
            // 'number' 타입 입력 필드는 숫자로 변환, 나머지는 그대로
            [name]: type === 'number' ? Number(value) : value,
        }));
    };


    // -----------------------------------------------------------
    // 5. 폼 제출 (수정) 처리 (PUT API 호출)
    // -----------------------------------------------------------
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product || isSaving) return;

        setIsSaving(true);
        setError('');
        const SERVER_URL = 'http://localhost:4000';
        try {
           // PUT /api/admin/products/:id 호출
            const response = await fetch(`${SERVER_URL}/api/admin/products/${product.id}`, { // 🟢 수정된 부분
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '상품 수정에 실패했습니다.');
            }

            alert(`[${product.name}] 상품이 성공적으로 수정되었습니다.`);
            // 수정 완료 후 상품 목록 페이지로 복귀
            navigate('/admin/products'); 

        } catch (err) {
            console.error('상품 수정 오류:', err);
            setError(`수정 중 오류가 발생했습니다: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
            setIsSaving(false);

        }
    };


    // -----------------------------------------------------------
    // 6. 렌더링: 로딩, 오류, 폼
    // -----------------------------------------------------------
    
    if (loading) {
        return (
            <div className="admin-wrapper">
                <AdminSidebar />
                <div className="admin-main-content">
                    <header className="admin-topbar"><h1>상품 수정</h1></header>
                    <main className="admin-page-content">
                        <p className="loading-text">상품 정보를 불러오는 중입니다...</p>
                    </main>
                </div>
            </div>
        );
    }

    if (error || !product.id) {
        return (
            <div className="admin-wrapper">
                <AdminSidebar />
                <div className="admin-main-content">
                    <header className="admin-topbar"><h1>상품 수정</h1></header>
                    <main className="admin-page-content">
                        <div className="widget">
                            <p className="error-text" style={{ color: '#e74c3c', fontWeight: 'bold' }}>
                                상품 로드 실패: {error || '유효하지 않은 상품 ID입니다.'}
                            </p>
                            <button className="btn btn-secondary" onClick={() => navigate('/admin/products')}>
                                목록으로 돌아가기
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        );
    }
    
    // 폼 렌더링
    return (
        <div className="admin-wrapper">
            <AdminSidebar />
            <div className="admin-main-content">
                <header className="admin-topbar">
                    <h1>상품 수정: {product.name} (ID: {product.id})</h1>
                    <div className="topbar-right">
                        <button 
                            className="btn btn-primary"
                            type="submit" 
                            form="product-edit-form"
                            disabled={isSaving}
                        >
                            {isSaving ? '저장 중...' : '수정 완료'}
                        </button>
                    </div>
                </header>
                
                <main className="admin-page-content">
                    {/* 오류 메시지 표시 */}
                    {error && (
                        <div style={{ padding: '15px', backgroundColor: '#fbe2e2', color: '#c0392b', borderRadius: '4px', marginBottom: '20px' }}>
                            {error}
                        </div>
                    )}

                    <div className="settings-layout"> {/* settings-layout 클래스를 재활용하여 폼 중앙 정렬 */}
                        <form id="product-edit-form" onSubmit={handleSubmit}>
                            <div className="setting-section">
                                <h4>기본 정보</h4>
                                <div className="setting-input-group">
                                    <label>
                                        상품명
                                        <input 
                                            type="text" 
                                            name="name"
                                            value={product.name}
                                            onChange={handleChange}
                                            required 
                                        />
                                    </label>
                                    <label>
                                        카테고리
                                        <select
                                            name="category"
                                            value={product.category}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="" disabled>카테고리 선택</option>
                                            {categoryOptions.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </label>
                                    <label>
                                        가격 (원)
                                        <input 
                                            type="number" 
                                            name="price"
                                            value={product.price}
                                            onChange={handleChange}
                                            min="0"
                                            required 
                                            className="policy-input"
                                        />
                                    </label>
                                    <label>
                                        재고 수량
                                        <input 
                                            type="number" 
                                            name="stock"
                                            value={product.stock}
                                            onChange={handleChange}
                                            min="0"
                                            required 
                                            className="policy-input"
                                        />
                                    </label>
                                </div>
                            </div>
                            
                            <div className="setting-section">
                                <h4>상세 정보 및 상태</h4>
                                <div className="setting-input-group">
                                    <label>
                                        상품 설명
                                        <textarea
                                            name="description"
                                            value={product.description}
                                            onChange={handleChange}
                                            rows={5}
                                        />
                                    </label>
                                    <label>
                                        판매 상태
                                        <select
                                            name="status"
                                            value={product.status}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="판매 중">판매 중</option>
                                            <option value="재고 부족">재고 부족</option>
                                            <option value="품절">품절</option>
                                            <option value="단종">단종</option>
                                        </select>
                                    </label>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={() => navigate('/admin/products')}
                                >
                                    취소 및 목록
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={isSaving}
                                >
                                    {isSaving ? '저장 중...' : '변경 사항 저장'}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdminProductEdit;