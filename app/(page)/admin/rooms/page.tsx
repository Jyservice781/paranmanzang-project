"use client";
import Pagination from "@/components/common/Row/pagination/Pagination";
import { RoomModel } from "@/models/room/room.model";
import { roomService } from "@/services/room/room-service";
import { getDisabledRooms, getRooms, getTotalPageDisabledRoom, getTotalPageEnabledRoom, saveCurrentRoom } from "@/lib/features/room/room.slice";
import { useAppDispatch } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";


export default function RoomAdmin() {
  const rooms = useSelector(getRooms);
  const dispatch = useAppDispatch();

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

  console.log("rooms 목록 불러오기 ", rooms);
  const route = useRouter();

  const [관리Page, set관리Page] = useState(0);
  const [승인대기Page, set승인대기Page] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const enabledRooms = useSelector(getRooms)
  const disabledRooms = useSelector(getDisabledRooms)
  const [selectedCategory, setSelectedCategory] = useState<'관리' | '승인 대기'>('관리');


  const showList: RoomModel[] = selectedCategory === '관리' ? enabledRooms : disabledRooms;
  const currentPage = selectedCategory === '관리' ? 관리Page : 승인대기Page;

  const totalPageEnabledRoom = useSelector(getTotalPageEnabledRoom)
  const totalPageDisableRoom = useSelector(getTotalPageDisabledRoom)
  useEffect(() => {
    if (selectedCategory === '관리') {
      roomService.findByEnabled(관리Page, pageSize, dispatch);
    } else {
      roomService.findDisable(승인대기Page, pageSize, dispatch);
    }
  }, [관리Page, 승인대기Page, pageSize, selectedCategory, dispatch]);


  const handleTabClick = (category: '관리' | '승인 대기') => {
    setSelectedCategory(category);
  };

  const onClick = (room: RoomModel) => {
    if (room.id !== undefined) {
      dispatch(saveCurrentRoom(room));
      route.push(`/rooms/${room.id}`);
    }
  };

  const onDelete = (id: string) => {
    console.log(`Deleting room with id: ${id}`);
    roomService.drop(Number(id), dispatch);
  };

  const onUpdate = (id: string) => {
    if (id !== undefined) {
      roomService.modifyConfirm(Number(id), dispatch);
    }
  };


  return (
    <div className="mx-auto mt-8 max-w-[80%]">
      <button onClick={() => route.back()} className="mx-2 rounded-lg bg-green-400 px-4 py-2 text-center text-sm font-medium text-white hover:bg-green-500">뒤로가기</button>

      <ul className="mx-auto my-8 rounded-lg bg-green-100 p-6 shadow-md">
        <li className="my-4 flex space-x-4">
          <button
            className={`rounded-lg px-4 py-2 ${selectedCategory === '관리' ? 'bg-green-400 text-white' : 'bg-gray-200 text-black'}`}
            onClick={() => handleTabClick('관리')}
          >
            관리
          </button>
          <button
            className={`rounded-lg px-4 py-2 ${selectedCategory === '승인 대기' ? 'bg-green-400 text-white' : 'bg-gray-200 text-black'}`}
            onClick={() => handleTabClick('승인 대기')}
          >
            승인 대기
          </button>
        </li>

        {showList.length > 0 ? (
          showList.map((room, index) => (
            <li key={index} className="mx-auto my-3 flex items-center justify-around bg-white p-3">
              <div className="flex w-80 items-center justify-around">
                <h2 className="text-lg">{room.name}</h2>
                <p className="w-36 text-sm">날짜: {room.createdAt ? formatDate(room.createdAt) : "날짜 정보 없음"}</p>
              </div>
              {selectedCategory === '관리' && (
                <button
                  type="button"
                  onClick={() => onClick(room)}
                  className="mx-2 rounded-lg bg-green-400 px-4 py-2 text-center text-sm font-medium text-white hover:bg-green-500"
                >
                  상세보기
                </button>
              )}
              {selectedCategory === '승인 대기' && (
                <div>
                  <button type="button" onClick={() => onUpdate(`${room.id}`)} className="mx-2 rounded-lg bg-green-400 p-3">승인</button>
                  <button type="button" onClick={() => onDelete(`${room.id}`)} className="mx-2 rounded-lg bg-green-400 p-3">거절</button>
                </div>
              )}
            </li>
          ))
        ) : (
          <li className="list-none">정보가 존재하지 않습니다.</li>
        )}
      </ul>

      <Pagination
        currentPage={currentPage}
        totalPages={selectedCategory === '관리' ? totalPageEnabledRoom : totalPageDisableRoom}
        onPageChange={selectedCategory === '관리' ? set관리Page : set승인대기Page}
      />
    </div>
  );
}