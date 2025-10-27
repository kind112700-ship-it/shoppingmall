// src/utils/cart.ts

import { CartItemType } from '../types'; // CartItemType 인터페이스를 외부에서 가져와야 합니다.

const CART_STORAGE_KEY = 'shoppingCart';

/**
 * Local Storage에서 장바구니 목록을 가져옵니다.
 * @returns CartItemType 배열
 */
export const getCartItems = (): CartItemType[] => { 
    try {
        const cartData = localStorage.getItem(CART_STORAGE_KEY);
        // JSON 파싱 에러를 방지하고, 데이터가 없거나 유효하지 않으면 빈 배열을 반환합니다.
        return cartData ? (JSON.parse(cartData) as CartItemType[]) : [];
    } catch (error) {
        console.error("Local Storage에서 장바구니를 읽는 데 실패했습니다.", error);
        return [];
    }
};

/**
 * 현재 장바구니 목록을 Local Storage에 저장합니다.
 * @param items 저장할 CartItemType 배열
 */
export const saveCartItems = (items: CartItemType[]) => { 
    try {
        // 배열을 JSON 문자열로 변환하여 저장합니다.
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
        console.error("Local Storage에 장바구니를 저장하는 데 실패했습니다.", error);
    }
};