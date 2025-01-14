"use client"
import { RoomModel } from "@/models/room/room.model"
import { roomService } from "@/services/room/room-service"
import { getNickname } from "@/lib/features/users/user.slice"
import { useAppDispatch } from "@/lib/store"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Pagination from "@/components/common/Row/pagination/Pagination"
import { getDisabledRoomByNickname, getEnabledRoomByNickname, getTotalPageSellerDisabledRoom, getTotalPageSellerEnabledRoom, saveCurrentRoom } from "@/lib/features/room/room.slice"

export default function SellerRoom() {
  const nickname = useSelector(getNickname)
  const dispatch = useAppDispatch()
  const enabledRooms = useSelector(getEnabledRoomByNickname)
  const disabledRooms = useSelector(getDisabledRoomByNickname)
  const route = useRouter()
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState<'관리' | '승인 대기'>('관리');

  const enabledRoomTotalPage = useSelector(getTotalPageSellerEnabledRoom)
  const disabledRoomTotalPage = useSelector(getTotalPageSellerDisabledRoom)

  console.log("rooms 승인", enabledRoomTotalPage)
  console.log("rooms 대기", disabledRoomTotalPage)
  console.log("rooms 승인", enabledRooms)
  console.log("rooms 대기", disabledRooms)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleTabClick = (category: '관리' | '승인 대기') => {
    setSelectedCategory(category);
    setPage(0); // 토글 탭 움직일때 페이징 넘버 1로 이동 
  };


  const showList: RoomModel[] =
    selectedCategory === '관리' ? enabledRooms : disabledRooms
    ;

  useEffect(() => {
    if (nickname) {
      if (selectedCategory === '관리') {
        roomService.findEnableByNickname(page, size, nickname, dispatch)
      } else {
        roomService.findDisableByNickname(page, size, nickname, dispatch)
      }
    }
  }, [nickname, page, size, dispatch, selectedCategory])

  const onDelete = (id: string) => {
    console.log(`Deleting id: ${id}`)
    roomService.drop(Number(id), dispatch)
  }

  const onUpdate = (room: RoomModel) => {
    if (room.id !== undefined) {
      dispatch(saveCurrentRoom(room))
      route.push(`/rooms/update/${room.id}`)
    }
  }

  const handleDetail = (room: RoomModel) => {
    if (room.id !== undefined) {
      dispatch(saveCurrentRoom(room))
      route.push(`/seller/bookings/${room.id}`)
    }
  }

  const handleToDetailRoom = (room: RoomModel) => {
    dispatch(saveCurrentRoom(room));
    route.push(`/rooms/${room.id}`);
  }

  return (
    <div className="mx-auto my-8 max-w-[80%] rounded-lg bg-green-100 p-6 shadow-md">
      <div className="mb-4 flex justify-between">
        <div>
          <button
            className={`rounded-lg px-4 py-2 ${selectedCategory === '관리' ? 'bg-green-400 text-white' : 'bg-gray-200 text-black'}`}
            onClick={() => handleTabClick('관리')}
          >
            관리
          </button>
          <button
            className={`mx-4 rounded-lg px-4 py-2 ${selectedCategory === '승인 대기' ? 'bg-green-400 text-white' : 'bg-gray-200 text-black'}`}
            onClick={() => handleTabClick('승인 대기')}
          >
            승인 대기
          </button>
        </div>
        <div>
          <button
            className={`text-black'} rounded-full bg-green-400 px-4 py-2 text-white hover:bg-green-500`}
            onClick={() => { route.push('/rooms/add') }}
          >
            공간등록
          </button>
        </div>
      </div>

      {showList.length > 0 ? (
        showList.map((room) => (
          <li key={room.id}
            className="mx-auto my-3 flex items-center justify-around bg-white p-3">
            <div className="flex w-1/2 items-center justify-around">
              <h2 className="w-1/2 text-lg">{room.name}</h2>
              <p className="min-w-40">{room.createdAt ? formatDate(room.createdAt) : "날짜 정보 없음"}</p>
            </div>
            {selectedCategory === '관리' && (
              <div>
                <button type="button" onClick={() => onDelete(`${room.id}`)} className="mx-2 rounded-lg bg-red-400 p-3 text-white">삭제</button>
                <button type="button" onClick={() => onUpdate(room)} className="mx-2 rounded-lg bg-green-400 p-3 text-white">수정</button>
                <button type="button" onClick={() => handleDetail(room)} className="mx-2 rounded-lg bg-green-400 p-3 text-white">예약 정보</button>
                <button
                  type="button"
                  onClick={() => handleToDetailRoom(room)}
                  className="mx-2 rounded-lg bg-green-400 p-3 text-white"
                >
                  공간 상세 보기
                </button>
              </div>
            )}
            {selectedCategory === '승인 대기' && (
              <div>
                <button type="button" onClick={() => onDelete(`${room.id}`)} className="mx-2 rounded-lg bg-red-400 p-3">등록 취소</button>
              </div>
            )}

          </li>
        ))
      ) : (
        <li className="list-none">정보가 존재하지 않습니다.</li>
      )}

      <Pagination
        currentPage={page}
        totalPages={selectedCategory === '관리' ? enabledRoomTotalPage : disabledRoomTotalPage}
        onPageChange={setPage}
      />

      <button type="button" onClick={() => route.back()} className="mt-4 rounded-lg bg-green-400 px-4 py-2 text-white">뒤로가기</button>
    </div>
  )
}