import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialRoomState, RoomModel } from '../../../app/model/room/room.model';
import { RootState } from '../../store';

export const roomSlice = createSlice({
    name: 'room',
    initialState: initialRoomState,
    reducers: {
        saveRooms: (state, action: PayloadAction<RoomModel[]>) => {
            state.rooms = action.payload;
        },
        saveRoomsMap: (state, action: PayloadAction<RoomModel[]>) => {
            state.roomsMap = action.payload;
        },
        saveDisableRooms: (state, action: PayloadAction<RoomModel[]>) => {
            state.disabledRooms = action.payload;
        },
        saveDisableRoomByNickname: (state, action: PayloadAction<RoomModel[]>) => {
            state.disabledRoomByNickname = action.payload;
        },
        saveEnabledRoomByNickname: (state, action: PayloadAction<RoomModel[]>) => {
            state.enabledRoomByNickname = action.payload;
        },
        saveLikedRooms: (state, action: PayloadAction<RoomModel[]>) => {
            state.roomsLiked = action.payload
        },
        saveSeparatedRooms: (state, action: PayloadAction<RoomModel[]>) => {
            state.enabledRooms = action.payload.filter(room => room.enabled);
            state.notEnabledRooms = action.payload.filter(room => !room.enabled);
        },
        saveCurrentRoom: (state, action: PayloadAction<RoomModel | null>) => {
            state.currentRoom = action.payload;
        },
        saveLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        saveError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        addRoom: (state, action: PayloadAction<RoomModel>) => {
            state.rooms.push(action.payload)
        },
        addRoomMap: (state, action: PayloadAction<RoomModel>) => {
            state.roomsMap.push(action.payload)
        },
        addEnabledRoomByNickname: (state, action: PayloadAction<RoomModel>) => {
            state.enabledRoomByNickname.push(action.payload)
        },
        addDisabledRoomByNickname: (state, action: PayloadAction<RoomModel>) => {
            state.disabledRoomByNickname.push(action.payload)
        },
        addDisabledRoom: (state, action: PayloadAction<RoomModel>) => {
            state.disabledRooms.push(action.payload)
        },
        addLikedRoom: (state, action: PayloadAction<RoomModel>) => {
            state.roomsLiked.push(action.payload);
        },
        addEnabledRoom: (state, action: PayloadAction<RoomModel>) => {
            state.enabledRooms.push(action.payload);
        },
        updateRoom: (state, action: PayloadAction<RoomModel>) => {
            const index = state.rooms.findIndex(room => room.id === action.payload.id)
            if (index !== -1) {
                state.rooms[index] = action.payload;
            }
        },
        updateRoomMap: (state, action: PayloadAction<RoomModel>) => {
            const index = state.roomsMap.findIndex(room => room.id === action.payload.id)
            if (index !== -1) {
                state.rooms[index] = action.payload;
            }
        },
        updateEnableRoomByNickname: (state, action: PayloadAction<RoomModel>) => {
            const index = state.enabledRoomByNickname.findIndex(room => room.id === action.payload.id)
            if (index !== -1) {
                state.rooms[index] = action.payload;
            }
        },
        updateDisabledRoomByNickname: (state, action: PayloadAction<RoomModel>) => {
            const index = state.disabledRoomByNickname.findIndex(room => room.id === action.payload.id)
            if (index !== -1) {
                state.rooms[index] = action.payload;
            }
        },
        updateDisabledRoom: (state, action: PayloadAction<RoomModel>) => {
            const index = state.disabledRooms.findIndex(room => room.id === action.payload.id)
            if (index !== -1) {
                state.rooms[index] = action.payload;
            }
        },
        removeRoom: (state, action: PayloadAction<number>) => {
            state.rooms.filter(room => room.id !== action.payload)
        },
        removeRoomMap: (state, action: PayloadAction<number>) => {
            state.roomsMap.filter(room => room.id !== action.payload)
        },
        removeEnabledRoomByNickname: (state, action: PayloadAction<number>) => {
            state.enabledRoomByNickname.filter(room => room.id !== action.payload)
        },
        removeDisabledRoomByNickname: (state, action: PayloadAction<number>) => {
            state.disabledRoomByNickname.filter(room => room.id !== action.payload)
        },
        removeDisabledRoom: (state, action: PayloadAction<number>) => {
            state.disabledRooms.filter(room => room.id !== action.payload)
        },
        removeNotEnabledRoom: (state, action: PayloadAction<number>) => {
            state.notEnabledRooms.filter(room => room.id !== action.payload)
        },
        removeLikedRoom: (state, action: PayloadAction<number>) => {
            state.roomsLiked.filter(room => room.id !== action.payload)
        },
        saveTotalPageSellerEnabledRoom: (state, action: PayloadAction<number>) => {
            state.totalPageSellerEnabledRoom = action.payload;
        },
        saveTotalPageSellerDisabledRoom: (state, action: PayloadAction<number>) => {
            state.totalPageSellerDisabledRoom = action.payload;
        },
        saveTotalPageEnabledRoom: (state, action: PayloadAction<number>) => {
            state.totalPageEnabledRoom = action.payload;
        },
        saveTotalPageDisabledRoom: (state, action: PayloadAction<number>) => {
            state.totalPageDisabledRoom = action.payload;
        },
    },
});

// Selector 함수들
export const getSeparatedRooms = createSelector(
    (state: RootState) => state.room.enabledRooms,
    (state: RootState) => state.room.notEnabledRooms,
    (enabledRooms, notEnabledRooms) => ({
        enabledRooms,
        notEnabledRooms
    })
)
export const getRooms = (state: RootState) => state.room.rooms;
export const getRoomsMap = (state: RootState) => state.room.roomsMap;
export const getEnabledRoomByNickname = (state: RootState) => state.room.enabledRoomByNickname;
export const getDisabledRoomByNickname = (state: RootState) => state.room.disabledRoomByNickname;
export const getDisabledRooms = (state: RootState) => state.room.disabledRooms;
export const getLikedRooms = (state: RootState) => state.room.roomsLiked;
export const getCurrentRoom = (state: RootState) => state.room.currentRoom;
export const getIsLoading = (state: RootState) => state.room.isLoading;
export const getError = (state: RootState) => state.room.error;
export const getTotalPageSellerEnabledRoom = (state: RootState) => state.room.totalPageSellerEnabledRoom;
export const getTotalPageSellerDisabledRoom = (state: RootState) => state.room.totalPageSellerDisabledRoom;
export const getTotalPageEnabledRoom = (state: RootState) => state.room.totalPageEnabledRoom;
export const getTotalPageDisabledRoom = (state: RootState) => state.room.totalPageDisabledRoom;

// 액션 생성자들을 export
export const {
    saveRooms,
    saveRoomsMap,
    saveDisableRooms,
    saveEnabledRoomByNickname,
    saveDisableRoomByNickname,
    saveLikedRooms,
    saveSeparatedRooms,
    saveCurrentRoom,
    saveLoading,
    saveError,
    addRoom,
    addRoomMap,
    addDisabledRoom,
    addDisabledRoomByNickname,
    addEnabledRoomByNickname,
    updateRoom,
    updateRoomMap,
    updateDisabledRoom,
    updateDisabledRoomByNickname,
    updateEnableRoomByNickname,
    removeRoom,
    removeRoomMap,
    addLikedRoom,
    removeLikedRoom,
    removeDisabledRoom,
    removeDisabledRoomByNickname,
    removeEnabledRoomByNickname,
    removeNotEnabledRoom,
    saveTotalPageSellerEnabledRoom,
    saveTotalPageSellerDisabledRoom,
    saveTotalPageEnabledRoom,
    saveTotalPageDisabledRoom,
} = roomSlice.actions;

// 리듀서를 export
export default roomSlice.reducer;