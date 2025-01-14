"use client";
import RoomDetails from "@/components/common/Details/RoomDetails";
import { useParams } from "next/navigation";

export default function Rooms() {
  const param = useParams();

  return (
    <div>
      <RoomDetails />
    </div>
  );
}
