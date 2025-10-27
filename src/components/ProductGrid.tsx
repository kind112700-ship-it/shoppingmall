// src/components/ProductGrid.tsx

import React from 'react';
import ProductCard from './ProductCard'; 
import { ProductGridProps } from '../types';

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
    return (
        <div className="product-grid">
            {/* 전달받은 상품 목록을 순회하며 ProductCard 컴포넌트를 렌더링 */}
            {products.map((product) => (
                <ProductCard 
                    key={product.id} 
                    product={product} 
                />
            ))}
        </div>
    );
}

export default ProductGrid;
export {};