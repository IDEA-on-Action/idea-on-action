---
description: Tier 2 (Standard) 수준의 기능을 효율적으로 구현하기 위한 배치 워크플로우
---

# Tier 2 Feature Implementation Workflow

> **목표**: 중간 규모의 기능(UI 컴포넌트, 로직 개선)을 최소한의 상호작용으로 구현합니다.
> **전략**: Plan(간소화) + Implement + Verify를 한 번의 호흡으로 처리합니다.

## 1. Preparation (Batch Planning)
- [ ] 사용자의 요구사항을 분석하여 `plan/[feature-name].md`를 생성하거나, 메모리에 계획을 수립합니다.
- [ ] 필요한 컴포넌트, 훅, 페이지 구조를 파악합니다.
- [ ] 기존 디자인 시스템(`src/components/ui`)과 유틸리티(`src/lib`) 재사용 가능성을 확인합니다.

## 2. Implementation (Batch Coding)
- [ ] **Component**: UI 컴포넌트를 구현합니다. (Tailwind CSS, Radix UI 활용)
- [ ] **Logic**: 필요한 Hook이나 유틸리티 함수를 구현합니다.
- [ ] **Integration**: 페이지나 부모 컴포넌트에 통합합니다.
- [ ] **Export**: Barrel file(`index.ts`)을 업데이트합니다.

## 3. Verification (Self-Correction)
- [ ] `npm run build`로 타입 에러와 빌드 오류를 확인합니다.
- [ ] 린트 에러가 있다면 즉시 수정합니다.
- [ ] 구현된 코드가 `constitution.md`의 원칙(접근성, 반응형 등)을 준수하는지 자가 점검합니다.

## 4. Finalization
- [ ] 변경 사항을 요약하여 사용자에게 보고합니다.
- [ ] `project-todo.md`를 업데이트합니다.

---
**Tip**: 이 워크플로우는 "한 번에" 실행하는 것을 목표로 합니다. 중간에 멈추지 말고 빌드 검증까지 진행하세요.
