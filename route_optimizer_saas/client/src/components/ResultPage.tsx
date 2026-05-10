/**
 * 결과 페이지 컴포넌트
 * 최적화된 경로 결과를 종합적으로 표시합니다.
 */

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OptimizedRoute, Location } from '@/lib/routeOptimizer';
import OptimizedRouteTable from './OptimizedRouteTable';
import RouteMap from './RouteMap';
import { Map, List } from 'lucide-react';

interface ResultPageProps {
  optimizedRoute: OptimizedRoute;
}

export default function ResultPage({ optimizedRoute }: ResultPageProps) {
  return (
    <div className="w-full space-y-6">
      <Tabs defaultValue="map" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Map className="w-4 h-4" />
            지도
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="w-4 h-4" />
            목록
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-4">
          <RouteMap
            locations={optimizedRoute.locations}
            totalDistance={optimizedRoute.totalDistance}
          />
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <OptimizedRouteTable
            locations={optimizedRoute.locations}
            totalDistance={optimizedRoute.totalDistance}
            estimatedTime={optimizedRoute.estimatedTime}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
