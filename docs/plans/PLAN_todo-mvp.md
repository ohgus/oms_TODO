# Implementation Plan: TODO 앱 MVP

**Status**: 🔄 In Progress
**Started**: 2026-02-05
**Last Updated**: 2026-02-05 (Phase 2 Completed)
**Estimated Completion**: -

---

**⚠️ CRITICAL INSTRUCTIONS**: 각 페이즈 완료 후:

1. ✅ 완료된 태스크 체크박스 체크
2. 🧪 모든 Quality Gate 검증 명령어 실행
3. ⚠️ 모든 Quality Gate 항목 통과 확인
4. 🔍 **`/frontend-code-review` 스킬 실행** (Phase 3, 4, 5)
5. 📅 위의 "Last Updated" 날짜 업데이트
6. 📝 Notes 섹션에 학습 내용 기록
7. ➡️ 그 후에만 다음 페이즈로 진행

⛔ **Quality Gate를 건너뛰거나 실패한 상태에서 진행하지 마세요**

---

## 🔧 MCP Tools 활용

### Supabase MCP

Supabase MCP를 통해 데이터베이스 작업을 자동화합니다.

**활용 시점**:
- Phase 2: 테이블 스키마 생성, RLS 정책 설정
- Phase 4: 실시간 구독 설정, 데이터 시드

**주요 MCP 명령어**:
```
# 테이블 생성
mcp_supabase: create_table todos (...)
mcp_supabase: create_table categories (...)

# RLS 정책 설정
mcp_supabase: enable_rls todos
mcp_supabase: create_policy ...

# 데이터 조회/삽입
mcp_supabase: select * from todos
mcp_supabase: insert into todos (...)
```

### shadcn MCP

shadcn/ui 컴포넌트 설치 및 관리를 자동화합니다.

**활용 시점**:
- Phase 1: 초기 설정
- Phase 3: 컴포넌트 추가

**주요 MCP 명령어**:
```
# 컴포넌트 설치
mcp_shadcn: add button input checkbox card badge
mcp_shadcn: add dialog dropdown-menu toast

# 테마 설정
mcp_shadcn: init --style default
```

### Playwright MCP

E2E 테스트 자동화 및 브라우저 상호작용을 지원합니다.

**활용 시점**:
- Phase 5: E2E 테스트 작성 및 실행
- 디버깅: 시각적 테스트 검증

**주요 MCP 명령어**:
```
# 브라우저 제어
mcp_playwright: navigate "http://localhost:5173"
mcp_playwright: click "[data-testid='add-todo-button']"
mcp_playwright: fill "[data-testid='todo-input']" "새로운 할 일"

# 스크린샷 캡처
mcp_playwright: screenshot "todo-list.png"

# 요소 검증
mcp_playwright: expect "[data-testid='todo-item']" to_be_visible
mcp_playwright: expect "[data-testid='todo-list']" to_have_count 3
```

**E2E 테스트 시나리오 자동화**:
- Todo CRUD 플로우 녹화
- 필터링 동작 검증
- 반응형 뷰포트 테스트
- 접근성 검증

### Storybook MCP

컴포넌트 문서화 및 시각적 테스트를 자동화합니다.

**활용 시점**:
- Phase 3: 컴포넌트 스토리 생성
- Phase 5: 시각적 회귀 테스트

**주요 MCP 명령어**:
```
# 스토리 생성
mcp_storybook: generate_story "TodoItem" --variants "default,completed,withCategory"
mcp_storybook: generate_story "TodoList" --variants "empty,loading,withItems"

# 스토리북 실행
mcp_storybook: start
mcp_storybook: build

# 시각적 테스트
mcp_storybook: visual_test --component "TodoItem"
mcp_storybook: visual_test --all
```

**컴포넌트 문서화 자동화**:
- Props 테이블 자동 생성
- 인터랙션 테스트 추가
- 접근성(a11y) 애드온 검증

---

## 🔍 Code Review 워크플로우

### `/frontend-code-review` 스킬 자동 실행

**각 Phase 완료 시 코드 리뷰 실행**:

| Phase | 리뷰 대상 | 주요 체크 포인트 |
|-------|----------|-----------------|
| Phase 3 | UI 컴포넌트 | 가독성, 조건부 렌더링, Props 설계 |
| Phase 4 | Hooks, Pages | 상태 관리 범위, 결합도, 응집도 |
| Phase 5 | 전체 코드 | 최종 품질 검증 |

**리뷰 4축 기준**:
1. **가독성(Readability)**: 매직 넘버, 조건부 렌더링, 삼항 연산자
2. **예측 가능성(Predictability)**: 반환 타입, 숨겨진 부작용, 네이밍
3. **응집도(Cohesion)**: 폼 응집도, 기능별 코드 조직
4. **결합도(Coupling)**: Props 드릴링, 상태 관리 범위, 성급한 추상화

**리뷰 실행 방법**:
```
/frontend-code-review src/presentation/components/
/frontend-code-review src/presentation/hooks/
/frontend-code-review src/presentation/pages/
```

**리뷰 결과 반영**:
- [ ] 리뷰에서 발견된 이슈 수정
- [ ] 개선안 적용 후 재리뷰
- [ ] Notes 섹션에 학습 내용 기록

---

## 📋 Overview

### Feature Description

CRUD 기능, 상태별 필터링, 카테고리/태그 분류를 지원하는 TODO 앱 MVP.
클린 아키텍처를 적용하여 비즈니스 로직과 UI를 분리하고, TDD 방식으로 개발합니다.

### Success Criteria

- [ ] Todo 항목 추가/조회/수정/삭제(CRUD) 기능 동작
- [ ] 완료/미완료 상태 토글 기능 동작
- [ ] 전체/완료/미완료 필터링 기능 동작
- [ ] 카테고리별 분류 및 필터링 기능 동작
- [ ] Supabase와 실시간 데이터 동기화
- [ ] Unit 테스트 커버리지 ≥80%
- [ ] E2E 테스트로 주요 사용자 시나리오 검증
- [ ] Storybook으로 UI 컴포넌트 문서화

### User Impact

- 직관적인 UI로 할 일을 쉽게 관리
- 카테고리별 분류로 업무 정리 효율 향상
- 멀티 디바이스에서 실시간 동기화

---

## 🏗️ Architecture Decisions

| 결정 사항 | 이유 | 트레이드오프 |
|-----------|------|-------------|
| 클린 아키텍처 적용 | 비즈니스 로직과 UI 분리, 테스트 용이성 향상, 유지보수성 증가 | 초기 설정 복잡도 증가, 보일러플레이트 코드 |
| Vite + React | 빠른 HMR, 가벼운 설정, TypeScript 기본 지원 | SSR 미지원 (필요시 별도 설정) |
| Supabase | 실시간 동기화, PostgreSQL 기반, 관리형 인증 | 외부 서비스 의존성 |
| shadcn/ui | 커스터마이징 용이, Radix UI 기반 접근성, 복사-붙여넣기 방식 | 일부 컴포넌트 직접 유지보수 필요 |
| Zustand + TanStack Query | 가벼운 상태 관리 + 서버 상태 캐싱 분리 | 학습 곡선 |
| TDD (Test-First) | 높은 코드 품질, 리팩터링 안전성 | 초기 개발 속도 저하 |
| **Mobile-First Design** | 모바일 사용자 경험 우선, 점진적 향상 전략 | 데스크톱 레이아웃 별도 고려 필요 |

---

## 📱 Mobile-First Design Guidelines

### 기본 원칙

**모바일 뷰를 기준으로 UI를 설계하고, 데스크톱은 점진적으로 향상합니다.**

| 항목 | 모바일 기준 | 데스크톱 확장 |
|------|------------|--------------|
| 기준 뷰포트 | **375px** (iPhone SE) | 768px+ (tablet), 1024px+ (desktop) |
| 레이아웃 | 단일 컬럼 | 멀티 컬럼 (사이드바 등) |
| 터치 타겟 | 최소 **44x44px** | 마우스 hover 상태 추가 |
| 폰트 크기 | 기본 16px, 최소 14px | 동일 또는 약간 증가 |
| 여백/간격 | 컴팩트 (16px 기준) | 여유롭게 (24px+) |

### Tailwind 반응형 전략

```css
/* Mobile-First: 기본 스타일은 모바일용 */
.container {
  @apply px-4 py-3;           /* 모바일 기본 */
  @apply md:px-6 md:py-4;     /* 태블릿 */
  @apply lg:px-8 lg:py-6;     /* 데스크톱 */
}

/* 컴포넌트 예시 */
.todo-item {
  @apply flex flex-col gap-2;           /* 모바일: 세로 배치 */
  @apply sm:flex-row sm:items-center;   /* 태블릿+: 가로 배치 */
}
```

### 모바일 UI 컴포넌트 가이드

**터치 친화적 인터랙션**:
- 버튼/체크박스: 최소 44x44px 터치 영역
- 스와이프 제스처: Todo 삭제/완료 (선택적)
- 풀 다운 리프레시: 목록 새로고침 (선택적)

**레이아웃 구성**:
```
┌─────────────────────────┐
│  📋 TODO App      [⚙️]  │  ← 헤더 (고정)
├─────────────────────────┤
│  [전체] [완료] [미완료]  │  ← 상태 필터 (가로 스크롤)
├─────────────────────────┤
│  🏷️ 카테고리 필터       │  ← 카테고리 칩 (가로 스크롤)
├─────────────────────────┤
│                         │
│  ☐ Todo Item 1          │
│  ☑ Todo Item 2          │  ← Todo 목록 (세로 스크롤)
│  ☐ Todo Item 3          │
│                         │
├─────────────────────────┤
│  [+ 새 할 일 추가]      │  ← FAB 또는 하단 입력창
└─────────────────────────┘
```

### Storybook 뷰포트 설정

```typescript
// .storybook/preview.ts
export const parameters = {
  viewport: {
    viewports: {
      mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
      mobileLarge: { name: 'Mobile Large', styles: { width: '414px', height: '896px' } },
      tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
      desktop: { name: 'Desktop', styles: { width: '1280px', height: '800px' } },
    },
    defaultViewport: 'mobile',  // 기본값을 모바일로 설정
  },
};
```

### Playwright E2E 모바일 테스트

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'Mobile Chrome',
      use: { ...devices['iPhone 12'] },  // 기본 테스트 디바이스
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'], browserName: 'webkit' },
    },
    {
      name: 'Desktop Chrome',
      use: { viewport: { width: 1280, height: 720 } },
    },
  ],
});
```

### 클린 아키텍처 디렉터리 구조

```
src/
├── domain/                 # 비즈니스 로직 (프레임워크 독립적)
│   ├── entities/           # 핵심 엔티티 정의
│   │   ├── Todo.ts
│   │   └── Category.ts
│   ├── usecases/           # 유스케이스 (비즈니스 규칙)
│   │   ├── CreateTodo.ts
│   │   ├── UpdateTodo.ts
│   │   ├── DeleteTodo.ts
│   │   ├── GetTodos.ts
│   │   └── FilterTodos.ts
│   └── repositories/       # Repository 인터페이스 (추상화)
│       ├── ITodoRepository.ts
│       └── ICategoryRepository.ts
│
├── data/                   # 데이터 레이어 (Repository 구현)
│   ├── repositories/       # Repository 구현체
│   │   ├── SupabaseTodoRepository.ts
│   │   └── SupabaseCategoryRepository.ts
│   └── mappers/            # DTO <-> Entity 변환
│       └── TodoMapper.ts
│
├── presentation/           # UI 레이어
│   ├── components/         # UI 컴포넌트
│   │   ├── ui/             # shadcn/ui 기본 컴포넌트
│   │   ├── todo/           # Todo 관련 컴포넌트
│   │   │   ├── TodoItem.tsx
│   │   │   ├── TodoList.tsx
│   │   │   └── TodoForm.tsx
│   │   └── category/       # Category 관련 컴포넌트
│   │       └── CategoryFilter.tsx
│   ├── pages/              # 페이지 컴포넌트
│   │   └── HomePage.tsx
│   ├── hooks/              # 커스텀 훅
│   │   ├── useTodos.ts
│   │   └── useCategories.ts
│   └── stores/             # Zustand 스토어
│       └── todoStore.ts
│
├── infrastructure/         # 외부 서비스 연결
│   └── supabase/
│       └── client.ts
│
└── shared/                 # 공통 유틸리티
    ├── types/
    └── utils/
```

---

## 📦 Dependencies

### Required Before Starting

- [ ] Node.js 18+ 설치
- [ ] Supabase 프로젝트 생성 및 API 키 확보
- [ ] shadcn MCP 서버 설정 (선택적)

### External Dependencies

**Core**:
- vite: ^5.x
- react: ^18.x
- react-dom: ^18.x
- typescript: ^5.x

**UI**:
- tailwindcss: ^3.x
- @radix-ui/react-* (shadcn/ui 의존성)
- lucide-react: ^0.x

**State & Data**:
- @supabase/supabase-js: ^2.x
- @tanstack/react-query: ^5.x
- zustand: ^4.x

**Testing**:
- vitest: ^1.x
- @testing-library/react: ^14.x
- @playwright/test: ^1.x

**Documentation**:
- storybook: ^8.x

---

## 🧪 Test Strategy

### Testing Approach

**TDD Principle**: 테스트를 먼저 작성하고, 테스트를 통과하는 최소한의 코드를 구현합니다.

### Test Pyramid for This Feature

| 테스트 유형 | 커버리지 목표 | 목적 |
|------------|--------------|------|
| **Unit Tests** | ≥80% | Entity, Use Case, Repository 로직 |
| **Integration Tests** | Critical paths | 컴포넌트 간 상호작용, 데이터 흐름 |
| **E2E Tests** | Key user flows | 전체 사용자 시나리오 검증 |
| **Visual Tests** | UI 컴포넌트 | Storybook을 통한 UI 검증 |

### Test File Organization

```
tests/
├── unit/
│   ├── domain/
│   │   ├── entities/
│   │   │   └── Todo.test.ts
│   │   └── usecases/
│   │       ├── CreateTodo.test.ts
│   │       └── FilterTodos.test.ts
│   └── data/
│       └── repositories/
│           └── TodoRepository.test.ts
├── integration/
│   └── todo/
│       └── TodoFlow.test.tsx
└── e2e/
    └── todo.spec.ts
```

### Coverage Requirements by Phase

- **Phase 1**: 설정 검증만 (빌드/린트 통과)
- **Phase 2**: Domain 레이어 ≥80%
- **Phase 3**: Presentation 컴포넌트 ≥70%
- **Phase 4**: Integration 테스트 critical paths
- **Phase 5**: E2E 테스트 주요 사용자 흐름

---

## 🚀 Implementation Phases

### Phase 1: 프로젝트 기반 설정 (Foundation)

**Goal**: 클린 아키텍처 폴더 구조 + 개발 환경 완전 설정
**Status**: ✅ Completed

#### Tasks

**🔴 RED: 설정 검증 테스트 작성**

- [ ] **Test 1.1**: Vitest 설정 검증 테스트 작성
  - File: `tests/setup.test.ts`
  - Expected: 테스트 러너가 정상 동작하는지 확인
  - Details: 간단한 expect(true).toBe(true) 테스트

**🟢 GREEN: 프로젝트 초기화 및 설정**

- [ ] **Task 1.2**: Vite + React + TypeScript 프로젝트 초기화
  - Command: `pnpm create vite@latest . -- --template react-ts`
  - Details: 기본 Vite 템플릿 생성

- [ ] **Task 1.3**: 클린 아키텍처 디렉터리 구조 생성
  - Files: `src/domain/`, `src/data/`, `src/presentation/`, `src/infrastructure/`, `src/shared/`
  - Details: 위 아키텍처 다이어그램 참조

- [ ] **Task 1.4**: TailwindCSS 설정
  - Files: `tailwind.config.js`, `postcss.config.js`, `src/index.css`
  - Command: `pnpm add -D tailwindcss postcss autoprefixer && pnpm exec tailwindcss init -p`

- [ ] **Task 1.5**: shadcn/ui 초기화
  - Command: `pnpm dlx shadcn-ui@latest init`
  - Files: `components.json`, `src/presentation/components/ui/`
  - Details: 기본 테마 및 컴포넌트 경로 설정

- [ ] **Task 1.6**: ESLint + Prettier 설정
  - Files: `.eslintrc.cjs`, `.prettierrc`, `package.json` scripts
  - Details: TypeScript, React, Import 정렬 규칙 적용

- [ ] **Task 1.7**: Vitest 설정
  - Files: `vitest.config.ts`, `tests/setup.ts`
  - Command: `pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom`

- [ ] **Task 1.8**: Storybook 설정 (모바일 뷰포트 기본)
  - Command: `pnpm dlx storybook@latest init`
  - Files: `.storybook/main.ts`, `.storybook/preview.ts`
  - Details:
    - 기본 뷰포트를 **375px (모바일)**로 설정
    - 뷰포트 프리셋: Mobile(375), Mobile Large(414), Tablet(768), Desktop(1280)
    - 모든 스토리가 모바일 뷰에서 먼저 렌더링되도록 구성

- [ ] **Task 1.9**: Playwright 설정 (모바일 우선 테스트)
  - Command: `pnpm create playwright`
  - Files: `playwright.config.ts`, `tests/e2e/`
  - Details:
    - 기본 프로젝트를 **Mobile Chrome (iPhone 12)**으로 설정
    - 테스트 디바이스: Mobile Chrome, Mobile Safari, Desktop Chrome
    - 모바일 테스트가 먼저 실행되도록 순서 구성

- [ ] **Task 1.10**: Supabase 클라이언트 설정
  - Files: `src/infrastructure/supabase/client.ts`, `.env.local`
  - Command: `pnpm add @supabase/supabase-js`
  - Details: 환경 변수로 API URL/Key 관리

- [ ] **Task 1.11**: Path alias 설정
  - Files: `tsconfig.json`, `vite.config.ts`
  - Details: `@domain/`, `@data/`, `@presentation/`, `@infrastructure/`, `@shared/` 별칭

**🔵 REFACTOR: 설정 정리**

- [ ] **Task 1.12**: 불필요한 보일러플레이트 제거
  - Files: `src/App.tsx`, `src/App.css` 등 기본 생성 파일 정리
  - Details: 클린 아키텍처에 맞게 재구성

#### Quality Gate ✋

**⚠️ STOP: Phase 2로 진행하기 전 모든 항목 통과 필수**

**Build & Configuration**:
- [ ] `pnpm run build` 성공
- [ ] `pnpm run dev` 로 개발 서버 정상 실행
- [ ] TypeScript 컴파일 에러 없음

**Testing Setup**:
- [ ] `pnpm run test` 실행 성공
- [ ] Storybook `pnpm run storybook` 실행 성공
- [ ] Playwright `pnpm exec playwright test --ui` 실행 성공

**Code Quality**:
- [ ] `pnpm run lint` 에러 없음
- [ ] `pnpm run format:check` 통과

**Infrastructure**:
- [ ] Supabase 연결 테스트 성공
- [ ] 환경 변수 정상 로드

**Validation Commands**:

```bash
# Build
pnpm run build

# Tests
pnpm run test

# Storybook
pnpm run storybook

# Playwright (UI mode)
pnpm exec playwright test --ui

# Lint & Format
pnpm run lint
pnpm run format:check

# Type Check
pnpm exec tsc --noEmit
```

---

### Phase 2: 도메인 및 데이터 레이어 (Domain & Data)

**Goal**: 핵심 비즈니스 로직 + Repository 패턴 구현 (프레임워크 독립적)
**Status**: ✅ Completed

#### Tasks

**🔴 RED: 도메인 테스트 작성**

- [x] **Test 2.1**: Todo Entity 테스트 작성
  - File: `tests/unit/domain/entities/Todo.test.ts`
  - Expected: 테스트 실패 (Entity 미존재)
  - Test Cases:
    - Todo 생성 시 필수 필드 검증
    - Todo 완료 상태 토글
    - Todo 업데이트 시 유효성 검증

- [x] **Test 2.2**: Category Entity 테스트 작성
  - File: `tests/unit/domain/entities/Category.test.ts`
  - Expected: 테스트 실패
  - Test Cases:
    - Category 생성 검증
    - Category 이름 중복 불가

- [x] **Test 2.3**: CreateTodo Use Case 테스트 작성
  - File: `tests/unit/domain/usecases/CreateTodo.test.ts`
  - Expected: 테스트 실패
  - Test Cases:
    - 유효한 데이터로 Todo 생성 성공
    - 제목 없이 생성 시 실패
    - Repository 호출 검증 (Mock)

- [x] **Test 2.4**: UpdateTodo Use Case 테스트 작성
  - File: `tests/unit/domain/usecases/UpdateTodo.test.ts`
  - Expected: 테스트 실패
  - Test Cases:
    - Todo 제목 수정
    - Todo 완료 상태 토글
    - 존재하지 않는 Todo 업데이트 시 에러

- [x] **Test 2.5**: DeleteTodo Use Case 테스트 작성
  - File: `tests/unit/domain/usecases/DeleteTodo.test.ts`
  - Expected: 테스트 실패
  - Test Cases:
    - Todo 삭제 성공
    - 존재하지 않는 Todo 삭제 시 에러

- [x] **Test 2.6**: GetTodos Use Case 테스트 작성
  - File: `tests/unit/domain/usecases/GetTodos.test.ts`
  - Expected: 테스트 실패
  - Test Cases:
    - 전체 Todo 목록 조회
    - 카테고리별 필터링
    - 완료 상태별 필터링

- [x] **Test 2.7**: Repository Mock 테스트 작성
  - File: `tests/unit/data/repositories/TodoRepository.test.ts`
  - Expected: 테스트 실패
  - Test Cases:
    - CRUD 메서드 호출 검증
    - Supabase 응답 매핑 검증

**🟢 GREEN: 도메인 구현**

- [x] **Task 2.8**: Todo Entity 구현
  - File: `src/domain/entities/Todo.ts`
  - Details:
    ```typescript
    interface Todo {
      id: string;
      title: string;
      description?: string;
      completed: boolean;
      categoryId?: string;
      createdAt: Date;
      updatedAt: Date;
    }
    ```

- [x] **Task 2.9**: Category Entity 구현
  - File: `src/domain/entities/Category.ts`
  - Details:
    ```typescript
    interface Category {
      id: string;
      name: string;
      color: string;
      createdAt: Date;
    }
    ```

- [x] **Task 2.10**: ITodoRepository 인터페이스 정의
  - File: `src/domain/repositories/ITodoRepository.ts`
  - Details: CRUD 메서드 시그니처 정의

- [x] **Task 2.11**: ICategoryRepository 인터페이스 정의
  - File: `src/domain/repositories/ICategoryRepository.ts`

- [x] **Task 2.12**: CreateTodo Use Case 구현
  - File: `src/domain/usecases/CreateTodo.ts`
  - Goal: Test 2.3 통과

- [x] **Task 2.13**: UpdateTodo Use Case 구현
  - File: `src/domain/usecases/UpdateTodo.ts`
  - Goal: Test 2.4 통과

- [x] **Task 2.14**: DeleteTodo Use Case 구현
  - File: `src/domain/usecases/DeleteTodo.ts`
  - Goal: Test 2.5 통과

- [x] **Task 2.15**: GetTodos Use Case 구현
  - File: `src/domain/usecases/GetTodos.ts`
  - Goal: Test 2.6 통과

- [x] **Task 2.16**: SupabaseTodoRepository 구현
  - File: `src/data/repositories/SupabaseTodoRepository.ts`
  - Goal: Test 2.7 통과
  - Details: Supabase 클라이언트를 사용한 실제 데이터 조작

- [x] **Task 2.17**: SupabaseCategoryRepository 구현
  - File: `src/data/repositories/SupabaseCategoryRepository.ts`

- [x] **Task 2.18**: Supabase MCP로 테이블 스키마 생성
  - Tool: `Supabase MCP`
  - Details:
    ```sql
    -- todos 테이블
    CREATE TABLE todos (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT FALSE,
      category_id UUID REFERENCES categories(id),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- categories 테이블
    CREATE TABLE categories (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL UNIQUE,
      color TEXT NOT NULL DEFAULT '#6366f1',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- RLS 정책 (public access for MVP)
    ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
    ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Allow all access to todos" ON todos FOR ALL USING (true);
    CREATE POLICY "Allow all access to categories" ON categories FOR ALL USING (true);
    ```

- [x] **Task 2.19**: Supabase MCP로 테이블 생성 및 검증
  - Tool: `Supabase MCP`
  - Details:
    - MCP를 통해 테이블 생성 실행
    - 생성된 테이블 구조 확인
    - 테스트 데이터 INSERT로 동작 검증

**🔵 REFACTOR: 도메인 코드 정리**

- [x] **Task 2.19**: 공통 타입 추출
  - File: `src/shared/types/index.ts`
  - Details: Result 타입, Error 타입 등 공통화

- [x] **Task 2.20**: 유틸리티 함수 추출
  - File: `src/shared/utils/index.ts`
  - Details: ID 생성, 날짜 포맷 등

#### Quality Gate ✋

**TDD Compliance**:
- [x] 모든 테스트가 먼저 작성됨 (RED phase)
- [x] 테스트 통과를 위한 최소 코드만 작성 (GREEN phase)
- [x] 리팩터링 후에도 테스트 통과 (REFACTOR phase)

**Coverage Check**:
- [x] Domain 레이어 커버리지 ≥80% (entities: 100%, usecases: 100%)

**Build & Tests**:
- [x] `pnpm run test` 모든 테스트 통과 (54 tests)
- [x] `pnpm run build` 성공

**Code Quality**:
- [x] `pnpm run lint` 에러 없음 (warnings only in coverage/)
- [x] 타입 체크 통과

**Validation Commands**:

```bash
# Unit Tests with Coverage
pnpm run test -- --coverage

# Type Check
pnpm exec tsc --noEmit

# Lint
pnpm run lint
```

**Manual Test Checklist**:
- [ ] Supabase 대시보드에서 테이블 생성 확인
- [ ] 테스트 데이터 INSERT/SELECT 동작 확인

---

### Phase 3: UI 컴포넌트 레이어 (Presentation)

**Goal**: 재사용 가능한 UI 컴포넌트 개발 + Storybook 문서화
**Status**: ⏳ Pending

#### Tasks

**🔴 RED: 컴포넌트 테스트 작성**

- [ ] **Test 3.1**: TodoItem 컴포넌트 테스트 작성
  - File: `tests/unit/presentation/components/TodoItem.test.tsx`
  - Expected: 테스트 실패
  - Test Cases:
    - Todo 정보 렌더링
    - 완료 체크박스 클릭 이벤트
    - 삭제 버튼 클릭 이벤트
    - 수정 모드 전환

- [ ] **Test 3.2**: TodoList 컴포넌트 테스트 작성
  - File: `tests/unit/presentation/components/TodoList.test.tsx`
  - Expected: 테스트 실패
  - Test Cases:
    - 빈 목록 메시지 표시
    - Todo 목록 렌더링
    - 로딩 상태 표시

- [ ] **Test 3.3**: TodoForm 컴포넌트 테스트 작성
  - File: `tests/unit/presentation/components/TodoForm.test.tsx`
  - Expected: 테스트 실패
  - Test Cases:
    - 폼 입력 및 제출
    - 유효성 검증 에러 표시
    - 카테고리 선택

- [ ] **Test 3.4**: CategoryFilter 컴포넌트 테스트 작성
  - File: `tests/unit/presentation/components/CategoryFilter.test.tsx`
  - Expected: 테스트 실패
  - Test Cases:
    - 카테고리 목록 렌더링
    - 필터 선택 이벤트

**🟢 GREEN: 컴포넌트 구현**

- [ ] **Task 3.5**: shadcn/ui 기본 컴포넌트 설치
  - Command: `pnpm dlx shadcn-ui@latest add button input checkbox card badge`
  - Files: `src/presentation/components/ui/`

- [ ] **Task 3.6**: TodoItem 컴포넌트 구현
  - File: `src/presentation/components/todo/TodoItem.tsx`
  - Goal: Test 3.1 통과
  - Details: Checkbox, 제목, 카테고리 배지, 삭제 버튼

- [ ] **Task 3.7**: TodoList 컴포넌트 구현
  - File: `src/presentation/components/todo/TodoList.tsx`
  - Goal: Test 3.2 통과
  - Details: TodoItem 목록 렌더링, 빈 상태 처리

- [ ] **Task 3.8**: TodoForm 컴포넌트 구현
  - File: `src/presentation/components/todo/TodoForm.tsx`
  - Goal: Test 3.3 통과
  - Details: 제목 입력, 카테고리 선택, 제출 버튼

- [ ] **Task 3.9**: CategoryFilter 컴포넌트 구현
  - File: `src/presentation/components/category/CategoryFilter.tsx`
  - Goal: Test 3.4 통과
  - Details: 전체/완료/미완료 + 카테고리별 필터 버튼

- [ ] **Task 3.10**: StatusFilter 컴포넌트 구현
  - File: `src/presentation/components/todo/StatusFilter.tsx`
  - Details: 전체/완료/미완료 필터 탭

**🔵 REFACTOR: Storybook 문서화 (Storybook MCP 활용)**

- [ ] **Task 3.11**: Storybook MCP로 TodoItem 스토리 생성
  - Tool: `Storybook MCP`
  - File: `src/presentation/components/todo/TodoItem.stories.tsx`
  - Variants: Default, Completed, WithCategory, LongTitle
  - Command: `mcp_storybook: generate_story "TodoItem" --variants "default,completed,withCategory,longTitle"`

- [ ] **Task 3.12**: Storybook MCP로 TodoList 스토리 생성
  - Tool: `Storybook MCP`
  - File: `src/presentation/components/todo/TodoList.stories.tsx`
  - Variants: Empty, WithItems, Loading
  - Command: `mcp_storybook: generate_story "TodoList" --variants "empty,withItems,loading"`

- [ ] **Task 3.13**: Storybook MCP로 TodoForm 스토리 생성
  - Tool: `Storybook MCP`
  - File: `src/presentation/components/todo/TodoForm.stories.tsx`
  - Variants: Default, WithCategories, ValidationError

- [ ] **Task 3.14**: Storybook MCP로 CategoryFilter 스토리 생성
  - Tool: `Storybook MCP`
  - File: `src/presentation/components/category/CategoryFilter.stories.tsx`
  - Variants: Default, WithSelected

- [ ] **Task 3.15**: 모바일 퍼스트 스타일 적용
  - Files: 모든 컴포넌트
  - Details:
    - 기본 스타일을 모바일(375px) 기준으로 작성
    - `sm:`, `md:`, `lg:` 접두사로 점진적 확장
    - 터치 타겟 최소 44x44px 보장
    - 모바일 레이아웃: 단일 컬럼, 컴팩트 여백

- [ ] **Task 3.16**: Storybook 모바일 뷰포트 기본 설정
  - File: `.storybook/preview.ts`
  - Details:
    - 기본 뷰포트를 375px (모바일)로 설정
    - Mobile, Tablet, Desktop 뷰포트 프리셋 추가

- [ ] **Task 3.17**: Storybook 시각적 테스트 실행
  - Tool: `Storybook MCP`
  - Command: `mcp_storybook: visual_test --all`
  - Details: 모든 컴포넌트 스냅샷 기준선 생성

#### Quality Gate ✋

**TDD Compliance**:
- [ ] 컴포넌트 테스트 먼저 작성
- [ ] 테스트 통과 후 Storybook 작성

**Coverage Check**:
- [ ] Presentation 레이어 커버리지 ≥70%

**Build & Tests**:
- [ ] `pnpm run test` 모든 테스트 통과
- [ ] `pnpm run build` 성공

**Storybook**:
- [ ] 모든 컴포넌트 스토리 작성 완료
- [ ] `pnpm run storybook` 정상 실행
- [ ] 모든 variants 시각적 검증

**Code Quality**:
- [ ] `pnpm run lint` 에러 없음
- [ ] 접근성(a11y) 기본 검증

**🔍 Code Review (REQUIRED)**:
- [ ] `/frontend-code-review src/presentation/components/` 실행
- [ ] 가독성 이슈 수정 (조건부 렌더링, 삼항 연산자 등)
- [ ] 결합도 이슈 수정 (Props 드릴링 등)
- [ ] 리뷰 결과 Notes 섹션에 기록

**Validation Commands**:

```bash
# Component Tests
pnpm run test -- --coverage

# Storybook
pnpm run storybook

# Build Storybook
pnpm run build-storybook

# Lint
pnpm run lint

# Code Review (Claude Code)
/frontend-code-review src/presentation/components/
```

**Manual Test Checklist**:
- [ ] 각 컴포넌트 Storybook에서 인터랙션 확인
- [ ] 반응형 레이아웃 확인 (mobile, tablet, desktop)
- [ ] 키보드 네비게이션 동작 확인

---

### Phase 4: 기능 통합 및 상태 관리 (Integration)

**Goal**: 전체 기능 연결 + 상태 관리 + 페이지 조합
**Status**: ⏳ Pending

#### Tasks

**🔴 RED: 통합 테스트 작성**

- [ ] **Test 4.1**: useTodos 훅 테스트 작성
  - File: `tests/unit/presentation/hooks/useTodos.test.ts`
  - Expected: 테스트 실패
  - Test Cases:
    - Todo 목록 조회
    - Todo 추가
    - Todo 업데이트
    - Todo 삭제
    - 필터링 적용

- [ ] **Test 4.2**: useCategories 훅 테스트 작성
  - File: `tests/unit/presentation/hooks/useCategories.test.ts`
  - Expected: 테스트 실패
  - Test Cases:
    - 카테고리 목록 조회
    - 카테고리 추가

- [ ] **Test 4.3**: HomePage 통합 테스트 작성
  - File: `tests/integration/todo/HomePage.test.tsx`
  - Expected: 테스트 실패
  - Test Cases:
    - 페이지 로드 시 Todo 목록 표시
    - 새 Todo 추가 플로우
    - Todo 완료 토글 플로우
    - 필터 변경 플로우

**🟢 GREEN: 상태 관리 및 페이지 구현**

- [ ] **Task 4.4**: TanStack Query 설정
  - File: `src/presentation/providers/QueryProvider.tsx`
  - Details: QueryClient 설정, DevTools 포함

- [ ] **Task 4.5**: Zustand 스토어 구현 (UI 상태용)
  - File: `src/presentation/stores/uiStore.ts`
  - Details: 필터 상태, 모달 상태 등 UI 전용 상태

- [ ] **Task 4.6**: useTodos 훅 구현
  - File: `src/presentation/hooks/useTodos.ts`
  - Goal: Test 4.1 통과
  - Details: TanStack Query + Use Case 연결

- [ ] **Task 4.7**: useCategories 훅 구현
  - File: `src/presentation/hooks/useCategories.ts`
  - Goal: Test 4.2 통과

- [ ] **Task 4.8**: Dependency Injection 컨테이너 설정
  - File: `src/infrastructure/di/container.ts`
  - Details: Repository 인스턴스 생성 및 주입

- [ ] **Task 4.9**: HomePage 구현
  - File: `src/presentation/pages/HomePage.tsx`
  - Goal: Test 4.3 통과
  - Details: TodoForm + StatusFilter + CategoryFilter + TodoList 조합

- [ ] **Task 4.10**: App 라우팅 설정
  - File: `src/App.tsx`
  - Details: React Router 또는 단일 페이지 구성

**🔵 REFACTOR: 최적화 및 UX 개선**

- [ ] **Task 4.11**: 로딩 상태 UX 개선
  - Details: Skeleton UI, 낙관적 업데이트

- [ ] **Task 4.12**: 에러 상태 처리
  - Details: Error Boundary, Toast 알림

- [ ] **Task 4.13**: 실시간 동기화 구현
  - File: `src/presentation/hooks/useTodosRealtime.ts`
  - Details: Supabase Realtime subscription

#### Quality Gate ✋

**TDD Compliance**:
- [ ] 훅 테스트 먼저 작성
- [ ] 통합 테스트로 플로우 검증

**Coverage Check**:
- [ ] 전체 커버리지 ≥75%

**Build & Tests**:
- [ ] `pnpm run test` 모든 테스트 통과
- [ ] `pnpm run build` 성공

**Code Quality**:
- [ ] `pnpm run lint` 에러 없음
- [ ] 타입 체크 통과

**Functional**:
- [ ] CRUD 전체 플로우 동작
- [ ] 필터링 동작
- [ ] 실시간 동기화 동작

**🔍 Code Review (REQUIRED)**:
- [ ] `/frontend-code-review src/presentation/hooks/` 실행
- [ ] `/frontend-code-review src/presentation/pages/` 실행
- [ ] 응집도 이슈 수정 (훅의 책임 분리)
- [ ] 예측 가능성 이슈 수정 (반환 타입 일관성)
- [ ] 상태 관리 범위 검증 (불필요한 리렌더링)
- [ ] 리뷰 결과 Notes 섹션에 기록

**Validation Commands**:

```bash
# All Tests
pnpm run test -- --coverage

# Build
pnpm run build

# Preview
pnpm run preview

# Type Check
pnpm exec tsc --noEmit

# Code Review (Claude Code)
/frontend-code-review src/presentation/hooks/
/frontend-code-review src/presentation/pages/
```

**Manual Test Checklist**:
- [ ] Todo 추가 → 목록에 즉시 반영
- [ ] Todo 완료 체크 → 상태 변경 반영
- [ ] Todo 삭제 → 목록에서 제거
- [ ] 필터 변경 → 목록 필터링
- [ ] 다른 탭/브라우저에서 변경 → 실시간 반영

---

### Phase 5: E2E 테스트 및 최종 검증 (Validation)

**Goal**: 사용자 시나리오 E2E 검증 + 배포 준비
**Status**: ⏳ Pending

#### Tasks

**🔴 RED: E2E 테스트 시나리오 작성 (Playwright MCP 활용)**

- [ ] **Test 5.1**: Playwright MCP로 Todo CRUD E2E 테스트 작성
  - Tool: `Playwright MCP`
  - File: `tests/e2e/todo-crud.spec.ts`
  - Expected: 테스트 실패 (시나리오 미완성)
  - Scenarios:
    - 새 Todo 추가
    - Todo 완료 표시
    - Todo 수정
    - Todo 삭제
  - MCP Commands:
    ```
    mcp_playwright: navigate "http://localhost:5173"
    mcp_playwright: fill "[data-testid='todo-input']" "새 할 일"
    mcp_playwright: click "[data-testid='add-button']"
    mcp_playwright: expect "[data-testid='todo-item']" to_be_visible
    ```

- [ ] **Test 5.2**: Playwright MCP로 필터링 E2E 테스트 작성
  - Tool: `Playwright MCP`
  - File: `tests/e2e/todo-filter.spec.ts`
  - Scenarios:
    - 완료된 항목만 보기
    - 미완료 항목만 보기
    - 카테고리별 필터
  - MCP Commands:
    ```
    mcp_playwright: click "[data-testid='filter-completed']"
    mcp_playwright: expect "[data-testid='todo-list']" to_have_count 2
    ```

- [ ] **Test 5.3**: Playwright MCP로 모바일 퍼스트 반응형 E2E 테스트 작성
  - Tool: `Playwright MCP`
  - File: `tests/e2e/responsive.spec.ts`
  - **모바일 우선 테스트 순서**:
    1. **Mobile (기준)**: 375x667 (iPhone SE) - 필수
    2. **Mobile Large**: 414x896 (iPhone 12 Pro) - 필수
    3. **Tablet**: 768x1024 (iPad) - 선택
    4. **Desktop**: 1280x720 - 선택
  - MCP Commands:
    ```
    # 모바일 (기준 뷰포트)
    mcp_playwright: set_viewport 375 667
    mcp_playwright: screenshot "mobile-375.png"
    mcp_playwright: expect "[data-testid='todo-list']" to_be_visible

    # 모바일 Large
    mcp_playwright: set_viewport 414 896
    mcp_playwright: screenshot "mobile-414.png"
    ```
  - 모바일 검증 항목:
    - [ ] 터치 타겟 크기 (44x44px 이상)
    - [ ] 단일 컬럼 레이아웃
    - [ ] 가로 스크롤 없음
    - [ ] 폰트 가독성 (최소 14px)

- [ ] **Test 5.4**: Playwright MCP로 접근성 E2E 테스트 작성
  - Tool: `Playwright MCP`
  - File: `tests/e2e/accessibility.spec.ts`
  - Scenarios:
    - 키보드 네비게이션
    - 스크린 리더 호환성 (aria 속성)
    - 색상 대비

**🟢 GREEN: E2E 테스트 통과 및 버그 수정**

- [ ] **Task 5.5**: E2E 테스트 환경 설정
  - File: `playwright.config.ts`
  - Details: 베이스 URL, 브라우저 설정, 스크린샷

- [ ] **Task 5.6**: Test 5.1 통과를 위한 버그 수정
  - Details: E2E 테스트 실행 중 발견된 이슈 수정

- [ ] **Task 5.7**: Test 5.2 통과를 위한 버그 수정

- [ ] **Task 5.8**: Test 5.3 통과를 위한 반응형 수정

- [ ] **Task 5.9**: Test 5.4 통과를 위한 접근성 수정

**🔵 REFACTOR: 최종 품질 개선**

- [ ] **Task 5.10**: 성능 최적화
  - Details: React.memo, useMemo, useCallback 적용
  - Lighthouse 성능 점수 확인

- [ ] **Task 5.11**: 번들 사이즈 최적화
  - Details: Tree shaking 확인, 코드 스플리팅

- [ ] **Task 5.12**: SEO 및 메타 태그 설정
  - File: `index.html`
  - Details: title, description, OG tags

- [ ] **Task 5.13**: 최종 코드 정리
  - Details: 미사용 코드 제거, console.log 제거

#### Quality Gate ✋

**E2E Tests**:
- [ ] `pnpm exec playwright test` 모든 테스트 통과
- [ ] 크로스 브라우저 테스트 통과 (Chrome, Firefox, Safari)

**Performance**:
- [ ] Lighthouse Performance ≥90
- [ ] Lighthouse Accessibility ≥90
- [ ] First Contentful Paint <1.5s

**Build & Deploy Ready**:
- [ ] `pnpm run build` 성공
- [ ] 빌드 결과물 크기 적정 (<500KB gzipped)
- [ ] 환경 변수 문서화

**Final Checklist**:
- [ ] 모든 Phase Quality Gate 통과 재확인
- [ ] README 작성
- [ ] 배포 가이드 작성

**🔍 Final Code Review (REQUIRED)**:
- [ ] `/frontend-code-review src/` 전체 코드 리뷰 실행
- [ ] 가독성 최종 점검
- [ ] 예측 가능성 최종 점검
- [ ] 응집도 최종 점검
- [ ] 결합도 최종 점검
- [ ] 모든 리뷰 이슈 해결 확인
- [ ] 리뷰 결과 및 개선 사항 Notes 섹션에 기록

**Validation Commands**:

```bash
# E2E Tests
pnpm exec playwright test

# E2E with UI (Playwright MCP)
mcp_playwright: test --ui

# Show Report
pnpm exec playwright show-report

# Lighthouse (requires build)
pnpm run build && pnpm run preview
# Then run Lighthouse in Chrome DevTools

# Bundle Analysis
pnpm run build -- --analyze

# Final Code Review (Claude Code)
/frontend-code-review src/presentation/
/frontend-code-review src/domain/
/frontend-code-review src/data/
```

**Manual Test Checklist**:
- [ ] 실제 Supabase 데이터로 전체 플로우 테스트
- [ ] 모바일 디바이스에서 테스트
- [ ] 느린 네트워크에서 테스트 (DevTools throttling)
- [ ] 오프라인 상태에서 에러 처리 확인

---

## ⚠️ Risk Assessment

| 리스크 | 확률 | 영향도 | 완화 전략 |
|--------|------|--------|-----------|
| Supabase 서비스 장애 | Low | High | 로컬 캐시 구현, 에러 핸들링 강화 |
| 실시간 동기화 충돌 | Medium | Medium | 낙관적 업데이트 + 서버 상태 우선 정책 |
| shadcn/ui 컴포넌트 제한 | Low | Low | 필요시 커스텀 컴포넌트 개발 |
| 테스트 환경 불안정 | Medium | Medium | 테스트 격리, Mock 서버 활용 |
| 번들 사이즈 증가 | Medium | Low | Tree shaking, 코드 스플리팅, 의존성 최적화 |

---

## 🔄 Rollback Strategy

### Phase 1 실패 시
- Vite 프로젝트 삭제 후 재생성
- Git: `git reset --hard HEAD`

### Phase 2 실패 시
- Domain/Data 디렉터리 삭제
- Supabase 테이블 DROP
- Git: Phase 1 완료 커밋으로 리셋

### Phase 3 실패 시
- Presentation 컴포넌트 삭제
- Git: Phase 2 완료 커밋으로 리셋

### Phase 4 실패 시
- 상태 관리 코드 제거
- Git: Phase 3 완료 커밋으로 리셋

### Phase 5 실패 시
- E2E 테스트 조정 또는 기능 수정
- Git: Phase 4 완료 커밋으로 리셋

---

## 📊 Progress Tracking

### Completion Status

- **Phase 1**: ✅ 100%
- **Phase 2**: ✅ 100%
- **Phase 3**: ⏳ 0%
- **Phase 4**: ⏳ 0%
- **Phase 5**: ⏳ 0%

**Overall Progress**: 40%

### Time Tracking

| Phase | Estimated | Actual | Variance |
|-------|-----------|--------|----------|
| Phase 1 | - | - | - |
| Phase 2 | - | - | - |
| Phase 3 | - | - | - |
| Phase 4 | - | - | - |
| Phase 5 | - | - | - |
| **Total** | - | - | - |

---

## 📝 Notes & Learnings

### Implementation Notes

- (구현 중 발견한 인사이트 기록)

### Blockers Encountered

- (발생한 블로커와 해결 방법 기록)

### Improvements for Future Plans

- (다음에 개선할 점 기록)

---

## 📚 References

### Documentation

- [Vite 공식 문서](https://vitejs.dev/)
- [React 공식 문서](https://react.dev/)
- [Supabase 공식 문서](https://supabase.com/docs)
- [shadcn/ui 공식 문서](https://ui.shadcn.com/)
- [TanStack Query 문서](https://tanstack.com/query/latest)
- [Zustand 문서](https://zustand-demo.pmnd.rs/)
- [Playwright 문서](https://playwright.dev/)
- [Storybook 문서](https://storybook.js.org/)

### Design References

- 클린 아키텍처 - Robert C. Martin
- Bulletproof React Architecture

---

## ✅ Final Checklist

**Before marking plan as COMPLETE**:

- [ ] 모든 Phase Quality Gate 통과
- [ ] 전체 통합 테스트 완료
- [ ] E2E 테스트 전체 통과
- [ ] 문서화 완료 (README, API)
- [ ] 성능 벤치마크 목표 달성
- [ ] 보안 검토 완료
- [ ] 접근성 요구사항 충족
- [ ] 배포 준비 완료

---

**Plan Status**: 🔄 Ready to Start
**Next Action**: Phase 1 시작 - 프로젝트 기반 설정
**Blocked By**: None
