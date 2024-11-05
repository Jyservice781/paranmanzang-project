import { AddressModel, AddressResponseModel, AddressUpdateModel, QueryModel } from "@/app/model/room/address.model";
import requests from "../requests";
import api from "../axios";
import qs from 'qs';

export const addressAPI = {
    search(queryModel: QueryModel) {
        console.log("queryModel", queryModel)
        return api.get<AddressResponseModel[]>(requests.fetchRooms + `/addresses/search`, {
            params: queryModel,
            paramsSerializer: (params: QueryModel) => qs.stringify(params, { encode: true })
        });
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