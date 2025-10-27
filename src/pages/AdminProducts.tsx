// src/pages/AdminProducts.tsx

import React, { useState, useEffect, useMemo } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import { useNavigate } from 'react-router-dom';

// -----------------------------------------------------------
// 1. 상품 관리 목록에 필요한 타입 정의 (서버 데이터와 일치)
// -----------------------------------------------------------
interface AdminProductType {
    id: string; // 서버에서 문자열로 관리
    name: string;
    price: number; // 서버에서 숫자로 관리
    stock: number;
    status: '판매 중' | '재고 부족' | '품절' | '단종';
    // 기타 상세 정보 필드 (예: img, description, options)는 목록에서 사용하지 않으므로 생략 가능
}

const AdminProducts: React.FC = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<AdminProductType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // -----------------------------------------------------------
    // 2. 상품 목록 로드 (GET API 호출)
    // -----------------------------------------------------------
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/products');
            if (!response.ok) {
                throw new Error('상품 목록을 불러오는 데 실패했습니다.');
            }
            const data = await response.json();
            setProducts(data.products || []);
        } catch (error) {
            console.error('상품 목록 로드 오류:', error);
            alert('상품 목록을 불러오지 못했습니다. 서버 상태를 확인하세요.');
            setProducts([]); // 실패 시 빈 배열로 설정
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // -----------------------------------------------------------
    // 3. 상품 삭제 처리 (DELETE API 호출)
    // -----------------------------------------------------------
    const handleDelete = async (productId: string, productName: string) => {
        if (!window.confirm(`[${productName}] 상품을 정말로 삭제하시겠습니까?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/products/${productId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '상품 삭제에 실패했습니다.');
            }

            alert(`[${productName}] 상품이 성공적으로 삭제되었습니다.`);
            // 삭제 성공 후 목록을 새로고침
            fetchProducts();

        } catch (error) {
            console.error('상품 삭제 오류:', error);
            alert(`삭제 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
        }
    };
    
    // -----------------------------------------------------------
    // 4. 상품 검색 및 필터링
    // -----------------------------------------------------------
    const filteredProducts = useMemo(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        
        if (!lowerCaseSearchTerm) {
            return products;
        }

        return products.filter(product => 
            product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            product.id.includes(lowerCaseSearchTerm)
        );
    }, [products, searchTerm]);

    // 상태에 따라 표시할 CSS 클래스 반환
    const getStatusClass = (status: AdminProductType['status']) => {
        switch (status) {
            case '판매 중':
                return 'status active';
            case '재고 부족':
                return 'status warning';
            case '품절':
                return 'status danger';
            default:
                return 'status inactive';
        }
    };

    if (loading) {
        return (
            <div className="admin-wrapper">
                <AdminSidebar />
                <div className="admin-main-content">
                    {/* 상단바는 로딩 중에도 표시하는 것이 자연스러움 */}
                    <header className="admin-topbar">
                        <h1>상품 관리</h1>
                    </header>
                    <main className="admin-page-content">
                        <p className="loading-text">상품 데이터를 불러오는 중...</p>
                    </main>
                </div>
            </div>
        );
    }


    return (
        <div className="admin-wrapper">
            <AdminSidebar />
            <div className="admin-main-content">
                <header className="admin-topbar">
                    <div className="topbar-left">
                        <h1>상품 관리</h1>
                    </div>
                    <div className="topbar-right">
                        <button 
                            className="btn btn-primary"
                            onClick={() => navigate('/admin/products/add')}
                        >
                            상품 추가
                        </button>
                    </div>
                </header>
                
                <main className="admin-page-content">
                    {/* 상품 검색 및 필터링 영역 */}
                    <div className="product-search-bar">
                        <input 
                            type="text" 
                            placeholder="상품 이름 또는 코드로 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="btn btn-secondary" onClick={() => fetchProducts()}>전체 목록 새로고침</button>
                    </div>

                    {/* 상품 목록 테이블 */}
                    {/* ⭐️ 테이블 가로 스크롤을 위해 widget-container 클래스로 감쌉니다. */}
                    <div className="widget full-width-table widget-container"> 
                        <h3>상품 목록 (총 {filteredProducts.length}개)</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>상품명</th>
                                    <th>재고</th>
                                    <th>가격</th>
                                    <th>상태</th>
                                    <th>액션</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center' }}>
                                            검색 결과가 없거나 등록된 상품이 없습니다.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map(product => (
                                        <tr key={product.id}>
                                            <td>{product.id}</td>
                                            <td>{product.name}</td>
                                            <td>{product.stock.toLocaleString()}개</td>
                                            <td>{product.price.toLocaleString('ko-KR')}원</td>
                                            <td>
                                                <span className={getStatusClass(product.status)}>
                                                    {product.status}
                                                </span>
                                            </td>
                                            <td className="admin-actions">
                                                <button 
                                                    className="btn btn-sm btn-secondary"
                                                    onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                                                >
                                                    수정
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDelete(product.id, product.name)}
                                                >
                                                    삭제
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdminProducts;

// ⭐️ TS1208 에러 방지를 위해 export {} 구문을 추가합니다.
export {};