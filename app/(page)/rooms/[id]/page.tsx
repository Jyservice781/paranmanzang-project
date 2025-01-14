"use client";
import RoomDetails from "@/components/common/Details/RoomDetails";
import { useParams } from "next/navigation";

interface RoomIdProps {
  params: {
    id: string
  }
}
export default function RoomOne({ params }: RoomIdProps) {
  return (
    <div>
      <RoomDetails />
    </div>
  );
}
