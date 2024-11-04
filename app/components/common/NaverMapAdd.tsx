"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { getAddresses, saveCurrentAddress } from '@/lib/features/room/address.slice';
import { AddressModel } from '@/app/model/room/address.model';
import { useAppDispatch } from '@/lib/store';
import { getRooms, saveCurrentRoom } from '@/lib/features/room/room.slice';

interface NaverMapAddProps {
    latitude: number;
    longitude: number;
    zoom?: number;
}

const NaverMapAdd: React.FC<NaverMapAddProps> = ({ latitude, longitude, zoom = 15 }) => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    // Redux 상태에서 주소와 방 정보를 가져오기
    const addresses = useSelector(getAddresses);
    const rooms = useSelector(getRooms);

    useEffect(() => {
        let map: naver.maps.Map;

        const initMap = () => {
            if (typeof window !== 'undefined' && window.naver) {
                // 초기 중심 위치 설정
                const center: AddressModel = addresses.length > 0 ? addresses[0] : {
                    id: 0,
                    address: "기본 주소",
                    detailAddress: "기본 상세 주소",
                    roomId: 0,
                    latitude: 37.552987017,
                    longitude: 126.972591728
                };

                const mapOptions = {
                    center: new window.naver.maps.LatLng(center.latitude, center.longitude),
                    zoom: zoom,
                };

                // 지도 초기화
                map = new window.naver.maps.Map('map', mapOptions);

                // 마커와 정보창 배열 초기화
                const markerList: naver.maps.Marker[] = [];
                const infoWindows: naver.maps.InfoWindow[] = [];

                addresses.forEach((address: AddressModel, index: number) => {
                    const marker = new window.naver.maps.Marker({
                        position: new window.naver.maps.LatLng(address.latitude, address.longitude),
                        map: map,
                    });

                    if (address.id) {
                        const infoWindow = new window.naver.maps.InfoWindow({
                            content: `<div style="width:250px;text-align:center;padding:10px;">
                                          <b>${address.detailAddress}</b><br/>
                                          ${address.address}
                                          <button type="button" id="move-button-${address.id}">이동하기</button>
                                      </div>`,
                        });

                        infoWindows.push(infoWindow);

                        window.naver.maps.Event.addListener(marker, 'click', () => {
                            infoWindow.open(map, marker);

                            // 이동하기 버튼 클릭 이벤트 추가
                            const moveButton = document.getElementById(`move-button-${address.id}`);
                            if (moveButton) {
                                moveButton.onclick = () => {
                                    if (address.id) {
                                        dispatch(saveCurrentRoom(
                                            rooms.find((room) => room.id === address.roomId) ?? null
                                        ));
                                        dispatch(saveCurrentAddress(address));
                                        router.push(`/rooms/${address.roomId}`);
                                    }
                                };
                            }
                        });
                    }

                    markerList.push(marker);

                    window.naver.maps.Event.addListener(marker, 'click', () => {
                        infoWindows.forEach((infowindow, idx) => {
                            if (idx === index) {
                                infowindow.open(map, marker);
                            } else {
                                infowindow.close();
                            }
                        });
                    });
                });

                // 지도 범위 내 마커 업데이트
                window.naver.maps.Event.addListener(map, 'idle', () => {
                    updateMarkers(map, markerList);
                });
            }
        };

        // 지도 내 마커 표시 함수
        function updateMarkers(map: naver.maps.Map, markers: naver.maps.Marker[]) {
            const mapBounds = map.getBounds();

            markers.forEach((marker) => {
                const position = marker.getPosition();
                if (mapBounds.hasLatLng(position)) {
                    showMarker(marker);
                } else {
                    hideMarker(marker);
                }
            });
        }

        // 마커를 보이게 하는 함수
        function showMarker(marker: naver.maps.Marker) {
            if (marker.getMap()) return;
            marker.setMap(map);
        }

        // 마커를 숨기는 함수
        function hideMarker(marker: naver.maps.Marker) {
            if (!marker.getMap()) return;
            marker.setMap(null);
        }

        // 네이버 지도 스크립트가 로드된 후 지도 초기화
        if (!window.naver) {
            const script = document.createElement('script');
            script.src = `${process.env.NEXT_PUBLIC_NAVER_MAP}`;
            script.async = true;
            script.onload = initMap;
            document.head.appendChild(script);
        } else {
            initMap();
        }
    }, [addresses, dispatch, router, zoom]);

    return <div id="map" style={{ width: '500px', height: '740px' }} />;
};

export default NaverMapAdd;
