/**
 * 최적화된 경로 테이블 컴포넌트
 * 최적화된 방문 순서를 표시합니다.
 */

import { Location } from '@/lib/routeOptimizer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Phone, FileText } from 'lucide-react';

interface OptimizedRouteTableProps {
  locations: Location[];
  totalDistance: number;
  estimatedTime: number;
}

export default function OptimizedRouteTable({
  locations,
  totalDistance,
  estimatedTime,
}: OptimizedRouteTableProps) {
  if (locations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        최적화된 경로가 없습니다.
      </div>
    );
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
  };

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <p className="text-xs text-muted-foreground font-semibold">총 거리</p>
          <p className="text-2xl font-bold text-primary mt-1">
            {totalDistance} km
          </p>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <p className="text-xs text-muted-foreground font-semibold">예상 시간</p>
          <p className="text-lg font-bold text-primary mt-1">
            {formatTime(estimatedTime)}
          </p>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <p className="text-xs text-muted-foreground font-semibold">방문 지점</p>
          <p className="text-2xl font-bold text-primary mt-1">
            {locations.length}
          </p>
        </div>
        <div className="bg-success/5 border border-success/20 rounded-lg p-4">
          <p className="text-xs text-muted-foreground font-semibold">상태</p>
          <p className="text-lg font-bold text-success mt-1">최적화 완료</p>
        </div>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <ScrollArea className="w-full">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  순서
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  고객명
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  주소
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  좌표
                </th>
              </tr>
            </thead>
            <tbody>
              {locations.map((location, index) => (
                <tr
                  key={location.id}
                  className={`
                    border-b border-border transition-colors
                    ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}
                    hover:bg-muted/40
                  `}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground font-medium">
                    {location.name}
                  </td>
                  <td className="px-4 py-3 text-foreground text-xs max-w-xs">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{location.address}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs font-mono">
                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </div>

      {locations[0]?.phone && (
        <div className="bg-muted/30 rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold text-foreground">연락처 정보</p>
          <div className="space-y-1">
            {locations
              .filter((loc) => loc.phone)
              .map((loc) => (
                <div key={loc.id} className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">{loc.name}:</span>
                  <span className="font-mono text-foreground">{loc.phone}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {locations[0]?.memo && (
        <div className="bg-muted/30 rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            메모
          </p>
          <div className="space-y-1">
            {locations
              .filter((loc) => loc.memo)
              .map((loc) => (
                <div key={loc.id} className="text-sm">
                  <span className="text-muted-foreground">{loc.name}:</span>
                  <span className="ml-2 text-foreground">{loc.memo}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
