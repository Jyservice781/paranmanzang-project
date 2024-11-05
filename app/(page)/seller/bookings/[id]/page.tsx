"use client"
import Pagination from "@/app/components/common/Row/pagination/Pagination"
import { BookingModel } from "@/app/model/room/bookings.model"
import { bookingService } from "@/app/service/room/booking.service"
import { getEnabledRoomBooking, getNotEnabledRoomBooking, getPayCompletedBookings, getTotalPageDisabledRoomBooking, getTotalPageEnabledRoomBooking, getTotalPagePayCompletedBooking } from "@/lib/features/room/booking.slice"
import { getCurrentRoom, saveCurrentRoom } from "@/lib/features/room/room.slice"
import { useAppDispatch } from "@/lib/store"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"

export default function SellerBooking() {
    const dispatch = useAppDispatch()
    const room = useSelector(getCurrentRoom)
    const enabledBookings = useSelector(getEnabledRoomBooking);
    const notEnabledBookings = useSelector(getNotEnabledRoomBooking)
    const payCompletedBookings = useSelector(getPayCompletedBookings)
    const route = useRouter()
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const totalPageEnabledBooking = useSelector(getTotalPageEnabledRoomBooking)
    const totalPageDisabledBooking = useSelector(getTotalPageDisabledRoomBooking)
    const totalPagePayCompletedBooking = useSelector(getTotalPagePayCompletedBooking)
    const [selectedCategory, setSelectedCategory] = useState<'결제 완료' | '결제 대기' | '승인 대기'>('결제 완료');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<BookingModel | null>(null);


    const handleTabClick = (category: '결제 완료' | '결제 대기' | '승인 대기') => {
        setSelectedCategory(category);
        setPage(0); // 페이지네이션 리셋 하는 부분 
    };

    useEffect(() => {
        if (room) {
            switch (selectedCategory) {
                case '결제 완료':
                    bookingService.findPayCompletedByRoom(Number(room.id), page, size, dispatch);
                    break;
                case '결제 대기':
                    bookingService.findEnabledByRoom(Number(room.id), page, size, dispatch);
                    break;
                case '승인 대기':
                    bookingService.findDisabledByRoom(Number(room.id), page, size, dispatch);
                    break;
                default:
                    break;
            }
        }
    }, [page, selectedCategory, dispatch])


    console.log("booking 확정" + enabledBookings)
    console.log("booking 대기" + notEnabledBookings)
    console.log("booking 결제 완료" + payCompletedBookings)

    const showList: BookingModel[] = useMemo(() => {
        if (!room) return [];
        switch (selectedCategory) {
            case '결제 완료':
                return payCompletedBookings[Number(room.id)];
            case '결제 대기':
                return enabledBookings[Number(room.id)];
            case '승인 대기':
                return notEnabledBookings[Number(room.id)];
            default:
                return [];
        }
    }, [selectedCategory, payCompletedBookings, enabledBookings, notEnabledBookings, room]);

    const totalPage: number = useMemo(() => {
        switch (selectedCategory) {
            case "결제 완료":
                return totalPagePayCompletedBooking || 0
            case "결제 대기":
                return totalPageEnabledBooking || 0
            case "승인 대기":
                return totalPageDisabledBooking || 0
            default:
                return 0;
        }
    }, [selectedCategory, payCompletedBookings, enabledBookings, notEnabledBookings]);

    const onDelete = (booking: BookingModel) => {
        bookingService.drop(booking, dispatch)
    }

    const onUpdate = (id: number) => {
        if (id !== undefined) {
            bookingService.modify(Number(id), dispatch)
        }
    }

    const openModal = (booking: BookingModel) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedBooking(null);
        setIsModalOpen(false);
    };

    const handleToDetailRoom = () => {
        if (room) {
            dispatch(saveCurrentRoom(room));
            route.push(`/rooms/${room.id}`);
        }
    }


    return (
        <div className="mx-auto my-8 max-w-[80%] rounded-lg bg-green-100 p-6 shadow-md">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-8 my-4 items-center text-gray-700 bg-white rounded-lg ">
                <p className="text-lg font-semibold">방 이름: <span className="font-normal">{room?.name || "정보 없음"}</span></p>
                <p className="text-lg font-semibold">가격: <span className="font-normal">{room?.price ? `${room.price}원` : "정보 없음"}</span></p>
                <p className="text-lg font-semibold">오픈 시간: <span className="font-normal">{room?.openTime || "정보 없음"}</span></p>
                <p className="text-lg font-semibold">종료 시간: <span className="font-normal">{room?.closeTime || "정보 없음"}</span></p>
                <button
                    type="button"
                    onClick={() => handleToDetailRoom}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                >
                    공간 상세 보기
                </button>
            </div>
            <div className="flex space-x-4 my-4">
                <button
                    className={`px-4 py-2 rounded-lg ${selectedCategory === '결제 완료' ? 'bg-green-400 text-white' : 'bg-gray-200 text-black'}`}
                    onClick={() => handleTabClick('결제 완료')}
                >
                    결제 완료
                </button>
                <button
                    className={`px-4 py-2 rounded-lg ${selectedCategory === '결제 대기' ? 'bg-green-400 text-white' : 'bg-gray-200 text-black'}`}
                    onClick={() => handleTabClick('결제 대기')}
                >
                    결제 대기
                </button>
                <button
                    className={`px-4 py-2 rounded-lg ${selectedCategory === '승인 대기' ? 'bg-green-400 text-white' : 'bg-gray-200 text-black'}`}
                    onClick={() => handleTabClick('승인 대기')}
                >
                    승인 대기
                </button>
            </div>

            {showList && showList.length > 0 ? (
                <ul>
                    {showList.map((booking) => (
                        <li key={booking.id} className="mx-auto my-3 flex items-center justify-around bg-white p-3">
                            <div className="flex justify-around">
                                <p>예약일: {booking.date}</p>
                                <p>예약시간: {booking.usingTime.map((time) => time.slice(0, 5)).join(", ")}</p>
                            </div>
                            <div>
                                {selectedCategory === "승인 대기" && !booking.enabled && (
                                    <>
                                        <button type="button" onClick={() => onUpdate(Number(booking.id))} className="mx-2 rounded-lg bg-green-100 p-3">
                                            승인
                                        </button>
                                        <button type="button" onClick={() => onDelete(booking)} className="mx-2 rounded-lg bg-green-100 p-3">
                                            거절
                                        </button>
                                    </>
                                )}
                                {["결제 완료", "결제 대기"].includes(selectedCategory) && (
                                    <button type="button" onClick={() => onDelete(booking)} className="mx-2 rounded-lg bg-green-100 p-3">
                                        승인 취소
                                    </button>
                                )}
                                {selectedCategory === "결제 완료" && (
                                    <button
                                        type="button"
                                        onClick={() => openModal(booking)}
                                        className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                                    >
                                        결제 상세 보기
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="list-none my-3 text-center text-gray-500">정보가 존재하지 않습니다.</p>
            )}

            <Pagination
                currentPage={page}
                totalPages={totalPage}
                onPageChange={setPage}
            />

            <button type="button" onClick={() => route.back()} className="rounded-lg bg-green-400 px-4 py-2 text-center text-sm font-medium text-white hover:bg-green-500">뒤로가기</button>
            {isModalOpen && selectedBooking && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">결제 상세 정보</h3>
                        <p>예약 방 이름: {selectedBooking.roomName}</p>
                        <p>예약 일: {selectedBooking.date}</p>
                        <p>소모임: {selectedBooking.accountModel?.orderName}</p>
                        <p>결제일: {selectedBooking.accountModel?.createAt}</p>
                        <p>결제 금액: {selectedBooking.accountModel?.amount}</p>
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