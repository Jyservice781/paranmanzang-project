// bookingSlice.ts

import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialBookingState, BookingModel } from '../../../app/model/room/bookings.model';
import { RootState } from '../../store'

const bookingSlice = createSlice({
    name: 'booking',
    initialState: initialBookingState,
    reducers: {
        saveBookings: (state, action: PayloadAction<BookingModel[]>) => {
            state.bookings = action.payload;
        },
        saveSeparatedBookings: (state, action: PayloadAction<BookingModel[]>) => {
            state.enabledBookings = action.payload.filter(booking => booking.enabled);
            state.notEnabledBookings = action.payload.filter(booking => !booking.enabled);
        },
        saveSeparatedRoomBookings: (state, action: PayloadAction<BookingModel[]>) => {
            state.enabledRoomBookings = action.payload.filter(booking => booking.enabled);
            state.notEnabledRoomBookings = action.payload.filter(booking => !booking.enabled);
        },
        addBooking: (state, action: PayloadAction<BookingModel>) => {
            state.notEnabledBookings.push(action.payload);
            state.bookings.push(action.payload)
        },
        addRoomBooking: (state, action: PayloadAction<BookingModel>) => {
            state.notEnabledRoomBookings.push(action.payload);
        },
        updateBooking: (state, action: PayloadAction<BookingModel>) => {
            const booking = state.notEnabledBookings.find(booking => booking.id === action.payload.id);
            const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
            if (booking) {
                state.enabledBookings.push(booking)
                state.notEnabledBookings = state.notEnabledBookings.filter(booking => booking.id !== action.payload.id)
                state.bookings[index] = action.payload;
            }
        },
        updateRoomBooking: (state, action: PayloadAction<BookingModel>) => {
            const booking = state.notEnabledRoomBookings.find(booking => booking.id === action.payload.id);
            if (booking) {
                state.enabledRoomBookings.push(booking)
                state.notEnabledRoomBookings = state.notEnabledRoomBookings.filter(booking => booking.id !== action.payload.id)
            }
        },
        removeBooking: (state, action: PayloadAction<number>) => {
            state.notEnabledBookings = state.notEnabledBookings.filter(booking => booking.id !== action.payload);
            state.bookings = state.bookings.filter(booking => booking.id !== action.payload);
        },
        removeRoomBooking: (state, action: PayloadAction<number>) => {
            state.notEnabledRoomBookings = state.notEnabledRoomBookings.filter(booking => booking.id !== action.payload);
        },
        saveCurrentBooking: (state, action: PayloadAction<BookingModel | null>) => {
            state.currentBooking = action.payload;
        },
        saveLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        saveError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        saveTotalPageEnabledBooking: (state, action: PayloadAction<number>) => {
            state.totalPageEnabledBooking = action.payload;
        },
        saveTotalPageDisabledBooking: (state, action: PayloadAction<number>) => {
            state.totalPageDisabledBooking = action.payload;
        },
        saveTotalPageGroupBooking: (state, action: PayloadAction<number>) => {
            state.totalPageGroupBooking = action.payload;
        },
        saveTotalPageEnabledRoomBooking: (state, action: PayloadAction<number>) => {
            state.totalPageEnabledRoomBooking = action.payload;
        },
        saveTotalPageDisabledRoomBooking: (state, action: PayloadAction<number>) => {
            state.totalPageDisabledRoomBooking = action.payload;
        },
    },
});

export const getSeparatedBookings = createSelector(
    (state: RootState) => state.bookings.enabledBookings,
    (state: RootState) => state.bookings.notEnabledBookings,
    (enabledBookings, notEnabledBookings) => ({
        enabledBookings,
        notEnabledBookings
    })
)

export const getBookings = (state:RootState) => state.bookings.bookings
export const getCurrentBooking = (state: RootState) => state.bookings.currentBooking;
export const getIsLoading = (state: RootState) => state.bookings.isLoading;
export const getError = (state: RootState) => state.bookings.error;
export const getEnabledBooking = (state: RootState) => state.bookings.enabledBookings
export const getNotEnabledBooking = (state: RootState) => state.bookings.notEnabledBookings
export const getTotalPageEnabledBooking = (state: RootState) => state.bookings.totalPageEnabledBooking
export const getTotalPageDisabledBooking = (state: RootState) => state.bookings.totalPageDisabledBooking
export const getTotalPageGroupBooking = (state: RootState) => state.bookings.totalPageGroupBooking
export const getTotalPageEnabledRoomBooking = (state: RootState) => state.bookings.totalPageEnabledRoomBooking
export const getTotalPageDisabledRoomBooking = (state: RootState) => state.bookings.totalPageDisabledRoomBooking

export const {
    saveBookings,
    saveSeparatedRoomBookings,
    addBooking,
    addRoomBooking,
    updateBooking,
    updateRoomBooking,
    removeBooking,
    removeRoomBooking,
    saveSeparatedBookings,
    saveCurrentBooking,
    saveLoading,
    saveError,
    saveTotalPageEnabledBooking,
    saveTotalPageDisabledBooking,
    saveTotalPageGroupBooking,
    saveTotalPageEnabledRoomBooking,
    saveTotalPageDisabledRoomBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;