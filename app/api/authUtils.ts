import Cookies from 'js-cookie';

// 쿠키 기본 설정
const cookieOptions = {
    secure: true,  // HTTPS에서만 쿠키 전송
    sameSite: 'strict' as const,
    path: '/',  // 모든 경로에서 쿠키 접근 가능
    domain: 'paranmanzang.com',  // 도메인 설정
    expires: 1 // 1일간 쿠키 유지
};

// Access Token 관련
export const getAccessToken = () => Cookies.get('accessToken');
export const setAccessToken = (token: string) => {
    Cookies.set('accessToken', token, {
        ...cookieOptions,
        expires: 1  // Access Token은 1일
    });
};
export const removeAccessToken = () => {
    Cookies.remove('accessToken', {
        path: '/',
        domain: 'paranmanzang.com'
    });
};

// Refresh Token 관련
export const getRefreshToken = () => Cookies.get('refreshToken');
export const setRefreshToken = (token: string) => {
    Cookies.set('refreshToken', token, {
        ...cookieOptions,
        expires: 1,
    });
};
export const removeRefreshToken = () => {
    Cookies.remove('refreshToken', {
        path: '/',
        domain: 'paranmanzang.com'
    });
};

// Nickname 관련
export const getNickname = () => Cookies.get('nickname');
export const removeNickname = () => {
    Cookies.remove('nickname', {
        path: '/',
        domain: 'paranmanzang.com'
    });
};

// Authorization 관련
export const getAuthorization = () => Cookies.get('Authorization');
export const removeAuthorization = () => {
    Cookies.remove('Authorization', {
        path: '/',
        domain: 'paranmanzang.com'
    });
};