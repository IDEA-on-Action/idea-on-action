# Repomix 사용 가이드

## 개요

Repomix는 프로젝트의 전체 소스코드를 단일 파일로 추출하는 도구입니다. AI 컨텍스트 제공, 프로젝트 문서화, 코드 리뷰 등 다양한 용도로 활용할 수 있습니다.

## 설치 및 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 설정 파일

`repomix.config.json` 파일이 프로젝트 루트에 생성되어 있으며, 다음과 같은 설정을 포함합니다:

- **출력 형식**: Markdown
- **출력 파일**: `repomix-output.md`
- **제외 항목**: node_modules, dist, test-results, playwright-report, .git 등
- **포함 항목**: src, docs, tests, 설정 파일들

## 사용법

### SOT 생성

```bash
npm run repomix:generate
```

이 명령어를 실행하면 `repomix-output.md` 파일이 생성됩니다.

### 생성된 파일 확인

```bash
# 파일 크기 확인
ls -lh repomix-output.md

# 파일 내용 미리보기
head -50 repomix-output.md
```

## 활용 예시

### 1. AI 컨텍스트 제공

생성된 `repomix-output.md` 파일을 AI 도구에 업로드하여:
- 프로젝트 전체 구조 파악
- 코드 분석 및 리팩토링 제안
- 버그 수정 및 기능 추가

### 2. 프로젝트 문서화

- 새로운 팀원 온보딩
- 프로젝트 구조 이해
- 코드 리뷰 준비

### 3. 백업 및 아카이브

- 프로젝트 스냅샷 생성
- 버전별 코드 비교
- 프로젝트 이력 관리

## 설정 커스터마이징

### 포함할 파일 추가

`repomix.config.json`의 `include.useFiles` 배열에 패턴을 추가:

```json
{
  "include": {
    "useFiles": [
      "src/**",
      "docs/**",
      "custom-folder/**"
    ]
  }
}
```

### 제외할 파일 추가

`repomix.config.json`의 `ignore.useFiles` 배열에 패턴을 추가:

```json
{
  "ignore": {
    "useFiles": [
      "node_modules/**",
      "dist/**",
      "custom-ignore/**"
    ]
  }
}
```

### 출력 형식 변경

```json
{
  "output": {
    "format": "xml"  // 또는 "json", "txt"
  }
}
```

## 주의사항

1. **파일 크기**: 대규모 프로젝트의 경우 생성된 파일이 매우 클 수 있습니다.
2. **민감한 정보**: API 키, 비밀번호 등 민감한 정보가 포함되지 않도록 주의하세요.
3. **Git 제외**: 생성된 파일은 `.gitignore`에 추가되어 Git에 커밋되지 않습니다.

## 문제 해결

### 일반적인 문제

1. **메모리 부족**: 대용량 프로젝트의 경우 Node.js 메모리 제한을 늘려보세요:
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" npm run repomix:generate
   ```

2. **파일 권한 오류**: 출력 디렉토리에 쓰기 권한이 있는지 확인하세요.

3. **설정 파일 오류**: `repomix.config.json`의 JSON 형식이 올바른지 확인하세요.

## 추가 리소스

- [Repomix 공식 문서](https://github.com/GitLiveApp/repomix)
- [프로젝트 구조 가이드](../project-structure.md)
- [배포 가이드](../devops/deployment-guide.md)
