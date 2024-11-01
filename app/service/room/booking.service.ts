import { BookingModel } from '@/app/model/room/bookings.model';
import { AppDispatch } from '@/lib/store';
import { addBooking, addRoomBooking, removeBooking, removeRoomBooking, saveBookings, saveLoading, saveSeperatedBookings, saveSeperatedRoomBookings, saveTotalPageDisabledBooking, saveTotalPageDisabledRoomBoking, saveTotalPageEnabledBooking, saveTotalPageEnabledRoomBoking, saveTotalPageGroupBooking, updateBooking, updateRoomBooking } from '@/lib/features/room/booking.slice';
import { bookingAPI } from '@/app/api/generate/booking.api';

// 예약 등록
const save = async (bookingModel: BookingModel, dispatch: AppDispatch): Promise<void> => {
  try {
    dispatch(saveLoading(true))
    const response = await bookingAPI.insert(bookingModel);
    console.log("예약 등록: ", response)
    dispatch(addBooking(response.data))
    dispatch(addRoomBooking(response.data))
  } catch (error: any) {
    if (error.response) {
      console.error('Server Error:', error.response.data);
      throw new Error('서버에서 오류가 발생했습니다.');
    } else if (error.request) {
      console.error('No Response:', error.request);
      throw new Error('서버 응답이 없습니다.');
    } else {
      console.error('Error:', error.message);
      throw new Error('요청 중 오류 발생');
    }
  }
};

// 예약 상태 업데이트 (승인)
const modify = async (id: number, dispatch: AppDispatch): Promise<void> => {
  try {
    dispatch(saveLoading(true))
    const response = await bookingAPI.modify(id)
    dispatch(updateBooking(response.data))
    dispatch(updateRoomBooking(response.data))
  } catch (error: any) {
    if (error.response) {
      console.error('Server Error:', error.response.data);
      throw new Error('서버에서 오류가 발생했습니다.');
    } else if (error.request) {
      console.error('No Response:', error.request);
      throw new Error('서버 응답이 없습니다.');
    } else {
      console.error('Error:', error.message);
      throw new Error('요청 중 오류 발생');
    }
  }
};


// 예약 삭제 (취소), 예약 거절 (삭제)
const drop = async (id: number, dispatch: AppDispatch): Promise<void> => {
  try {
    dispatch(saveLoading(true))
    console.log("booking drop - service 부분임", id)
    const response = await bookingAPI.drop(id)
    console.log("booking drop - result: ", response)
    dispatch(removeBooking(id))
    dispatch(removeRoomBooking(id))
  } catch (error: any) {
    if (error.response) {
      console.error('Server Error:', error.response.data);
      throw new Error('서버에서 오류가 발생했습니다.');
    } else if (error.request) {
      console.error('No Response:', error.request);
      throw new Error('서버 응답이 없습니다.');
    } else {
      console.error('Error:', error.message);
      throw new Error('요청 중 오류 발생');
    }
  }
};

// 소모임 예약 조회
const findByGroupId = async (groupId: number, page: number, size: number, dispatch: AppDispatch): Promise<void> => {
  try {
    dispatch(saveLoading(true))
    const response = await bookingAPI.findByGroup(groupId, page, size)
    dispatch(saveBookings(response.data.content))
    dispatch(saveTotalPageGroupBooking(response.data.totalPages))
  } catch (error: any) {
    if (error.response) {
      console.error('Server Error:', error.response.data);
      throw new Error('서버에서 오류가 발생했습니다.');
    } else if (error.request) {
      console.error('No Response:', error.request);
      throw new Error('서버 응답이 없습니다.');
    } else {
      console.error('Error:', error.message);
      throw new Error('요청 중 오류 발생');
    }
  }
};
// 소모임들 예약 조회
const findEnabledByGroups = async (groupIds: number[], page: number, size: number, dispatch: AppDispatch): Promise<void> => {
  try {
    dispatch(saveLoading(true))
    const response = await bookingAPI.findEnabledByGroups(groupIds, page, size)
    dispatch(saveSeperatedBookings(response.data.content))
    dispatch(saveTotalPageEnabledBooking(response.data.totalPages))
  } catch (error: any) {
    if (error.response) {
      console.error('Server Error:', error.response.data);
      throw new Error('서버에서 오류가 발생했습니다.');
    } else if (error.request) {
      console.error('No Response:', error.request);
      throw new Error('서버 응답이 없습니다.');
    } else {
      console.error('Error:', error.message);
      throw new Error('요청 중 오류 발생');
    }
  }
};
const findDisabledByGroups = async (groupIds: number[], page: number, size: number, dispatch: AppDispatch): Promise<void> => {
  try {
    dispatch(saveLoading(true))
    const response = await bookingAPI.findDisabledByGroups(groupIds, page, size)
    dispatch(saveSeperatedBookings(response.data.content))
    dispatch(saveTotalPageDisabledBooking(response.data.totalPages))
  } catch (error: any) {
    if (error.response) {
      console.error('Server Error:', error.response.data);
      throw new Error('서버에서 오류가 발생했습니다.');
    } else if (error.request) {
      console.error('No Response:', error.request);
      throw new Error('서버 응답이 없습니다.');
    } else {
      console.error('Error:', error.message);
      throw new Error('요청 중 오류 발생');
    }
  }
};

// 공간 예약 조회
const findEnabledByRoom = async (nickname:string, page: number, size: number, dispatch: AppDispatch): Promise<void> => {
  try {
    dispatch(saveLoading(true))
    const response = await bookingAPI.findEnabledByRoom(nickname, page, size)
    dispatch(saveSeperatedRoomBookings(response.data.content))
    dispatch(saveTotalPageEnabledRoomBoking(response.data.totalPages))
  } catch (error: any) {
    if (error.response) {
      console.error('Server Error:', error.response.data);
      throw new Error('서버에서 오류가 발생했습니다.');
    } else if (error.request) {
      console.error('No Response:', error.request);
      throw new Error('서버 응답이 없습니다.');
    } else {
      console.error('Error:', error.message);
      throw new Error('요청 중 오류 발생');
    }
  }
};
const findDisabledByRoom = async (nickname: string, page: number, size: number, dispatch: AppDispatch): Promise<void> => {
  try {
    dispatch(saveLoading(true))
    const response = await bookingAPI.findDisabledByRoom(nickname, page, size)
    dispatch(saveSeperatedRoomBookings(response.data.content))
    dispatch(saveTotalPageDisabledRoomBoking(response.data.totalPages))
  } catch (error: any) {
    if (error.response) {
      console.error('Server Error:', error.response.data);
      throw new Error('서버에서 오류가 발생했습니다.');
    } else if (error.request) {
      console.error('No Response:', error.request);
      throw new Error('서버 응답이 없습니다.');
    } else {
      console.error('Error:', error.message);
      throw new Error('요청 중 오류 발생');
    }
  }
};

export const bookingService = {
  save, modify, drop,
  findByGroupId, findEnabledByGroups, findDisabledByGroups, findEnabledByRoom,findDisabledByRoom
}

