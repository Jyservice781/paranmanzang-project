import Cookies from 'js-cookie';

export const getAccessToken = () => Cookies.get('accessToken')
export const setAccessToken = (token: string) => Cookies.set('accessToken', token, { secure: true, sameSite: 'Lax' })

export const getNickname = () => Cookies.get('nickname')
export const getAuthorization = () => Cookies.get('Authorization')
export const getRefreshToken = () => Cookies.get('refreshToken')

export const removeAccessToken = () => Cookies.remove('accessToken')
export const removeNickname = () => Cookies.remove('nickname',{path:'/',domain: 'paranmanzang.com'})
export const removeAuthorization = () => Cookies.remove('Authorization',{path:'/',domain: 'paranmanzang.com'})
export const removeRefreshToken = () => Cookies.remove('refreshToken')

export const setRefreshToken = (token: string) => Cookies.set('refreshToken', token, { secure: true, sameSite: 'Lax' })