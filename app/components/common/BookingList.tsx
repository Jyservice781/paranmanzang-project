"use client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AccountButton from "./AccountButton"
import { useEffect, useState } from "react"
import { useAppDispatch } from "@/lib/store"
import { BookingModel } from "@/app/model/room/bookings.model"

import { getEnabledBooking, getNotEnabledBooking, getPayCompletedBookingsByGroup, getTotalPageDisabledBooking, getTotalPageEnabledBooking, getTotalPagePayCompletedBookingsByGroup } from "@/lib/features/room/booking.slice"
import { useSelector } from "react-redux"
import { bookingService } from "@/app/service/room/booking.service"
import { getCurrentGroup } from "@/lib/features/group/group.slice"
import { accountService } from "@/app/service/room/account.service"
import Pagination from "./Row/pagination/Pagination"
import { getRoomsMap, saveCurrentRoom } from "@/lib/features/room/room.slice"


type TabType = "결제 완료" | '결제 대기' | "예약 대기";

export default function BookingList() {
  const router = useRouter()
  const dispatch = useAppDispatch();

  // Redux 상태를 최상위 레벨에서 가져오기
  const group = useSelector(getCurrentGroup)
  const enabledBookings = useSelector(getEnabledBooking)
  const notEnabledBookings = useSelector(getNotEnabledBooking)
  const payCompletedBookings = useSelector(getPayCompletedBookingsByGroup)
  const totalPageEnabled = useSelector(getTotalPageEnabledBooking)
  const totalPageDisabled = useSelector(getTotalPageDisabledBooking)
  const totalPagePayCompletedBooking = useSelector(getTotalPagePayCompletedBookingsByGroup)
  const enableRooms = useSelector(getRoomsMap)

  // 로컬 상태 정의
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [activeTab, setActiveTab] = useState<TabType>('결제 완료');
  const tabs: TabType[] = ["결제 완료", "결제 대기", "예약 대기"];
  const [totalPages, setTotalPages] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingModel | null>(null);

  useEffect(() => {
    if (!group) return;
    switch (activeTab) {
      case '결제 완료':
        bookingService.findPayCompletedByGroupId(group.id, page, size, dispatch);
        setTotalPages(totalPagePayCompletedBooking)
        break;
      case '결제 대기':
        bookingService.findEnabledByGroup(group.id, page, size, dispatch);
        setTotalPages(totalPageEnabled)
        break;
      case '예약 대기':
        bookingService.findDisabledByGroup(group.id, page, size, dispatch);
        setTotalPages(totalPageDisabled);
        break;
      default:
        break;
    }
  }, [dispatch, group, page, size, activeTab]);


  const renderTabContent = () => {
    if (!group) return;
    switch (activeTab) {
      case '결제 완료':
        return renderBookingList(payCompletedBookings[group.id])
      case '결제 대기':
        return renderBookingList(enabledBookings[group.id]);
      case '예약 대기':
        return renderBookingList(notEnabledBookings[group.id]);
      default:
        return null;
    }
  };

  console.log("booking 확정" + enabledBookings)

  console.log("booking 대기" + notEnabledBookings)

  const renderBookingList = (bookings: BookingModel[] = []) => (
    <ul className="space-y-4">
      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <li
            key={booking.id}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative mb-4 rounded-lg bg-green-100 border border-gray-200">
              <div className="border-b border-gray-100 p-6">
                <Link href={`/books/${booking.id}`} passHref>
                  <h5 className="mb-2 text-lg font-semibold tracking-tight text-gray-800 cursor-pointer hover:text-green-600 transition-colors">
                    예약 방: {booking.roomName}
                  </h5>
                </Link>
                <p className="mb-3 text-sm font-medium text-gray-700">예약 일: {booking.date}</p>
                <p className="mb-3 text-sm font-medium text-gray-700">예약 소모임: {booking.groupId}</p>
                <p className="mb-3 text-sm font-medium text-gray-700">
                  시간: {booking.usingTime.length > 1 && `${booking.usingTime[0]} - ${booking.usingTime[booking.usingTime.length - 1]}`}
                </p>
                <p className="mb-3 text-sm font-medium text-gray-700">상태: {booking.enabled ? '활성화됨' : '비활성화됨'}</p>
                <div className="mt-5 flex justify-end space-x-3">
                  {activeTab === '예약 대기' && (
                    <button
                      type="button"
                      onClick={() => handleDelete(booking)}
                      className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                    >
                      삭제하기
                    </button>
                  )}
                  {activeTab === '결제 대기' && (
                      <AccountButton booking={booking} room={enableRooms.find(room => room.id === booking.roomId) || null} group={group || null}/>
                  )}
                  {activeTab === '결제 완료' && (
                    <button
                      type="button"
                      onClick={() => openModal(booking)}
                      className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                    >
                      결제 상세 보기
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleToDetailRoom(booking.roomId)}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                  >
                    공간 상세 보기
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))
      ) : (
        <p className="text-center text-gray-500">예약 내역이 없습니다.</p>
      )}
    </ul>
  );

  const handleDelete = (booking: BookingModel) => {
    console.log('삭제하기:', booking.id);
    bookingService.drop(booking, dispatch);
  };

  const openModal = (booking: BookingModel) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setIsModalOpen(false);
  };

  const handleToDetailRoom = (id: number) => {
    const selectedRoom = enableRooms.find(room => room.id === id) || null;
    dispatch(saveCurrentRoom(selectedRoom));
    router.push(`/rooms/${id}`);
  }

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white rounded-lg shadow-lg">
      <div className="my-6 space-y-6">
        <div>
          {group?.name} </div>
        <div className="flex justify-center space-x-4 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 
                        ${activeTab === tab ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              onClick={() => {
                setActiveTab(tab);
                setPage(0);
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-green-50 p-8 rounded-lg shadow-md">
          {renderTabContent()}
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <div className="flex justify-center mt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-white bg-green-400 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          뒤로가기
        </button>
      </div>
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">결제 상세 정보</h3>
            <p>예약 방 이름: {selectedBooking.roomName}</p>
            <p>예약 일: {selectedBooking.date}</p>
            <p>소모임: {group?.name}</p>
            <p>결제일: {selectedBooking.account?.createAt}</p>
            <p>결제 금액: {selectedBooking.account?.amount}</p>
            <div className="mt-5 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
