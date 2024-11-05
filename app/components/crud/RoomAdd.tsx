"use client"
import { useRouter } from "next/navigation";
import { useState, ChangeEvent } from "react";
import Alert from "../common/Alert";
import { useAppDispatch } from "@/lib/store";
import { roomService } from "@/app/service/room/room.service";
import { RoomModel } from "@/app/model/room/room.model";
import { useSelector } from "react-redux";
import { getCurrentUser } from "@/lib/features/users/user.slice";
import { AddressModel, AddressResponseModel, QueryModel } from "@/app/model/room/address.model";
import { addressService } from "@/app/service/room/address.service";
import NaverMapAdd from "../common/NaverMapAdd";

export default function RoomAdd() {
  const user = useSelector(getCurrentUser)
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [mapState, setMapState] = useState(false);
  const [data, setData] = useState<AddressResponseModel[]>([]);
  const [lalngModel, setlalngModel] = useState<AddressModel>();
  const [formData, setFormData] = useState<RoomModel>({
    name: '',
    maxPeople: 0,
    opened: false,
    openTime: '00:00',
    closeTime: '24:00',
    price: 0,
    enabled: false,
    nickname: user?.nickname as string
  });

  const [address, setAddress] = useState<string>('')

  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const [imageFile, setImageFile] = useState<File | null>(null); // 단일 파일


  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'radio' ? value === 'true' : value
    }));
  };

  // 이미지 올리기
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file); // 첫 번째 파일 저장
    }
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
    if (lalngModel) {
      roomService.save(formData, imageFile, lalngModel, dispatch);
    }
    router.push('/seller/rooms')
  };

  const goBack = () => {
    router.back();
  };

  const onCreate = () => {
    setIsOpen(true);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));

  const TimeSelector = ({ label, timeType }: { label: string, timeType: 'openTime' | 'closeTime' }) => (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
      <div className="flex space-x-2">
        <select
          value={formData[timeType].split(':')[0]}
          onChange={(e) => handleTimeChange(timeType, 'hour', e.target.value)}
          className="bg-green-50 border border-green-300 text-green-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 px-6 py-3"
        >
          {hours.map(hour => (
            <option key={hour} value={hour}>{hour} : 00</option>
          ))}
        </select>
      </div>
    </div>
  );

  const onMap = (addr: AddressResponseModel) => {
    setMapState(true)
    setData([addr])
    setLongitude(parseFloat(addr.mapx.slice(0, addr.mapx.length - 7) + "." + addr.mapx.slice(-7)))
    setLatitude(parseFloat(addr.mapy.slice(0, addr.mapy.length - 7) + "." + addr.mapy.slice(-7)))
    setlalngModel({
      detailAddress: addr.title,
      latitude: parseFloat(addr.mapy.slice(0, addr.mapy.length - 7) + "." + addr.mapy.slice(-7)),
      longitude: parseFloat(addr.mapx.slice(0, addr.mapx.length - 7) + "." + addr.mapx.slice(-7)),
      address: addr.roadAddress,
      roomId: 0,
    })
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
    const queryModel: QueryModel = {
      query: address
    } // 상태 업데이트
    addressService.search(queryModel, dispatch)
      .then((response) => {
        console.log("room add search", response)
        setData(response)
      })
  };

  return (
    <div className="max-w-lg mx-auto bg-green-50 my-8 rounded-lg p-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">공간 이름</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="공간의 이름을 적어주세요" className="bg-green-50 border border-green-300 text-green-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5" />
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900">주소 입력</label>
          <input type="text" id="address" name="address" value={address} onChange={handleInputChange} placeholder="공간의 주소를 입력해주세요" className="bg-green-50 border border-green-300 text-green-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5" />
          <ul>
            {(Array.isArray(data) ? data : []).map((addr, index) => (
              <li key={index} onClick={() => onMap(addr)}>
                {addr.title}
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <label htmlFor="maxPeople" className="block mb-2 text-sm font-medium text-gray-900">정원 수</label>
          <input type="number" id="maxPeople" name="maxPeople" value={formData.maxPeople} onChange={handleChange} className="bg-green-50 border border-green-300 text-green-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5" />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900">공유 오피스인가요?</label>
          <div className="flex items-center mb-2">
            <input type="radio" id="aloneYes" name="opened" value="true" checked={formData.opened === true} onChange={handleChange} className="size-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 focus:ring-2 " />
            <label htmlFor="aloneYes" className="ml-2 text-sm font-medium text-gray-900">네</label>
          </div>
          <div className="flex items-center">
            <input type="radio" id="aloneNo" name="opened" value="false" checked={formData.opened === false} onChange={handleChange} className="size-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500  focus:ring-2" />
            <label htmlFor="aloneNo" className="ml-2 text-sm font-medium text-gray-900">아니오</label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900">이용가능 시간</label>
          <span className="text-xs my-2 text-blue-600">00 시는 오전 12시입니다 이용에 착오없으시길 바랍니다</span>
          <div className="flex items-center space-x-4">
            <TimeSelector label="시작 시간" timeType="openTime" />
            <TimeSelector label="종료 시간" timeType="closeTime" />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900">이용 금액</label>
          <input type="text" id="price" name="price" value={formData.price} onChange={handleChange} placeholder="시간당 이용금액을 적어주세요" className="bg-green-50 border border-green-300 text-green-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5" />
        </div>
        <div className="my-4">
          <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700 mb-2">
            {/* 이미지 업로드 */}
          </label>
          <input
            type="file"
            id="imageUpload"
            onChange={handleImageUpload}
            accept="image/*"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
          />
          {imageFile && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">{imageFile.name}</p>
            </div>
          )}
        </div>

        <button type="submit" onClick={onCreate} className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">등록하기</button>
        <button type="button" onClick={goBack} className="text-gray-900 bg-green-50 hover:bg-green-100 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 mx-2 border-green-600 text-center">뒤로가기</button>
      </form>
      {mapState && (
        <NaverMapAdd latitude={latitude} longitude={longitude} zoom={15} />
      )}
      <Alert message={'등록되었습니다.'} isOpen={isOpen} onClose={() => { setIsOpen(false) }} />
    </div>
  )
}