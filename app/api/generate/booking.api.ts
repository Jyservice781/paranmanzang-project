import { BookingModel } from "@/app/model/room/bookings.model";
import api from "../axios";
import requests from "../requests";
import qs from "qs";

export const bookingAPI = {
    insert(bookingModel: BookingModel) { return api.post<BookingModel>(requests.fetchRooms + '/bookings', bookingModel); },

    modify(id: number) { return api.put<BookingModel>(requests.fetchRooms + `/bookings/${id}`); },

    drop(id: number) { return api.delete<boolean>(requests.fetchRooms + `/bookings/${id}`); },

    findByGroup(groupId: number, page: number, size: number) { return api.get<Page<BookingModel>>(requests.fetchRooms + `/bookings/group/${groupId}`, { params: { page, size } }); },

    findEnabledByGroups(groupIds: number[], page: number, size: number) { return api.get<Page<BookingModel>>(requests.fetchRooms + `/bookings/group/enabled`, { params: { groupIds, page, size }, paramsSerializer: (params: any) => qs.stringify(params, { arrayFormat: 'repeat' }) }); },
    findDisabledByGroups(groupIds: number[], page: number, size: number) { return api.get<Page<BookingModel>>(requests.fetchRooms + `/bookings/group/disabled`, { params: { groupIds, page, size }, paramsSerializer: (params: any) => qs.stringify(params, { arrayFormat: 'repeat' }) }); },

    findEnabledByRoom(nickname: string, page: number, size: number) {
        return api.get<Page<BookingModel>>(requests.fetchRooms + `/bookings/room/enabled`, { params: { nickname, page, size } });
    },
    findDisabledByRoom(nickname: string, page: number, size: number) {
        return api.get<Page<BookingModel>>(requests.fetchRooms + `/bookings/room/disabled`, { params: { nickname, page, size } });
    },
}