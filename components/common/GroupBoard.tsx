"use client"
import { useEffect, useState } from "react";
import { getCurrentGroup, getGroupPosts, getTotalPageGeneralGroupPost, getTotalPageNoticeGroupPost, saveCurrentGroupPost } from "@/lib/features/group/group.slice";
import { useAppDispatch } from "@/lib/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { groupPostService } from "@/services/group/groupPost-service";
import { bookingService } from "@/services/room/booking-service";
import { getRoomsMap, saveCurrentRoom } from "@/lib/features/room/room.slice";
import { getAddresses, saveCurrentAddress } from "@/lib/features/room/address.slice";
import { GroupPostResponseModel } from "@/models/group/group.model";
import PostEditor from "../crud/PostEditor";
import Pagination from "@/components/common/Row/pagination/Pagination";
import { getPayCompletedBookingsByGroup, getTotalPagePayCompletedBookingsByGroup } from "@/lib/features/room/booking.slice";
import { BookingModel } from "@/models/room/bookings.model";

type TabType = "공지 사항" | "자유게시판" | "스케쥴";

export default function GroupBoard() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    // Redux 상태를 최상위 레벨에서 가져옴
    const { groupPostsNotice, groupPostsGeneral } = useSelector(getGroupPosts);
    const group = useSelector(getCurrentGroup);
    const totalPageNotice = useSelector(getTotalPageNoticeGroupPost);
    const totalPageGeneral = useSelector(getTotalPageGeneralGroupPost);
    const totalPageBooking = useSelector(getTotalPagePayCompletedBookingsByGroup);
    const bookings = useSelector(getPayCompletedBookingsByGroup);
    const enableRooms = useSelector(getRoomsMap);
    const addresses = useSelector(getAddresses);

    // 로컬 상태
    const [isEditorVisible, setIsEditorVisible] = useState<boolean>(false);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [activeTab, setActiveTab] = useState<TabType>('공지 사항');
    const tabs: TabType[] = ["공지 사항", "자유게시판", "스케쥴"];
    const [totalPages, setTotalPages] = useState(totalPageNotice);

    useEffect(() => {
        if (!group) return;
        let category;
        if (activeTab === '공지 사항') {
            category = 'Notice'
        } else {
            category = 'General'
        }
        groupPostService.findByGroupId(group.id, page, size, category, dispatch);
        bookingService.findPayCompletedByGroupId(group.id, page, size, dispatch);
    }, [dispatch, group, activeTab, page, size]);

    useEffect(() => {
        // activeTab에 따라 totalPages 설정
        switch (activeTab) {
            case "공지 사항":
                setTotalPages(totalPageNotice);
                break;
            case "자유게시판":
                setTotalPages(totalPageGeneral);
                break;
            case "스케쥴":
                setTotalPages(totalPageBooking);
                break;
        }
    }, [activeTab, totalPageNotice, totalPageGeneral, totalPageBooking]);

    const onClickToDetail = (post: GroupPostResponseModel) => {
        if (post) {
            dispatch(saveCurrentGroupPost(post));
            groupPostService.modifyViewCount(post.id, dispatch)
                .finally(() => {
                    router.push(`/groups/board/detail/${post.id}`);
                });
        }
    };

    const onClickToRoomDetail = (currentId: number | undefined) => {
        if (currentId !== undefined) {
            dispatch(saveCurrentRoom(enableRooms.find((room) => room.id === currentId) || null));
            dispatch(saveCurrentAddress(addresses.find(({ roomId }) => roomId === currentId) ?? null));
            router.push(`/rooms/${currentId}`);
        }
    };

    function formatUsingTime(times: string[]) {
        if (times.length === 0) return "시간 정보 없음";
        const startTime = times[0].slice(0, 5);
        const endTime = times[times.length - 1].slice(0, 5);
        return `${startTime} ~ ${endTime}`;
    }

    const toggleEditorVisibility = () => {
        setIsEditorVisible((prev) => !prev);
    };


    const renderTabContent = () => {
        if (!group) return;
        switch (activeTab) {
            case "공지 사항":
                return renderPostList(groupPostsNotice);
            case "자유게시판":
                return renderPostList(groupPostsGeneral);
            case "스케쥴":
                return renderScheduleList(bookings[group.id]);
            default:
                return null;
        }
    };

    const renderPostList = (posts: GroupPostResponseModel[]) => (
        <ul className="space-y-4">
            {posts.length > 0 ? (
                posts.map((post, index) => (
                    <li key={index} className="rounded-lg bg-white p-4 shadow-md transition-shadow duration-300 hover:shadow-lg" onClick={() => onClickToDetail(post)}>
                        <div className="flex items-center justify-between space-x-4">
                            <p className="flex-1 truncate text-lg font-semibold text-gray-800">
                                {post.title}
                            </p>
                            <div className="flex items-center space-x-6">
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium text-gray-700">작성자:</span> {post.nickname}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium text-gray-700">조회수:</span> {post.viewCount}
                                </p>
                            </div>
                        </div>
                    </li>
                ))
            ) : (
                <p className="text-center text-gray-500">게시물이 없습니다.</p>
            )}
        </ul>
    );

    const renderScheduleList = (bookings: BookingModel[] = []) => (
        <ul className="space-y-4">
            {bookings.length > 0 ? (
                bookings.map((booking, index) => (
                    <li
                        key={index}
                        className="rounded-lg bg-white p-4 shadow-md transition-shadow duration-300 hover:shadow-lg"
                    >
                        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                            <p className="text-lg font-semibold text-gray-900">{booking.date}</p>
                            <p
                                className="cursor-pointer text-base font-medium text-green-600 hover:underline"
                                onClick={() => onClickToRoomDetail(booking.roomId)}
                            >
                                장소: {enableRooms.find((room) => room.id === booking.roomId)?.name || "알 수 없음"}
                            </p>
                        </div>
                        <div className="mt-2">
                            <p className="text-base font-medium text-gray-800">
                                <span className="font-semibold text-gray-700">이용 시간: </span>
                                {formatUsingTime(booking.usingTime)}
                            </p>
                        </div>
                    </li>
                ))
            ) : (
                <li className="py-8 text-center text-gray-500">스케쥴이 없습니다.</li>
            )}
        </ul>
    );


    return (
        <div className="mx-auto my-10 max-w-4xl rounded-lg bg-white p-6 shadow-lg">
            <div className="rounded-lg bg-green-50 py-8 text-center">
                <h1 className="text-4xl font-bold">{group?.name}</h1>
            </div>

            <div className="my-6 space-y-6">
                <div className="mb-8 flex justify-center space-x-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            className={`rounded-lg px-6 py-2 font-medium transition-all duration-300 
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

                <div className="mx-auto my-4 max-w-4xl rounded-lg bg-white p-6 shadow-lg">
                    <button
                        type="button"
                        onClick={toggleEditorVisibility}
                        className="rounded-lg bg-green-400 px-6 py-2 text-white shadow-md transition-colors duration-300 hover:bg-green-500"
                    >
                        {isEditorVisible ? '글 작성 취소' : '글 작성'}
                    </button>

                    {isEditorVisible && (
                        <div className="mt-8 scale-100 rounded-lg bg-gray-50 p-6 shadow-md transition-transform duration-500 ease-in-out">
                            <PostEditor />
                        </div>
                    )}
                </div>

                <div className="rounded-lg bg-green-50 p-8 shadow-md">
                    {renderTabContent()}
                </div>

                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div>

            <div className="mt-6 flex justify-center">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="w-full rounded-lg bg-green-400 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-500 focus:outline-none focus:ring-4 focus:ring-green-300 sm:w-auto"
                >
                    뒤로가기
                </button>
            </div>
        </div>
    );
}
