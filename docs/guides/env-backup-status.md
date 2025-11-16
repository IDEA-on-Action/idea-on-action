# 환경 변수 백업 상태

> `.env.local` 파일의 현재 백업 상태 및 복원 방법

**마지막 업데이트**: 2025-11-16
**백업 완료 시간**: 2025-11-16 09:41

---

## ✅ 완료된 백업

### 1️⃣ **1Password** (Primary Backup) ⭐
- **상태**: ✅ Import 완료
- **형식**: Secure Note
- **제목**: "IDEA on Action - Environment Variables"
- **태그**: env, development, backup, idea-on-action
- **변수 수**: 26개
- **접근**: https://my.1password.com

**복원 방법**:
```bash
1. 1Password 웹/앱 열기
2. "IDEA on Action - Environment Variables" 검색
3. Secure Note 열기
4. 내용 전체 복사 (Ctrl+A → Ctrl+C)
5. 프로젝트 루트에 .env.local 파일 생성
6. 복사한 내용 붙여넣기
7. 저장
```

---

### 2️⃣ **GPG 암호화 백업** (Secondary Backup)
- **상태**: ✅ 생성 완료
- **파일**: `.env.local.gpg` (프로젝트 루트)
- **암호화**: AES256
- **크기**: 1.4 KB
- **생성일**: 2025-11-16 09:05

**복원 방법**:
```bash
# 암호화된 파일에서 복원
gpg --decrypt .env.local.gpg > .env.local

# 또는 npm 스크립트 사용
npm run env:restore
# → 옵션 1 선택: GPG 암호화 백업에서 복원
```

**주의사항**:
- ⚠️ GPG 비밀번호를 반드시 기억하세요!
- 📌 이 파일을 클라우드에 백업하는 것을 권장합니다:
  - Google Drive
  - OneDrive
  - Dropbox
  - 외장 하드디스크

---

### 3️⃣ **백업 시스템** (자동화)
- **상태**: ✅ 설치 완료
- **스크립트**:
  - `scripts/backup-env.js` - 백업 생성
  - `scripts/restore-env.js` - 백업 복원
  - `scripts/export-env-to-csv.js` - CSV 내보내기

**사용 가능한 명령어**:
```bash
# 전체 백업 생성 (GPG + 타임스탬프)
npm run env:backup

# 백업 복원 (인터랙티브)
npm run env:restore

# 1Password CSV 내보내기
npm run env:export:csv
```

---

## 📊 백업 현황 요약

| 백업 종류 | 상태 | 위치 | 암호화 | 우선순위 |
|---------|------|------|--------|----------|
| **1Password** | ✅ 완료 | 클라우드 | ✅ | 🔴 Primary |
| **GPG 백업** | ✅ 완료 | 로컬 (`.env.local.gpg`) | ✅ AES256 | 🟡 Secondary |
| **원본 파일** | ✅ 존재 | 로컬 (`.env.local`) | ❌ | 🟢 Working Copy |

---

## 🔐 보안 상태

### ✅ 완료된 보안 조치

- [x] `.env.local`이 `.gitignore`에 포함됨
- [x] `.env.local.gpg` (암호화 백업) 생성
- [x] 1Password에 안전하게 저장
- [x] CSV 파일 삭제 완료 (평문 노출 방지)
- [x] 백업 자동화 시스템 구축

### ⚠️ 추가 권장 사항

- [ ] **GPG 백업을 클라우드에 업로드** (중요!)
  ```bash
  # .env.local.gpg 파일을 다음 중 하나에 업로드:
  - Google Drive
  - OneDrive
  - Dropbox
  ```

- [ ] **1Password 2FA 활성화**
  ```
  1Password → Settings → Security → Two-Factor Authentication
  → Authenticator App (Google Authenticator, Authy)
  ```

- [ ] **Emergency Kit 다운로드**
  ```
  1Password → Settings → Security → Download Emergency Kit
  → 금고 또는 안전한 곳에 보관
  ```

- [ ] **정기 백업 일정 설정**
  ```
  캘린더에 월 1회 알림 추가:
  - 제목: "환경 변수 백업 확인"
  - 작업: npm run env:backup 실행 및 1Password 업데이트
  ```

---

## 🔄 복원 시나리오

### 시나리오 1: .env.local 파일 손실

**상황**: 로컬에서 .env.local 파일이 삭제됨

**해결**:
```bash
# Option A: 1Password에서 복원 (가장 빠름)
1. 1Password에서 "IDEA on Action - Environment Variables" 열기
2. 내용 복사
3. .env.local 파일 생성 후 붙여넣기

# Option B: GPG 백업에서 복원
npm run env:restore
# → 옵션 1 선택
```

---

### 시나리오 2: 새 컴퓨터 설정

**상황**: 새 컴퓨터에서 프로젝트 시작

**해결**:
```bash
# 1. 저장소 클론
git clone https://github.com/IDEA-on-Action/idea-on-action.git
cd idea-on-action

# 2. 의존성 설치
npm install

# 3. 환경 변수 복원 (1Password 사용)
# - 1Password 로그인
# - "IDEA on Action - Environment Variables" 검색
# - 내용 복사 → .env.local 파일 생성

# 4. 개발 서버 실행
npm run dev
```

---

### 시나리오 3: 팀원 온보딩

**상황**: 새 팀원이 프로젝트에 합류

**해결**:
```bash
# Option A: 1Password Teams (권장)
1. 1Password Teams Vault에 팀원 초대
2. "IDEA on Action - Environment Variables" 공유
3. 팀원이 내용 복사 → .env.local 파일 생성

# Option B: GPG 백업 공유
1. .env.local.gpg 파일 안전한 채널로 전달 (Slack DM, 이메일 등)
2. GPG 비밀번호 별도로 전달 (전화, SMS 등)
3. 팀원이 복호화:
   gpg --decrypt .env.local.gpg > .env.local
```

---

## 📋 환경 변수 목록 (26개)

### Supabase (3개)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### OAuth Providers (4개)
- `VITE_GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `VITE_GITHUB_CLIENT_ID`
- `VITE_KAKAO_CLIENT_ID`

### OpenAI (2개)
- `VITE_OPENAI_API_KEY`
- `VITE_OPENAI_MODEL`

### Analytics (1개)
- `VITE_GA4_MEASUREMENT_ID`

### Payment Gateway (4개)
- `VITE_KAKAO_PAY_CID`
- `VITE_KAKAO_PAY_ADMIN_KEY`
- `VITE_TOSS_CLIENT_KEY`
- `VITE_TOSS_SECRET_KEY`

### Email Service (2개)
- `VITE_RESEND_API_KEY`
- `VITE_RESEND_FROM_EMAIL`

### Giscus 댓글 (6개)
- `VITE_GISCUS_REPO`
- `VITE_GISCUS_REPO_ID`
- `VITE_GISCUS_CATEGORY_GENERAL`
- `VITE_GISCUS_CATEGORY_GENERAL_ID`
- `VITE_GISCUS_CATEGORY_BLOG`
- `VITE_GISCUS_CATEGORY_BLOG_ID`

### Vercel (2개)
- `VERCEL_PROJECT_ID`
- `VERCEL_ORG_ID`

### Sentry (1개)
- `VITE_SENTRY_DSN`

### Application (1개)
- `VITE_APP_VERSION`

---

## 🛡️ 보안 모범 사례

### 1. 정기적인 키 로테이션
```
권장 주기:
- API 키: 3-6개월
- OAuth 시크릿: 6-12개월
- 암호화 키: 12개월

로테이션 프로세스:
1. 새 키 발급
2. .env.local 업데이트
3. 1Password 업데이트
4. npm run env:backup (새 GPG 백업 생성)
5. Vercel/GitHub Secrets 업데이트
6. 이전 키 비활성화
```

### 2. 접근 권한 최소화
```
원칙: Least Privilege
- 프로덕션 키는 프로덕션 환경에만
- 테스트 키는 개발 환경에만
- Service Role Key는 백엔드에만
```

### 3. 환경별 분리
```
.env.local          # 로컬 개발 (Git 제외)
.env.test           # 테스트 환경
.env.production     # 프로덕션 (Vercel/GitHub Secrets)
```

---

## 📚 관련 문서

- [환경 변수 관리 가이드](./env-management.md)
- [1Password 설정 가이드](./password-manager-setup.md)
- [백업 스크립트](../../scripts/backup-env.js)
- [복원 스크립트](../../scripts/restore-env.js)
- [CSV 내보내기 스크립트](../../scripts/export-env-to-csv.js)

---

## 🆘 문제 해결

### Q1: GPG 비밀번호를 잊어버렸어요

**A**:
```
1. 1Password에서 복원 (Primary Backup)
   - "IDEA on Action - Environment Variables" 열기
   - 내용 복사 → .env.local 생성

2. 새로운 GPG 백업 생성
   npm run env:backup
   - 새로운 비밀번호 설정
   - 비밀번호를 1Password에 저장!
```

### Q2: 1Password 계정에 접근할 수 없어요

**A**:
```
1. GPG 백업에서 복원
   gpg --decrypt .env.local.gpg > .env.local

2. Emergency Kit 사용
   - 1Password Emergency Kit 확인
   - Secret Key로 복구

3. Trusted Emergency Contact에게 요청
   (1Password Emergency Access 설정한 경우)
```

### Q3: 모든 백업을 잃어버렸어요

**A**:
```
최악의 시나리오입니다. 다음 단계를 따르세요:

1. 각 서비스에서 키 재발급:
   - Supabase Dashboard
   - OpenAI Platform
   - Google Cloud Console
   - GitHub Settings
   - Kakao Developers
   - Toss Developers
   - Resend Dashboard
   - Sentry Dashboard

2. 새 .env.local 파일 생성
3. 즉시 백업 생성:
   npm run env:backup
   npm run env:export:csv
4. 1Password에 Import

5. 예방책 강화:
   - 정기 백업 일정 설정
   - 클라우드 백업 추가
   - Emergency Kit 안전한 곳에 보관
```

---

## ✅ 최종 체크리스트

### 즉시 완료
- [x] .env.local 파일 복원 완료
- [x] 1Password에 Import 완료
- [x] GPG 암호화 백업 생성
- [x] CSV 파일 삭제 (보안)
- [x] 백업 스크립트 설치

### 오늘 중 완료 (권장)
- [ ] GPG 백업 (.env.local.gpg) 클라우드 업로드
- [ ] 1Password 2FA 활성화
- [ ] Emergency Kit 다운로드

### 이번 주 완료
- [ ] 정기 백업 일정 설정 (캘린더 알림)
- [ ] API 키 만료일 확인
- [ ] 팀원과 백업 프로세스 공유

---

**작성일**: 2025-11-16
**작성자**: Claude Code
**프로젝트**: IDEA on Action
**버전**: 2.0.1
