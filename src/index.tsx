// src/index.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router-dom';

// const basename = "/shoppingmall"; // HashRouter 사용 시 basename은 필요 없습니다.

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    {/* ⭐️ HashRouter 사용 */}
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);