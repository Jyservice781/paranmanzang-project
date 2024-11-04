"use client";

import React, { useEffect } from 'react';

interface NaverMapAddProps {
    latitude: number;
    longitude: number;
    zoom?: number;
}

const NaverMapAdd: React.FC<NaverMapAddProps> = ({ latitude, longitude, zoom = 15 }) => {
    useEffect(() => {
        const initMap = () => {
            if (typeof window !== 'undefined' && window.naver) {
                const mapOptions = {
                    center: new window.naver.maps.LatLng(latitude, longitude),
                    zoom: zoom,
                };

                const map = new window.naver.maps.Map('map', mapOptions);

                new window.naver.maps.Marker({
                    position: new window.naver.maps.LatLng(latitude, longitude),
                    map: map,
                });
            }
        };

        // 네이버 지도 스크립트가 로드된 후 지도 초기화
        if (!window.naver) {
            const script = document.createElement('script');
            script.src = process.env.NEXT_PUBLIC_NAVER_MAP as string;
            script.async = true;
            script.onload = initMap;
            document.head.appendChild(script);
        } else {
            initMap();
        }
    }, [latitude, longitude, zoom]);

    return (
        <>
            <div id="map" style={{ width: '50rem', height: '30rem' }} />
        </>
    );
};

export default NaverMapAdd;
