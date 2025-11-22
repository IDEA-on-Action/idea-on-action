# Compass Navigator JWT 설정 가이드

> Compass Navigator(CN) 팀을 위한 Supabase JWT Secret 설정 안내

**작성일**: 2025-11-22
**대상**: Compass Navigator 개발팀
**보안 등급**: Confidential

---

## 1. JWT Secret 확인 방법

### Supabase Dashboard 접근

1. [Supabase Dashboard](https://supabase.com/dashboard)에 로그인
2. IDEA on Action 프로젝트 선택
3. 좌측 메뉴에서 **Project Settings** (톱니바퀴 아이콘) 클릭
4. **API** 탭 선택
5. **JWT Settings** 섹션에서 `JWT Secret` 확인

### 프로젝트 정보

| 항목 | 값 |
|------|-----|
| Supabase URL | `https://zykjdneewbzyazfukzyg.supabase.co` |
| Project Ref | `zykjdneewbzyazfukzyg` |

---

## 2. 보안 모범 사례

### 비밀 정보 공유 시 주의사항

- **암호화된 채널 사용**: Slack DM, 1Password, LastPass 등 암호화된 채널로만 공유
- **일회성 공유 서비스**: [One-Time Secret](https://onetimesecret.com/) 등 자동 삭제되는 서비스 활용
- **이메일/메신저 금지**: 일반 이메일, 카카오톡 등 암호화되지 않은 채널로 절대 공유 금지
- **화면 공유 주의**: 화상 회의 중 JWT Secret이 노출되지 않도록 주의

### 코드 보안 규칙

```bash
# 절대 금지 - 코드에 직접 입력
JWT_SECRET = "your-super-secret-jwt-token"  # 금지

# 권장 - 환경 변수 사용
JWT_SECRET = os.environ.get("IDEAONACTION_SUPABASE_JWT_SECRET")
```

### Git 보안

```gitignore
# .gitignore에 반드시 포함
.env
.env.local
.env.*.local
*.pem
*.key
```

---

## 3. 환경 변수 설정

### 필수 환경 변수

| 환경 변수명 | 설명 | 발급 방법 |
|------------|------|----------|
| `IDEAONACTION_SUPABASE_URL` | Supabase 프로젝트 URL | 위 표 참조 |
| `IDEAONACTION_SUPABASE_JWT_SECRET` | JWT 서명/검증용 시크릿 | Dashboard에서 확인 |
| `IDEAONACTION_WEBHOOK_SECRET` | Webhook 요청 검증용 | 아래 생성 방법 참조 |

### Webhook Secret 생성 방법

```bash
# OpenSSL 사용 (권장)
openssl rand -hex 32

# Python 사용
python -c "import secrets; print(secrets.token_hex(32))"

# Node.js 사용
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 환경 변수 파일 예시

```bash
# .env.local (CN 서버용)
IDEAONACTION_SUPABASE_URL=https://zykjdneewbzyazfukzyg.supabase.co
IDEAONACTION_SUPABASE_JWT_SECRET=<Dashboard에서 확인한 값>
IDEAONACTION_WEBHOOK_SECRET=<생성한 32바이트 hex 값>
```

---

## 4. JWT 토큰 검증 예시

### Python (PyJWT)

```python
import jwt
import os

def verify_supabase_token(token: str) -> dict:
    """Supabase JWT 토큰 검증"""
    secret = os.environ.get("IDEAONACTION_SUPABASE_JWT_SECRET")

    try:
        payload = jwt.decode(
            token,
            secret,
            algorithms=["HS256"],
            audience="authenticated"
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception("토큰이 만료되었습니다")
    except jwt.InvalidTokenError:
        raise Exception("유효하지 않은 토큰입니다")
```

### Node.js (jsonwebtoken)

```javascript
const jwt = require('jsonwebtoken');

function verifySupabaseToken(token) {
  const secret = process.env.IDEAONACTION_SUPABASE_JWT_SECRET;

  try {
    const payload = jwt.verify(token, secret, {
      algorithms: ['HS256'],
      audience: 'authenticated'
    });
    return payload;
  } catch (error) {
    throw new Error(`토큰 검증 실패: ${error.message}`);
  }
}
```

---

## 5. CN 팀 체크리스트

### 초기 설정

- [ ] Supabase Dashboard 접근 권한 확인
- [ ] JWT Secret 수신 (암호화 채널 통해)
- [ ] Webhook Secret 생성 및 공유
- [ ] 환경 변수 파일 설정 (.env.local)
- [ ] .gitignore에 환경 변수 파일 포함 확인

### 연동 테스트

- [ ] JWT 토큰 검증 로직 구현
- [ ] 테스트 토큰으로 검증 성공 확인
- [ ] 만료된 토큰 처리 확인
- [ ] 잘못된 토큰 처리 확인

### 보안 점검

- [ ] 코드에 하드코딩된 시크릿 없음 확인
- [ ] 로그에 JWT Secret 노출 없음 확인
- [ ] 환경 변수 파일이 Git에 포함되지 않음 확인
- [ ] 프로덕션 환경 변수 별도 관리 확인

### 프로덕션 배포

- [ ] 스테이징 환경 테스트 완료
- [ ] 프로덕션 환경 변수 설정
- [ ] 모니터링 알림 설정
- [ ] 롤백 계획 수립

---

## 6. 문제 해결

### 자주 발생하는 오류

| 오류 | 원인 | 해결 방법 |
|------|------|----------|
| `invalid signature` | JWT Secret 불일치 | Dashboard에서 최신 Secret 확인 |
| `token expired` | 토큰 만료 | 클라이언트에서 토큰 갱신 요청 |
| `audience mismatch` | audience 값 불일치 | `authenticated` 사용 확인 |

### 지원 연락처

- **IDEA on Action 기술팀**: sinclairseo@gmail.com
- **긴급 연락**: 010-4904-2671

---

## 7. 참고 자료

- [Supabase Auth 문서](https://supabase.com/docs/guides/auth)
- [JWT 공식 사이트](https://jwt.io/)
- [PyJWT 문서](https://pyjwt.readthedocs.io/)
- [jsonwebtoken npm](https://www.npmjs.com/package/jsonwebtoken)

---

**문서 버전**: 1.0.0
**최종 수정**: 2025-11-22
