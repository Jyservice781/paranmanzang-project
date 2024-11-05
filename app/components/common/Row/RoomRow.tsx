"use client";
import React, { useEffect, useState } from "react";
import { getError, getIsLoading, getRooms, getTotalPageEnabledRoom, saveCurrentRoom } from "@/lib/features/room/room.slice";
import { useAppDispatch } from "@/lib/store";
import { useSelector } from "react-redux";
import { roomService } from "@/app/service/room/room.service";
import { getFiles, saveCurrentFile } from "@/lib/features/file/file.slice";
import Pagination from "./pagination/Pagination";
import RoomCard from "./RoomCard";
import { useRouter } from "next/navigation";
import { getAddresses, saveCurrentAddress } from "@/lib/features/room/address.slice";
import { defaultFile, FileModel, FileType } from "@/app/model/file/file.model";
import LoadingSpinner from "../status/LoadingSpinner";
import ErrorMessage from "../status/ErrorMessage";

interface RoomRowProps {
  active: boolean;
  onSelect: () => void;
}

const RoomRow = ({ active, onSelect }: RoomRowProps) => {
  const rooms = useSelector(getRooms)
  const files = useSelector(getFiles)
  const addresses = useSelector(getAddresses)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const isLoading = useSelector(getIsLoading)
  const error = useSelector(getError)

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(9);
  const totalPages = useSelector(getTotalPageEnabledRoom)

  useEffect(() => {
    roomService.findByEnabled(page, pageSize, dispatch);
  }, [page, pageSize, dispatch])

  const onClickToDetail = (currentId: number | undefined): void => {
    if (currentId !== undefined) {
      const currentRoom = rooms.find(({ id }) => id === currentId);
      if (currentRoom) {
        dispatch(saveCurrentRoom(currentRoom));
        dispatch(saveCurrentFile(files.roomFiles.find(({ refId }) => refId === currentId) ?? {} as FileModel));
        dispatch(saveCurrentAddress(addresses.find(({ roomId }) => roomId === currentId) ?? null))
        router.push(`/rooms/${currentId}`);
      }
    }
  };

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <>
      <div className="w-[92%] mb-4 ml-4 grid grid-cols-4 gap-8 md:grid-cols-3">
        {rooms.map((room, index) => (
          <RoomCard
            key={index}
            room={room}
            isActive={active}
            file={files.roomFiles.find(file => file.refId === room.id) ?? defaultFile(FileType.ROOM, Number(room.id))}
            onSelect={onSelect}
            onClickToDetail={onClickToDetail}
          />
        ))}
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </>
  );
};

export default RoomRow;