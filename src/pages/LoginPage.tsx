import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';



const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        
        // 로그인 로직 처리 (/admin 경로로 이동 가정)
        if (username && password) {
            console.log('Login Attempt:', { username, password, remember });
            // 성공 시, 관리자 페이지로 리다이렉션
            console.log("로그인 성공! 관리자 페이지로 이동합니다.");
            navigate('/admin'); 
        } else {
            console.error('아이디와 비밀번호를 모두 입력해주세요.');
        }
    };

    return (
        // JSX에서는 HTML 클래스 대신 className을 사용합니다.
        <div className="login-container"> 
            <div className="login-box"> 
                
                <h1 className="logo-title">Pastel Shop</h1>
                <p className="subtitle">관리자 / 회원 로그인</p>

                <form onSubmit={handleLogin} className="login-form">
                    
                    {/* 아이디 입력 그룹 */}
                    <div className="input-group">
                        <label htmlFor="username">
                            {/* Font Awesome 아이콘은 className으로 처리 */}
                            <i className="fas fa-user"></i> 아이디
                        </label>
                        <input 
                            type="text" 
                            id="username" 
                            name="username" 
                            placeholder="아이디를 입력하세요" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required 
                        />
                    </div>

                    {/* 비밀번호 입력 그룹 */}
                    <div className="input-group">
                        <label htmlFor="password">
                            <i className="fas fa-lock"></i> 비밀번호
                        </label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            placeholder="비밀번호를 입력하세요" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>

                    {/* 옵션 그룹 */}
                    <div className="options-group">
                        <label>
                            <input 
                                type="checkbox" 
                                name="remember" 
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                            /> 아이디 저장
                        </label>
                        {/* React Router Link 대신 일반 a 태그 사용 (현재 라우팅 경로에 맞게 변경) */}
                        <a href="/find-password" className="find-link">아이디/비밀번호 찾기</a>
                    </div>

                    <button type="submit" className="login-btn">로그인</button>
                </form>

                {/* 추가 링크 */}
                <div className="extra-links">
                    <a href="/register">회원가입</a> | 
                    <a href="/">메인으로 돌아가기</a>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
