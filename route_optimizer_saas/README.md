# 배송 경로 최적화 SaaS (Route Optimizer SaaS)

엑셀 파일로 여러 주소를 업로드하면, 인공지능이 가장 효율적인 방문 순서를 자동으로 계산해주는 배송 경로 최적화 웹 서비스입니다.

## 🎯 주요 기능

- **엑셀 파일 업로드**: CSV, XLSX 형식 지원 (필수 컬럼: 순번, 고객명, 주소, 연락처)
- **경로 최적화**: Nearest Neighbor 알고리즘 기반 최적 방문 순서 계산
- **지도 시각화**: Google Maps 통합으로 최적 경로 시각화
- **결과 다운로드**: 최적화된 경로를 엑셀 파일로 다운로드
- **모바일 반응형**: 모든 기기에서 최적화된 UI/UX

## 🛠 기술 스택

- **Frontend**: React 19 + TypeScript + Tailwind CSS 4
- **라우팅**: Wouter (클라이언트 사이드 라우팅)
- **UI 컴포넌트**: shadcn/ui + Radix UI
- **지도**: Google Maps JavaScript API
- **빌드 도구**: Vite
- **패키지 매니저**: pnpm

## 📋 필수 요구사항

- Node.js 18+ 
- pnpm 10.4.1+

## 🚀 로컬 개발 환경 설정

### 1. 저장소 클론
```bash
git clone <repository-url>
cd route_optimizer_saas
```

### 2. 의존성 설치
```bash
pnpm install
```

### 3. 개발 서버 실행
```bash
pnpm dev
```

개발 서버는 `http://localhost:3000`에서 실행됩니다.

## 📦 프로젝트 구조

```
route_optimizer_saas/
├── client/                          # 프론트엔드 코드
│   ├── public/                      # 정적 파일 (favicon, robots.txt 등)
│   ├── src/
│   │   ├── components/              # React 컴포넌트
│   │   │   ├── ui/                  # shadcn/ui 컴포넌트
│   │   │   ├── ExcelUploader.tsx    # 엑셀 업로드 컴포넌트
│   │   │   ├── AddressTable.tsx     # 주소 테이블 컴포넌트
│   │   │   ├── RouteMap.tsx         # 경로 지도 컴포넌트
│   │   │   └── ...
│   │   ├── pages/                   # 페이지 컴포넌트
│   │   │   ├── Home.tsx             # 메인 페이지
│   │   │   └── NotFound.tsx         # 404 페이지
│   │   ├── lib/                     # 유틸리티 함수
│   │   │   ├── excelParser.ts       # 엑셀 파싱 함수
│   │   │   ├── routeOptimizer.ts    # 경로 최적화 알고리즘
│   │   │   └── geocoding.ts         # 지오코딩 API 구조
│   │   ├── contexts/                # React Context
│   │   ├── hooks/                   # Custom Hooks
│   │   ├── App.tsx                  # 라우터 설정
│   │   ├── main.tsx                 # React 진입점
│   │   └── index.css                # 글로벌 스타일
│   └── index.html                   # HTML 템플릿
├── server/                          # 백엔드 코드 (선택사항)
│   └── index.ts                     # Express 서버
├── shared/                          # 공유 타입/상수
│   └── const.ts
├── package.json                     # 프로젝트 의존성
├── vite.config.ts                   # Vite 설정
├── tsconfig.json                    # TypeScript 설정
├── tailwind.config.ts               # Tailwind CSS 설정
├── vercel.json                      # Vercel 배포 설정
└── README.md                        # 이 파일
```

## 🔧 빌드 및 배포

### 로컬 빌드
```bash
pnpm build
```

빌드 결과물은 `dist/` 디렉토리에 생성됩니다.

### 프로덕션 서버 실행
```bash
pnpm start
```

### Vercel 배포

#### 방법 1: GitHub를 통한 배포
1. 코드를 GitHub에 푸시
2. [Vercel 대시보드](https://vercel.com)에 접속
3. "New Project" 클릭
4. GitHub 저장소 선택
5. 배포 설정 확인 후 "Deploy" 클릭

#### 방법 2: Vercel CLI를 통한 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

#### 환경 변수 설정
Vercel 대시보드에서 다음 환경 변수를 설정하세요:
- `VITE_APP_TITLE`: 앱 제목
- `VITE_APP_LOGO`: 앱 로고
- `VITE_APP_ID`: 앱 ID

## 📝 엑셀 파일 형식

업로드할 엑셀 파일은 다음 컬럼을 포함해야 합니다:

| 컬럼명 | 필수 여부 | 설명 |
|--------|---------|------|
| 순번 | ✅ 필수 | 주소의 순번 |
| 고객명 | ✅ 필수 | 고객 이름 |
| 주소 | ✅ 필수 | 배송 주소 |
| 연락처 | ✅ 필수 | 고객 연락처 |
| 메모 | ❌ 선택 | 배송 시 참고사항 |

### 예시
```
순번,고객명,주소,연락처,메모
1,김철수,서울시 강남구 테헤란로 123,010-1234-5678,오전 배송
2,이영희,서울시 강남구 강남대로 456,010-2345-6789,
3,박민준,서울시 서초구 서초대로 789,010-3456-7890,신호등 근처
```

## 🔌 API 통합 준비

### Google Maps API
- **Geocoding API**: 주소를 좌표로 변환
- **Directions API**: 경로 정보 및 소요 시간 계산
- **Maps JavaScript API**: 지도 표시 및 마커 추가

현재 Manus 플랫폼에서 Google Maps API 프록시를 제공하므로, 별도의 API 키 설정이 필요하지 않습니다.

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: 파란색 (`#0066FF`)
- **Background**: 흰색 (`#FFFFFF`)
- **Text**: 어두운 회색 (`#1A1A1A`)

### 타이포그래피
- **Display**: Pretendard Bold (제목)
- **Body**: Pretendard Regular (본문)

## 📱 모바일 반응형

모든 페이지는 다음 breakpoint에서 최적화됩니다:
- **모바일**: 320px - 640px
- **태블릿**: 641px - 1024px
- **데스크톱**: 1025px 이상

## 🐛 문제 해결

### 포트 충돌
개발 서버가 3000 포트를 사용할 수 없는 경우:
```bash
pnpm dev -- --port 3001
```

### 의존성 문제
```bash
# 캐시 삭제 및 재설치
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### TypeScript 오류
```bash
# TypeScript 검사
pnpm check
```

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.

## 🤝 기여

버그 리포트나 기능 제안은 GitHub Issues를 통해 제출해주세요.

## 📞 지원

문제가 발생하면 다음을 확인하세요:
1. 모든 의존성이 올바르게 설치되었는지 확인
2. Node.js 버전이 18 이상인지 확인
3. 환경 변수가 올바르게 설정되었는지 확인

---

**마지막 업데이트**: 2026년 5월 8일
