/**
 * 지오코딩 유틸리티
 * 주소를 위도/경도로 변환하고, 좌표를 주소로 역변환합니다.
 * Google Maps API를 사용합니다.
 */

export interface GeocodingResult {
  lat: number;
  lng: number;
  formattedAddress: string;
}

export interface ReverseGeocodingResult {
  address: string;
  lat: number;
  lng: number;
}

/**
 * Google Maps Geocoder를 초기화합니다.
 * 이 함수는 Map 컴포넌트의 onMapReady 콜백에서 호출됩니다.
 */
let geocoder: google.maps.Geocoder | null = null;

export function initializeGeocoder() {
  if (typeof google !== 'undefined' && google.maps) {
    geocoder = new google.maps.Geocoder();
  }
}

/**
 * 주소를 위도/경도로 변환합니다.
 * @param address 변환할 주소
 * @returns 위도/경도 및 포맷된 주소
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult> {
  if (!geocoder) {
    throw new Error('Geocoder가 초기화되지 않았습니다.');
  }

  return new Promise((resolve, reject) => {
    geocoder!.geocode({ address }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        const location = results[0].geometry.location;
        resolve({
          lat: location.lat(),
          lng: location.lng(),
          formattedAddress: results[0].formatted_address,
        });
      } else {
        reject(
          new Error(
            `주소 변환 실패: ${address} (상태: ${status})`
          )
        );
      }
    });
  });
}

/**
 * 여러 주소를 일괄 변환합니다.
 * @param addresses 변환할 주소 배열
 * @returns 변환된 좌표 배열
 */
export async function geocodeAddresses(
  addresses: string[]
): Promise<GeocodingResult[]> {
  const results: GeocodingResult[] = [];

  for (const address of addresses) {
    try {
      const result = await geocodeAddress(address);
      results.push(result);
      // API 레이트 제한을 피하기 위해 약간의 딜레이 추가
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`주소 변환 실패: ${address}`, error);
      // 실패한 주소는 스킵하고 계속 진행
    }
  }

  return results;
}

/**
 * 좌표를 주소로 역변환합니다.
 * @param lat 위도
 * @param lng 경도
 * @returns 주소 정보
 */
export async function reverseGeocodeLocation(
  lat: number,
  lng: number
): Promise<ReverseGeocodingResult> {
  if (!geocoder) {
    throw new Error('Geocoder가 초기화되지 않았습니다.');
  }

  return new Promise((resolve, reject) => {
    geocoder!.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        resolve({
          address: results[0].formatted_address,
          lat,
          lng,
        });
      } else {
        reject(
          new Error(
            `역변환 실패: (${lat}, ${lng}) (상태: ${status})`
          )
        );
      }
    });
  });
}

/**
 * 주소 자동완성을 위한 Places Service를 초기화합니다.
 */
let placesService: google.maps.places.PlacesService | null = null;
let autocompleteService: google.maps.places.AutocompleteService | null = null;

export function initializePlacesService(map: google.maps.Map) {
  placesService = new google.maps.places.PlacesService(map);
  autocompleteService = new google.maps.places.AutocompleteService();
}

/**
 * 주소 자동완성 제안을 가져옵니다.
 * @param input 입력된 텍스트
 * @param componentRestrictions 제한 조건 (예: 국가)
 * @returns 자동완성 제안 배열
 */
export async function getAutocompletePredictions(
  input: string,
  componentRestrictions?: google.maps.places.ComponentRestrictions
): Promise<google.maps.places.AutocompletePrediction[]> {
  if (!autocompleteService) {
    throw new Error('AutocompleteService가 초기화되지 않았습니다.');
  }

  return new Promise((resolve, reject) => {
    autocompleteService!.getPlacePredictions(
      {
        input,
        componentRestrictions,
      },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          resolve(predictions);
        } else {
          reject(
            new Error(
              `자동완성 요청 실패 (상태: ${status})`
            )
          );
        }
      }
    );
  });
}

/**
 * 모의 지오코딩 함수 (개발/테스트용)
 * 실제 API 없이 테스트할 때 사용합니다.
 */
export function mockGeocodeAddress(address: string): GeocodingResult {
  // 서울 시내 주요 지역의 대략적인 좌표
  const mockCoordinates: Record<string, GeocodingResult> = {
    '강남구': {
      lat: 37.4979,
      lng: 127.0276,
      formattedAddress: '서울시 강남구',
    },
    '서초구': {
      lat: 37.4835,
      lng: 127.0325,
      formattedAddress: '서울시 서초구',
    },
    '송파구': {
      lat: 37.5145,
      lng: 127.1069,
      formattedAddress: '서울시 송파구',
    },
    '마포구': {
      lat: 37.5634,
      lng: 126.9016,
      formattedAddress: '서울시 마포구',
    },
    '중구': {
      lat: 37.5642,
      lng: 126.9975,
      formattedAddress: '서울시 중구',
    },
    '은평구': {
      lat: 37.5642,
      lng: 126.9975,
      formattedAddress: '서울시 은평구',
    },
    '안양시': {
      lat: 37.3943,
      lng: 126.9568,
      formattedAddress: '경기도 안양시',
    },
    '의왕시': {
      lat: 37.3447,
      lng: 126.9683,
      formattedAddress: '경기도 의왕시',
    },
    '화성시': {
      lat: 37.1995,
      lng: 126.8312,
      formattedAddress: '경기도 화성시',
    },
    '수원시': {
      lat: 37.2636,
      lng: 127.0286,
      formattedAddress: '경기도 수원시',
    },
    '성남시': {
      lat: 37.4200,
      lng: 127.1265,
      formattedAddress: '경기도 성남시',
    },
  };

  // 주소에서 구 정보 추출
  for (const [key, value] of Object.entries(mockCoordinates)) {
    if (address.includes(key)) {
      return value;
    }
  }

  // 기본값: 서울 시청
  return {
    lat: 37.5665,
    lng: 126.978,
    formattedAddress: address,
  };
}
