// components/DetailButton.tsx
"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BookingModal from "../BookingModal";
import Alert from "../Alert";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/lib/store";
import { getCurrentBook, getLikedBooks } from "@/lib/features/group/book.slice";
import { getCurrentRoom, getLikedRooms } from "@/lib/features/room/room.slice";
import { getCurrentGroup, getCurrentGroupPost, getGroupEnableMembers, getGroupMembers, getLeaderGroups, getLikedPosts } from "@/lib/features/group/group.slice";
import { LikeBookModel } from "@/models/group/book.model";
import { likeBookService } from "@/services/group/likeBook-service";
import { getCurrentUser, getNickname } from "@/lib/features/users/user.slice";
import { LikeRoomModel } from "@/models/user/users.model";
import { likeRoomService } from "@/services/users/likeRoom-service";
import { likePostService } from "@/services/group/likePost-service";
import { GroupResponseModel, JoiningModel, LikePostModel } from "@/models/group/group.model";
import { groupService } from "@/services/group/group-service";
import { chatUserService } from "@/services/chat/chatUser-service";
import { chatRoomService } from "@/services/chat/chatRoom-service";
import CommentBlock from "./CommentBlock";
import { roomService } from "@/services/room/room-service";

interface DetailButtonProps {
    thisPage: string
    displayReview: 'none' | 'block'
    displayBoard: 'none' | 'block'
    displayReservation: 'none' | 'block'
    displayComment: 'none' | 'block'
}

export default function DetailButton({ thisPage, displayReview, displayBoard, displayReservation }: DetailButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [IsCommentOpen, setIsCommentOpen] = useState(false)

    const route = useRouter()
    const dispatch = useAppDispatch()
    const book = useSelector(getCurrentBook)
    const likebooks = useSelector(getLikedBooks)
    const likeRooms = useSelector(getLikedRooms)
    const likePosts = useSelector(getLikedPosts)
    const leaderGroups = useSelector(getLeaderGroups)
    const room = useSelector(getCurrentRoom)
    const group = useSelector(getCurrentGroup)
    const post = useSelector(getCurrentGroupPost)
    const user = useSelector(getCurrentUser)
    const users = useSelector(getGroupMembers)
    const nickname = useSelector(getNickname)
    const userInfo = user?.role
    const enableUsers = useSelector(getGroupEnableMembers)
    const isUserInGroup = group?.id && users[group.id]?.some((user: any) => user.nickname === nickname);
    const isPendingGroup = group?.id && enableUsers[group.id]?.some((user) => user.nickname === nickname);

    useEffect(() => {
        if (user?.nickname as string && nickname) {
            groupService.findByNickname(nickname, dispatch)
            if (group as GroupResponseModel && group?.id as number) {
                groupService.findUserById(Number(group?.id), dispatch)
            }
        }
    }, [group, nickname])

    const handleReview = () => {
        route.push(`${thisPage}/review`)
    }
    const handleAlertClose = () => {
        setIsAlertOpen(false);
        setIsConfirmOpen(true);
    };
    const Message = () => {
        setAlertMessage('이미 찜 상품에 있습니다.');
        setIsAlertOpen(true);
    }
    const LikeThis = () => {
        switch (thisPage) {
            case "/books": {
                if (!book || !nickname) return;
                const likeBookModel: LikeBookModel = {
                    bookId: book.id,
                    nickname: nickname
                };
                likeBookService.insert(likeBookModel, dispatch);
                break;
            }
            case "/groups/board/detail": {
                if (!post || !nickname) return;
                const likePostModel: LikePostModel = {
                    postId: post.id,
                    nickname: nickname
                };

                likePostService.insert(likePostModel, dispatch);
                break;
            }
            case "/rooms": {
                if (!room || !nickname) return;
                const likeRoomModel: LikeRoomModel = {
                    roomId: Number(room.id),
                    nickname: nickname
                };
                likeRoomService.insert(likeRoomModel, dispatch, room);
                break;
            }
            default:
                return;
        }
        setAlertMessage('찜 했습니다.');
        setIsAlertOpen(true);
    }

    const leaveGroup = () => {
        setAlertMessage('소모임 탈퇴가 완료 됐습니다.');
        setIsAlertOpen(true);
        if (nickname && group) {
            groupService.dropUser(nickname, group.id, dispatch)
            chatUserService.drop(group.chatRoomId, nickname, dispatch)
        }
    }

    const deleteGroup = () => {
        setAlertMessage('소모임 삭제가 완료 됐습니다.');
        setIsAlertOpen(true);
        if (nickname && group) {
            groupService.drop(group.id, dispatch)
            chatRoomService.drop({ roomId: group.chatRoomId, dispatch })
        }
    }
    const joinGroup = () => {
        if (group && nickname) {
            const joiningModel: JoiningModel = {
                nickname: nickname,
                groupId: group.id
            }
            groupService.insertUser(joiningModel, dispatch);
        }
    }

    const deleteJoinGroup = () => {
        if (group && nickname) {
            groupService.dropUser(nickname, group.id, dispatch)
        }
    }

    const groupConfirm = () => {
        setIsConfirmOpen(false);
        route.push('/');
    }
    const handleConfirm = () => {
        setIsConfirmOpen(false);
        route.push('/likeList');
    }

    const roomConfirm = (answer: string) => {
        if (room?.id) {
            switch (answer) {
                case "승인":
                    roomService.modifyConfirm(room?.id, dispatch);
                    break;
                case "거절":
                case "삭제":
                    roomService.drop(room?.id, dispatch);
                    route.back()
            }
        }

        route.push('/admin/rooms');
    }

    const isBookLiked = likebooks.some((likeBook) => likeBook.id === book?.id)
    const isRoomLiked = likeRooms.some((likeRoom) => likeRoom.id === room?.id)
    const isPostLiked = likePosts.some((likePost) => likePost.id === post?.id)

    console.log(isBookLiked)

    console.log(likeRooms)
    return (
        <>
            {userInfo === 'ROLE_ADMIN' && (
                <div className="flex items-end justify-center">
                    {room?.enabled && (
                        <button type="button" onClick={() => { roomConfirm("삭제") }} className="mx-2 rounded-lg border border-green-400 bg-green-400 px-3 py-2 font-medium text-white transition duration-300 hover:bg-green-500">삭제</button>
                    )}
                    {!room?.enabled && (
                        <>
                            <button type="button" onClick={() => { roomConfirm("승인") }} className="mx-2 rounded-lg border border-green-400 bg-green-400 px-3 py-2 font-medium text-white transition duration-300 hover:bg-green-500">승인</button>
                            <button type="button" onClick={() => { roomConfirm("거절") }} className="mx-2 rounded-lg border border-green-400 bg-green-400 px-3 py-2 font-medium text-white transition duration-300 hover:bg-green-500">거절</button>
                        </>
                    )}
                    <button type="button" onClick={() => { route.back() }} className="mx-2 rounded-lg border border-green-400 bg-green-400 px-3 py-2 font-medium text-white transition duration-300 hover:bg-green-500">
                        뒤로가기
                    </button>
                </div>
            )}
            {userInfo !== "ROLE_ADMIN" && (
                <>
                    <div className="my-4 flex items-end justify-center pb-8">
                        {thisPage !== '/groups' && (() => {
                            let isLiked;
                            switch (thisPage) {
                                case '/books':
                                    isLiked = isBookLiked;
                                    console.log(isLiked)
                                    break;
                                case '/rooms':
                                    isLiked = isRoomLiked;
                                    console.log(isLiked)
                                    break;
                                case '/groups/board/detail':
                                    isLiked = isPostLiked;
                                    break;
                                default:
                                    return null; // 해당되지 않는 페이지일 경우 렌더링하지 않음
                            }
                            // 좋아요 여부에 따른 버튼 렌더링
                            return (
                                isLiked ? (
                                    <button type="button" onClick={Message} className="rounded-lg border border-gray-200 bg-green-400 px-3 py-2 font-medium text-white transition duration-300 hover:bg-green-500">
                                        이미 좋아요 목록에 있습니다
                                    </button>
                                ) : (
                                    userInfo && (
                                        <button type="button" onClick={LikeThis} className="mx-2 rounded-lg border border-green-400 bg-green-400 px-3 py-2 font-medium text-white transition duration-300 hover:bg-green-500">
                                            🥰 좋아요 🥰
                                        </button>
                                    )
                                )
                            );
                        })()}

                        {/* 리뷰는 유저의 예약일이 접속일보다 과거면 버튼 띄우기 -> 해당 유저가 진짜 그 장소를 컨텍했는지에 따라 버튼 유무 결정할 것 */}
                        <button type="button" onClick={handleReview} className="mx-2 rounded-lg border border-green-400 bg-green-400 px-3 py-2 font-medium text-white transition duration-300 hover:bg-green-500"
                            style={{ display: displayReview }}
                        >
                            리뷰보기
                        </button>
                        {thisPage == '/rooms' && leaderGroups.length > 0 && (
                            <button type="button" onClick={() => setIsModalOpen(true)} className="mx-2 rounded-lg border border-green-400 bg-green-400 px-3 py-2 font-medium text-white transition duration-300 hover:bg-green-500"
                                style={{ display: displayReview }}
                            >
                                예약하기
                            </button>
                        )}
                        <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} id={room?.id ?? 0} />
                        {userInfo && thisPage === '/groups' && group && !isUserInGroup && !isPendingGroup && (
                            <button type="button" onClick={joinGroup} className="mx-2 rounded-lg border border-green-400 bg-green-400 px-3 py-2 font-medium text-white transition duration-300 hover:bg-green-500"
                                style={{ display: displayReservation }}
                            >
                                참여하기
                            </button>
                        )}
                        {isPendingGroup && thisPage === '/groups' &&
                            <button type="button" onClick={deleteJoinGroup} className="rounded-lg bg-green-400 px-3 py-2 text-white font-medium hover:bg-green-500 transition duration-300 border border-green-400 mx-2"
                                style={{ display: displayReservation }}
                            >
                                참여신청 취소
                            </button>
                        }
                        {nickname && thisPage === '/groups' && isUserInGroup && (
                            <>
                                {group.nickname !== nickname &&
                                    <button
                                        type="button"
                                        onClick={leaveGroup}
                                        className="mx-2 rounded-lg border border-green-400 bg-green-400 px-3 py-2 font-medium text-white transition duration-300 hover:bg-green-500"
                                        style={{ display: displayBoard }}
                                    >
                                        탈퇴하기
                                    </button>
                                }
                                {group.nickname === nickname &&
                                    <button
                                        type="button"
                                        onClick={deleteGroup}
                                        className="mx-2 rounded-lg border border-green-400 bg-green-400 px-3 py-2 font-medium text-white transition duration-300 hover:bg-green-500"
                                        style={{ display: displayBoard }}
                                    >
                                        모임 삭제 하기
                                    </button>
                                }
                                <button
                                    type="button"
                                    onClick={() => { route.push(`/groups/board/${group?.id}`) }}
                                    className="mx-2 rounded-lg border border-green-400 bg-green-400 px-3 py-2 font-medium text-white transition duration-300 hover:bg-green-500"
                                    style={{ display: displayBoard }}
                                >
                                    모임 공지가기
                                </button>
                            </>
                        )}
                        <button type="button" onClick={() => { route.back() }} className="mx-2 rounded-lg border border-green-400 bg-green-400 px-3 py-2 font-medium text-white transition duration-300 hover:bg-green-500">
                            뒤로가기
                        </button>
                    </div>
                    {nickname && thisPage === '/groups/board/detail' && isUserInGroup && (
                        <CommentBlock open={IsCommentOpen} />
                    )}
                </>

            )}

            <Alert
                message={alertMessage}
                isOpen={isAlertOpen}
                onClose={handleAlertClose}
            />
            {thisPage === '/rooms' && (
                <Alert
                    message="목록으로 이동하시겠습니까?"
                    isOpen={isConfirmOpen}
                    onClose={() => { setIsConfirmOpen(false) }}
                    onConfirm={handleConfirm}
                    showConfirm={true}
                />
            )}
            {thisPage === '/groups' && (
                <Alert
                    message="목록으로 이동하시겠습니까?"
                    isOpen={isConfirmOpen}
                    onClose={() => { setIsConfirmOpen(false) }}
                    onConfirm={groupConfirm}
                    showConfirm={true}
                />
            )}
        </>
    )
}