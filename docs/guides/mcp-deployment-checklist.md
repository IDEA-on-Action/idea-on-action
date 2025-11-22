# Compass Navigator MCP Server 배포 체크리스트

> MCP 서버의 프로덕션 배포를 위한 종합 가이드

**마지막 업데이트**: 2025-11-22
**대상 버전**: 1.0.0
**배포 대상**: https://www.ideaonaction.ai

---

## 목차

1. [배포 전 요구사항](#1-배포-전-요구사항)
2. [빌드 단계](#2-빌드-단계)
3. [프로덕션 설정](#3-프로덕션-설정)
4. [헬스 체크 검증](#4-헬스-체크-검증)
5. [배포 후 테스트](#5-배포-후-테스트)
6. [모니터링 및 로깅](#6-모니터링-및-로깅)
7. [롤백 절차](#7-롤백-절차)
8. [문제 해결](#8-문제-해결)

---

## 1. 배포 전 요구사항

### 1.1 환경 변수 체크리스트

배포 전 `.env` 파일에 모든 필수 환경 변수가 설정되어 있는지 확인합니다.

#### 필수 환경 변수

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `SUPABASE_URL` | Supabase 프로젝트 URL | `https://zykjdneewbzyazfukzyg.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase 익명 키 (RLS 적용) | `eyJhbGciOiJIUzI1Ni...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 서비스 역할 키 (RLS 우회) | `eyJhbGciOiJIUzI1Ni...` |
| `SUPABASE_JWT_SECRET` | JWT 검증용 시크릿 | `your-jwt-secret` |

#### 서버 설정 변수

| 변수명 | 기본값 | 프로덕션 권장값 |
|--------|--------|-----------------|
| `PORT` | `3001` | `3001` |
| `HOST` | `localhost` | `0.0.0.0` |
| `NODE_ENV` | `production` | `production` |
| `MCP_TRANSPORT` | `http` | `http` |

#### CORS 설정

| 변수명 | 프로덕션 값 |
|--------|------------|
| `CORS_ORIGINS` | `https://www.ideaonaction.ai,https://ideaonaction.ai` |

#### 로깅 설정 (선택사항)

| 변수명 | 기본값 | 프로덕션 권장값 |
|--------|--------|-----------------|
| `LOG_LEVEL` | `info` | `info` |
| `LOG_REQUESTS` | `false` | `true` |

### 1.2 Docker 환경 체크리스트

- [ ] Docker Engine 20.10+ 설치 확인
- [ ] Docker Compose v2.0+ 설치 확인
- [ ] 충분한 디스크 공간 (최소 1GB 권장)
- [ ] 포트 3001이 사용 가능한지 확인

```bash
# Docker 버전 확인
docker --version
docker compose version

# 포트 사용 확인 (Linux/macOS)
lsof -i :3001

# 포트 사용 확인 (Windows)
netstat -ano | findstr :3001
```

### 1.3 Supabase 연결 확인

- [ ] Supabase 프로젝트가 활성 상태인지 확인
- [ ] `compass_user_subscription_view` 뷰가 생성되어 있는지 확인
- [ ] Service Role Key 권한이 올바른지 확인

```bash
# Supabase 연결 테스트 (curl 사용)
curl -X GET \
  "${SUPABASE_URL}/rest/v1/" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}"
```

---

## 2. 빌드 단계

### 2.1 로컬 빌드 (npm)

```bash
# 1. mcp-server 디렉토리로 이동
cd mcp-server

# 2. 의존성 설치
npm ci

# 3. TypeScript 타입 체크
npm run typecheck

# 4. 테스트 실행
npm test

# 5. 프로덕션 빌드
npm run build

# 6. 빌드 결과 확인
ls -la dist/
```

### 2.2 Docker 이미지 빌드

```bash
# 1. mcp-server 디렉토리에서 빌드
cd mcp-server

# 2. Docker 이미지 빌드
docker build -t compass-mcp-server:latest .

# 3. 이미지 빌드 확인
docker images | grep compass-mcp-server

# 4. (선택) 이미지 크기 확인
docker images compass-mcp-server --format "{{.Size}}"
```

### 2.3 Docker Compose 빌드

```bash
# 개발 환경 빌드
docker compose build

# 프로덕션 환경 빌드
docker compose -f docker-compose.yml -f docker-compose.prod.yml build
```

---

## 3. 프로덕션 설정

### 3.1 CORS Origins 설정

프로덕션 환경에서는 반드시 허용된 도메인만 CORS에 등록해야 합니다.

```env
# .env 파일
CORS_ORIGINS=https://www.ideaonaction.ai,https://ideaonaction.ai
```

**허용되는 Origin 목록:**
- `https://www.ideaonaction.ai` (기본 도메인)
- `https://ideaonaction.ai` (www 없는 버전)

### 3.2 보안 헤더 설정

`docker-compose.prod.yml`에서 다음 보안 설정이 적용됩니다:

| 설정 | 값 | 설명 |
|------|-----|------|
| `no-new-privileges` | `true` | 컨테이너 내 권한 상승 방지 |
| `nofile (soft/hard)` | `65536` | 파일 디스크립터 제한 |
| `nproc (soft/hard)` | `4096` | 프로세스 수 제한 |

### 3.3 포트 설정

| 포트 | 용도 | 방화벽 설정 |
|------|------|------------|
| `3001` | MCP HTTP Server | 내부 네트워크만 허용 권장 |

**리버스 프록시 설정 (Nginx 예시):**

```nginx
server {
    listen 443 ssl;
    server_name mcp.ideaonaction.ai;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3.4 리소스 제한

`docker-compose.prod.yml`에서 설정된 리소스 제한:

| 리소스 | 제한 | 최소 보장 |
|--------|------|----------|
| CPU | 1.0 코어 | 0.25 코어 |
| Memory | 512MB | 128MB |

---

## 4. 헬스 체크 검증

### 4.1 Docker 헬스체크 설정

프로덕션 환경의 헬스체크 설정:

| 설정 | 개발 | 프로덕션 |
|------|------|----------|
| `interval` | 30s | 15s |
| `timeout` | 10s | 5s |
| `start_period` | 5s | 10s |
| `retries` | 3 | 5 |

### 4.2 헬스체크 엔드포인트 테스트

```bash
# 로컬 테스트
curl -i http://localhost:3001/health

# 예상 응답
# HTTP/1.1 200 OK
# Content-Type: application/json
# {"status":"healthy","timestamp":"2025-11-22T..."}
```

### 4.3 컨테이너 헬스 상태 확인

```bash
# 컨테이너 헬스 상태 확인
docker inspect --format='{{.State.Health.Status}}' compass-mcp-server

# 헬스체크 로그 확인
docker inspect --format='{{json .State.Health.Log}}' compass-mcp-server | jq
```

---

## 5. 배포 후 테스트

### 5.1 /health 엔드포인트 테스트

```bash
# 헬스 체크
curl -i http://localhost:3001/health

# 예상 응답:
# {
#   "status": "healthy",
#   "timestamp": "2025-11-22T12:00:00.000Z"
# }
```

**체크리스트:**
- [ ] HTTP 상태 코드 200 반환
- [ ] `status: "healthy"` 확인
- [ ] 응답 시간 < 1초

### 5.2 /info 엔드포인트 테스트

```bash
# 서버 정보 조회
curl -i http://localhost:3001/info

# 예상 응답:
# {
#   "name": "compass-navigator-mcp",
#   "version": "1.0.0",
#   "transport": "http"
# }
```

**체크리스트:**
- [ ] 서버 이름 확인
- [ ] 버전 정보 확인
- [ ] Transport 모드가 `http`인지 확인

### 5.3 MCP 프로토콜 테스트

#### 5.3.1 권한 목록 조회

```bash
curl -X POST http://localhost:3001/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "list_permissions"
    },
    "id": 1
  }'
```

#### 5.3.2 토큰 검증 테스트

```bash
curl -X POST http://localhost:3001/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "verify_token",
      "arguments": {
        "token": "YOUR_JWT_TOKEN"
      }
    },
    "id": 2
  }'
```

#### 5.3.3 권한 확인 테스트

```bash
curl -X POST http://localhost:3001/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "check_permission",
      "arguments": {
        "permission": "access_compass_basic"
      }
    },
    "id": 3
  }'
```

### 5.4 통합 테스트 체크리스트

- [ ] `/health` 엔드포인트 정상 응답
- [ ] `/info` 엔드포인트 정상 응답
- [ ] MCP 프로토콜 요청/응답 정상
- [ ] CORS 헤더 정상 (ideaonaction.ai에서 요청 시)
- [ ] JWT 토큰 검증 정상
- [ ] Supabase 연결 정상
- [ ] 권한 체크 로직 정상

---

## 6. 모니터링 및 로깅

### 6.1 로그 설정

프로덕션 로그 설정 (`docker-compose.prod.yml`):

| 설정 | 값 | 설명 |
|------|-----|------|
| `driver` | `json-file` | JSON 형식 로그 |
| `max-size` | `50m` | 최대 파일 크기 |
| `max-file` | `5` | 유지할 파일 수 |
| `compress` | `true` | 로테이션 시 압축 |

### 6.2 로그 확인 명령어

```bash
# 실시간 로그 확인
docker logs -f compass-mcp-server

# 최근 100줄 로그
docker logs --tail 100 compass-mcp-server

# 특정 시간 이후 로그
docker logs --since "2025-11-22T00:00:00" compass-mcp-server

# 에러 로그만 필터링 (grep 사용)
docker logs compass-mcp-server 2>&1 | grep -i error
```

### 6.3 컨테이너 상태 모니터링

```bash
# 컨테이너 상태 확인
docker ps -a --filter name=compass-mcp-server

# 리소스 사용량 확인
docker stats compass-mcp-server

# 상세 정보 확인
docker inspect compass-mcp-server
```

### 6.4 알림 설정 권장사항

다음 조건에서 알림을 설정하는 것을 권장합니다:

| 조건 | 심각도 | 권장 알림 채널 |
|------|--------|----------------|
| 컨테이너 다운 | Critical | Slack, Email |
| 헬스체크 실패 | High | Slack |
| 메모리 사용량 > 80% | Warning | Slack |
| 응답 시간 > 5초 | Warning | Slack |
| 에러 비율 > 5% | High | Slack, Email |

---

## 7. 롤백 절차

### 7.1 빠른 롤백

```bash
# 1. 이전 이미지로 롤백
docker compose -f docker-compose.yml -f docker-compose.prod.yml down
docker tag compass-mcp-server:previous compass-mcp-server:latest
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# 2. 롤백 후 헬스 체크
curl -i http://localhost:3001/health
```

### 7.2 버전 태그를 사용한 롤백

```bash
# 특정 버전으로 롤백
docker compose -f docker-compose.yml -f docker-compose.prod.yml down
docker pull ghcr.io/idea-on-action/compass-mcp-server:v0.9.0
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## 8. 문제 해결

### 8.1 일반적인 문제

#### 컨테이너가 시작되지 않음

```bash
# 로그 확인
docker logs compass-mcp-server

# 환경 변수 확인
docker exec compass-mcp-server env | grep -E "SUPABASE|PORT|NODE_ENV"
```

**일반적인 원인:**
- 환경 변수 누락
- Supabase 연결 실패
- 포트 충돌

#### 헬스체크 실패

```bash
# 수동 헬스체크
docker exec compass-mcp-server node -e "const http = require('http'); http.get('http://localhost:3001/health', (res) => console.log(res.statusCode))"

# 네트워크 문제 확인
docker exec compass-mcp-server ping -c 3 google.com
```

#### CORS 오류

**증상:** 브라우저 콘솔에 CORS 오류 표시

**해결 방법:**
1. `CORS_ORIGINS` 환경 변수 확인
2. 요청 Origin이 허용 목록에 있는지 확인
3. 프로토콜 (http/https) 일치 확인

```bash
# CORS 설정 확인
docker exec compass-mcp-server printenv CORS_ORIGINS
```

### 8.2 성능 문제

#### 메모리 부족

```bash
# 메모리 사용량 확인
docker stats --no-stream compass-mcp-server

# 리소스 제한 조정 (docker-compose.prod.yml)
# memory: 512M -> 1G
```

#### 응답 지연

```bash
# 응답 시간 측정
time curl -s http://localhost:3001/health > /dev/null

# Supabase 연결 지연 확인
docker exec compass-mcp-server node -e "
const { createClient } = require('@supabase/supabase-js');
const start = Date.now();
// 연결 테스트 코드
console.log('Response time:', Date.now() - start, 'ms');
"
```

### 8.3 보안 문제

#### JWT 토큰 검증 실패

**확인사항:**
- `SUPABASE_JWT_SECRET` 값이 올바른지 확인
- 토큰 만료 여부 확인
- 토큰 발급자 확인

```bash
# JWT 디코드 (검증 없이)
echo "YOUR_TOKEN" | cut -d. -f2 | base64 -d 2>/dev/null | jq
```

---

## 배포 체크리스트 요약

### 배포 전

- [ ] 모든 필수 환경 변수 설정 완료
- [ ] Docker 환경 준비 완료
- [ ] Supabase 연결 테스트 통과
- [ ] 로컬 테스트 통과

### 빌드

- [ ] `npm run typecheck` 통과
- [ ] `npm test` 통과
- [ ] `npm run build` 성공
- [ ] Docker 이미지 빌드 성공

### 배포

- [ ] `docker compose up -d` 실행
- [ ] 컨테이너 상태 `running` 확인
- [ ] 헬스체크 상태 `healthy` 확인

### 배포 후

- [ ] `/health` 엔드포인트 200 응답
- [ ] `/info` 엔드포인트 정상 응답
- [ ] MCP 프로토콜 테스트 통과
- [ ] CORS 정상 작동 확인
- [ ] 로그 모니터링 설정 완료

---

## 관련 문서

- [MCP 서버 README](../../mcp-server/README.md)
- [MCP 서버 스펙](../specs/mcp-server-spec.md)
- [Supabase 데이터베이스 가이드](./database/)
- [보안 가이드](./security/)

---

## 지원

문제가 발생하면 다음 채널로 문의하세요:

- **이메일**: sinclairseo@gmail.com
- **GitHub Issues**: https://github.com/IDEA-on-Action/idea-on-action/issues
