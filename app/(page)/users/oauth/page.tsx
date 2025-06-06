"use client"

import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/store';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/common/status/LoadingSpinner';

const OauthCallback = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    // 컴포넌트가 로드될 때 handleOAuthCallback 자동 실행
    useEffect(() => {
        const executeOAuthCallback = () => {
            try {
                console.log("OAuth 콜백 실행 중...")
                router.push("/users/oauth/success")
            } catch (error) {
                console.error("OAuth 처리 중 오류:", error)
                router.push("/users/login") // 오류 발생 시 로그인 페이지로 이동
            }
        }
        executeOAuthCallback() // useEffect 내부에서 함수 호출
    }, [dispatch, router])

    return <LoadingSpinner />
}

export default OauthCallback;