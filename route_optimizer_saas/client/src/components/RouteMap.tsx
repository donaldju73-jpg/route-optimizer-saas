/**
 * 경로 지도 시각화 컴포넌트
 * Google Maps를 사용하여 최적화된 경로를 지도에 표시합니다.
 */

import { useEffect, useRef, useState } from 'react';
import { Location } from '@/lib/routeOptimizer';
import { AlertCircle } from 'lucide-react';
import { MapView } from './Map';

interface RouteMapProps {
  locations: Location[];
  totalDistance: number;
}

export default function RouteMap({ locations, totalDistance }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMapReady = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  useEffect(() => {
    if (!map || locations.length === 0) return;

    // 기존 마커 제거
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);

    // 기존 폴리라인 제거
    if (polyline) {
      polyline.setMap(null);
    }

    try {
      const newMarkers: google.maps.Marker[] = [];
      const path: google.maps.LatLng[] = [];

      // 마커 생성 및 폴리라인 경로 구성
      locations.forEach((location, index) => {
        const position = { lat: location.lat, lng: location.lng };
        path.push(new google.maps.LatLng(position.lat, position.lng));

        // 마커 아이콘 설정
        let markerColor = '#2563EB'; // 기본: 파란색
        if (index === 0) markerColor = '#10B981'; // 출발지: 초록색
        if (index === locations.length - 1) markerColor = '#EF4444'; // 도착지: 빨간색

        const marker = new google.maps.Marker({
          position,
          map,
          title: location.name,
          label: {
            text: String(index + 1),
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold',
          },
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: markerColor,
            fillOpacity: 1,
            strokeColor: 'white',
            strokeWeight: 2,
          },
        });

        // 마커 클릭 시 정보 표시
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
              <p style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px;">${location.name}</p>
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${location.address}</p>
              ${location.phone ? `<p style="margin: 0; font-size: 12px; color: #666;">${location.phone}</p>` : ''}
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        newMarkers.push(marker);
      });

      setMarkers(newMarkers);

      // 폴리라인 생성
      const newPolyline = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#2563EB',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        map,
        icons: [
          {
            icon: {
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              scale: 3,
              fillColor: '#2563EB',
              fillOpacity: 1,
              strokeColor: 'white',
              strokeWeight: 1,
            },
            offset: '100%',
          },
        ],
      });

      setPolyline(newPolyline);

      // 지도 범위 조정
      const bounds = new google.maps.LatLngBounds();
      locations.forEach((location) => {
        bounds.extend(new google.maps.LatLng(location.lat, location.lng));
      });
      map.fitBounds(bounds);
      // 패딩 적용을 위해 약간의 줌 아웃
      const currentZoom = map.getZoom();
      if (currentZoom) {
        map.setZoom(currentZoom - 1);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '지도 렌더링 중 오류가 발생했습니다.';
      setError(errorMessage);
    }
  }, [map, locations]);

  if (error) {
    return (
      <div className="w-full h-96 bg-muted/30 rounded-lg border border-border flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <MapView onMapReady={handleMapReady} />
        <div ref={mapRef} className="w-full h-96 bg-muted/30" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <p className="text-xs text-muted-foreground font-semibold">총 거리</p>
          <p className="text-2xl font-bold text-primary mt-1">{totalDistance} km</p>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <p className="text-xs text-muted-foreground font-semibold">방문 지점</p>
          <p className="text-2xl font-bold text-primary mt-1">{locations.length}</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>범례:</strong> <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
          출발지 <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1 ml-3"></span>
          경유지 <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1 ml-3"></span>
          도착지
        </p>
      </div>
    </div>
  );
}
