"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import Alert from "@/components/common/Alert";
import { useSelector } from "react-redux";
import { getCurrentDeclarationPost } from "@/lib/features/users/declarationPost.slice";
import { declarationService } from "@/services/users/declarationPost-service";
import { useAppDispatch } from "@/lib/store";
import { userService } from "@/services/user/user-service";

export default function ShowOne() {
  const route = useRouter();
  const dispatch = useAppDispatch()
  const declarationPost = useSelector(getCurrentDeclarationPost)
  const [isOpen, setIsOpen] = useState(false);

  const Deny = () => {
    if (declarationPost?.id) {
      declarationService.drop(declarationPost.id, dispatch)
      route.back();
    }
  }

  const Complete = () => {
    if (declarationPost?.target && declarationPost?.id) {
      userService.modifyDeclaration(declarationPost.target, dispatch)
      declarationService.drop(declarationPost.id, dispatch)
    }
    setIsOpen(true);
    route.back();
  }

  return (
    <div className="mx-auto my-8 max-w-lg rounded-lg bg-green-100 p-8 shadow-lg">
      {/* 신고 접수 요청을 리스트로 크게 볼 수 있도록 한다. */}
      <ul className="rounded-lg bg-white p-6 shadow-md">
        <li className="mb-6 border-b-2 border-gray-200 pb-6">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            {declarationPost?.title || "제목 없음"}
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            {declarationPost?.content || "내용 없음"}
          </p>

          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {`신고자: ${declarationPost?.declarer || "알 수 없음"}`}
            </span>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">
              <strong className="text-gray-800">신고 대상: </strong>
              {declarationPost?.target || "알 수 없음"}
            </p>
          </div>
        </li>

        <li className="flex justify-center space-x-4">
          <button
            type="button"
            className="rounded-lg border border-green-500 px-6 py-2 text-green-600 transition-colors hover:bg-green-100"
            onClick={Complete}
          >
            처리 완료하기
          </button>
          <button
            type="button"
            className="rounded-lg border border-red-500 px-6 py-2 text-red-600 transition-colors hover:bg-red-100"
            onClick={Deny}
          >
            거절하기
          </button>
        </li>
      </ul>
      <button type="button" onClick={() => { route.back() }} className="mt-4 rounded-lg bg-green-400 p-2 text-white hover:bg-green-500">뒤로가기</button>
      <Alert
        message={"처리가 완료되었습니다"}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  )
}
