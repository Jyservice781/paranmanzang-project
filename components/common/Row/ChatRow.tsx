"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { useAppDispatch } from "@/lib/store";
import { getNickname } from "@/lib/features/users/user.slice";
import { ChatRoomModel } from "@/models/chat/chat.model";
import { chatRoomService } from "@/services/chat/chatRoom-service";
import ChatCard from "./ChatCard";
import { getUserGroups } from "@/lib/features/group/group.slice";
interface ChatRowProps {
  active: boolean;
  onSelect: () => void;
}

const ChatRow = ({ active, onSelect }: ChatRowProps) => {
  const nickname = useSelector(getNickname) as string;
  const dispatch = useAppDispatch();
  const [chatRooms, setChatRooms] = useState<ChatRoomModel[] | null>(null)
  const myGroups = useSelector(getUserGroups).filter((group) => group.enabled === true)

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const result: ChatRoomModel[] = await chatRoomService.findList({ nickname, dispatch });
        setChatRooms(result.filter((chatRoom) =>
          myGroups.some((group) => group.chatRoomId === chatRoom.roomId)
        ));
      } catch (error) {
        console.error("Error fetching chat rooms:", error);
      }
    };

    fetchChatRooms();
  }, [nickname, dispatch]);

  return (
    <>
      <div className="w-[92%] mb-4 ml-4 grid grid-cols-4 gap-8 md:grid-cols-3">
        {chatRooms?.map((room, index) => (
          <ChatCard key={index}
            chatRoom={room} active={active} onSelect={onSelect} />
        ))}
      </div>
    </>
  );
};

export default ChatRow;