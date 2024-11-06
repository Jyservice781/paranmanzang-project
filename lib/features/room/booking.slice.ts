// bookingSlice.ts

import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialBookingState, BookingModel } from '../../../app/model/room/bookings.model';
import { RootState } from '../../store'

const bookingSlice = createSlice({
    name: 'booking',
    initialState: initialBookingState,
    reducers: {
        saveSeparatedBookings: (state, action: PayloadAction<BookingModel[]>) => {
            if (action.payload.length > 0) {
                const groupId = action.payload[0].groupId
                state.enabledBookings[groupId] = action.payload.filter(booking => booking.enabled)
                state.notEnabledBookings[groupId] = action.payload.filter(booking => !booking.enabled)
            }
        },
        saveSeparatedRoomBookings: (state, action: PayloadAction<BookingModel[]>) => {
            if (action.payload.length > 0) {
                const roomId = action.payload[0].roomId
                state.enabledRoomBookings[roomId] = action.payload.filter(booking => booking.enabled)
                state.notEnabledRoomBookings[roomId] = action.payload.filter(booking => !booking.enabled)
            }
        },
        savePayCompletedBookings: (state, action: PayloadAction<BookingModel[]>) => {
            if (action.payload.length > 0) {
                const roomId = action.payload[0].roomId
                state.payCompletedBookings[roomId] = action.payload
            }
        },
        savePayCompletedBookingsByGroup: (state, action: PayloadAction<BookingModel[]>) => {
            if (action.payload.length > 0) {
                const groupId = action.payload[0].groupId
                state.payCompletedBookingsByGroup[groupId] = action.payload
            }
        },
        addBooking: (state, action: PayloadAction<BookingModel>) => {
            const groupId = action.payload.groupId;
            const roomId = action.payload.roomId;
            if (!state.notEnabledBookings[groupId]) {
                state.notEnabledBookings[groupId] = [];
            }
            state.notEnabledBookings[groupId].push(action.payload);

            if (!state.notEnabledRoomBookings[roomId]) {
                state.notEnabledRoomBookings[roomId] = [];
            }
            state.notEnabledRoomBookings[roomId].push(action.payload);
        },
        addPayCompletedBooking: (state, action: PayloadAction<BookingModel>) => {
            const groupId = action.payload.groupId;
            const roomId = action.payload.roomId;
            const id = action.payload.id;
            console.log("addPayCompleteBooking", action.payload)
            console.log("addPayCompleteBooking", action.payload)
            state.enabledBookings[groupId] = state.enabledBookings[groupId].filter(booking => booking.id !== id)
            state.enabledRoomBookings[roomId] = state.enabledRoomBookings[roomId].filter(booking => booking.id !== id)
            console.log("State after removing from enabledBookings:", JSON.stringify(state.enabledBookings[groupId], null, 2));
            console.log("State after removing from enabledRoomBookings:", JSON.stringify(state.enabledRoomBookings[roomId], null, 2));
            state.payCompletedBookings[roomId].push(action.payload)
            state.payCompletedBookingsByGroup[groupId].push(action.payload)
            console.log("Updated state of enabledBookings after addition:", JSON.stringify(state.enabledBookings, null, 2));
            console.log("Updated state of enabledRoomBookings after addition:", JSON.stringify(state.enabledRoomBookings, null, 2));
        },
        updateBooking: (state, action: PayloadAction<BookingModel>) => {
            const groupId = action.payload.groupId;
            const roomId = action.payload.roomId;
            const id = action.payload.id;
            console.log("updateBooking", id, groupId, roomId)
            console.log("updateBooking", action.payload)
            console.log("Initial state of enabledBookings:", JSON.stringify(state.enabledBookings, null, 2));
            console.log("Initial state of enabledRoomBookings:", JSON.stringify(state.enabledRoomBookings, null, 2));
            console.log("Initial state of notEnabledBookings:", JSON.stringify(state.notEnabledBookings, null, 2));
            console.log("Initial state of notEnabledRoomBookings:", JSON.stringify(state.notEnabledRoomBookings, null, 2));
            state.enabledBookings[groupId].push(action.payload)
            state.enabledRoomBookings[roomId].push(action.payload)
            console.log("State after pushing to enabledBookings[groupId]:", JSON.stringify(state.enabledBookings[groupId], null, 2));
            console.log("State after pushing to enabledRoomBookings[roomId]:", JSON.stringify(state.enabledRoomBookings[roomId], null, 2));

            // notEnabledBookings와 notEnabledRoomBookings에서 필터링 전 상태
            console.log("State before filtering out from notEnabledBookings[groupId]:", JSON.stringify(state.notEnabledBookings[groupId], null, 2));
            console.log("State before filtering out from notEnabledRoomBookings[roomId]:", JSON.stringify(state.notEnabledRoomBookings[roomId], null, 2));
            state.notEnabledBookings[groupId] = state.notEnabledBookings[groupId].filter(booking => booking.id !== id)
            state.notEnabledRoomBookings[roomId] = state.notEnabledRoomBookings[roomId].filter(booking => booking.id !== id)
            console.log("State after filtering out from notEnabledBookings[groupId]:", JSON.stringify(state.notEnabledBookings[groupId], null, 2));
            console.log("State after filtering out from notEnabledRoomBookings[roomId]:", JSON.stringify(state.notEnabledRoomBookings[roomId], null, 2));
        },
        removeBooking: (state, action: PayloadAction<BookingModel>) => {
            const groupId = action.payload.groupId;
            const roomId = action.payload.roomId;
            const id = action.payload.id;
            state.notEnabledBookings[groupId] = state.notEnabledBookings[groupId].filter(booking => booking.id !== id)
            state.notEnabledRoomBookings[roomId] = state.notEnabledRoomBookings[roomId].filter(booking => booking.id !== id)
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
        saveTotalPagePayCompletedBooking: (state, action: PayloadAction<number>) => {
            state.totalPagePayCompletedBooking = action.payload;
        },
    },
});

export const getCurrentBooking = (state: RootState) => state.bookings.currentBooking;
export const getIsLoading = (state: RootState) => state.bookings.isLoading;
export const getError = (state: RootState) => state.bookings.error;
export const getEnabledBooking = (state: RootState) => state.bookings.enabledBookings
export const getNotEnabledBooking = (state: RootState) => state.bookings.notEnabledBookings
export const getEnabledRoomBooking = (state: RootState) => state.bookings.enabledRoomBookings
export const getNotEnabledRoomBooking = (state: RootState) => state.bookings.notEnabledRoomBookings
export const getPayCompletedBookings = (state: RootState) => state.bookings.payCompletedBookings
export const getPayCompletedBookingsByGroup = (state: RootState) => state.bookings.payCompletedBookingsByGroup
export const getTotalPageEnabledBooking = (state: RootState) => state.bookings.totalPageEnabledBooking
export const getTotalPageDisabledBooking = (state: RootState) => state.bookings.totalPageDisabledBooking
export const getTotalPageGroupBooking = (state: RootState) => state.bookings.totalPageGroupBooking
export const getTotalPageEnabledRoomBooking = (state: RootState) => state.bookings.totalPageEnabledRoomBooking
export const getTotalPageDisabledRoomBooking = (state: RootState) => state.bookings.totalPageDisabledRoomBooking
export const getTotalPagePayCompletedBooking = (state: RootState) => state.bookings.totalPagePayCompletedBooking
export const getTotalPagePayCompletedBookingsByGroup = (state: RootState) => state.bookings.totalPagePayCompletedBookingsByGroup

export const {
    saveSeparatedRoomBookings,
    savePayCompletedBookings,
    savePayCompletedBookingsByGroup,
    addBooking,
    addPayCompletedBooking,
    updateBooking,
    removeBooking,
    saveSeparatedBookings,
    saveCurrentBooking,
    saveLoading,
    saveError,
    saveTotalPageEnabledBooking,
    saveTotalPageDisabledBooking,
    saveTotalPageGroupBooking,
    saveTotalPageEnabledRoomBooking,
    saveTotalPageDisabledRoomBooking,
    saveTotalPagePayCompletedBooking
} = bookingSlice.actions;

export default bookingSlice.reducer;