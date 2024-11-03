// bookingTypes.ts
export interface BookingModel {
  id?: number;
  enabled: boolean;
  date: string;
  usingTime: string[]; //HH:00 형식
  roomId: number;
  groupId: number;
}

// 상태 인터페이스 정의
export interface BookingState {
  bookings: BookingModel[];
  enabledBookings: BookingModel[];
  notEnabledBookings: BookingModel[];
  enabledRoomBookings: BookingModel[];
  notEnabledRoomBookings: BookingModel[];
  currentBooking: BookingModel | null;
  isLoading: boolean;
  error: string | null;
  totalPageEnabledBooking: number
  totalPageDisabledBooking: number
  totalPageGroupBooking: number
  totalPageEnabledRoomBooking: number
  totalPageDisabledRoomBooking: number
}

// 초기 상태
export const initialBookingState: BookingState = {
  bookings: [],
  enabledBookings: [],
  notEnabledBookings: [],
  enabledRoomBookings: [],
  notEnabledRoomBookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,
  totalPageEnabledBooking: 0,
  totalPageDisabledBooking: 0,
  totalPageGroupBooking: 0,
  totalPageEnabledRoomBooking: 0,
  totalPageDisabledRoomBooking: 0
};