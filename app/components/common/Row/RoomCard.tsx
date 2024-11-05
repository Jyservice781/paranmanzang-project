import Image from 'next/image';
import { RoomModel } from '@/app/model/room/room.model';
import { FileModel } from '@/app/model/file/file.model';
import { useAppDispatch } from '@/lib/store';
import { useRouter } from 'next/router';
import { saveCurrentRoom } from '@/lib/features/room/room.slice';
import { saveCurrentFile } from '@/lib/features/file/file.slice';

interface RoomCardProps {
  room: RoomModel
  isActive: boolean
  onSelect: () => void
  file: FileModel;
}

export default function RoomCard({ room, isActive, file, onSelect }: RoomCardProps){
  
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onClickToDetail = () => {
      dispatch(saveCurrentRoom(room));
      dispatch(saveCurrentFile(file));
      router.push(`/rooms/${room.id}`);
  };

 

  return (
    <div key={room.id}>
    <div
      className={`max-w-80 rounded-lg border border-gray-200 bg-white shadow ${isActive ? 'ring-2 ring-green-500' : ''}`}
      onClick={onSelect}
    >
      <Image
          width={600}
          height={400}
          className="cursor-pointer rounded-lg bg-green-400"
          src={file.path === process.env.NEXT_PUBLIC_IMAGE_DEFAULT ? process.env.NEXT_PUBLIC_IMAGE_DEFAULT : `http://api.paranmanzang.com/api/files?path=${file.path}`}
          alt={`cover of ${room?.name}`}
          priority
          unoptimized
      />
      <div className="p-5">
        <h5
          className={`mb-2 text-lg font-medium tracking-tight ${isActive ? 'text-green-600' : 'text-gray-900'}`}
        >
          {room.name}
        </h5>
        <p className="mb-3 text-sm font-medium text-gray-700">
          {room.price.toLocaleString("ko-kr")}원
        </p>
        <p className="text-sm font-medium">판매자: {room.nickname}</p>
        <button
          onClick={() => onClickToDetail()}
          className={`mt-5 inline-flex w-full items-center rounded-lg p-3 text-sm font-medium text-white ${isActive
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-green-400 hover:bg-green-500'
            }`}
        >
          상세보기
          <svg
            className="ms-2 size-3.5 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
  )
}  