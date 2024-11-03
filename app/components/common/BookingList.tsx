"use client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AccountButton from "./AccountButton"
import { useEffect, useState } from "react"
import { useAppDispatch } from "@/lib/store"
import { BookingModel } from "@/app/model/room/bookings.model"

import { getEnabledBooking, getNotEnabledBooking, getTotalPageDisabledBooking, getTotalPageEnabledBooking } from "@/lib/features/room/booking.slice"
import { useSelector } from "react-redux"
import { bookingService } from "@/app/service/room/booking.service"
import { getLeaderGroups } from "@/lib/features/group/group.slice"
import { accountService } from "@/app/service/room/account.service"
import Pagination from "./Row/pagination/Pagination"

interface BookingListProps {
  bookingId?: string
}

type TabType = "예약 확정" | "예약 대기";

export default function BookingList({ bookingId }: BookingListProps) {
  const router = useRouter()
  const [selectedBookings, setSelectedBookings] = useState<string[]>([])
  const dispatch = useAppDispatch();

  // Redux 상태를 최상위 레벨에서 가져오기
  const leaderGroups = useSelector(getLeaderGroups);
  const enabledBookings = useSelector(getEnabledBooking);
  const notEnabledBookings = useSelector(getNotEnabledBooking);
  const totalPageEnabled = useSelector(getTotalPageEnabledBooking);
  const totalPageDisabled = useSelector(getTotalPageDisabledBooking);

  // 로컬 상태 정의
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [activeTab, setActiveTab] = useState<TabType>('예약 확정');
  const tabs: TabType[] = ["예약 확정", "예약 대기"];
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    // 그룹 ID를 통해 예약 데이터를 가져옴
    bookingService.findEnabledByGroups(leaderGroups.map(group => group.id), page, size, dispatch);
    bookingService.findDisabledByGroups(leaderGroups.map(group => group.id), page, size, dispatch);

    // activeTab에 따라 totalPages 설정
    switch (activeTab) {
      case "예약 확정":
        setTotalPages(totalPageEnabled);
        break;
      case "예약 대기":
        setTotalPages(totalPageDisabled);
        break;
    }
  }, [dispatch, leaderGroups, page, size, activeTab, totalPageEnabled, totalPageDisabled]);


  const renderTabContent = () => {
    switch (activeTab) {
      case "예약 확정":
        return renderBookingList(enabledBookings);
      case "예약 대기":
        return renderBookingList(notEnabledBookings);
      default:
        return null;
    }
  };

  const renderBookingList = (bookings: BookingModel[]) => (
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
                    예약 방 번호: {booking.roomId}
                  </h5>
                </Link>
                <p className="mb-3 text-sm font-medium text-gray-700">
                  예약 일: {booking.date}
                </p>
                <p className="mb-3 text-sm font-medium text-gray-700">
                  예약 소모임: {booking.groupId}
                </p>
                <p className="mb-3 text-sm font-medium text-gray-700">
                  시간: {booking.usingTime.length > 1 && `${booking.usingTime[0]} - ${booking.usingTime[booking.usingTime.length - 1]}`}
                </p>
                <p className="mb-3 text-sm font-medium text-gray-700">
                  상태: {booking.enabled ? '활성화됨' : '비활성화됨'}
                </p>
                <div className="mt-5 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => router.push(`/rooms/${booking.id}`)}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                  >
                    상세보기
                  </button>
                  {activeTab === '예약 대기' && (
                    <button
                      type="button"
                      onClick={() => handleDelete(Number(booking.id))}
                      className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                    >
                      삭제하기
                    </button>
                  )}
                  {activeTab === '예약 확정' && (
                    new Date(booking.date) > new Date() && !accountService.findByBooking(booking.id ?? 0, dispatch) && (
                      <AccountButton />
                    )
                  )}
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

  const handleDelete = (id: number) => {
    console.log('삭제하기:', id);
    bookingService.drop(id, dispatch);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setSize(newPageSize);
    setPage(1);
  };

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white rounded-lg shadow-lg">
      <div className="my-6 space-y-6">
        <div className="flex justify-center space-x-4 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 
                        ${activeTab === tab ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              onClick={() => {
                setActiveTab(tab);
                setPage(1);
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
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
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
    </div>
  )
}
