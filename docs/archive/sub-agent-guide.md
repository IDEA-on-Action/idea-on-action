# Sub-Agent 사용 가이드

Sub-Agent를 반복해서 사용할 수 있는 완전한 가이드입니다.

## 개요

Sub-Agent는 컴포넌트 리팩토링, 테스트 작성, 문서 생성 작업을 자동화하는 도구입니다. 원하는 때 언제든지 사용할 수 있도록 설계되었습니다.

## 🚀 빠른 시작

### 1. Sub-Agent 실행

```bash
# Sub-Agent 메뉴 실행
npm run sub-agent

# 도움말 보기
npm run sub-agent:help
```

### 2. 메뉴 선택

```
🤖 Sub-Agent Runner
==================
1. 전체 컴포넌트 리팩토링
2. 특정 컴포넌트 리팩토링
3. 컴포넌트 상태 확인
4. 계획 파일 생성
5. 도움말
0. 종료
==================
```

## 📋 사용 방법

### 1. 전체 컴포넌트 리팩토링

모든 컴포넌트를 한 번에 처리합니다.

```bash
npm run sub-agent
# 메뉴에서 "1" 선택
```

**처리 과정:**
1. 사용 가능한 모든 컴포넌트 스캔
2. 각 컴포넌트별로 Sub-Agent 실행
3. 리팩토링, 테스트, 문서 생성
4. 작업 완료 요약 제공

### 2. 특정 컴포넌트 리팩토링

원하는 컴포넌트만 선택해서 처리합니다.

```bash
npm run sub-agent
# 메뉴에서 "2" 선택
# 컴포넌트 번호 입력
```

**사용 시나리오:**
- 새로운 컴포넌트 추가 후
- 특정 컴포넌트만 업데이트 필요할 때
- 점진적 리팩토링 진행 시

### 3. 컴포넌트 상태 확인

현재 컴포넌트들의 상태를 확인합니다.

```bash
npm run sub-agent
# 메뉴에서 "3" 선택
```

**확인 항목:**
- ✅ 컴포넌트 파일 존재 여부
- ✅ 테스트 파일 존재 여부
- ✅ 문서 파일 존재 여부

### 4. 계획 파일 생성

Sub-Agent 작업 계획을 자동으로 생성합니다.

```bash
npm run sub-agent
# 메뉴에서 "4" 선택
```

**생성되는 파일:**
- `sub-agent-component-refactor.plan.md`

## 🔧 고급 사용법

### 커스텀 컴포넌트 추가

새로운 컴포넌트를 Sub-Agent에 추가하려면:

1. **컴포넌트 파일 생성**
```bash
# src/components/NewComponent.tsx 생성
```

2. **스크립트 수정**
```javascript
// scripts/sub-agent-runner.js
const COMPONENT_TEMPLATES = {
  // 기존 컴포넌트들...
  'NewComponent': {
    description: '새로운 컴포넌트 설명',
    tasks: ['리팩토링', '테스트 작성', '문서 생성']
  }
};
```

3. **Sub-Agent 실행**
```bash
npm run sub-agent
```

### 배치 작업 설정

여러 컴포넌트를 그룹으로 처리하려면:

```javascript
// scripts/sub-agent-runner.js
const COMPONENT_GROUPS = {
  'ui-components': ['Button', 'Input', 'Card'],
  'layout-components': ['Header', 'Footer', 'Sidebar'],
  'feature-components': ['Hero', 'Features', 'Services']
};
```

## 📊 작업 결과 확인

### 생성되는 파일들

각 컴포넌트 처리 시 다음 파일들이 생성/업데이트됩니다:

```
src/components/
├── ComponentName.tsx          # 리팩토링된 컴포넌트
tests/unit/components/
├── ComponentName.test.tsx     # 테스트 파일
docs/components/
├── ComponentName.md           # 컴포넌트 문서
└── README.md                  # 문서 인덱스
```

### 작업 로그

```bash
📦 Hero 컴포넌트 처리 중...
  🔄 리팩토링 중...
  🔄 테스트 작성 중...
  🔄 문서 생성 중...

📦 Features 컴포넌트 처리 중...
  🔄 리팩토링 중...
  🔄 테스트 작성 중...
  🔄 문서 생성 중...

✅ 전체 리팩토링이 완료되었습니다!
```

## 🎯 사용 시나리오

### 시나리오 1: 신규 프로젝트 설정

```bash
# 1. 프로젝트 초기 설정
npm run sub-agent
# "1" 선택 - 전체 컴포넌트 리팩토링

# 2. 결과 확인
npm run sub-agent
# "3" 선택 - 컴포넌트 상태 확인
```

### 시나리오 2: 점진적 리팩토링

```bash
# 1. 특정 컴포넌트만 처리
npm run sub-agent
# "2" 선택 - 특정 컴포넌트 리팩토링
# "1" 선택 - Hero 컴포넌트

# 2. 다른 컴포넌트 처리
npm run sub-agent
# "2" 선택 - 특정 컴포넌트 리팩토링
# "2" 선택 - Features 컴포넌트
```

### 시나리오 3: 팀 협업

```bash
# 1. 계획 파일 생성
npm run sub-agent
# "4" 선택 - 계획 파일 생성

# 2. 계획 파일을 팀과 공유
git add sub-agent-component-refactor.plan.md
git commit -m "Add Sub-Agent refactoring plan"
git push
```

## 🔍 문제 해결

### 일반적인 문제들

#### 1. 컴포넌트를 찾을 수 없음

```bash
❌ 컴포넌트 디렉토리를 찾을 수 없습니다.
```

**해결 방법:**
```bash
# 프로젝트 루트에서 실행
cd /path/to/your/project
npm run sub-agent
```

#### 2. 권한 오류

```bash
❌ 파일을 생성할 수 없습니다.
```

**해결 방법:**
```bash
# 권한 확인 및 수정
chmod +x scripts/sub-agent-runner.js
```

#### 3. Node.js 버전 오류

```bash
❌ Node.js 버전이 지원되지 않습니다.
```

**해결 방법:**
```bash
# Node.js 16+ 버전 사용
node --version
nvm use 18  # nvm 사용 시
```

### 디버깅

```bash
# 상세 로그와 함께 실행
DEBUG=sub-agent npm run sub-agent

# 특정 컴포넌트만 디버깅
DEBUG=sub-agent:ComponentName npm run sub-agent
```

## 📈 성능 최적화

### 대용량 프로젝트 처리

```javascript
// scripts/sub-agent-runner.js
const CONFIG = {
  // 배치 크기 조정
  batchSize: 3,
  // 병렬 처리 수 제한
  maxConcurrency: 2,
  // 타임아웃 설정
  timeout: 30000
};
```

### 메모리 사용량 최적화

```bash
# Node.js 메모리 제한 증가
NODE_OPTIONS="--max-old-space-size=4096" npm run sub-agent
```

## 🔄 자동화 설정

### CI/CD 통합

```yaml
# .github/workflows/sub-agent.yml
name: Sub-Agent Refactoring
on:
  schedule:
    - cron: '0 2 * * 1'  # 매주 월요일 오전 2시
  workflow_dispatch:

jobs:
  sub-agent:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run sub-agent
      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add .
          git commit -m "Auto Sub-Agent refactoring" || exit 0
          git push
```

### Git Hook 설정

```bash
# .git/hooks/pre-commit
#!/bin/sh
echo "Running Sub-Agent check..."
npm run sub-agent -- --check-only
```

## 📚 추가 리소스

### 관련 문서
- [컴포넌트 문서](../components/README.md)
- [테스트 가이드](../../tests/README.md)
- [프로젝트 구조 가이드](../project-structure.md)

### 외부 도구
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest](https://jestjs.io/)
- [Playwright](https://playwright.dev/)
- [Axe-core](https://github.com/dequelabs/axe-core)

## 🤝 기여하기

### Sub-Agent 개선
1. 이슈 생성
2. 기능 제안
3. 풀 리퀘스트 생성

### 새로운 템플릿 추가
```javascript
// scripts/sub-agent-runner.js
const COMPONENT_TEMPLATES = {
  // 새로운 컴포넌트 템플릿 추가
  'YourComponent': {
    description: '컴포넌트 설명',
    tasks: ['리팩토링', '테스트 작성', '문서 생성'],
    customConfig: {
      // 커스텀 설정
    }
  }
};
```

---

**마지막 업데이트**: 2025년 1월
**Sub-Agent 버전**: v1.0.0
