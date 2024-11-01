"use client"
import LoadingSpinner from "@/app/components/common/status/LoadingSpinner";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OAuthSuccess() {
  const route = useRouter()
  useEffect(() => {
   try{
    route.push("/")
   }catch(error){
    console.error("OAuth 처리 중 오류:", error)
   }
  })
  return (
    <>
      OAuthSuccess !!
      <LoadingSpinner />
    </>
  )
}
