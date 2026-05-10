# Vercel 배포 가이드

이 문서는 Route Optimizer SaaS를 Vercel에 배포하는 방법을 설명합니다.

## 📋 사전 준비사항

- GitHub 계정
- Vercel 계정 (https://vercel.com에서 가입)
- 프로젝트 코드가 GitHub 저장소에 푸시되어 있어야 함

## 🚀 배포 방법

### 방법 1: Vercel 대시보드를 통한 배포 (권장)

#### 1단계: GitHub에 코드 푸시
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/route_optimizer_saas.git
git push -u origin main
```

#### 2단계: Vercel에서 프로젝트 생성
1. [Vercel 대시보드](https://vercel.com/dashboard)에 로그인
2. "New Project" 버튼 클릭
3. GitHub 저장소 선택 (`route_optimizer_saas`)
4. 프로젝트 설정 확인:
   - **Framework**: Vite
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`

#### 3단계: 환경 변수 설정
1. "Environment Variables" 섹션에서 다음 변수 추가:
   ```
   VITE_APP_TITLE=배송 경로 최적화
   VITE_APP_LOGO=Route Optimizer
   VITE_APP_ID=route_optimizer_saas
   ```

#### 4단계: 배포
"Deploy" 버튼을 클릭하여 배포 시작

### 방법 2: Vercel CLI를 통한 배포

#### 1단계: Vercel CLI 설치
```bash
npm install -g vercel
```

#### 2단계: 로그인
```bash
vercel login
```

#### 3단계: 프로젝트 배포
```bash
vercel
```

프롬프트에 따라 설정:
- Project name: `route-optimizer-saas`
- Directory: `.` (현재 디렉토리)
- Override settings: `N` (기본 설정 사용)

#### 4단계: 프로덕션 배포
```bash
vercel --prod
```

## 🔧 배포 후 설정

### 커스텀 도메인 연결

1. Vercel 대시보드에서 프로젝트 선택
2. "Settings" → "Domains" 이동
3. "Add Domain" 클릭
4. 도메인 입력 (예: `route-optimizer.com`)
5. DNS 설정 지침 따라 진행

### 환경 변수 추가 (필요시)

1. Vercel 대시보드에서 프로젝트 선택
2. "Settings" → "Environment Variables" 이동
3. 새 변수 추가

## 📊 배포 모니터링

### 배포 로그 확인
```bash
vercel logs
```

### 프로덕션 환경 테스트
배포 완료 후 제공된 URL에서 다음을 확인:
1. 페이지 로딩 속도
2. 엑셀 파일 업로드 기능
3. 경로 최적화 계산
4. 지도 표시
5. 결과 다운로드

## 🔐 보안 설정

### 환경 변수 보호
- 민감한 정보(API 키 등)는 환경 변수로 관리
- `.env` 파일은 `.gitignore`에 포함되어 있음

### HTTPS 자동 적용
- Vercel은 자동으로 HTTPS 인증서 발급 및 적용

## 🚨 문제 해결

### 빌드 실패
```bash
# 로컬에서 빌드 테스트
pnpm build

# 빌드 오류 확인
pnpm check
```

### 배포 후 페이지 로드 실패
1. Vercel 대시보드에서 배포 로그 확인
2. 환경 변수가 올바르게 설정되었는지 확인
3. 브라우저 콘솔에서 오류 메시지 확인

### 느린 로딩 속도
1. Vercel Analytics 확인
2. 이미지 최적화 검토
3. 번들 크기 분석: `pnpm build --analyze`

## 📈 성능 최적화

### 이미지 최적화
- 모든 이미지를 WebP 형식으로 변환
- 적절한 크기의 이미지 사용

### 코드 분할
- 동적 import를 통한 코드 분할
- 불필요한 의존성 제거

### 캐싱 전략
- 정적 파일에 장기 캐싱 설정
- API 응답 캐싱

## 🔄 지속적 배포 (CI/CD)

### GitHub Actions 통합
Vercel은 GitHub에 푸시할 때마다 자동으로:
1. 빌드 실행
2. 테스트 실행 (설정된 경우)
3. 프리뷰 배포 생성
4. 프로덕션 배포 (main 브랜치만)

### 배포 상태 확인
GitHub 저장소의 "Deployments" 탭에서 배포 상태 확인 가능

## 📞 지원

배포 중 문제가 발생하면:
1. [Vercel 문서](https://vercel.com/docs) 확인
2. [Vercel 커뮤니티](https://vercel.com/community) 질문
3. 로컬 환경에서 `pnpm build` 실행하여 빌드 오류 확인

---

**마지막 업데이트**: 2026년 5월 8일
