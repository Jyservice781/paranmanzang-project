import { AccountModel } from "./account.model";

// bookingTypes.ts
export interface BookingModel {
  id?: number;
  enabled: boolean;
  date: string;
  usingTime: string[]; //HH:00 형식
  roomId: number;
  groupId: number;
  roomName?: string;
  address?: string
  accountModel?: AccountModel
}

// 상태 인터페이스 정의
export interface BookingState {
  enabledBookings: { enableBookings: any;[groupId: number]: BookingModel[] };
  notEnabledBookings: { notEnabledBookings: any;[groupId: number]: BookingModel[] };
  payCompletedBookingsByGroup: { payCompletedBookingsByGroup: any;[groupId: number]: BookingModel[] };
  enabledRoomBookings: { enabledRoomBookings: any;[roomId: number]: BookingModel[] };
  notEnabledRoomBookings: { notEnabledRoomBookings: any;[roomId: number]: BookingModel[] };
  payCompletedBookings: { payCompletedBookings: any;[roomId: number]: BookingModel[] };
  currentBooking: BookingModel | null;
  isLoading: boolean;
  error: string | null;
  totalPageEnabledBooking: number
  totalPageDisabledBooking: number
  totalPageGroupBooking: number
  totalPageEnabledRoomBooking: number
  totalPageDisabledRoomBooking: number
  totalPagePayCompletedBooking: number
  totalPagePayCompletedBookingsByGroup: number
}

// 초기 상태
export const initialBookingState: BookingState = {
  enabledBookings: { enableBookings: null },
  notEnabledBookings: { notEnabledBookings: null },
  enabledRoomBookings: { enabledRoomBookings: null },
  notEnabledRoomBookings: { notEnabledRoomBookings: null },
  payCompletedBookings: { payCompletedBookings: null },
  payCompletedBookingsByGroup: { payCompletedBookingsByGroup: null },
  currentBooking: null,
  isLoading: false,
  error: null,
  totalPageEnabledBooking: 0,
  totalPageDisabledBooking: 0,
  totalPageGroupBooking: 0,
  totalPageEnabledRoomBooking: 0,
  totalPageDisabledRoomBooking: 0,
  totalPagePayCompletedBooking: 0,
  totalPagePayCompletedBookingsByGroup: 0,
};