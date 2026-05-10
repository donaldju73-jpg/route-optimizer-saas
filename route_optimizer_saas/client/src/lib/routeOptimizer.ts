/**
 * 경로 최적화 알고리즘
 * 주어진 좌표들 사이의 최적 방문 순서를 계산합니다.
 * 현재는 Nearest Neighbor 알고리즘을 사용합니다.
 */

export interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  memo?: string;
}

export interface OptimizedRoute {
  locations: Location[];
  totalDistance: number;
  estimatedTime: number; // 분 단위
}

/**
 * 두 좌표 사이의 거리를 계산합니다 (Haversine formula)
 * @param lat1 첫 번째 위도
 * @param lng1 첫 번째 경도
 * @param lat2 두 번째 위도
 * @param lng2 두 번째 경도
 * @returns 거리 (킬로미터)
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // 지구 반지름 (킬로미터)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Nearest Neighbor 알고리즘으로 최적 경로를 계산합니다.
 * 출발지에서 시작하여 가장 가까운 미방문 위치를 순차적으로 방문합니다.
 *
 * @param locations 방문할 위치 배열
 * @param startLocation 출발지
 * @param endLocation 도착지 (선택사항)
 * @returns 최적화된 경로
 */
export function optimizeRouteNearestNeighbor(
  locations: Location[],
  startLocation: Location,
  endLocation?: Location
): OptimizedRoute {
  if (locations.length === 0) {
    return {
      locations: endLocation ? [startLocation, endLocation] : [startLocation],
      totalDistance: 0,
      estimatedTime: 0,
    };
  }

  const unvisited = [...locations];
  const route: Location[] = [startLocation];
  let currentLocation = startLocation;
  let totalDistance = 0;

  // Nearest Neighbor 알고리즘
  while (unvisited.length > 0) {
    let nearestIndex = 0;
    let minDistance = calculateDistance(
      currentLocation.lat,
      currentLocation.lng,
      unvisited[0].lat,
      unvisited[0].lng
    );

    // 가장 가까운 위치 찾기
    for (let i = 1; i < unvisited.length; i++) {
      const distance = calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        unvisited[i].lat,
        unvisited[i].lng
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = i;
      }
    }

    // 가장 가까운 위치를 경로에 추가
    const nextLocation = unvisited[nearestIndex];
    route.push(nextLocation);
    totalDistance += minDistance;
    currentLocation = nextLocation;

    // 방문한 위치 제거
    unvisited.splice(nearestIndex, 1);
  }

  // 도착지 추가
  if (endLocation) {
    const distanceToEnd = calculateDistance(
      currentLocation.lat,
      currentLocation.lng,
      endLocation.lat,
      endLocation.lng
    );
    route.push(endLocation);
    totalDistance += distanceToEnd;
  }

  // 예상 시간 계산 (평균 속도 40km/h, 각 위치당 5분 체류)
  const averageSpeed = 40; // km/h
  const drivingTime = (totalDistance / averageSpeed) * 60; // 분
  const stayTime = (locations.length + 1) * 5; // 각 위치당 5분
  const estimatedTime = Math.round(drivingTime + stayTime);

  return {
    locations: route,
    totalDistance: Math.round(totalDistance * 100) / 100,
    estimatedTime,
  };
}

/**
 * 2-opt 알고리즘으로 경로를 개선합니다.
 * (더 정교한 최적화가 필요한 경우 사용)
 */
export function improveRouteWith2Opt(
  route: Location[],
  iterations: number = 100
): Location[] {
  let improved = [...route];

  for (let iter = 0; iter < iterations; iter++) {
    let improved_flag = false;

    for (let i = 1; i < improved.length - 2; i++) {
      for (let k = i + 1; k < improved.length - 1; k++) {
        const delta = calculateDistance(
          improved[i - 1].lat,
          improved[i - 1].lng,
          improved[k].lat,
          improved[k].lng
        ) +
          calculateDistance(
            improved[i].lat,
            improved[i].lng,
            improved[k + 1].lat,
            improved[k + 1].lng
          ) -
          (calculateDistance(
            improved[i - 1].lat,
            improved[i - 1].lng,
            improved[i].lat,
            improved[i].lng
          ) +
            calculateDistance(
              improved[k].lat,
              improved[k].lng,
              improved[k + 1].lat,
              improved[k + 1].lng
            ));

        if (delta < 0) {
          // 경로 개선됨
          const newRoute = [
            ...improved.slice(0, i),
            ...improved.slice(i, k + 1).reverse(),
            ...improved.slice(k + 1),
          ];
          improved = newRoute;
          improved_flag = true;
        }
      }
    }

    if (!improved_flag) break;
  }

  return improved;
}
