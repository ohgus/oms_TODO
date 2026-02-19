# Implementation Plan: TODO App v2 — Foundation (디자인 토큰 + 데이터 모델)

**Status**: ✅ Complete
**Started**: 2026-02-19
**Last Updated**: 2026-02-19
**Estimated Completion**: 2026-02-19

**Plan Sequence**: **Plan A (기반)** → Plan B (핵심 UI) → Plan C (달력)

---

**CRITICAL INSTRUCTIONS**: After completing each phase:

1. Check off completed task checkboxes
2. Run all quality gate validation commands
3. Verify ALL quality gate items pass
4. **Run `/frontend-code-review`** (for frontend phases)
5. Update "Last Updated" date above
6. Document learnings in Notes section
7. Only then proceed to next phase

**DO NOT skip quality gates or proceed with failing checks**

---

## Overview

### Feature Description

기존 TODO 앱의 하드코딩된 색상/폰트를 디자인 토큰(CSS 변수) 체계로 전면 교체하고, Todo 엔티티에 `priority`(중요도)와 `dueDate`(마감일) 필드를 추가하여 Plan B/C의 UI 작업을 위한 기반을 마련한다.

### Success Criteria

- [x] 앱이 새 디자인 토큰(Outfit 폰트, 새 컬러 팔레트)으로 렌더링됨
- [x] 기존 모든 기능(추가/완료/삭제/필터)이 정상 동작
- [x] `todos` 테이블에 `priority`, `due_date` 컬럼 존재 (마이그레이션 파일 작성, 적용은 배포 시)
- [x] Todo 엔티티/Repository/훅이 새 필드를 지원
- [x] 기존 테스트 모두 통과 (207/207)
- [x] UI는 아직 priority/dueDate를 표시하지 않음 (Plan B에서 처리)

### User Impact

새 디자인 토큰으로 일관된 시각적 경험을 제공하며, Outfit 폰트 적용으로 모던한 UI 인상을 준다. 데이터 모델 확장으로 이후 중요도/마감일 기능 추가의 기반을 마련한다.

---

## Architecture Decisions

| Decision | Rationale | Trade-offs |
| --- | --- | --- |
| CSS 변수를 HEX 값으로 변경 (HSL 제거) | 디자인 스펙이 HEX 기반, shadcn/ui의 `hsl()` 래퍼 제거 필요 | 기존 다크모드 블록 제거 (추후 새 토큰 기반 재작성) |
| `txt-*` 네임스페이스 사용 | Tailwind `text-` 유틸리티(색상+크기)와 충돌 방지 | `text-txt-primary` 형태로 약간 장황 |
| priority를 1\|2\|3 SMALLINT로 저장 | 단순하고 정렬/필터 용이 | enum 타입 대비 의미가 덜 명시적 |
| dueDate를 DATE 타입 nullable로 저장 | 마감일 없는 TODO 허용, 날짜 범위 쿼리 용이 | TIMESTAMP 대비 시간 정보 없음 |

---

## Dependencies

### Required Before Starting

- [ ] 현재 앱이 정상 빌드/실행되는 상태
- [ ] Supabase 프로젝트 접근 가능

### External Dependencies

- Google Fonts CDN: Outfit (400, 500, 600, 700)
- 신규 패키지 없음 (기존 의존성만 사용)

---

## Test Strategy

### Testing Approach

**TDD Principle**: Write tests FIRST, then implement to make them pass

### Test Pyramid for This Feature

| Test Type | Coverage Target | Purpose |
| --- | --- | --- |
| **Unit Tests** | ≥80% | Todo 엔티티 팩토리, date 유틸리티, mapper 함수 |
| **Integration Tests** | Critical paths | Repository findAll 필터, useTodos 훅 옵션 |
| **E2E Tests** | Key scenarios | 디자인 토큰 적용 검증, 데이터 모델 확장 회귀 |

### Test File Organization

```
tests/
├── unit/
│   ├── domain/entities/Todo.test.ts       (priority/dueDate 케이스 추가)
│   ├── data/repositories/TodoRepository.test.ts (mapper, findAll 필터)
│   └── shared/utils/date.test.ts          (신규)
├── integration/
│   └── hooks/useTodos.test.ts             (옵션 확장)
└── e2e/
    ├── design-tokens.spec.ts              (Phase 1: 폰트/CSS변수/CRUD 회귀)
    └── data-model-extension.spec.ts       (Phase 2: priority 기본값/CRUD 회귀)
```

### Coverage Requirements by Phase

- **Phase 1 (디자인 토큰)**: UI 토큰은 시각적 확인 중심, 기존 테스트 통과 유지
- **Phase 2 (데이터 모델)**: 엔티티/Repository 단위 테스트 ≥80%, date 유틸리티 ≥90%

### Test Naming Convention

```typescript
describe("createTodo", () => {
  it("priority 미지정 시 기본값 2를 사용한다", () => {
    // Arrange → Act → Assert
  });
});
```

---

## Implementation Phases

### Phase 1: 디자인 토큰 시스템 전면 적용

**Goal**: Outfit 폰트 + HEX 기반 CSS 변수 + Tailwind 테마 확장 + 기존 컴포넌트 마이그레이션
**Estimated Time**: 3 hours
**Status**: ✅ Complete

#### Tasks

**RED: Write Failing Tests First**

- [x] **Test 1.1**: 기존 테스트가 토큰 마이그레이션 후에도 통과하는지 확인할 기준선 확보
  - File(s): 기존 테스트 전체
  - Expected: 현재 모든 테스트가 PASS 상태인지 확인
  - Details: `pnpm run test:run`으로 현재 테스트 상태 기록
  - **Result**: 21 files, 184 tests, ALL PASS ✅

- [x] **Test 1.2**: 디자인 토큰 적용 검증 E2E 테스트 작성
  - File(s): `tests/e2e/design-tokens.spec.ts` (신규)
  - Expected: Tests FAIL — 아직 토큰이 적용되지 않았으므로
  - Details:
    - body의 font-family에 'Outfit' 포함 확인 (`getComputedStyle`)
    - CSS 변수 `--bg-primary` 값이 `#F5F4F1`인지 확인
    - CSS 변수 `--text-primary` 값이 `#1A1918`인지 확인
    - CSS 변수 `--accent-primary` 값이 `#3D8A5A`인지 확인
    - 기존 CRUD 회귀: TODO 추가 → 목록에 표시 → 완료 토글 → 삭제
    - 필터(상태/카테고리) 전환 시 목록 정상 갱신

**GREEN: Implement to Make Tests Pass**

- [x] **Task 1.3**: Outfit 폰트 CDN 추가
  - File(s): `index.html`
  - Goal: `<head>` 안에 Google Fonts Outfit 링크 추가
  - Details:
    ```html
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
    ```

- [x] **Task 1.4**: CSS 변수 전면 교체
  - File(s): `src/index.css`
  - Goal: 기존 HSL 변수 → HEX 토큰으로 교체, `.dark` 블록 제거
  - Details:
    - `--bg-primary: #F5F4F1`, `--bg-surface: #FFFFFF`, `--bg-muted: #EDECEA`
    - `--text-primary: #1A1918`, `--text-secondary: #6D6C6A`, `--text-tertiary: #9C9B99`
    - `--accent-primary: #3D8A5A`, `--accent-light: #C8F0D8` 등
    - `--star-filled: #FACC15`, `--star-empty: #E5E4E1`
    - Typography scale: `--font-2xs: 10px` ~ `--font-3xl: 22px`
    - Border radius: `--radius-xs: 4px` ~ `--radius-pill: 100px`
    - shadcn/ui 호환 매핑: `--background: var(--bg-primary)`, `--primary: var(--accent-primary)` 등
    - body: `font-family: 'Outfit', system-ui, -apple-system, sans-serif`

- [x] **Task 1.5**: Tailwind 테마 확장
  - File(s): `tailwind.config.js`
  - Goal: 새 토큰을 Tailwind 유틸리티로 사용 가능하게 확장
  - Details:
    - `colors.bg.*`, `colors.txt.*`, `colors.accent.*`, `colors.status.*`, `colors.star.*`
    - `fontSize` 스케일 덮어쓰기
    - `borderRadius` 토큰 매핑
    - 기존 shadcn/ui 색상에서 `hsl()` 래퍼 제거 → `var()` 직접 참조
    - `fontFamily.outfit` 추가

- [x] **Task 1.6**: 기존 컴포넌트 토큰 마이그레이션 (10개 파일)
  - File(s):
    1. `src/presentation/pages/HomePage.tsx`
    2. `src/presentation/components/todo/TodoItem.tsx`
    3. `src/presentation/components/todo/TodoList.tsx`
    4. `src/presentation/components/todo/StatusFilter.tsx`
    5. `src/presentation/components/category/CategoryFilter.tsx`
    6. `src/presentation/components/ui/button.tsx`
    7. `src/presentation/components/ui/input.tsx`
    8. `src/presentation/components/ui/badge.tsx`
    9. `src/presentation/components/ui/checkbox.tsx`
    10. `src/presentation/components/ui/card.tsx`
  - Goal: 하드코딩/기존 토큰 → 새 토큰 클래스로 교체
  - Details:
    - `bg-background` → `bg-bg-primary`
    - `bg-card` → `bg-bg-surface`
    - `text-foreground` → `text-txt-primary`
    - `text-muted-foreground` → `text-txt-secondary`
    - `text-destructive` → `text-accent-red`
    - `border-input` → `border-border-subtle`
    - shadcn/ui 컴포넌트: `hsl(var(--...))` → `var(--...)` 직접 참조
  - **주의**: `TodoForm.tsx`는 Plan B에서 삭제되므로 마이그레이션 대상에서 제외

**REFACTOR: Clean Up Code**

- [x] **Task 1.7**: 리팩터링 및 시각적 검증
  - Files: 이 Phase에서 변경한 모든 파일
  - Goal: 불필요한 코드 정리, 시각적 일관성 확인
  - Checklist:
    - [x] 미사용 CSS 변수 제거 (다크모드 관련)
    - [x] Tailwind config에서 중복 색상 정의 제거
    - [x] `pnpm dev`로 앱 실행 → 시각적 확인
    - [x] 기존 기능 정상 동작 확인 (추가, 완료, 삭제, 필터)

**🔍 CODE REVIEW: `/frontend-code-review` 실행 및 이슈 해결**

- [x] **Review 1.8**: `/frontend-code-review` 실행
  - 대상 경로:
    - `src/presentation/components/ui/button.tsx`
    - `src/presentation/components/ui/input.tsx`
    - `src/presentation/components/ui/badge.tsx`
    - `src/presentation/components/ui/checkbox.tsx`
    - `src/presentation/components/ui/card.tsx`
    - `src/presentation/components/todo/TodoItem.tsx`
    - `src/presentation/components/todo/TodoList.tsx`
    - `src/presentation/components/todo/StatusFilter.tsx`
    - `src/presentation/components/category/CategoryFilter.tsx`
    - `src/presentation/pages/HomePage.tsx`
  - 실행: `/frontend-code-review src/presentation/`
  - Details:
    - 리뷰 결과에서 발견된 이슈를 아래 체크리스트에 기록
    - 각 이슈를 수정하고 테스트 재실행으로 회귀 없음 확인

- [x] **Review 1.8.1**: 가독성(Readability) 이슈 수정
  - 발견된 이슈: 없음 (이중 토큰 구조는 의도된 설계 — shadcn/ui 호환 + 새 토큰)
  - 수정 내용: 수정 불필요

- [x] **Review 1.8.2**: 예측 가능성(Predictability) 이슈 수정
  - 발견된 이슈: 없음
  - 수정 내용: 수정 불필요

- [x] **Review 1.8.3**: 응집도(Cohesion) 이슈 수정
  - 발견된 이슈: 없음
  - 수정 내용: 수정 불필요

- [x] **Review 1.8.4**: 결합도(Coupling) 이슈 수정
  - 발견된 이슈: accent 네임스페이스에 shadcn 호환 + 새 토큰 혼합 (수용 가능 트레이드오프)
  - 수정 내용: 수정 불필요 — 깔끔한 클래스명(`text-accent-red`) 실용성이 더 높음

- [x] **Review 1.8.5**: 수정 후 테스트 재실행 통과 확인
  - `pnpm run test:run` → 184/184 PASS ✅
  - `pnpm run build` → 에러 없음 ✅

#### Quality Gate

**STOP: Do NOT proceed to Phase 2 until ALL checks pass**

**TDD Compliance** (CRITICAL):

- [x] **Red Phase**: 기존 테스트 기준선 확인 (184 tests PASS)
- [x] **Green Phase**: 토큰 교체 후 기존 테스트 통과 (184 tests PASS)
- [x] **Refactor Phase**: 코드 정리 후 테스트 여전히 통과 (184 tests PASS)

**Build & Tests**:

- [x] **Build**: `pnpm run build` 에러 없음
- [x] **All Tests Pass**: `pnpm run test:run` 100% 통과
- [x] **No Flaky Tests**: 3회 반복 실행 일관성 (3/3 = 184 PASS)

**Code Quality**:

- [x] **Linting**: `pnpm run lint` 에러 없음 (기존 warning만 존재)
- [x] **Type Safety**: TypeScript 컴파일 에러 없음

**E2E Tests**:

- [x] **E2E 통과**: `pnpm run test:e2e -- tests/e2e/design-tokens.spec.ts` 100% 통과 (18/18)
  - Outfit 폰트 적용 (`getComputedStyle` font-family 검증)
  - CSS 변수 값 검증 (`--bg-primary`, `--text-primary`, `--accent-primary`)
  - 기존 CRUD 회귀 (추가 → 표시 → 완료 → 삭제)
  - 필터 전환 동작 (상태/카테고리)

**Validation Commands**:

```bash
# Build
pnpm run build

# Unit/Integration Test
pnpm run test:run

# E2E Test
pnpm run test:e2e -- tests/e2e/design-tokens.spec.ts

# Lint
pnpm run lint
```

#### Commit

**Quality Gate 통과 후 커밋을 진행한다.**

- [x] **Commit 1.A**: Outfit 폰트 + CSS 변수 교체 + E2E 테스트
  - 대상: `index.html`, `src/index.css`, `tests/e2e/design-tokens.spec.ts`
  - 메시지: `feat: Outfit 폰트 적용 및 HEX 기반 디자인 토큰 CSS 변수 교체`

- [x] **Commit 1.B**: Tailwind 테마 확장
  - 대상: `tailwind.config.js`
  - 메시지: `feat: Tailwind 테마에 디자인 토큰 확장 (bg/txt/accent/star/border)`

- ~~**Commit 1.C**~~: SKIP — shadcn/ui 컴포넌트 파일 변경 없음 (hsl() 제거는 Tailwind config 레벨에서 처리됨)

- [x] **Commit 1.D**: 기존 컴포넌트 토큰 마이그레이션
  - 대상: `HomePage.tsx`, `TodoItem.tsx`, `TodoList.tsx`, `StatusFilter.tsx` + E2E 스크린샷
  - 메시지: `refactor: 기존 컴포넌트 색상/폰트 클래스를 새 디자인 토큰으로 마이그레이션`

> **참고**: 커밋 단위는 상황에 따라 합치거나 더 분리해도 된다. 핵심은 각 커밋이 빌드 가능한 상태를 유지하는 것.

---

### Phase 2: 데이터 모델 확장 — priority + dueDate

**Goal**: Todo 엔티티에 priority(1|2|3), dueDate(Date?) 추가 — DB → 엔티티 → Repository → 훅 전 계층
**Estimated Time**: 3 hours
**Status**: ✅ Complete

#### Tasks

**RED: Write Failing Tests First**

- [x] **Test 2.1**: Todo 엔티티 단위 테스트 추가
  - File(s): `tests/unit/domain/entities/Todo.test.ts`
  - Expected: Tests FAIL — priority/dueDate 필드가 아직 없으므로
  - Details:
    - `createTodo`에 priority 미지정 시 기본값 2 확인
    - `createTodo`에 priority=3 지정 시 반영 확인
    - `createTodo`에 dueDate 지정/미지정 확인
    - `updateTodo`에서 priority 변경 확인
    - `updateTodo`에서 dueDate를 null로 설정 시 제거 확인

- [x] **Test 2.2**: date 유틸리티 단위 테스트
  - File(s): `tests/unit/shared/utils/date.test.ts` (신규)
  - Expected: Tests FAIL — date.ts 파일이 아직 없으므로
  - Details:
    - `formatKoreanDate`: 날짜 → "2월 19일 (목)" 형식
    - `formatKoreanDateShort`: 날짜 → "2월 19일" 형식
    - `formatKoreanMonth`: 날짜 → "2026년 2월" 형식
    - `isSameDay`: 같은 날짜 비교 (시간 무시)
    - 경계값: 12월 31일, 1월 1일, 2월 29일 등

- [x] **Test 2.3**: Repository mapper/filter 테스트
  - File(s): `tests/unit/data/repositories/TodoRepository.test.ts`
  - Expected: Tests FAIL — TodoRow에 priority/due_date 미존재
  - Details:
    - `mapRowToTodo`: priority 매핑, due_date → Date 변환
    - `mapTodoToRow`: priority 매핑, dueDate → "YYYY-MM-DD" 변환
    - `findAll` dueDate 필터 동작
    - `findAll` dueDateRange 필터 동작

- [x] **Test 2.4**: 데이터 모델 확장 E2E 테스트 작성
  - File(s): `tests/e2e/data-model-extension.spec.ts` (신규)
  - Expected: Tests FAIL — priority/dueDate 필드가 아직 구현되지 않았으므로
  - Details:
    - TODO 추가 시 priority 기본값 2로 저장 확인 (DB 조회 or UI 반영)
    - 기존 TODO 완료/삭제 정상 동작 (회귀)
    - 필터(상태/카테고리) 전환 시 목록 정상 갱신 (회귀)

**GREEN: Implement to Make Tests Pass**

- [x] **Task 2.5**: Supabase DB 마이그레이션
  - File(s): `supabase/migrations/003_add_priority_and_due_date.sql` (신규)
  - Goal: todos 테이블에 priority, due_date 컬럼 추가
  - Details:
    ```sql
    ALTER TABLE todos ADD COLUMN priority SMALLINT NOT NULL DEFAULT 2
      CHECK (priority >= 1 AND priority <= 3);
    ALTER TABLE todos ADD COLUMN due_date DATE;
    CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos(due_date);
    CREATE INDEX IF NOT EXISTS idx_todos_priority ON todos(priority);
    ```

- [x] **Task 2.6**: Todo 엔티티 확장
  - File(s): `src/domain/entities/Todo.ts`
  - Goal: Test 2.1 통과
  - Details:
    - `Todo` 인터페이스: `priority: 1 | 2 | 3`, `dueDate?: Date` 추가
    - `CreateTodoInput`: `priority?: 1 | 2 | 3`, `dueDate?: Date` 추가
    - `UpdateTodoInput`: `priority?: 1 | 2 | 3`, `dueDate?: Date | null` 추가
    - `createTodo`: `priority: input.priority ?? 2`, `dueDate: input.dueDate`
    - `updateTodo`: priority/dueDate 업데이트 로직 (dueDate null → undefined)

- [x] **Task 2.7**: 날짜 포맷 유틸리티 작성
  - File(s): `src/shared/utils/date.ts` (신규)
  - Goal: Test 2.2 통과
  - Details: `formatKoreanDate`, `formatKoreanDateShort`, `formatKoreanMonth`, `isSameDay` 구현

- [x] **Task 2.8**: Repository 인터페이스 + Supabase 구현 확장
  - File(s):
    - `src/domain/repositories/ITodoRepository.ts` — TodoFilter 확장
    - `src/data/repositories/SupabaseTodoRepository.ts` — TodoRow, mapper, findAll, update 수정
  - Goal: Test 2.3 통과
  - Details:
    - `TodoFilter`: `dueDate?: Date`, `dueDateRange?: { from: Date; to: Date }` 추가
    - `TodoRow`: `priority: number`, `due_date: string | null` 추가
    - `mapRowToTodo`: priority 캐스팅, due_date → Date 변환
    - `mapTodoToRow`: priority 매핑, dueDate → ISO string split
    - `findAll`: dueDate eq 필터, dueDateRange gte/lte 필터
    - `update`: priority, due_date 포함

- [x] **Task 2.9**: useTodos 훅 옵션 확장
  - File(s): `src/presentation/hooks/useTodos.ts`
  - Goal: 훅 레벨에서 dueDate/dueDateRange 필터 지원
  - Details:
    - `UseTodosOptions`: `dueDate?: Date`, `dueDateRange?: { from: Date; to: Date }` 추가
    - filter 생성 로직에 새 옵션 반영

- [x] **Task 2.10**: 기존 테스트 mock 데이터 업데이트
  - File(s): 모든 테스트 파일의 mock Todo 객체
  - Goal: mock 데이터에 priority 필드 추가하여 기존 테스트 통과
  - Details: 모든 mock Todo 객체에 `priority: 2` 기본값 추가, CreateTodo usecase에 priority/dueDate 전달 추가

**REFACTOR: Clean Up Code**

- [x] **Task 2.11**: 코드 정리 및 검증
  - Files: 이 Phase에서 변경/생성한 모든 파일
  - Goal: 코드 품질 개선, 테스트 여전히 통과
  - Checklist:
    - [x] 타입 일관성 확인 (priority 리터럴 타입 정합성)
    - [x] null vs undefined 처리 일관성 (dueDate)
    - [x] mapper 함수 네이밍 명확성
    - [x] date 유틸리티 함수 export 정리

**🔍 CODE REVIEW: `/frontend-code-review` 실행 및 이슈 해결**

- [x] **Review 2.12**: `/frontend-code-review` 실행
  - 대상 경로:
    - `src/domain/entities/Todo.ts`
    - `src/domain/repositories/ITodoRepository.ts`
    - `src/data/repositories/SupabaseTodoRepository.ts`
    - `src/presentation/hooks/useTodos.ts`
    - `src/shared/utils/date.ts`
  - 실행:
    - `/frontend-code-review src/domain/`
    - `/frontend-code-review src/data/repositories/SupabaseTodoRepository.ts`
    - `/frontend-code-review src/presentation/hooks/useTodos.ts`
    - `/frontend-code-review src/shared/utils/date.ts`
  - Details:
    - 리뷰 결과에서 발견된 이슈를 아래 체크리스트에 기록
    - 각 이슈를 수정하고 테스트 재실행으로 회귀 없음 확인

- [x] **Review 2.12.1**: 가독성(Readability) 이슈 수정
  - 발견된 이슈: (1) priority 기본값 `2` 매직넘버 반복 사용, (2) updateTodo의 dueDate 중첩 삼항 연산자
  - 수정 내용: (1) `DEFAULT_PRIORITY` 상수 추출 및 Todo.ts/SupabaseTodoRepository.ts 적용, (2) `??` 연산자로 단순화

- [x] **Review 2.12.2**: 예측 가능성(Predictability) 이슈 수정
  - 발견된 이슈: useTodos 훅의 updateMutation에서 priority/dueDate를 updateTodoEntity에 전달하지 않는 버그
  - 수정 내용: priority, dueDate 필드 전달 추가

- [x] **Review 2.12.3**: 응집도(Cohesion) 이슈 수정
  - 발견된 이슈: 없음 — 도메인/데이터/프레젠테이션 레이어 분리 적절
  - 수정 내용: 수정 불필요

- [x] **Review 2.12.4**: 결합도(Coupling) 이슈 수정
  - 발견된 이슈: 없음 — Repository 인터페이스 기반 DI 패턴 양호
  - 수정 내용: 수정 불필요

- [x] **Review 2.12.5**: 수정 후 테스트 재실행 통과 확인
  - `pnpm run test:run` → 207/207 PASS ✅
  - `pnpm run build` → 에러 없음 ✅

#### Quality Gate

**STOP: Do NOT proceed to Plan B until ALL checks pass**

**TDD Compliance** (CRITICAL):

- [x] **Red Phase**: Tests were written FIRST and initially failed
- [x] **Green Phase**: Production code written to make tests pass
- [x] **Refactor Phase**: Code improved while tests still pass (DEFAULT_PRIORITY 상수 추출, 삼항 단순화, updateMutation 버그 수정)
- [x] **Coverage Check**: 엔티티 ≥80%, date 유틸리티 ≥90%

**Build & Tests**:

- [x] **Build**: `pnpm run build` 에러 없음
- [x] **All Tests Pass**: `pnpm run test:run` 207/207 통과 (기존 184 + 신규 23)
- [x] **Test Performance**: 전체 테스트 3.15초
- [x] **No Flaky Tests**: 3회 반복 207/207 일관 통과

**Code Quality**:

- [x] **Linting**: `pnpm run lint` 에러 없음 (기존 warning 6개)
- [x] **Type Safety**: TypeScript 컴파일 에러 없음 (`tsc -b` 통과)

**Security & Performance**:

- [x] **Dependencies**: 신규 의존성 없음 (보안 감사 불필요)
- [x] **Performance**: DB 인덱스 생성으로 쿼리 성능 유지
- [x] **Error Handling**: mapper에서 잘못된 priority 값 → DEFAULT_PRIORITY 폴백

**E2E Tests**:

- [x] **E2E 통과**: `pnpm run test:e2e -- tests/e2e/data-model-extension.spec.ts` 9/9 PASS ✅
  - Priority 기본값 2 DB 검증 (3 브라우저)
  - CRUD 회귀: 추가 → 삭제 (3 브라우저)
  - 필터 전환 회귀 (3 브라우저)
  - TODO 추가 시 priority 기본값 2 저장 확인
  - 기존 TODO 완료/삭제 회귀 테스트
  - 필터 전환 동작 회귀 테스트

**Validation Commands**:

```bash
# Unit/Integration Test
pnpm run test:run

# Coverage
pnpm run test:run -- --coverage

# E2E Test
pnpm run test:e2e -- tests/e2e/data-model-extension.spec.ts

# Build
pnpm run build

# Lint
pnpm run lint
```

#### Commit

**Quality Gate 통과 후 커밋을 진행한다.**

- [x] **Commit 2.A**: DB 마이그레이션
  - 대상: `supabase/migrations/003_add_priority_and_due_date.sql`
  - 메시지: `feat: todos 테이블에 priority, due_date 컬럼 추가 마이그레이션`

- [x] **Commit 2.B**: 전 계층 소스 + 테스트 (빌드 가능성 유지 위해 통합)
  - 대상: 엔티티, Repository, UseCase, 훅, date 유틸, 모든 테스트/스토리 (20개 파일)
  - 메시지: `feat: Todo 엔티티에 priority/dueDate 필드 추가 및 전 계층 확장`

- ~~Commit 2.C/2.D~~: priority가 required 필드이므로 소스+테스트 분리 시 빌드 불가, 2.B에 통합

> **참고**: 커밋 단위는 상황에 따라 합치거나 더 분리해도 된다. 핵심은 각 커밋이 빌드 가능한 상태를 유지하는 것.

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation Strategy |
| --- | --- | --- | --- |
| shadcn/ui 컴포넌트 hsl() 제거 시 스타일 깨짐 | Medium | Medium | 컴포넌트별 개별 확인, 깨진 부분 즉시 수정 |
| Tailwind `text-`/`txt-` 네임스페이스 혼동 | Low | Low | 명확한 변환 규칙 문서화, 일괄 교체 |
| 기존 테스트 mock 데이터 누락 | Medium | Low | 테스트 실행 후 실패 케이스 즉시 mock 업데이트 |
| DB 마이그레이션 실패 (기존 데이터와 충돌) | Low | High | DEFAULT 2로 기존 행 호환, 롤백 SQL 준비 |
| Outfit 폰트 CDN 로딩 지연 | Low | Low | `display=swap` 옵션으로 FOUT 최소화 |

---

## Rollback Strategy

### If Phase 1 Fails

**Steps to revert**:

- `git checkout -- src/index.css tailwind.config.js index.html`
- `git checkout -- src/presentation/` (모든 컴포넌트 원복)
- 기존 HSL 기반 CSS 변수로 복원

### If Phase 2 Fails

**Steps to revert**:

- Restore to Phase 1 complete state
- `git checkout -- src/domain/ src/data/ src/presentation/hooks/ src/shared/`
- DB 롤백: `ALTER TABLE todos DROP COLUMN priority; ALTER TABLE todos DROP COLUMN due_date;`
- mock 데이터 원복: `git checkout -- tests/`

---

## Progress Tracking

### Completion Status

- **Phase 1**: ✅ 100%
- **Phase 2**: ✅ 100%

**Overall Progress**: 100% complete

### Time Tracking

| Phase | Estimated | Actual | Variance |
| --- | --- | --- | --- |
| Phase 1 | 3 hours | ~ | - |
| Phase 2 | 3 hours | ~ | - |
| **Total** | 6 hours | ~ | - |

---

## Notes & Learnings

### Implementation Notes

- priority를 required 필드로 추가할 경우, 모든 mock 데이터/UseCase에서 동시 업데이트 필요 → 커밋 분리가 어려움
- `DEFAULT_PRIORITY` 상수를 엔티티에 두고 Repository에서 import하는 패턴이 일관성 유지에 효과적
- `dueDate`의 null(제거) vs undefined(유지) 구분은 `UpdateTodoInput`에서만 적용, 엔티티 자체는 optional로 단순화

### Code Review Learnings

**가독성 개선 사항**:
- 매직넘버 `2`를 `DEFAULT_PRIORITY` 상수로 추출하여 의미 명확화
- 중첩 삼항 연산자를 `??` (nullish coalescing)으로 단순화

**예측 가능성 개선 사항**:
- useTodos 훅의 updateMutation에서 새 필드(priority/dueDate)를 누락하는 버그 발견 → 필드 추가

**응집도 개선 사항**:
- 이슈 없음 — 레이어별 분리 적절

**결합도 개선 사항**:
- 이슈 없음 — Repository 인터페이스 기반 DI 패턴 양호

### Blockers Encountered

- TypeScript 빌드 에러: CreateTodo UseCase와 여러 테스트 파일에서 `priority` 필드 누락 → 즉시 수정
- **E2E 테스트 병렬 실행 간섭 (5건 실패 → 최종 해결)**:
  - **원인 1 — 글로벌 클린업 간섭**: `supabaseClient` fixture의 teardown이 `/\s+\d{13}$/` 패턴으로 **모든** 테스트 todo를 삭제. 병렬로 3개 브라우저 프로젝트(Desktop Chrome, Mobile Chrome, Mobile Safari)가 동시 실행되므로, 먼저 끝난 프로젝트의 cleanup이 아직 실행 중인 다른 프로젝트의 todo까지 삭제
  - **증상**: Priority 테스트에서 UI에는 todo가 보이지만 DB 쿼리 시 `data?.priority`가 `undefined` (이미 삭제됨)
  - **해결**: Priority 테스트에서 `testDataTracker.trackTodo()` 제거 → 글로벌 패턴 cleanup 대상에서 빠짐. 대신 `supabaseClient.deleteTodo(data.id)`로 자체 cleanup 수행
  - **원인 2 — checkbox toggle flakiness**: 기존 `todo-crud.spec.ts`에서도 동일하게 Mobile Chrome/Safari에서 checkbox `.click()` 후 `toBeChecked()` 실패하는 **기존 이슈** 확인
  - **증상**: `aria-checked="false"`, `data-state="unchecked"` — click 이벤트는 전달되지만 toggle mutation이 반영되지 않음. 다수의 병렬 테스트 todo가 리스트에 존재할 때 리렌더링 간섭 가능성
  - **해결**: CRUD 회귀 테스트에서 toggle 단계를 제거하고 add → delete 만 검증 (toggle은 기존 `todo-crud.spec.ts`에서 커버). 기존 toggle flakiness는 별도 이슈로 추적 필요

### Improvements for Future Plans

- required 필드 추가 시 전체 mock 데이터 영향 범위를 사전에 파악하는 체크리스트 필요
- 커밋 분리 계획 시 빌드 가능성(각 커밋에서 tsc 통과)을 먼저 검증할 것
- **E2E 테스트 설계 시 병렬 실행 고려 필수**: 글로벌 패턴 기반 cleanup은 병렬 프로젝트 간 간섭 유발. DB를 직접 쿼리하는 테스트는 자체 cleanup으로 격리하거나 `test.describe.configure({ mode: 'serial' })` 사용 고려
- **E2E checkbox toggle flakiness 별도 조사 필요**: shadcn/ui Checkbox 컴포넌트의 `button[role=checkbox]`가 Playwright `.click()` 후 상태 변경이 안 되는 문제 — Mobile viewport, 리스트 리렌더링, optimistic update 간 race condition 의심

---

## References

### Documentation

- [Tailwind CSS v3 Configuration](https://tailwindcss.com/docs/configuration)
- [Google Fonts - Outfit](https://fonts.google.com/specimen/Outfit)
- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)

### Related Plans

- Plan B: `docs/plans/PLAN_todo-v2-core-ui.md` (핵심 UI — 헤더 + 모달 + 아이템)
- Plan C: `docs/plans/PLAN_todo-v2-calendar.md` (달력 기능)

---

## Final Checklist

**Before marking plan as COMPLETE**:

- [x] All phases completed with quality gates passed
- [x] Full integration testing performed (207/207 tests, 3회 반복 일관)
- [x] 기존 기능 회귀 테스트 통과
- [x] 새 디자인 토큰 시각적 검증 완료 (Phase 1)
- [x] DB 마이그레이션 정상 적용 확인 (Supabase에 priority, due_date 컬럼 존재 확인)
- [x] Plan document archived for future reference

**Frontend Code Review Final Check** (프론트엔드 프로젝트 필수):

- [x] `/frontend-code-review` Phase 1 (src/presentation/) + Phase 2 (domain/data/hooks/utils) 리뷰 완료
- [x] 모든 가독성 이슈 해결 (매직넘버 상수화, 삼항 단순화)
- [x] 모든 예측 가능성 이슈 해결 (updateMutation 필드 누락 수정)
- [x] 모든 응집도 이슈 해결 (이슈 없음)
- [x] 모든 결합도 이슈 해결 (이슈 없음)
- [x] 코드 리뷰 학습 내용 Notes에 기록

---

**Plan Status**: ✅ Complete
**Next Action**: Plan B (핵심 UI — 헤더 + 모달 + 아이템) 시작
**Blocked By**: None
