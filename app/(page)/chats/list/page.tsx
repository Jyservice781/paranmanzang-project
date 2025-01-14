"use client";
import CardRow from "@/components/chat/CardRow";
import { ChatRoomModel } from "@/models/chat/chat.model";
import { chatRoomService } from "@/services/chat/chatRoom-service";
import { useAppDispatch } from "@/lib/store";
import { useEffect, useState } from "react";
import { getNickname } from "@/lib/features/users/user.slice";
import { useSelector } from "react-redux";

export default function ChatList() {
  const nickname = useSelector(getNickname) as string;
  const dispatch = useAppDispatch();
  const [chatRooms, setChatRooms] = useState<ChatRoomModel[] | null>(null)

  useEffect(() => {
    chatRoomService.findList({ nickname, dispatch })
      .then(result => {
        setChatRooms(result);
      })
  }, [nickname, dispatch]);

  return (
    <div className="mx-auto my-6 grid w-full max-w-lg grid-cols-2 gap-3">
      {chatRooms?.map((room) => (
        <CardRow key={room.roomId}
          chatRoom={room} />
      ))}
    </div>
  );
}
