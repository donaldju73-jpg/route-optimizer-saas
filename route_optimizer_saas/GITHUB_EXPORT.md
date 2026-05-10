# GitHub Export 및 배포 가이드

이 문서는 Route Optimizer SaaS 프로젝트를 GitHub로 export하고 배포하는 방법을 설명합니다.

## 📦 프로젝트 다운로드

### ZIP 파일 다운로드
프로젝트는 `route_optimizer_saas.zip` 파일로 제공됩니다.

**포함 내용:**
- ✅ 모든 소스 코드
- ✅ 설정 파일 (package.json, vite.config.ts 등)
- ✅ 배포 설정 (vercel.json, .vercelignore)
- ✅ 문서 (README.md, DEPLOYMENT.md)
- ❌ node_modules (크기 최소화)
- ❌ 빌드 결과물 (dist/)
- ❌ Manus 관련 파일 (.manus-logs, .webdev)

### 파일 크기
- **ZIP 파일**: ~191KB
- **압축 해제 후**: ~500KB (node_modules 제외)

## 🚀 GitHub에 올리기

### 1단계: 저장소 생성

#### GitHub 웹사이트에서:
1. https://github.com/new 접속
2. Repository name: `route-optimizer-saas`
3. Description: `배송 경로 최적화 SaaS - 엑셀 주소 업로드 기반 최적 경로 생성 서비스`
4. Public 선택 (또는 Private)
5. "Create repository" 클릭

### 2단계: 로컬에 프로젝트 설정

```bash
# 1. ZIP 파일 압축 해제
unzip route_optimizer_saas.zip
cd route_optimizer_saas

# 2. Git 초기화 (이미 .git이 있으면 스킵)
# git init

# 3. 원격 저장소 추가
git remote add origin https://github.com/YOUR_USERNAME/route-optimizer-saas.git

# 4. 모든 파일 추가
git add .

# 5. 커밋
git commit -m "Initial commit: Route Optimizer SaaS MVP"

# 6. 브랜치명 변경 (필요시)
git branch -M main

# 7. 푸시
git push -u origin main
```

### 3단계: GitHub 저장소 설정

#### README 확인
- `README.md`가 GitHub 저장소 홈에 자동으로 표시됩니다.

#### Topics 추가 (선택사항)
GitHub 저장소의 "About" 섹션에서:
- `react`
- `typescript`
- `tailwindcss`
- `vite`
- `route-optimization`
- `saas`

#### Releases 생성 (선택사항)
1. "Releases" 탭 클릭
2. "Create a new release" 클릭
3. Tag version: `v1.0.0`
4. Title: `Route Optimizer SaaS v1.0.0`
5. Description: 주요 기능 설명
6. "Publish release" 클릭

## 🔗 GitHub 저장소 구조

```
route-optimizer-saas/
├── README.md                    # 프로젝트 설명
├── DEPLOYMENT.md                # Vercel 배포 가이드
├── GITHUB_EXPORT.md             # 이 파일
├── package.json                 # 프로젝트 의존성
├── vercel.json                  # Vercel 설정
├── .vercelignore                # Vercel 무시 파일
├── .gitignore                   # Git 무시 파일
├── vite.config.ts               # Vite 설정
├── tsconfig.json                # TypeScript 설정
├── client/                      # 프론트엔드 코드
│   ├── src/
│   │   ├── components/          # React 컴포넌트
│   │   ├── pages/               # 페이지
│   │   ├── lib/                 # 유틸리티
│   │   └── ...
│   └── index.html
├── server/                      # 백엔드 코드 (선택사항)
└── shared/                      # 공유 타입
```

## 📋 체크리스트

GitHub에 올리기 전에 다음을 확인하세요:

- [ ] `README.md`가 명확한가?
- [ ] `package.json`의 프로젝트 정보가 정확한가?
- [ ] `.gitignore`에 민감한 파일이 포함되어 있는가?
- [ ] 환경 변수 예시 파일이 있는가?
- [ ] 라이선스 파일이 있는가? (LICENSE)
- [ ] 배포 가이드가 명확한가?

## 🔐 보안 체크리스트

GitHub에 올리기 전에:

- [ ] API 키가 코드에 포함되어 있지 않은가?
- [ ] 환경 변수가 `.gitignore`에 포함되어 있는가?
- [ ] 개인 정보가 코드에 포함되어 있지 않은가?
- [ ] 테스트 계정 정보가 제거되었는가?

## 📝 커밋 메시지 규칙

좋은 커밋 메시지 예시:

```
feat: 엑셀 업로드 기능 추가
fix: 경로 최적화 알고리즘 버그 수정
docs: README 업데이트
style: 코드 포맷팅
refactor: 컴포넌트 구조 개선
test: 테스트 추가
chore: 의존성 업데이트
```

## 🔄 협업 설정

### Branch 전략
```
main          # 프로덕션 배포
├── develop   # 개발 브랜치
├── feature/* # 기능 개발
└── hotfix/*  # 긴급 수정
```

### Pull Request 템플릿
`.github/pull_request_template.md` 생성:
```markdown
## 설명
이 PR은 무엇을 하나요?

## 변경 사항
- 변경 1
- 변경 2

## 테스트
어떻게 테스트했나요?

## 체크리스트
- [ ] 코드 리뷰 완료
- [ ] 테스트 통과
- [ ] 문서 업데이트
```

## 🌟 GitHub 프로필 개선

### 저장소 설명 작성
```
배송 경로 최적화 SaaS - 엑셀 주소 업로드 기반 최적 경로 생성 서비스
React + TypeScript + Tailwind CSS + Vite
```

### Topics 추가
- react
- typescript
- tailwindcss
- vite
- route-optimization
- saas

### Badges 추가 (선택사항)
README.md 상단에 추가:
```markdown
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-v10.4.1-blue)](https://pnpm.io/)
```

## 📊 GitHub Pages (선택사항)

정적 사이트를 GitHub Pages에 배포:

1. 저장소 Settings → Pages
2. Source: `Deploy from a branch`
3. Branch: `main` / `docs` 폴더 선택
4. 저장

## 🔗 유용한 링크

- [GitHub 문서](https://docs.github.com)
- [Git 가이드](https://git-scm.com/doc)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

## 📞 문제 해결

### Git 푸시 실패
```bash
# 원격 저장소 상태 확인
git remote -v

# 원격 저장소 재설정
git remote set-url origin https://github.com/YOUR_USERNAME/route-optimizer-saas.git

# 다시 푸시
git push -u origin main
```

### 커밋 히스토리 정리
```bash
# 마지막 커밋 수정
git commit --amend

# 커밋 히스토리 리베이스
git rebase -i HEAD~3
```

---

**마지막 업데이트**: 2026년 5월 8일
