"use client"
import LoadingSpinner from "@/app/components/common/status/LoadingSpinner";
import { useEffect } from "react";
import { loginService } from "@/app/service/user/login.service";
import { useAppDispatch } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function OAuthSuccess() {
  const route = useRouter()
  const dispatch = useAppDispatch()
  useEffect(() => {
    const routeBack = () => {
      try{
        loginService.handleOAuthCallback(dispatch)  // OAuth 콜백 처리
        
        console.log("oauth success 도착 완료")
        route.push("/")
         
      }catch(error){
       console.error("OAuth 처리 중 오류:", error)
      }
    }
    routeBack()
  })
  return (
    <>
      OAuthSuccess !!
      <LoadingSpinner />
    </>
  )
}
