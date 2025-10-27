const express = require('express');
const session = require('express-session');
const cors = require('cors');
// const app = express();
// const PORT = 4000; // ⭐️ Vercel에서는 이 상수가 필요 없습니다.


// ⭐️ CORS 미들웨어 추가 (가장 먼저 위치하는 것이 좋습니다.)
app.use(cors({
    // ⭐️ 1. Vercel 배포를 위해 프론트엔드 주소를 배열에 추가했습니다.
    origin: ['http://localhost:3000', 'https://kind112700-ship-it.github.io'], 
    credentials: true, // 세션(쿠키) 전송 허용
}));

// 미들웨어 설정
app.use(express.json()); 
app.use(session({
    secret: 'my_strong_secret_key_for_shoppingmall', 
    resave: false, 
    saveUninitialized: true, 
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

const express = require('express');
const app = express();
// ... (다른 미들웨어 설정)

// ⭐️ 디버깅용 임시 라우트 추가
app.post('/api/test-order', (req, res) => {
    console.log("디버깅용 POST 요청 수신 완료!");
    res.status(200).json({ success: true, message: "테스트 통과" });
});

// ----------------------------------------------------
// ⭐️ 0. 이미지 경로 상수 (ProductDetailPage와 동일하게 가정)
// ----------------------------------------------------
const productImg1 = 'img/product/1.jpg';
const productImg2 = 'img/product/2.jpg';
const productImg3 = 'img/product/3.jpg';
const productImg4 = 'img/product/4.jpg';
const productImg5 = 'img/product/5.jpg';
const productImg6 = 'img/product/6.jpg';
const productImg7 = 'img/product/7.jpg';
const productImg8 = 'img/product/8.jpg';
const SUB_IMAGE_PLACEHOLDER = 'https://via.placeholder.com/150';

// ----------------------------------------------------
// ⭐️ 1. ProductDetailPage 목업 데이터를 서버 초기 데이터로 변환
// ----------------------------------------------------
const initialProducts = [
    { 
        id: '1', name: "파스텔 니트", price: 39000, 
        img: productImg1, subImages: [productImg2, productImg3, SUB_IMAGE_PLACEHOLDER], 
        description: "부드러운 파스텔톤으로 제작된 고급 니트입니다. 봄/가을에 착용하기 좋습니다.", 
        options: { size: ["S", "M", "L", "XL"], color: [{ name: "아이보리", hex: "#f8f0e3" }, { name: "민트", hex: "#a8c0bf" }, { name: "핑크", hex: "#f0b8c6" }] },
        stock: 120, status: '판매 중' 
    },
    { 
        id: '2', name: "세련된 셔츠", price: 54000, 
        img: productImg2, subImages: [productImg3, productImg4],
        description: "고급스러운 소재와 세련된 디자인으로 오피스룩에 완벽합니다. 주름이 잘 가지 않습니다.", 
        options: { size: ["S", "M", "L"], color: [{ name: "화이트", hex: "#FFFFFF" }, { name: "블루", hex: "#6082B6" }, { name: "네이비", hex: "#000080" }] },
        stock: 45, status: '판매 중'
    },
    { 
        id: '3', name: "기본 티셔츠", price: 22000, 
        img: productImg3, subImages: [productImg4, productImg5],
        description: "데일리룩의 필수템, 100% 코튼 소재의 베이직 티셔츠입니다. 여러 색상을 소장해보세요.", 
        options: { size: ["Free"], color: [{ name: "화이트", hex: "#FFFFFF" }, { name: "블랙", hex: "#000000" }, { name: "그레이", hex: "#808080" }] },
        stock: 5, status: '재고 부족'
    },
    { 
        id: '4', name: "트렌치 코트", price: 99000, 
        img: productImg4, subImages: [productImg5, productImg6, productImg7],
        description: "클래식한 디자인의 가을 트렌치 코트입니다. 방수 처리되어 실용적입니다.", 
        options: { size: ["M", "L"], color: [{ name: "베이지", hex: "#F5F5DC" }, { name: "카키", hex: "#8FBC8F" }] },
        stock: 70, status: '판매 중'
    },
    { 
        id: '5', name: "플리츠 스커트", price: 45000, 
        img: productImg5, subImages: [productImg6],
        description: "활동성이 좋은 플리츠 디테일의 미디 스커트입니다. 캐주얼/포멀 모두 가능합니다.", 
        options: { size: ["S", "M"], color: [{ name: "블랙", hex: "#000000" }, { name: "차콜", hex: "#36454F" }] },
        stock: 30, status: '판매 중'
    },
    { 
        id: '6', name: "도트 원피스", price: 68000, 
        img: productImg6, subImages: [productImg7, productImg8],
        description: "발랄한 도트 패턴이 돋보이는 롱 원피스입니다. 허리 라인이 강조되어 날씬해 보입니다.", 
        options: { size: ["Free"], color: [{ name: "블랙도트", hex: "#000000" }, { name: "네이비도트", hex: "#000080" }] },
        stock: 90, status: '판매 중'
    },
    { 
        id: '7', name: "데님 팬츠", price: 49000, 
        img: productImg7, subImages: [productImg1, productImg2],
        description: "레귤러 핏의 편안한 데님 팬츠입니다. 사계절 활용 가능하며 튼튼한 원단입니다.", 
        options: { size: ["26", "28", "30", "32"], color: [{ name: "중청", hex: "#5D8AA8" }, { name: "진청", hex: "#1560BD" }] },
        stock: 15, status: '판매 중'
    },
    { 
        id: '8', name: "루즈핏 가디건", price: 63000, 
        img: productImg8, subImages: [productImg3, productImg4],
        description: "부드러운 촉감의 루즈핏 가디건입니다. 간절기에 가볍게 걸치기 좋습니다.", 
        options: { size: ["Free"], color: [{ name: "아이보리", hex: "#f8f0e3" }, { name: "베이지", hex: "#F5F5DC" }, { name: "브라운", hex: "#A52A2A" }] },
        stock: 80, status: '판매 중'
    },
];

// ⭐️ 서버 시작 시 초기 상품/주문/장바구니 데이터 설정
app.use((req, res, next) => {
    // Express 세션이 req.session에 접근 가능한지 확인 후 초기 데이터 설정
    if (req.session) {
        if (!req.session.products) {
            req.session.products = initialProducts;
        }
        if (!req.session.orders) {
            req.session.orders = [
                { orderId: 'ORD-20251026-001', items: [{ name: '파스텔 니트', quantity: 1, price: 39000 }], finalTotal: 42000, date: new Date('2025-10-26').toISOString(), status: '배송 완료' },
                { orderId: 'ORD-20251027-002', items: [{ name: '데님 팬츠', quantity: 2, price: 49000 }], finalTotal: 101000, date: new Date('2025-10-27').toISOString(), status: '결제 완료' },
            ];
        }
        if (!req.session.cart) {
            req.session.cart = [];
        }
    }
    next();
});

// ----------------------------------------------------
// ⭐️ 2. 기본 경로 라우트
// ----------------------------------------------------
app.get('/', (req, res) => {
    res.send('Shopping Mall API Server is running successfully!');
});


// ====================================================
// 🌟 관리자 페이지 API (AdminProducts.tsx 연결용) 🌟
// ====================================================

// ⭐️ 2-1. 상품 목록 조회 API (AdminProducts.tsx 연결용)
app.get('/api/admin/products', (req, res) => {
    res.json({ success: true, products: req.session.products });
});

// 🟢 2-2. 상품 상세 정보 조회 API (AdminProductEdit.tsx 연결용)
app.get('/api/admin/products/:id', (req, res) => {
    const productId = req.params.id;
    const product = req.session.products.find(p => p.id === productId);

    if (product) {
        res.json({ success: true, product: product });
    } else {
        res.status(404).json({ success: false, message: '요청하신 상품 ID를 찾을 수 없습니다.' });
    }
});


// ⭐️ 2-3. 상품 추가 API 
app.post('/api/admin/products', (req, res) => {
    const { name, price, stock, status = '판매 중', description, options, category, img, subImages } = req.body;
    
    if (!name || !price || stock === undefined) {
        return res.status(400).json({ success: false, message: '필수 정보(이름, 가격, 재고)를 입력해주세요.' });
    }

    const currentMaxId = req.session.products.reduce((max, p) => Math.max(max, parseInt(p.id)), 0);
    const newId = (currentMaxId + 1).toString();
    
    const newProduct = { 
        id: newId, 
        name, 
        price: parseInt(price), 
        stock: parseInt(stock), 
        status,
        description: description || '상세 설명이 없습니다.',
        options: options || { size: [], color: [] },
        category: category || '기타',
        img: img || SUB_IMAGE_PLACEHOLDER,
        subImages: subImages || [],
    };

    req.session.products.push(newProduct);
    res.json({ success: true, message: '새 상품이 등록되었습니다.', product: newProduct });
});

// ⭐️ 2-4. 상품 수정 API 
app.put('/api/admin/products/:id', (req, res) => {
    const productId = req.params.id;
    const updates = req.body;

    const productIndex = req.session.products.findIndex(p => p.id === productId);

    if (productIndex > -1) {
        req.session.products[productIndex] = { 
            ...req.session.products[productIndex], 
            ...updates,
            price: updates.price !== undefined ? parseInt(updates.price) : req.session.products[productIndex].price,
            stock: updates.stock !== undefined ? parseInt(updates.stock) : req.session.products[productIndex].stock,
        };
        res.json({ success: true, message: `${productId}번 상품이 수정되었습니다.`, product: req.session.products[productIndex] });
    } else {
        res.status(404).json({ success: false, message: '수정할 상품을 찾을 수 없습니다.' });
    }
});

// ⭐️ 2-5. 상품 삭제 API 
app.delete('/api/admin/products/:id', (req, res) => {
    const productId = req.params.id;

    const initialLength = req.session.products.length;
    req.session.products = req.session.products.filter(p => p.id !== productId);
    
    if (req.session.products.length < initialLength) {
        res.json({ success: true, message: `${productId}번 상품이 삭제되었습니다.` });
    } else {
        res.status(404).json({ success: false, message: '삭제할 상품을 찾을 수 없습니다.' });
    }
});

// ====================================================
// 🌟 쇼핑몰 사용자 API 🌟
// ====================================================

// ⭐️ 3-1. 상품 상세 정보 조회 API (전체 상세 정보를 반환)
app.get('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    const product = req.session.products.find(p => p.id === productId);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: '상품 ID를 찾을 수 없습니다.' });
    }
});

// ⭐️ 3-2. 장바구니에 상품 추가 API
app.post('/api/cart/add', (req, res) => {
    const { productId, name, price, option, quantity = 1 } = req.body;

    const cart = req.session.cart;

    const existingItemIndex = cart.findIndex(item => 
        item.productId === productId && item.option === option
    );

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
        res.json({ success: true, message: `${name} 상품의 수량이 ${quantity}개 업데이트되었습니다.` });
    } else {
        const newItem = { productId, name, price, option, quantity };
        cart.push(newItem);
        res.json({ success: true, message: `${name}이(가) 장바구니에 담겼습니다.` });
    }
});


// ⭐️ 3-3. 장바구니 조회 API
app.get('/api/cart', (req, res) => {
    const cart = req.session.cart || [];
    res.json({ success: true, cart: cart });
});

// ⭐️ 3-4. 장바구니 수량 변경 API
app.post('/api/cart/update', (req, res) => {
    const { productId, option, quantity } = req.body;
    const cart = req.session.cart || [];

    const itemIndex = cart.findIndex(item => 
        item.productId === productId && item.option === option
    );

    if (itemIndex > -1) {
        cart[itemIndex].quantity = Math.max(1, quantity); 
        req.session.cart = cart;
        res.json({ success: true, message: '수량이 변경되었습니다.' });
    } else {
        res.status(404).json({ success: false, message: '장바구니 항목을 찾을 수 없습니다.' });
    }
});

// ⭐️ 3-5. 장바구니 상품 삭제 API
app.post('/api/cart/remove', (req, res) => {
    const { productId, option } = req.body;
    const cart = req.session.cart || [];

    const newCart = cart.filter(item => 
        !(item.productId === productId && item.option === option)
    );
    
    if (newCart.length < cart.length) {
        req.session.cart = newCart;
        res.json({ success: true, message: '상품이 장바구니에서 삭제되었습니다.' });
    } else {
        res.status(404).json({ success: false, message: '삭제할 장바구니 항목을 찾을 수 없습니다.' });
    }
});

// ⭐️ 3-6. 주문 처리 API
app.post('/api/order', (req, res) => {
    const { items, shippingInfo, paymentMethod, finalTotal } = req.body;

    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newOrder = { 
        orderId, 
        items, 
        shippingInfo, 
        paymentMethod, 
        finalTotal,
        date: new Date().toISOString(),
        status: '결제 완료',
    };
    req.session.orders.push(newOrder);

    req.session.cart = []; 

    res.json({ 
        success: true, 
        message: '주문이 성공적으로 완료되었습니다.', 
        orderId: orderId,
        orderTotal: finalTotal 
    });
});

// ⭐️ 3-7. 주문 내역 조회 API
app.get('/api/orders', (req, res) => {
    const orders = req.session.orders || [];
    
    orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    res.json({ 
        success: true, 
        orders: orders,
        totalCount: orders.length
    });
});

// ⭐️ 3-8. 주문 상세 정보 조회 API 
app.get('/api/orders/:orderId', (req, res) => {
    const { orderId } = req.params;
    
    const orderDetail = req.session.orders.find(o => o.orderId === orderId);

    if (orderDetail) {
        const orderToSend = {
            ...orderDetail,
            shippingFee: orderDetail.shippingFee !== undefined ? orderDetail.shippingFee : 3000,
            totalProductsPrice: orderDetail.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            shippingInfo: orderDetail.shippingInfo || {
                receiverName: "홍길동",
                address: "서울시 어딘가",
                phone: "010-0000-0000",
                request: "부재 시 문 앞",
            },
            paymentMethod: orderDetail.paymentMethod || '카드결제',
        };
        
        res.json({
            success: true,
            message: "주문 상세 정보를 성공적으로 불러왔습니다.",
            order: orderToSend
        });
    } else {
        res.status(404).json({
            success: false,
            message: `주문 번호 ${orderId}를 찾을 수 없습니다.`
        });
    }
});

// ⭐️ 3-9. 주문 취소 요청 API
app.post('/api/orders/:orderId/cancel', (req, res) => {
    const { orderId } = req.params;
    
    const orderIndex = req.session.orders.findIndex(o => o.orderId === orderId);

    if (orderIndex > -1) {
        const order = req.session.orders[orderIndex];

        if (order.status === '주문 취소' || order.status === '배송 중' || order.status === '배송 완료') {
            return res.status(400).json({ 
                success: false, 
                message: `주문 번호 ${orderId}는 현재 상태(${order.status})에서는 취소할 수 없습니다.` 
            });
        }
        
        req.session.orders[orderIndex].status = '주문 취소';
        
        return res.json({
            success: true,
            message: `주문 번호 ${orderId}의 취소 요청이 완료되었습니다.`,
            order: req.session.orders[orderIndex]
        });
    } else {
        res.status(404).json({
            success: false,
            message: `취소할 주문 번호 ${orderId}를 찾을 수 없습니다.`
        });
    }
});

// ⭐️ Vercel 배포를 위한 핵심 수정: Express 앱 객체를 내보냅니다.
// Vercel은 이 객체를 가져가서 서버리스 환경에서 실행합니다.
module.exports = app;

// ⭐️ 기존의 로컬 서버 시작 코드는 반드시 제거하거나 주석 처리해야 합니다.
/*
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
*/