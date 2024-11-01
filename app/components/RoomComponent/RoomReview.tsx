"use client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useSelector } from "react-redux"
import { getReviews, getTotalPageRoomReview } from "@/lib/features/room/review.slice"
import { getNickname } from "@/lib/features/users/user.slice"
import { useEffect, useState } from "react"
import { reviewService } from "@/app/service/room/review.service"
import { getCurrentRoom } from "@/lib/features/room/room.slice"
import { useAppDispatch } from "@/lib/store"
import Pagination from "../common/Row/pagination/Pagination"

export default function RoomReview() {
  const route = useRouter()
  const reviews = useSelector(getReviews)
  const nickname = useSelector(getNickname)
  const room = useSelector(getCurrentRoom)
  const dispatch = useAppDispatch()
  const goBack = () => {
    route.back()
  }
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(9)
  const totalPages = useSelector(getTotalPageRoomReview)

  useEffect(() => {
    if (room?.id) {
      reviewService.findByRoom(room.id, 1, 10, dispatch)
    }
  }, [room, dispatch])
  return (
    <div className="mx-auto my-8 max-w-lg rounded-lg bg-green-50 p-6">
      <p className="text-lg">공간리뷰</p>
      <span className="text-sm"> 실제 사용자분들의 후기를 담고 있습니다.</span>
      <ul className="my-3 w-full">
        {reviews.map((review, index) => (
          <li className="my-5 min-w-full max-w-3 rounded-lg bg-white" key={index}>
            <Link href="/" className="p-5">
              <h2 className="border-b border-gray-100 text-xl">⭐{review.rating}</h2>
              <p className="w-18 truncate">{review.content}</p>
            </Link>
          </li>
        ))}
      </ul>
      <Pagination
        currentPage={page}
        pageSize={pageSize}
        totalPages={totalPages}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
      <button type="button" className="rounded-lg border-white bg-green-100 p-2" onClick={goBack}>뒤로가기</button>
    </div>
  )
}
