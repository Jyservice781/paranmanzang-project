import { AddressModel, AddressResponseModel, AddressUpdateModel } from "@/app/model/room/address.model";
import requests from "../requests";
import api from "../axios";

export const addressAPI = {
    search(query: string) {
        return api.get<AddressResponseModel[]>(requests.fetchRooms + `/addresses/search?query=${encodeURIComponent(query)}`);
    },
    insert(addressModel: AddressModel) {
        return api.post<AddressModel>(requests.fetchRooms + '/addresses', addressModel);
    },
    modify(addressModel: AddressUpdateModel) {
        return api.put<AddressModel>(requests.fetchRooms + '/addresses', addressModel);
    },
    drop(id: number) {
        return api.delete<boolean>(requests.fetchRooms + `/addresses/${id}`);
    },
    findByAddresses() {
        return api.get<AddressModel[]>(requests.fetchRooms + '/addresses');
    },
    findByQuery(query: string) {
        return api.get<AddressModel[]>(`${requests.fetchRooms}/addresses/${query}`);
    }
}