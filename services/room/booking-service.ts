import { BookingModel } from '@/models/room/bookings.model';
import { AppDispatch } from '@/lib/store';
import { bookingAPI } from '@/app/api/generate/booking.api';
import { addBooking, removeBooking, saveLoading, savePayCompletedBookings, savePayCompletedBookingsByGroup, saveSeparatedBookings, saveSeparatedRoomBookings, saveTotalPageDisabledBooking, saveTotalPageDisabledRoomBooking, saveTotalPageEnabledBooking, saveTotalPageEnabledRoomBooking, saveTotalPageGroupBooking, saveTotalPagePayCompletedBooking, updateBooking } from '@/lib/features/room/booking.slice';

// 예약 등록
const save = async (bookingModel: BookingModel, dispatch: AppDispatch): Promise<void> => {
  try {
    dispatch(saveLoading(true))
    const response = await bookingAPI.insert(bookingModel);
    console.log("예약 등록: ", response)
    dispatch(addBooking(response.data))
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
const drop = async (bookingModel: BookingModel, dispatch: AppDispatch): Promise<void> => {
  try {
    dispatch(saveLoading(true))
    console.log("booking drop - service 부분임", bookingModel.id)
    const response = await bookingAPI.drop(Number(bookingModel.id))
    console.log("booking drop - result: ", response)
    dispatch(removeBooking(bookingModel))
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

// 소모임 예약 조회 (스케쥴, 결제 O)
const findPayCompletedByGroupId = async (groupId: number, page: number, size: number, dispatch: AppDispatch): Promise<void> => {
  try {
    dispatch(saveLoading(true))
    const response = await bookingAPI.findPayCompletedByGroup(groupId, page, size)
    dispatch(savePayCompletedBookingsByGroup(response.data.content))
    dispatch(saveTotalPagePayCompletedBooking(response.data.totalPages))
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

const findEnabledByGroup = async (groupId: number, page: number, size: number, dispatch: AppDispatch): Promise<void> => {
  try {
    dispatch(saveLoading(true))
    const response = await bookingAPI.findEnabledByGroup(groupId, page, size)
    dispatch(saveSeparatedBookings(response.data.content))
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
const findDisabledByGroup = async (groupId: number, page: number, size: number, dispatch: AppDispatch): Promise<void> => {
  try {
    dispatch(saveLoading(true))
    const response = await bookingAPI.findDisabledByGroup(groupId, page, size)
    dispatch(saveSeparatedBookings(response.data.content))
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

const findEnabledByRoom = async (roomId: number, page: number, size: number, dispatch: AppDispatch): Promise<void> => {
  try {
    dispatch(saveLoading(true))
    const response = await bookingAPI.findEnabledByRoom(roomId, page, size)
    dispatch(saveSeparatedRoomBookings(response.data.content))
    dispatch(saveTotalPageEnabledRoomBooking(response.data.totalPages))
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
const findDisabledByRoom = async (roomId: number, page: number, size: number, dispatch: AppDispatch): Promise<void> => {
  try {
    dispatch(saveLoading(true))
    const response = await bookingAPI.findDisabledByRoom(roomId, page, size)
    dispatch(saveSeparatedRoomBookings(response.data.content))
    dispatch(saveTotalPageDisabledRoomBooking(response.data.totalPages))
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

const findPayCompletedByRoom = async (roomId: number, page: number, size: number, dispatch: AppDispatch): Promise<void> => {
  try {
    dispatch(saveLoading(true))
    const response = await bookingAPI.findPayCompletedByRoom(roomId, page, size)
    dispatch(savePayCompletedBookings(response.data.content))
    dispatch(saveTotalPagePayCompletedBooking(response.data.totalPages))
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
  findPayCompletedByGroupId, findEnabledByGroup, findDisabledByGroup, findEnabledByRoom, findDisabledByRoom, findPayCompletedByRoom
}

