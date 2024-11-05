// addressTypes.ts
export interface AddressModel {
    id?: number;
    address: string;
    detailAddress: string;
    latitude: number;
    longitude: number;
    roomId: number;
}

export interface ApiResponse {
    items: AddressResponseModel[];
    lastBuildDate: string;
    total: number;
    start: number;
    display: number;
}

export interface AddressResponseModel {
    title: string;
    category:string;
    description: string;
    link: string;
    mapx: string;
    mapy: string;
    roadAddress: string;
    telephone: string;
    address: string;
  }

export const initializeAddressModel = (): AddressModel => ({
    id: 0,
    address: '',
    detailAddress: '',
    latitude: 0,
    longitude: 0,
    roomId: 0
});

export interface AddressUpdateModel {
    id: number;
    address: string;
    detailAddress: string;
    latitude: number;
    longitude: number;
}

export interface QueryModel {
    query : string
}

// 상태 인터페이스 정의
export interface AddressState {
    addresses: AddressModel[];
    currentAddress: AddressModel | null;
    isLoading: boolean;
    error: string | null;
}

// 초기 상태
export const initialAddressState: AddressState = {
    addresses: [],
    currentAddress: null,
    isLoading: false,
    error: null
};