# 비밀번호 관리자 설정 가이드

> 1Password 또는 Bitwarden을 사용하여 `.env.local` 파일을 안전하게 보관하는 방법

**마지막 업데이트**: 2025-11-16

---

## 📋 목차

1. [1Password 사용법](#1password-사용법)
2. [Bitwarden 사용법](#bitwarden-사용법)
3. [복원 방법](#복원-방법)
4. [팀 공유 방법](#팀-공유-방법)
5. [보안 팁](#보안-팁)

---

## 🔐 1Password 사용법

### 1단계: 1Password 설치

**무료 체험**: 14일 무료 (개인용 $2.99/월, 팀용 $19.95/월)

- **Windows/Mac**: [1password.com/downloads](https://1password.com/downloads)
- **브라우저 확장**: Chrome, Firefox, Edge, Safari

### 2단계: .env.local 저장하기

#### 방법 1: 웹/앱 사용

```
1. 1Password 앱 열기
2. 오른쪽 상단 [+ New Item] 클릭
3. "Secure Note" 선택
4. 다음 정보 입력:

   Title: IDEA on Action - Environment Variables

   Notes 필드에 .env.local 파일 내용 붙여넣기:
   ```
   # Supabase Configuration
   VITE_SUPABASE_URL=https://zykjdneewbzyazfukzyg.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   ...
   ```

5. 태그 추가:
   - development
   - env
   - idea-on-action
   - backup

6. [Save] 클릭
```

#### 방법 2: 파일 첨부

```
1. 1Password 앱에서 "Secure Note" 생성
2. 하단 [Attach File] 클릭
3. .env.local 파일 선택
4. 저장
```

#### 방법 3: CLI 사용 (고급)

```bash
# 1Password CLI 설치
# Windows (Scoop)
scoop install 1password-cli

# macOS
brew install --cask 1password-cli

# 1Password에 저장
op item create \
  --category="Secure Note" \
  --title="IDEA on Action - Environment Variables" \
  --vault="Development" \
  --tags="env,backup" \
  < .env.local
```

### 3단계: 정기적으로 업데이트

```
환경 변수가 변경될 때마다:
1. 1Password에서 해당 노트 열기
2. [Edit] 클릭
3. 새 내용으로 업데이트
4. [Save] 클릭

→ 1Password는 자동으로 버전 관리를 해줍니다!
```

---

## 🔓 Bitwarden 사용법 (오픈소스)

### 1단계: Bitwarden 설치

**무료 플랜**: 개인용 무료, 팀용 $3/월

- **Windows/Mac**: [bitwarden.com/download](https://bitwarden.com/download)
- **브라우저 확장**: Chrome, Firefox, Edge, Safari

### 2단계: .env.local 저장하기

#### 웹/앱 사용

```
1. Bitwarden 앱 열기
2. 오른쪽 상단 [+ Add Item] 클릭
3. "Secure Note" 선택
4. 다음 정보 입력:

   Name: IDEA on Action - Environment Variables

   Notes 필드에 .env.local 파일 내용 붙여넣기:
   ```
   # Supabase Configuration
   VITE_SUPABASE_URL=https://zykjdneewbzyazfukzyg.supabase.co
   ...
   ```

5. Folder: Development (사전 생성 필요)
6. [Save] 클릭
```

#### CLI 사용 (고급)

```bash
# Bitwarden CLI 설치
# Windows (Scoop)
scoop install bitwarden-cli

# macOS
brew install bitwarden-cli

# 로그인
bw login

# 세션 키 저장
export BW_SESSION=$(bw unlock --raw)

# Secure Note 생성
bw create item '{
  "type": 2,
  "name": "IDEA on Action - Environment Variables",
  "secureNote": {
    "type": 0
  },
  "notes": "'"$(cat .env.local)"'",
  "folderId": null
}'
```

### 3단계: 파일 첨부 (프리미엄 필요)

```
무료 플랜: 텍스트만 가능
프리미엄 ($10/년): 파일 첨부 가능 (1GB)

1. Bitwarden 프리미엄 구독
2. Secure Note에 .env.local 파일 첨부
3. 암호화되어 저장됨
```

---

## 🔄 복원 방법

### 1Password에서 복원

#### 웹/앱

```
1. 1Password 앱 열기
2. "IDEA on Action - Environment Variables" 검색
3. Notes 필드 내용 복사
4. 프로젝트 루트에 .env.local 파일 생성
5. 복사한 내용 붙여넣기
6. 저장
```

#### CLI

```bash
# 1Password CLI로 복원
op item get "IDEA on Action - Environment Variables" \
  --fields label=notesPlain \
  > .env.local

# 파일 권한 설정 (Linux/macOS)
chmod 600 .env.local
```

### Bitwarden에서 복원

#### 웹/앱

```
1. Bitwarden 앱 열기
2. "IDEA on Action - Environment Variables" 검색
3. Notes 필드 클릭 → [Copy] 아이콘
4. .env.local 파일 생성 후 붙여넣기
```

#### CLI

```bash
# Bitwarden CLI로 복원
export BW_SESSION=$(bw unlock --raw)

bw get item "IDEA on Action - Environment Variables" \
  | jq -r '.notes' \
  > .env.local
```

---

## 🤝 팀 공유 방법

### 1Password 팀 공유

```
1. 1Password Teams 구독 ($19.95/월, 5명)
2. 공유 Vault 생성:
   Settings → Vaults → [+ Create New Vault]
   이름: "IDEA on Action - Shared"

3. 팀원 초대:
   Settings → People → [+ Invite People]
   이메일 입력 → 권한 설정

4. 환경 변수 노트를 공유 Vault로 이동:
   노트 선택 → 우클릭 → Move to → "IDEA on Action - Shared"

5. 권한 설정:
   - View: 읽기 전용
   - Edit: 편집 가능
   - Manager: 관리 권한
```

### Bitwarden Organization

```
1. Bitwarden Organization 생성 ($3/월 per user)
2. 팀원 초대:
   Organization → Manage → People → [+ Invite User]

3. Collection 생성:
   Organization → Manage → Collections → [+ New Collection]
   이름: "IDEA on Action"

4. 환경 변수를 Collection으로 이동
5. Collection 권한 설정:
   - Can View
   - Can Edit
   - Can Manage
```

---

## 🛡️ 보안 팁

### 1. 강력한 마스터 비밀번호 사용

```
✅ 좋은 예:
- 20자 이상
- 대소문자, 숫자, 특수문자 조합
- 사전에 없는 단어
- 예: "MyP@ssw0rd!2024-IdeaOnAction"

❌ 나쁜 예:
- password123
- qwerty
- 생일, 이름
```

### 2. 2단계 인증 (2FA) 활성화

**1Password:**
```
Settings → Security → Two-Factor Authentication
→ Authenticator App (Google Authenticator, Authy)
```

**Bitwarden:**
```
Settings → Security → Two-step Login
→ Authenticator App (무료)
→ YubiKey (프리미엄)
```

### 3. 정기적으로 비밀번호 감사

```
1Password: Watchtower 기능
- 약한 비밀번호 알림
- 재사용된 비밀번호 알림
- 유출된 비밀번호 알림

Bitwarden: Reports
- Exposed Passwords Report
- Weak Passwords Report
- Reused Passwords Report
```

### 4. 자동 잠금 설정

```
1Password:
Settings → Security → Auto-lock
→ 5분 후 자동 잠금

Bitwarden:
Settings → Security → Vault Timeout
→ 5분 후 자동 잠금
```

### 5. 긴급 액세스 설정

**1Password:**
```
Settings → Security → Emergency Kit
→ 긴급 연락처 지정
→ 대기 기간 설정 (예: 7일)
```

**Bitwarden:**
```
Settings → Emergency Access
→ Trusted Emergency Contact 추가
→ Wait Time 설정
```

---

## 📋 체크리스트

### 초기 설정

- [ ] 비밀번호 관리자 설치 (1Password / Bitwarden)
- [ ] 마스터 비밀번호 설정 (강력하게!)
- [ ] 2단계 인증 (2FA) 활성화
- [ ] .env.local 파일 Secure Note로 저장
- [ ] 태그 추가 (development, env, backup)
- [ ] Emergency Kit 다운로드 (안전한 곳에 보관)

### 정기 유지보수

- [ ] 환경 변수 변경 시 즉시 업데이트
- [ ] 월 1회: 비밀번호 감사 실행
- [ ] 분기 1회: API 키 로테이션
- [ ] 반기 1회: 팀원 권한 검토
- [ ] 연 1회: 마스터 비밀번호 변경 검토

### 팀 협업

- [ ] 팀 플랜 구독 (필요 시)
- [ ] 공유 Vault/Collection 생성
- [ ] 팀원 초대 및 권한 설정
- [ ] 온보딩 문서 작성
- [ ] 오프보딩 프로세스 정의

---

## 🚀 다음 단계

1. **지금 바로 백업하기**
   ```bash
   # 비밀번호 관리자에 저장
   # 1. .env.local 파일 열기
   # 2. 전체 내용 복사
   # 3. 1Password/Bitwarden에 Secure Note로 저장
   ```

2. **GPG 백업 추가하기**
   ```bash
   npm run env:backup
   ```

3. **정기 백업 일정 설정**
   - 캘린더에 월 1회 알림 추가
   - 환경 변수 변경 시 즉시 업데이트

4. **팀원에게 공유 (필요 시)**
   - 팀 플랜 구독
   - 공유 Vault/Collection 생성
   - 팀원 초대

---

## 🔗 참고 자료

### 공식 문서
- [1Password Documentation](https://support.1password.com/)
- [Bitwarden Help Center](https://bitwarden.com/help/)
- [1Password CLI](https://developer.1password.com/docs/cli)
- [Bitwarden CLI](https://bitwarden.com/help/cli/)

### 비교 가이드
- [1Password vs Bitwarden](https://www.nytimes.com/wirecutter/reviews/best-password-managers/)
- [Security Audit Reports](https://bitwarden.com/help/is-bitwarden-audited/)

### 무료 대안
- [KeePassXC](https://keepassxc.org/) - 완전 무료, 오프라인
- [Dashlane Free](https://www.dashlane.com/plans) - 50개 비밀번호까지 무료

---

## ❓ FAQ

### Q1: 1Password와 Bitwarden 중 어떤 것을 선택해야 하나요?

**1Password:**
- ✅ 더 세련된 UI/UX
- ✅ 더 많은 통합 기능
- ✅ 가족 플랜 좋음
- ❌ 더 비쌈 ($2.99/월)

**Bitwarden:**
- ✅ 오픈소스
- ✅ 무료 플랜 강력함
- ✅ Self-hosted 가능
- ✅ 더 저렴함 (무료 또는 $10/년)

**추천:**
- **개인 사용**: Bitwarden (무료)
- **팀 사용**: 1Password (팀 기능 우수)
- **예산 중시**: Bitwarden
- **UX 중시**: 1Password

### Q2: 마스터 비밀번호를 잊어버리면 어떻게 하나요?

**1Password:**
- Emergency Kit을 안전한 곳에 보관했다면 복구 가능
- 그렇지 않으면 계정 복구 불가능 (보안상 이유)

**Bitwarden:**
- Emergency Access를 설정했다면 Trusted Contact를 통해 복구
- 그렇지 않으면 복구 불가능

**예방책:**
- Emergency Kit 출력 후 금고에 보관
- Emergency Access 설정
- 마스터 비밀번호 힌트 저장 (안전한 곳에)

### Q3: .env.local을 Git에 커밋해도 되나요?

**절대 안 됩니다!**

```bash
# .gitignore에 반드시 포함
.env.local
.env.*.local
*.env.backup
```

**이유:**
- GitHub에 공개되면 API 키 노출
- 보안 침해 위험
- 복구 불가능한 피해 발생 가능

**대신:**
- 비밀번호 관리자에 저장
- GPG 암호화 백업 (.env.local.gpg)
- dotenv-vault (.env.vault)

### Q4: 팀원이 환경 변수를 잘못 수정하면 어떻게 하나요?

**1Password:**
```
1. 노트 열기
2. 우측 상단 시계 아이콘 클릭
3. "Item History" 확인
4. 이전 버전 복원
```

**Bitwarden:**
```
Premium Plan 필요:
1. 노트 열기
2. 우측 상단 [...] 메뉴
3. "View History"
4. 이전 버전 복원
```

**Git 백업:**
```bash
# 백업 폴더에서 복원
npm run env:restore
# → 타임스탬프 백업 선택
```

---

**작성자**: Claude Code
**프로젝트**: IDEA on Action
**최종 업데이트**: 2025-11-16

---

**다음 단계**: [환경 변수 관리 가이드](./env-management.md)로 돌아가기
