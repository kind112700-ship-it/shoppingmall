// src/pages/AdminProductAdd.tsx

import React, { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import { useNavigate } from 'react-router-dom';


// -----------------------------------------------------------
// 1. 초기 폼 데이터 구조 (서버가 요구하는 필수 필드 + 옵션 구조)
// -----------------------------------------------------------
interface ProductFormData {
    name: string;
    price: string; // 입력은 문자열로 받습니다.
    stock: string; // 입력은 문자열로 받습니다.
    status: '판매 중' | '재고 부족' | '품절' | '단종';
    description: string;
    img: string;
    subImages: string[]; // 쉼표로 구분된 문자열을 배열로 처리할 예정
    // 옵션은 복잡하므로 단순화를 위해 일단 빈 상태로 시작합니다.
    options: {
        size: string[];
        color: { name: string; hex: string }[];
    };
}

const initialFormData: ProductFormData = {
    name: '',
    price: '',
    stock: '',
    status: '판매 중',
    description: '',
    img: 'img/product/default.jpg', // 기본 이미지 경로 설정
    subImages: [],
    options: { size: ["Free"], color: [] },
};


const AdminProductAdd: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<ProductFormData>(initialFormData);
    const [loading, setLoading] = useState(false);
    const [colorInput, setColorInput] = useState(''); // 색상 추가용 임시 입력값
    const [sizeInput, setSizeInput] = useState('');   // 사이즈 추가용 임시 입력값

    // -----------------------------------------------------------
    // 2. 입력 필드 변경 핸들러
    // -----------------------------------------------------------
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    // -----------------------------------------------------------
    // 3. 옵션 (사이즈) 관리 핸들러
    // -----------------------------------------------------------
    const handleAddSize = () => {
        const newSize = sizeInput.trim();
        if (newSize && !formData.options.size.includes(newSize)) {
            setFormData(prev => ({
                ...prev,
                options: {
                    ...prev.options,
                    size: [...prev.options.size, newSize],
                },
            }));
            setSizeInput('');
        }
    };
    const handleRemoveSize = (sizeToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            options: {
                ...prev.options,
                size: prev.options.size.filter(s => s !== sizeToRemove),
            },
        }));
    };

    // -----------------------------------------------------------
    // 4. 옵션 (색상) 관리 핸들러 (예시: '이름:#HEX' 형식)
    // -----------------------------------------------------------
    const handleAddColor = () => {
        // 예시: "블루:#0000FF" 형식으로 입력받는다고 가정
        const match = colorInput.trim().match(/^(.+?):(#([0-9a-fA-F]{3}){1,2})$/);
        
        if (match) {
            const [, name, hex] = match;
            const newColor = { name: name.trim(), hex: hex.toUpperCase() };

            if (!formData.options.color.some(c => c.name === newColor.name)) {
                setFormData(prev => ({
                    ...prev,
                    options: {
                        ...prev.options,
                        color: [...prev.options.color, newColor],
                    },
                }));
                setColorInput('');
            } else {
                alert('이미 존재하는 색상 이름입니다.');
            }
        } else {
            alert('색상 형식이 올바르지 않습니다. (예: 화이트:#FFFFFF)');
        }
    };
    const handleRemoveColor = (colorName: string) => {
        setFormData(prev => ({
            ...prev,
            options: {
                ...prev.options,
                color: prev.options.color.filter(c => c.name !== colorName),
            },
        }));
    };

    // -----------------------------------------------------------
    // 5. 상품 등록 최종 제출 (POST API 호출)
    // -----------------------------------------------------------
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // 유효성 검사
        if (!formData.name || !formData.price || !formData.stock) {
            alert('상품명, 가격, 재고는 필수 입력 항목입니다.');
            setLoading(false);
            return;
        }

        const dataToSend = {
            ...formData,
            // 가격과 재고는 숫자로 변환하여 서버로 보냅니다.
            price: Number(formData.price.replace(/[^0-9]/g, '')),
            stock: Number(formData.stock.replace(/[^0-9]/g, '')),
            // subImages는 쉼표로 구분된 문자열로 입력받았다면 배열로 변환
            subImages: formData.subImages, 
        };

        try {
            const response = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '상품 등록에 실패했습니다.');
            }

            const result = await response.json();
            alert(`[${result.product.name}] 상품이 성공적으로 등록되었습니다. (ID: ${result.product.id})`);

            // 등록 성공 후 상품 목록 페이지로 복귀
            navigate('/admin/products'); 

        } catch (error) {
            console.error('상품 등록 오류:', error);
            alert(`상품 등록 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="admin-wrapper">
            <AdminSidebar />
            <div className="admin-main-content">
                <header className="admin-topbar">
                    <div className="topbar-left">
                        <h1>상품 추가</h1>
                    </div>
                </header>
                
                <main className="admin-page-content product-add-form-container">
                    <form onSubmit={handleSubmit} className="admin-form">
                        
                        {/* 기본 정보 */}
                        <div className="form-group">
                            <label htmlFor="name">상품명 (*)</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group half-group">
                            <label htmlFor="price">가격 (원) (*)</label>
                            <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required />
                        </div>
                        <div className="form-group half-group">
                            <label htmlFor="stock">재고 수량 (개) (*)</label>
                            <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="status">판매 상태</label>
                            <select id="status" name="status" value={formData.status} onChange={handleChange}>
                                <option value="판매 중">판매 중</option>
                                <option value="재고 부족">재고 부족</option>
                                <option value="품절">품절</option>
                                <option value="단종">단종</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">상세 설명</label>
                            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={5} />
                        </div>

                        <hr/>
                        
                        {/* 이미지 정보 */}
                        <h2>이미지 정보</h2>
                        <div className="form-group">
                            <label htmlFor="img">대표 이미지 URL</label>
                            <input type="text" id="img" name="img" value={formData.img} onChange={handleChange} placeholder="예: img/product/new_item.jpg" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="subImages">추가 이미지 URL (쉼표로 구분)</label>
                            <input 
                                type="text" 
                                id="subImages" 
                                name="subImages" 
                                value={formData.subImages.join(', ')} // 배열을 문자열로 표시
                                onChange={(e) => setFormData(prev => ({ 
                                    ...prev, 
                                    subImages: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                                }))} 
                                placeholder="예: img1.jpg, img2.jpg, placeholder.png" 
                            />
                        </div>

                        <hr/>
                        
                        {/* 옵션 정보 */}
                        <h2>옵션 설정</h2>

                        {/* 사이즈 옵션 관리 */}
                        <div className="form-group">
                            <label>사이즈 옵션</label>
                            <div className="option-add-control">
                                <input type="text" placeholder="새 사이즈 (예: XL)" value={sizeInput} onChange={(e) => setSizeInput(e.target.value)} />
                                <button type="button" onClick={handleAddSize} className="btn btn-sm btn-secondary">추가</button>
                            </div>
                            <div className="option-list">
                                {formData.options.size.map(size => (
                                    <span key={size} className="option-tag">
                                        {size} 
                                        <button type="button" onClick={() => handleRemoveSize(size)}>x</button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* 색상 옵션 관리 */}
                        <div className="form-group">
                            <label>색상 옵션</label>
                            <div className="option-add-control">
                                <input type="text" placeholder="이름:#HEX (예: 레드:#FF0000)" value={colorInput} onChange={(e) => setColorInput(e.target.value)} />
                                <button type="button" onClick={handleAddColor} className="btn btn-sm btn-secondary">추가</button>
                            </div>
                            <div className="option-list">
                                {formData.options.color.map(color => (
                                    <span key={color.name} className="option-tag color-tag" style={{ borderLeft: `10px solid ${color.hex}` }}>
                                        {color.name} ({color.hex})
                                        <button type="button" onClick={() => handleRemoveColor(color.name)}>x</button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary large-btn" disabled={loading}>
                                {loading ? '등록 중...' : '상품 등록 완료'}
                            </button>
                            <button type="button" className="btn btn-secondary large-btn" onClick={() => navigate('/admin/products')} disabled={loading}>
                                취소 / 목록으로
                            </button>
                        </div>

                    </form>
                </main>
            </div>
        </div>
    );
}

export default AdminProductAdd;