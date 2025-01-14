import React, { useEffect } from 'react';
import GroupRow from "./GroupRow";
import RoomRow from "./RoomRow";
import BookRow from "./BookRow";
import ChatRow from "./ChatRow";
import MyGroupRow from './MyGroupRow';
import { useSelector } from 'react-redux';
import { getNickname } from '@/app/api/authUtils';
import { useAppDispatch } from '@/lib/store';
import { groupService } from '@/services/group/group-service';

interface ContentAreaProps {
  activeTab: string
}

const ContentArea = ({ activeTab }: ContentAreaProps) => {
  const dispatch = useAppDispatch()
  const nickname = useSelector(getNickname)
  useEffect(() => {
    if (nickname && activeTab === "MyGroups") {
      groupService.findByNickname(nickname, dispatch)
    }
  }, [activeTab]);
  
  const renderActiveContent = () => {
    switch (activeTab) {
      case "Groups":
        return <GroupRow active={true} onSelect={() => { }} />;
      case "Rooms":
        return <RoomRow active={true} onSelect={() => { }} />;
      case "Books":
        return <BookRow active={true} onSelect={() => { }} />;
      case "Chats":
        return <ChatRow active={true} onSelect={() => { }} />
      case "MyGroups":
        return <MyGroupRow active={true} onSelect={() => { }} />
      default:
        return null
    }
  };



  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div>
        {renderActiveContent()}
      </div>
    </div>
  );
};

export default ContentArea;