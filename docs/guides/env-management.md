# 환경 변수 관리 가이드

> `.env.local` 파일을 안전하게 보관하고 관리하는 방법

**마지막 업데이트**: 2025-11-16

---

## 📋 목차

1. [즉시 적용 가능한 방법](#즉시-적용-가능한-방법)
2. [프로젝트 레벨 솔루션](#프로젝트-레벨-솔루션)
3. [팀 협업을 위한 솔루션](#팀-협업을-위한-솔루션)
4. [보안 모범 사례](#보안-모범-사례)
5. [환경 변수 복원 가이드](#환경-변수-복원-가이드)

---

## 🔐 즉시 적용 가능한 방법

### 1. 비밀번호 관리자 사용 (가장 추천 ⭐)

**1Password, Bitwarden, LastPass 등에 저장**

#### 장점
- ✅ 즉시 사용 가능
- ✅ 팀원과 안전하게 공유 가능
- ✅ 버전 관리 (변경 이력 추적)
- ✅ 2FA 보호
- ✅ 여러 기기에서 동기화

#### 사용법

**1Password 예시:**
1. 1Password 앱 열기
2. "New Item" → "Secure Note" 선택
3. 제목: `IDEA on Action - Environment Variables`
4. `.env.local` 파일 내용 붙여넣기
5. 태그: `development`, `env`, `idea-on-action`
6. 저장

**Bitwarden 예시:**
1. Bitwarden 웹/앱 열기
2. "New Item" → "Secure Note"
3. 이름: `IDEA on Action - .env.local`
4. Notes 필드에 전체 내용 붙여넣기
5. 폴더: `Development` (사전 생성 필요)
6. 저장

#### 팀 공유 방법
```bash
# 1Password 팀 공유
1. 1Password Vault 생성 (예: "IDEA on Action - Shared")
2. 팀원 초대
3. 환경 변수 노트를 해당 Vault로 이동
4. 접근 권한 설정 (읽기 전용 / 편집 가능)
```

---

### 2. 암호화된 백업 파일

**GPG를 사용한 암호화**

```bash
# 1. GPG 설치 확인
gpg --version

# 2. .env.local 암호화
gpg --symmetric --cipher-algo AES256 .env.local
# 비밀번호 입력 → .env.local.gpg 생성

# 3. 원본 파일 삭제 (선택)
rm .env.local

# 4. 복호화 (필요 시)
gpg --decrypt .env.local.gpg > .env.local
```

**Windows에서 GPG 설치:**
```powershell
# Chocolatey 사용
choco install gpg4win

# 또는 Scoop 사용
scoop install gpg
```

**저장 위치 (암호화된 파일):**
- ✅ Google Drive (개인 폴더)
- ✅ Dropbox (암호화된 폴더)
- ✅ OneDrive (개인 Vault)
- ✅ 외장 하드디스크
- ✅ USB 드라이브 (BitLocker 사용)

---

## 🏢 프로젝트 레벨 솔루션

### 3. dotenv-vault (추천 ⭐)

**암호화된 .env 파일을 Git에 안전하게 커밋**

#### 설치

```bash
# 1. dotenv-vault 설치
npm install --save-dev dotenv-vault-core

# 2. 글로벌 CLI 설치 (선택)
npm install -g dotenv-vault
```

#### 사용법

```bash
# 1. .env.local 암호화
npx dotenv-vault local build

# 생성되는 파일:
# - .env.vault (암호화된 파일, Git 커밋 가능)
# - .env.keys (암호화 키, .gitignore에 추가)

# 2. .env.keys를 비밀번호 관리자에 저장

# 3. 복호화 (새 환경에서)
DOTENV_KEY="dotenv://:key_xxxxx@dotenv.local/vault/.env.vault?environment=production"
npx dotenv-vault local decrypt
```

#### .gitignore 업데이트

```bash
# .env files
.env
.env.local
.env.*.local

# dotenv-vault keys (중요!)
.env.keys
```

#### .env.vault 파일 커밋

```bash
git add .env.vault
git commit -m "chore: add encrypted environment variables"
git push
```

---

### 4. git-crypt

**Git 저장소 내 특정 파일 자동 암호화**

#### 설치

```bash
# Windows (Chocolatey)
choco install git-crypt

# macOS
brew install git-crypt

# Linux
sudo apt-get install git-crypt
```

#### 설정

```bash
# 1. git-crypt 초기화
cd d:\GitHub\idea-on-action
git-crypt init

# 2. .gitattributes 파일 생성
echo ".env.local filter=git-crypt diff=git-crypt" > .gitattributes
echo ".env.keys filter=git-crypt diff=git-crypt" >> .gitattributes

# 3. GPG 키로 잠금 해제 (팀원 공유용)
git-crypt add-gpg-user your-gpg-key-id

# 4. 커밋
git add .gitattributes .env.local
git commit -m "chore: encrypt sensitive env files with git-crypt"
```

#### 팀원과 공유

```bash
# 1. GPG 키 생성 (팀원)
gpg --gen-key

# 2. 공개 키 공유
gpg --export --armor your-email@example.com > public-key.asc

# 3. 저장소 관리자가 팀원 추가
gpg --import public-key.asc
git-crypt add-gpg-user your-email@example.com

# 4. 팀원이 저장소 클론 후 잠금 해제
git-crypt unlock
```

---

## 🤝 팀 협업을 위한 솔루션

### 5. Doppler (클라우드 시크릿 관리)

**무료 플랜으로 시작 가능**

#### 설치 및 설정

```bash
# 1. Doppler CLI 설치
# Windows (Scoop)
scoop install doppler

# macOS
brew install dopplerhq/cli/doppler

# 2. 로그인
doppler login

# 3. 프로젝트 설정
doppler setup

# 4. 시크릿 업로드
doppler secrets upload .env.local

# 5. 시크릿 다운로드 (팀원)
doppler secrets download --no-file --format env > .env.local
```

#### 장점
- ✅ 중앙 집중식 관리
- ✅ 팀원 권한 관리
- ✅ 변경 이력 추적
- ✅ 자동 동기화
- ✅ CI/CD 통합

#### 가격
- **Free**: 5명까지, 무제한 시크릿
- **Team**: $12/월 (사용자당)

---

### 6. Infisical (오픈소스 대안)

**self-hosted 또는 클라우드**

```bash
# CLI 설치
npm install -g @infisical/cli

# 로그인
infisical login

# 시크릿 푸시
infisical secrets push --env=dev

# 시크릿 풀
infisical secrets pull --env=dev > .env.local
```

**장점:**
- ✅ 오픈소스 (MIT 라이선스)
- ✅ Self-hosted 가능
- ✅ 무료 클라우드 플랜
- ✅ Git 통합

---

## 🛡️ 보안 모범 사례

### 1. 환경 변수 분류

```bash
# .env (공개 가능, Git 커밋 OK)
VITE_APP_NAME=IDEA on Action
VITE_APP_VERSION=2.0.0
VITE_GA4_MEASUREMENT_ID=G-GCEBTH0LX4

# .env.local (로컬 개발, Git 제외)
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_OPENAI_API_KEY=...

# .env.production (프로덕션 전용, Vercel/GitHub Secrets)
SUPABASE_SERVICE_ROLE_KEY=...
VITE_SENTRY_DSN=...
```

### 2. .gitignore 확인

```bash
# .gitignore에 반드시 포함
.env.local
.env.*.local
.env.keys
*.env.backup
```

### 3. 정기적인 키 로테이션

```bash
# 3-6개월마다 API 키 갱신
# 1. 새 키 생성
# 2. .env.local 업데이트
# 3. 비밀번호 관리자 업데이트
# 4. Vercel/GitHub Secrets 업데이트
# 5. 이전 키 비활성화
```

### 4. 접근 권한 최소화

```bash
# 파일 권한 설정 (Linux/macOS)
chmod 600 .env.local

# Windows
icacls .env.local /inheritance:r
icacls .env.local /grant:r "%USERNAME%:F"
```

---

## 🔄 환경 변수 복원 가이드

### 시나리오 1: 로컬 파일 손실

```bash
# 1. 비밀번호 관리자에서 복사
# 2. 새 .env.local 파일 생성
# 3. 내용 붙여넣기

# 또는 암호화된 백업 복호화
gpg --decrypt .env.local.gpg > .env.local
```

### 시나리오 2: 새 팀원 온보딩

```bash
# 방법 1: 비밀번호 관리자 공유
1. 팀원을 1Password/Bitwarden Vault에 초대
2. 환경 변수 노트 공유
3. 팀원이 .env.local 생성

# 방법 2: dotenv-vault
1. DOTENV_KEY 공유 (안전한 채널)
2. 팀원이 복호화
   npx dotenv-vault local decrypt

# 방법 3: git-crypt
1. 팀원 GPG 공개 키 받기
2. 저장소에 추가
   git-crypt add-gpg-user team@example.com
3. 팀원이 저장소 클론 후
   git-crypt unlock
```

### 시나리오 3: CI/CD 환경 설정

```bash
# GitHub Actions (.github/workflows/*.yml)
env:
  VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
  VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}

# Vercel (vercel.com/dashboard)
# Project Settings → Environment Variables
# - Development
# - Preview
# - Production
```

---

## 🚀 추천 워크플로우

### 개인 개발자 (현재 상황)

```bash
✅ 단기 (즉시):
1. 비밀번호 관리자에 .env.local 저장 (1Password/Bitwarden)
2. 암호화된 백업 생성 (GPG)
3. Google Drive에 .env.local.gpg 업로드

✅ 중기 (1주일):
1. dotenv-vault 도입
2. .env.vault 파일 Git 커밋
3. .env.keys를 비밀번호 관리자에 저장

✅ 장기 (1개월):
1. Doppler 또는 Infisical 도입 검토
2. 자동 동기화 설정
3. CI/CD 통합
```

### 팀 프로젝트

```bash
✅ 필수:
1. 비밀번호 관리자 팀 Vault (1Password Teams)
2. git-crypt로 .env.local 암호화
3. CI/CD 환경 변수 설정 (GitHub Secrets, Vercel)

✅ 권장:
1. Doppler/Infisical로 중앙 관리
2. 팀원 권한 관리
3. 변경 이력 추적
4. 자동 로테이션 설정
```

---

## 📝 체크리스트

### 환경 변수 보안 체크리스트

- [ ] `.env.local`이 `.gitignore`에 포함되어 있는가?
- [ ] 비밀번호 관리자에 백업이 저장되어 있는가?
- [ ] 암호화된 백업 파일이 있는가? (.gpg)
- [ ] 팀원과 안전하게 공유할 방법이 있는가?
- [ ] CI/CD 환경 변수가 설정되어 있는가?
- [ ] API 키 로테이션 일정이 있는가?
- [ ] 파일 권한이 적절히 설정되어 있는가?
- [ ] 프로덕션 키와 개발 키가 분리되어 있는가?

---

## 🔗 참고 자료

### 도구
- [1Password](https://1password.com/) - 비밀번호 관리자
- [Bitwarden](https://bitwarden.com/) - 오픈소스 비밀번호 관리자
- [dotenv-vault](https://www.dotenv.org/docs/security/env-vault) - 암호화된 .env 관리
- [git-crypt](https://github.com/AGWA/git-crypt) - Git 파일 암호화
- [Doppler](https://www.doppler.com/) - 클라우드 시크릿 관리
- [Infisical](https://infisical.com/) - 오픈소스 시크릿 관리
- [GPG](https://gnupg.org/) - 파일 암호화

### 가이드
- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [The Twelve-Factor App: Config](https://12factor.net/config)
- [GitHub: Encrypted secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Vercel: Environment Variables](https://vercel.com/docs/projects/environment-variables)

---

**작성자**: Claude Code
**프로젝트**: IDEA on Action
**최종 업데이트**: 2025-11-16
