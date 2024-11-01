"use client"

import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/store';
import { loginService } from '@/app/service/user/login.service';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/app/components/common/status/LoadingSpinner';

const OauthCallback = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    // 컴포넌트가 로드될 때 handleOAuthCallback 자동 실행
    useEffect(() => {
        const executeOAuthCallback = () => {
            loginService.handleOAuthCallback(dispatch) // OAuth 콜백 처리
            router.push("/") // 오류 발생 시 로그인 페이지로 이동
        }
        executeOAuthCallback() // useEffect 내부에서 함수 호출
    }, [dispatch, router])

    return <LoadingSpinner />
}

export default OauthCallback;