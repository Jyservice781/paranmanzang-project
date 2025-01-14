"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import Alert from "../common/Alert";
import { RoomUpdateModel } from "@/models/room/room.model";
import { useSelector } from "react-redux";
import { roomService } from "@/services/room/room-service";
import { useAppDispatch } from "@/lib/store";
import { getCurrentRoom } from "@/lib/features/room/room.slice";

export default function RoomUpdate() {
  const room = useSelector(getCurrentRoom)
  const [formData, setFormData] = useState<RoomUpdateModel>({
    id: room?.id,
    name: '',
    maxPeople: 0,
    opened: false,
    openTime: '00:00',
    closeTime: '24:00',
    price: 0,
  });

  const route = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'radio' ? value === 'true' : value
    }));
  };

  const handleTimeChange = (timeType: 'openTime' | 'closeTime', part: 'hour' | 'minute', value: string) => {
    setFormData(prevState => {
      const [hour, minute] = prevState[timeType].split(':');
      const newTime = part === 'hour' ? `${value}:${minute}` : `${hour}:${value}`;
      return { ...prevState, [timeType]: newTime };
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    roomService.modify(formData, dispatch);
  }

  const onCreate = () => {
    setIsOpen(true);
  }

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));


  const TimeSelector = ({ label, timeType }: { label: string, timeType: 'openTime' | 'closeTime' }) => (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-900">{label}</label>
      <div className="flex space-x-2">
        <select
          value={formData[timeType].split(':')[0]}
          onChange={(e) => handleTimeChange(timeType, 'hour', e.target.value)}
          className="rounded-lg border border-green-300 bg-green-50 px-6 py-3 text-sm text-green-900 focus:border-green-500 focus:ring-green-500"
        >
          {hours.map(hour => (
            <option key={hour} value={hour}>{hour} : 00</option>
          ))}
        </select>
      </div>
    </div>
  );

  const goBack = () => {
    route.back()
  }

  return (
    <div className="mx-auto my-8 max-w-lg rounded-lg bg-green-50 p-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-900">공간 이름</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="공간의 이름을 적어주세요" className="block w-full rounded-lg border border-green-300 bg-green-50 p-2.5 text-sm text-green-900 focus:border-green-500 focus:ring-green-500" />
        </div>

        <div className="mb-4">
          <label htmlFor="maxPeople" className="mb-2 block text-sm font-medium text-gray-900 ">정원 수</label>
          <input type="number" id="maxPeople" name="maxPeople" value={formData.maxPeople} onChange={handleChange} className="block w-full rounded-lg border border-green-300 bg-green-50 p-2.5 text-sm text-green-900 focus:border-green-500 focus:ring-green-500" />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-900">공유 오피스인가요?</label>
          <div className="mb-2 flex items-center">
            <input type="radio" id="aloneYes" name="opened" value="true" checked={formData.opened === true} onChange={handleChange} className="size-4 border-gray-300 bg-gray-100 text-green-600 focus:ring-2 focus:ring-green-500" />
            <label htmlFor="aloneYes" className="ml-2 text-sm font-medium text-gray-900 ">네</label>
          </div>
          <div className="flex items-center">
            <input type="radio" id="aloneNo" name="opened" value="false" checked={formData.opened === false} onChange={handleChange} className="size-4 border-gray-300 bg-gray-100 text-green-600 focus:ring-2 focus:ring-green-500 " />
            <label htmlFor="aloneNo" className="ml-2 text-sm font-medium text-gray-900">아니오</label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900">이용가능 시간</label>
          <span className="my-2 text-xs text-blue-600">00 시는 오전 12시입니다 이용에 착오없으시길 바랍니다</span>
          <div className="flex items-center space-x-4">
            <TimeSelector label="시작 시간" timeType="openTime" />
            <TimeSelector label="종료 시간" timeType="closeTime" />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="mb-2 block text-sm font-medium text-gray-900 ">이용 금액</label>
          <input type="text" id="price" name="price" value={formData.price} onChange={handleChange} placeholder="이용금액을 적어주세요" className="block w-full rounded-lg border border-green-300 bg-green-50 p-2.5 text-sm text-green-900 focus:border-green-500 focus:ring-green-500" />
        </div>

        <button type="submit" onClick={onCreate} className="w-full rounded-lg bg-green-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 sm:w-auto">수정하기</button>
        <button type="button" onClick={goBack} className="mx-2 w-full rounded-lg border-green-600 bg-green-50 px-5 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-green-100 focus:outline-none focus:ring-4 focus:ring-green-300 sm:w-auto">뒤로가기</button>
      </form>
      <Alert message={'수정되었습니다.'} isOpen={isOpen} onClose={() => { setIsOpen(false) }} />
    </div>
  )
}