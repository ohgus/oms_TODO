# Implementation Plan: TODO App v2 — Core UI (헤더 + 모달 + 아이템)

**Status**: ⏳ Pending
**Started**: -
**Last Updated**: 2026-02-19
**Estimated Completion**: -

**Plan Sequence**: Plan A (기반) → **Plan B (핵심 UI)** → Plan C (달력)

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

헤더를 단순화하고 인라인 TodoForm을 Bottom Sheet(Drawer) 모달로 교체한다. 수정 모달을 새로 구현하고, TodoItem에 중요도 별점(PriorityStars) + 날짜 배지(DateBadge)를 추가한다.

### Success Criteria

- [ ] 헤더가 "체크 아이콘 + TODO + (+) 버튼" 구조
- [ ] (+) 버튼 → Bottom Sheet 모달로 TODO 추가 (제목/카테고리/중요도/날짜)
- [ ] 수정 아이콘 → Bottom Sheet 모달로 TODO 수정 (기존 값 프리필)
- [ ] TodoItem에 중요도 별점 + 날짜 배지 표시
- [ ] 인라인 TodoForm 완전 제거
- [ ] 기존 필터(상태/카테고리) 정상 동작

### User Impact

Bottom Sheet 모달로 TODO 추가/수정 UX가 모바일 친화적으로 개선되며, 중요도와 마감일을 시각적으로 한눈에 파악할 수 있다.

---

## Architecture Decisions

| Decision | Rationale | Trade-offs |
| --- | --- | --- |
| vaul + shadcn Drawer 사용 | 모바일 네이티브에 가까운 Bottom Sheet UX, shadcn/ui 생태계 호환 | vaul 의존성 추가 (~8KB) |
| PrioritySelector(모달용) / PriorityStars(아이템용) 분리 | 선택과 표시의 역할이 다름 — 단일 책임 원칙 | 컴포넌트 수 증가 |
| TodoAddModal / TodoEditModal 독립 구현 | 로직이 단순하고 파일이 2개뿐이므로 공통 추출 대비 명확성 우선 | 폼 영역 약간의 코드 중복 |
| native `<input type="date">` 사용 | 모바일 네이티브 달력 활용, 추가 라이브러리 불필요 | 데스크톱에서 브라우저별 UI 차이 |

---

## Dependencies

### Required Before Starting

- [ ] **Plan A 완료**: 디자인 토큰 적용 + Todo에 priority/dueDate 필드 존재
- [ ] 앱이 새 디자인 토큰으로 정상 빌드/실행

### External Dependencies

- `vaul`: Bottom Sheet/Drawer 라이브러리 (신규 설치)
- `shadcn/ui drawer`: vaul 기반 shadcn 컴포넌트 (신규 추가)

---

## Test Strategy

### Testing Approach

**TDD Principle**: Write tests FIRST, then implement to make them pass

### Test Pyramid for This Feature

| Test Type | Coverage Target | Purpose |
| --- | --- | --- |
| **Unit Tests** | ≥80% | PrioritySelector, PriorityStars, DateBadge 렌더링 |
| **Integration Tests** | Critical paths | 모달 열기/닫기, 폼 제출, 프리필 동작 |
| **E2E Tests** | Key user flows | TODO 추가/수정 전체 플로우 |

### Test File Organization

```
tests/
├── unit/
│   ├── components/todo/PrioritySelector.test.tsx
│   ├── components/todo/PriorityStars.test.tsx
│   ├── components/todo/TodoAddModal.test.tsx
│   ├── components/todo/TodoEditModal.test.tsx
│   └── components/common/DateBadge.test.tsx
├── integration/
│   └── todo-modal-flow.test.tsx
└── e2e/
    └── todo-crud-modal.spec.ts
```

### Coverage Requirements by Phase

- **Phase 3 (헤더+추가모달)**: PrioritySelector ≥80%, TodoAddModal 통합 테스트
- **Phase 4 (수정모달)**: TodoEditModal 통합 테스트, 프리필 동작
- **Phase 5 (TodoItem)**: PriorityStars ≥90%, DateBadge ≥90%

---

## Implementation Phases

### Phase 3: 헤더 변경 + TODO 추가 모달

**Goal**: 인라인 TodoForm → Bottom Sheet 추가 모달로 교체, 헤더에 (+) 버튼 추가
**Estimated Time**: 4 hours
**Status**: ⏳ Pending

> 헤더에서 TodoForm 제거와 TodoAddModal 추가를 동일 Phase에서 처리하여, 중간에 TODO 추가 기능이 사라지는 구간을 방지한다.

#### Tasks

**RED: Write Failing Tests First**

- [ ] **Test 3.1**: PrioritySelector 단위 테스트
  - File(s): `tests/unit/components/todo/PrioritySelector.test.tsx`
  - Expected: Tests FAIL — PrioritySelector 컴포넌트 미존재
  - Details:
    - 3개 버튼(낮음/보통/높음) 렌더링
    - 클릭 시 onChange 콜백 호출
    - 선택 상태에 따른 스타일 변경 (aria-pressed)
    - 별 아이콘 채워진 개수 확인

- [ ] **Test 3.2**: TodoAddModal 통합 테스트
  - File(s): `tests/unit/components/todo/TodoAddModal.test.tsx`
  - Expected: Tests FAIL — TodoAddModal 컴포넌트 미존재
  - Details:
    - open=true 시 모달 표시
    - 제목 입력 + 제출 시 onSubmit 호출
    - 제목 비어있으면 제출 비활성화
    - priority 기본값 2
    - 카테고리 선택 동작
    - 제출 후 폼 초기화

**GREEN: Implement to Make Tests Pass**

- [ ] **Task 3.3**: vaul + shadcn Drawer 설치
  - File(s): `src/presentation/components/ui/drawer.tsx` (신규)
  - Goal: Bottom Sheet 기반 UI 컴포넌트 추가
  - Details:
    ```bash
    pnpm add vaul
    npx shadcn@latest add drawer
    ```
    export: Drawer, DrawerTrigger, DrawerPortal, DrawerClose, DrawerOverlay, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription

- [ ] **Task 3.4**: PrioritySelector 구현
  - File(s): `src/presentation/components/todo/PrioritySelector.tsx` (신규)
  - Goal: Test 3.1 통과
  - Details:
    - Props: `value: 1 | 2 | 3`, `onChange: (value: 1 | 2 | 3) => void`
    - 3단계 버튼: ★☆☆ 낮음(1), ★★☆ 보통(2), ★★★ 높음(3)
    - 선택 버튼: `bg-accent-light text-accent-primary border-accent-primary`
    - 비선택 버튼: `bg-bg-surface text-txt-secondary border-border-subtle`
    - 별 아이콘: `Star` from lucide-react

- [ ] **Task 3.5**: TodoAddModal 구현
  - File(s): `src/presentation/components/todo/TodoAddModal.tsx` (신규)
  - Goal: Test 3.2 통과
  - Details:
    - Props: `open`, `onOpenChange`, `onSubmit`, `categories`
    - 내부 상태: title, categoryId, priority(default 2), dueDate
    - 폼 필드: 할 일 Input, 카테고리 라디오, PrioritySelector, 날짜 native input
    - 날짜 표시: `formatKoreanDate(date)` 사용
    - 제출: title.trim() 비어있으면 return, 성공 시 상태 초기화
    - 버튼: "추가하기" (`bg-accent-primary text-white`)

- [ ] **Task 3.6**: 헤더 변경 + HomePage 연결
  - File(s): `src/presentation/pages/HomePage.tsx`
  - Goal: 인라인 TodoForm → (+) 버튼 + TodoAddModal 교체
  - Details:
    - TodoForm import 제거, TodoAddModal import 추가
    - 헤더: `flex items-center justify-between` + CheckSquare + "TODO" + Plus 버튼
    - Plus 버튼 → `openAddTodoModal()` 호출
    - TodoAddModal 렌더링 (isAddTodoModalOpen 연동)
    - handleAddTodo: priority/dueDate 포함하여 addTodo 호출 + closeAddTodoModal

- [ ] **Task 3.7**: TodoForm 삭제
  - File(s):
    - `src/presentation/components/todo/TodoForm.tsx` (삭제)
    - `src/presentation/components/todo/TodoForm.stories.tsx` (존재 시 삭제)
  - Goal: 인라인 폼 완전 제거
  - Details: 다른 파일에서 TodoFormData import 경로를 TodoAddModal로 변경 확인

**REFACTOR: Clean Up Code**

- [ ] **Task 3.8**: 리팩터링
  - Files: 이 Phase에서 변경/생성한 모든 파일
  - Goal: 코드 품질 개선, 테스트 통과 유지
  - Checklist:
    - [ ] TodoAddModal 내 폼 필드 간 간격/정렬 일관성
    - [ ] 접근성: aria-label, role 속성 확인
    - [ ] 모달 열기/닫기 시 포커스 관리
    - [ ] 불필요한 import 제거

**🔍 CODE REVIEW: `/frontend-code-review` 실행 및 이슈 해결**

- [ ] **Review 3.9**: `/frontend-code-review` 실행
  - 대상 경로:
    - `src/presentation/components/todo/PrioritySelector.tsx`
    - `src/presentation/components/todo/TodoAddModal.tsx`
    - `src/presentation/pages/HomePage.tsx`
  - 실행:
    - `/frontend-code-review src/presentation/components/todo/PrioritySelector.tsx`
    - `/frontend-code-review src/presentation/components/todo/TodoAddModal.tsx`
    - `/frontend-code-review src/presentation/pages/HomePage.tsx`
  - Details:
    - 리뷰 결과에서 발견된 이슈를 아래 체크리스트에 기록
    - 각 이슈를 수정하고 테스트 재실행으로 회귀 없음 확인

- [ ] **Review 3.9.1**: 가독성(Readability) 이슈 수정
  - 발견된 이슈: (리뷰 후 기록)
  - 수정 내용: (수정 후 기록)

- [ ] **Review 3.9.2**: 예측 가능성(Predictability) 이슈 수정
  - 발견된 이슈: (리뷰 후 기록)
  - 수정 내용: (수정 후 기록)

- [ ] **Review 3.9.3**: 응집도(Cohesion) 이슈 수정
  - 발견된 이슈: (리뷰 후 기록)
  - 수정 내용: (수정 후 기록)

- [ ] **Review 3.9.4**: 결합도(Coupling) 이슈 수정
  - 발견된 이슈: (리뷰 후 기록)
  - 수정 내용: (수정 후 기록)

- [ ] **Review 3.9.5**: 수정 후 테스트 재실행 통과 확인
  - `pnpm run test:run` → 100% PASS
  - `pnpm run build` → 에러 없음

#### Quality Gate

**STOP: Do NOT proceed to Phase 4 until ALL checks pass**

**TDD Compliance** (CRITICAL):

- [ ] **Red Phase**: Tests were written FIRST and initially failed
- [ ] **Green Phase**: Production code written to make tests pass
- [ ] **Refactor Phase**: Code improved while tests still pass
- [ ] **Coverage Check**: PrioritySelector ≥80%

**Build & Tests**:

- [ ] **Build**: `pnpm run build` 에러 없음
- [ ] **All Tests Pass**: `pnpm run test:run` 100% 통과
- [ ] **Test Performance**: 전체 테스트 5분 이내
- [ ] **No Flaky Tests**: 3회 반복 일관성

**Code Quality**:

- [ ] **Linting**: `pnpm run lint` 에러 없음
- [ ] **Type Safety**: TypeScript 컴파일 에러 없음

**Security & Performance**:

- [ ] **Dependencies**: vaul 패키지 보안 감사 (`pnpm audit`)
- [ ] **Performance**: Drawer 애니메이션 부드러움 확인

**Frontend Code Review** (프론트엔드 Phase 필수):

- [ ] `/frontend-code-review src/presentation/components/todo/PrioritySelector.tsx` 실행
- [ ] `/frontend-code-review src/presentation/components/todo/TodoAddModal.tsx` 실행
- [ ] `/frontend-code-review src/presentation/pages/HomePage.tsx` 실행
- [ ] **가독성** 이슈 수정
- [ ] **예측 가능성** 이슈 수정
- [ ] **응집도** 이슈 수정
- [ ] **결합도** 이슈 수정
- [ ] 리뷰 결과 Notes 섹션에 기록

**Validation Commands**:

```bash
# Build
pnpm run build

# Test
pnpm run test:run

# Lint
pnpm run lint

# Security Audit
pnpm audit

# Frontend Code Review
/frontend-code-review src/presentation/components/todo/PrioritySelector.tsx
/frontend-code-review src/presentation/components/todo/TodoAddModal.tsx
/frontend-code-review src/presentation/pages/HomePage.tsx
```

**Manual Test Checklist**:

- [ ] (+) 버튼 클릭 → Bottom Sheet 모달 열림
- [ ] 모달에서 제목 입력 + "추가하기" → TODO 추가 + 모달 닫힘
- [ ] priority 선택(1/2/3) → DB에 올바른 값 저장
- [ ] 날짜 선택 → "2월 19일 (목)" 형식으로 표시 → DB에 저장
- [ ] 제목 비어있을 때 "추가하기" 버튼 비활성화
- [ ] 모달 닫고 다시 열면 폼 초기화됨

---

### Phase 4: TODO 수정 모달

**Goal**: TodoEditModal 구현 + HomePage 연결 (기존 handleEdit 주석 대체)
**Estimated Time**: 2.5 hours
**Status**: ⏳ Pending

#### Tasks

**RED: Write Failing Tests First**

- [ ] **Test 4.1**: uiStore editingTodo 상태 테스트
  - File(s): `tests/unit/stores/uiStore.test.ts`
  - Expected: Tests FAIL — editingTodo 상태/액션 미존재
  - Details:
    - `openEditTodoModal(todo)` → editingTodo가 해당 todo로 설정
    - `closeEditTodoModal()` → editingTodo가 null로 초기화
    - `useEditingTodo` 셀렉터 동작

- [ ] **Test 4.2**: TodoEditModal 통합 테스트
  - File(s): `tests/unit/components/todo/TodoEditModal.test.tsx`
  - Expected: Tests FAIL — TodoEditModal 컴포넌트 미존재
  - Details:
    - todo=null 시 모달 닫힘
    - todo 전달 시 폼에 기존 값 프리필 (title, categoryId, priority, dueDate)
    - 수정 후 onSubmit(id, data) 호출
    - 타이틀 "TODO 수정", 버튼 "수정하기"

**GREEN: Implement to Make Tests Pass**

- [ ] **Task 4.3**: uiStore 확장
  - File(s): `src/presentation/stores/uiStore.ts`
  - Goal: Test 4.1 통과
  - Details:
    - UIState: `editingTodo: Todo | null` 추가
    - UIActions: `openEditTodoModal`, `closeEditTodoModal` 추가
    - 셀렉터: `useEditingTodo` 추가

- [ ] **Task 4.4**: TodoEditModal 구현
  - File(s): `src/presentation/components/todo/TodoEditModal.tsx` (신규)
  - Goal: Test 4.2 통과
  - Details:
    - Props: `todo: Todo | null`, `onOpenChange`, `onSubmit: (id, data) => void`, `categories`
    - open 조건: `todo !== null`
    - useEffect로 todo 변경 시 폼 상태 프리필
    - TodoAddModal과 동일한 Drawer + 폼 구조
    - 타이틀: "TODO 수정", 버튼: "수정하기"

- [ ] **Task 4.5**: HomePage에 수정 모달 연결
  - File(s): `src/presentation/pages/HomePage.tsx`
  - Goal: 기존 handleEdit 주석을 실제 구현으로 교체
  - Details:
    - `editingTodo = useEditingTodo()`
    - `handleEdit = (todo) => openEditTodoModal(todo)`
    - `handleUpdateTodo = async (id, data) => { await updateTodo({...}); closeEditTodoModal(); }`
    - TodoEditModal 렌더링 추가

**REFACTOR: Clean Up Code**

- [ ] **Task 4.6**: 리팩터링
  - Files: 이 Phase에서 변경/생성한 모든 파일
  - Goal: 코드 품질 개선, 테스트 통과 유지
  - Checklist:
    - [ ] TodoAddModal / TodoEditModal 간 공통 패턴 정리
    - [ ] useEffect 프리필 로직의 dependency 정확성
    - [ ] 모달 닫기 시 editingTodo 정리 확인

**🔍 CODE REVIEW: `/frontend-code-review` 실행 및 이슈 해결**

- [ ] **Review 4.7**: `/frontend-code-review` 실행
  - 대상 경로:
    - `src/presentation/components/todo/TodoEditModal.tsx`
    - `src/presentation/stores/uiStore.ts`
    - `src/presentation/pages/HomePage.tsx`
  - 실행:
    - `/frontend-code-review src/presentation/components/todo/TodoEditModal.tsx`
    - `/frontend-code-review src/presentation/stores/uiStore.ts`
    - `/frontend-code-review src/presentation/pages/HomePage.tsx`
  - Details:
    - 리뷰 결과에서 발견된 이슈를 아래 체크리스트에 기록
    - 각 이슈를 수정하고 테스트 재실행으로 회귀 없음 확인

- [ ] **Review 4.7.1**: 가독성(Readability) 이슈 수정
  - 발견된 이슈: (리뷰 후 기록)
  - 수정 내용: (수정 후 기록)

- [ ] **Review 4.7.2**: 예측 가능성(Predictability) 이슈 수정
  - 발견된 이슈: (리뷰 후 기록)
  - 수정 내용: (수정 후 기록)

- [ ] **Review 4.7.3**: 응집도(Cohesion) 이슈 수정
  - 발견된 이슈: (리뷰 후 기록)
  - 수정 내용: (수정 후 기록)

- [ ] **Review 4.7.4**: 결합도(Coupling) 이슈 수정
  - 발견된 이슈: (리뷰 후 기록)
  - 수정 내용: (수정 후 기록)

- [ ] **Review 4.7.5**: 수정 후 테스트 재실행 통과 확인
  - `pnpm run test:run` → 100% PASS
  - `pnpm run build` → 에러 없음

#### Quality Gate

**STOP: Do NOT proceed to Phase 5 until ALL checks pass**

**TDD Compliance** (CRITICAL):

- [ ] **Red Phase**: Tests were written FIRST and initially failed
- [ ] **Green Phase**: Production code written to make tests pass
- [ ] **Refactor Phase**: Code improved while tests still pass

**Build & Tests**:

- [ ] **Build**: `pnpm run build` 에러 없음
- [ ] **All Tests Pass**: `pnpm run test:run` 100% 통과
- [ ] **No Flaky Tests**: 3회 반복 일관성

**Code Quality**:

- [ ] **Linting**: `pnpm run lint` 에러 없음
- [ ] **Type Safety**: TypeScript 컴파일 에러 없음

**Frontend Code Review** (프론트엔드 Phase 필수):

- [ ] `/frontend-code-review src/presentation/components/todo/TodoEditModal.tsx` 실행
- [ ] `/frontend-code-review src/presentation/stores/uiStore.ts` 실행
- [ ] **가독성** 이슈 수정
- [ ] **예측 가능성** 이슈 수정
- [ ] **응집도** 이슈 수정
- [ ] **결합도** 이슈 수정
- [ ] 리뷰 결과 Notes 섹션에 기록

**Validation Commands**:

```bash
pnpm run build
pnpm run test:run
pnpm run lint

/frontend-code-review src/presentation/components/todo/TodoEditModal.tsx
/frontend-code-review src/presentation/stores/uiStore.ts
```

**Manual Test Checklist**:

- [ ] TodoItem 수정 버튼 → Bottom Sheet 모달 열림
- [ ] 모달에 기존 TODO 데이터 프리필 (제목, 카테고리, 중요도, 날짜)
- [ ] 수정 후 "수정하기" → DB 반영 + 모달 닫힘
- [ ] priority 변경 → DB에 올바른 값 저장
- [ ] dueDate 변경/제거 → DB 반영

---

### Phase 5: TodoItem 변경 + DateBadge + PriorityStars

**Goal**: TodoItem에 중요도 별점(읽기 전용) + 날짜 배지 표시 추가
**Estimated Time**: 2 hours
**Status**: ⏳ Pending

#### Tasks

**RED: Write Failing Tests First**

- [ ] **Test 5.1**: PriorityStars 단위 테스트
  - File(s): `tests/unit/components/todo/PriorityStars.test.tsx`
  - Expected: Tests FAIL — PriorityStars 컴포넌트 미존재
  - Details:
    - level=1: 별 1개 채워짐, 2개 비어있음
    - level=2: 별 2개 채워짐, 1개 비어있음
    - level=3: 별 3개 모두 채워짐
    - aria-label 접근성 확인

- [ ] **Test 5.2**: DateBadge 단위 테스트
  - File(s): `tests/unit/components/common/DateBadge.test.tsx`
  - Expected: Tests FAIL — DateBadge 컴포넌트 미존재
  - Details:
    - 날짜 → "2월 19일" 형식 표시
    - Calendar 아이콘 포함
    - className prop 병합

- [ ] **Test 5.3**: TodoItem 렌더링 테스트 업데이트
  - File(s): 기존 TodoItem 테스트 파일
  - Expected: Tests FAIL — 기존 테스트에 priority/dueDate 관련 검증 추가
  - Details:
    - priority=3인 TODO → 별 3개 표시
    - dueDate 있는 TODO → DateBadge 표시
    - dueDate 없는 TODO → DateBadge 미표시

**GREEN: Implement to Make Tests Pass**

- [ ] **Task 5.4**: PriorityStars 구현
  - File(s): `src/presentation/components/todo/PriorityStars.tsx` (신규)
  - Goal: Test 5.1 통과
  - Details:
    - Props: `level: 1 | 2 | 3`
    - Star 아이콘 3개, level 이하는 `fill-star-filled text-star-filled`, 초과는 `fill-none text-star-empty`
    - `h-3 w-3` 크기, `gap-0.5`
    - aria-label: `"중요도 ${level}단계"`

- [ ] **Task 5.5**: DateBadge 구현
  - File(s): `src/presentation/components/common/DateBadge.tsx` (신규)
  - Goal: Test 5.2 통과
  - Details:
    - Props: `date: Date`, `className?: string`
    - Calendar 아이콘 (h-3 w-3) + `formatKoreanDateShort(date)`
    - 스타일: `text-xs text-txt-tertiary`

- [ ] **Task 5.6**: TodoItem 레이아웃 변경
  - File(s): `src/presentation/components/todo/TodoItem.tsx`
  - Goal: Test 5.3 통과
  - Details:
    - Title 아래: dueDate 있으면 DateBadge 표시
    - Category Badge 옆: PriorityStars 추가
    - description 표시 부분은 dueDate로 교체

**REFACTOR: Clean Up Code**

- [ ] **Task 5.7**: 리팩터링
  - Files: 이 Phase에서 변경/생성한 모든 파일
  - Goal: 코드 품질 개선, 테스트 통과 유지
  - Checklist:
    - [ ] TodoItem 레이아웃 정렬 일관성
    - [ ] 반응형 스타일 확인 (모바일/데스크톱)
    - [ ] 완료된 TODO 스타일 (line-through 등) 정상
    - [ ] PriorityStars/DateBadge 재사용 가능한 구조 확인

**🔍 CODE REVIEW: `/frontend-code-review` 실행 및 이슈 해결**

- [ ] **Review 5.8**: `/frontend-code-review` 실행
  - 대상 경로:
    - `src/presentation/components/todo/PriorityStars.tsx`
    - `src/presentation/components/common/DateBadge.tsx`
    - `src/presentation/components/todo/TodoItem.tsx`
  - 실행:
    - `/frontend-code-review src/presentation/components/todo/PriorityStars.tsx`
    - `/frontend-code-review src/presentation/components/common/DateBadge.tsx`
    - `/frontend-code-review src/presentation/components/todo/TodoItem.tsx`
  - Details:
    - 리뷰 결과에서 발견된 이슈를 아래 체크리스트에 기록
    - 각 이슈를 수정하고 테스트 재실행으로 회귀 없음 확인

- [ ] **Review 5.8.1**: 가독성(Readability) 이슈 수정
  - 발견된 이슈: (리뷰 후 기록)
  - 수정 내용: (수정 후 기록)

- [ ] **Review 5.8.2**: 예측 가능성(Predictability) 이슈 수정
  - 발견된 이슈: (리뷰 후 기록)
  - 수정 내용: (수정 후 기록)

- [ ] **Review 5.8.3**: 응집도(Cohesion) 이슈 수정
  - 발견된 이슈: (리뷰 후 기록)
  - 수정 내용: (수정 후 기록)

- [ ] **Review 5.8.4**: 결합도(Coupling) 이슈 수정
  - 발견된 이슈: (리뷰 후 기록)
  - 수정 내용: (수정 후 기록)

- [ ] **Review 5.8.5**: 수정 후 테스트 재실행 통과 확인
  - `pnpm run test:run` → 100% PASS
  - `pnpm run build` → 에러 없음

#### Quality Gate

**STOP: Do NOT proceed to Plan C until ALL checks pass**

**TDD Compliance** (CRITICAL):

- [ ] **Red Phase**: Tests were written FIRST and initially failed
- [ ] **Green Phase**: Production code written to make tests pass
- [ ] **Refactor Phase**: Code improved while tests still pass
- [ ] **Coverage Check**: PriorityStars ≥90%, DateBadge ≥90%

**Build & Tests**:

- [ ] **Build**: `pnpm run build` 에러 없음
- [ ] **All Tests Pass**: `pnpm run test:run` 100% 통과
- [ ] **No Flaky Tests**: 3회 반복 일관성

**Code Quality**:

- [ ] **Linting**: `pnpm run lint` 에러 없음
- [ ] **Type Safety**: TypeScript 컴파일 에러 없음

**Frontend Code Review** (프론트엔드 Phase 필수):

- [ ] `/frontend-code-review src/presentation/components/todo/PriorityStars.tsx` 실행
- [ ] `/frontend-code-review src/presentation/components/common/DateBadge.tsx` 실행
- [ ] `/frontend-code-review src/presentation/components/todo/TodoItem.tsx` 실행
- [ ] **가독성** 이슈 수정
- [ ] **예측 가능성** 이슈 수정
- [ ] **응집도** 이슈 수정
- [ ] **결합도** 이슈 수정
- [ ] 리뷰 결과 Notes 섹션에 기록

**Validation Commands**:

```bash
pnpm run build
pnpm run test:run
pnpm run test:run -- --coverage
pnpm run lint

/frontend-code-review src/presentation/components/todo/PriorityStars.tsx
/frontend-code-review src/presentation/components/common/DateBadge.tsx
/frontend-code-review src/presentation/components/todo/TodoItem.tsx
```

**Manual Test Checklist**:

- [ ] priority=1 TODO → 별 1개 채워짐
- [ ] priority=2 TODO → 별 2개 채워짐
- [ ] priority=3 TODO → 별 3개 채워짐
- [ ] dueDate 있는 TODO → "2월 19일" 형식 배지
- [ ] dueDate 없는 TODO → 날짜 배지 미표시
- [ ] 완료된 TODO → line-through + 흐린 스타일

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation Strategy |
| --- | --- | --- | --- |
| vaul 패키지 shadcn/ui 버전 호환성 | Low | High | `npx shadcn@latest add drawer`로 호환 보장, 실패 시 수동 작성 |
| TodoForm 삭제 시 import 참조 누락 | Medium | Medium | TodoFormData 타입의 모든 import 경로 확인 후 삭제 |
| Bottom Sheet 모바일 터치 UX 이슈 | Low | Medium | vaul의 검증된 터치 핸들링 활용, iOS/Android 실기기 테스트 |
| 수정 모달 프리필 시 useEffect race condition | Low | Low | todo dependency 정확히 지정, 모달 닫힘 시 cleanup |
| TodoItem 레이아웃 변경으로 기존 테스트 깨짐 | Medium | Low | 기존 테스트 업데이트를 RED 단계에서 먼저 수행 |

---

## Rollback Strategy

### If Phase 3 Fails

**Steps to revert**:

- `pnpm remove vaul` (의존성 제거)
- TodoForm.tsx 복원: `git checkout -- src/presentation/components/todo/TodoForm.tsx`
- HomePage.tsx 복원: `git checkout -- src/presentation/pages/HomePage.tsx`
- drawer.tsx, PrioritySelector.tsx, TodoAddModal.tsx 삭제

### If Phase 4 Fails

**Steps to revert**:

- Restore to Phase 3 complete state
- uiStore.ts 복원: `git checkout -- src/presentation/stores/uiStore.ts` (editingTodo 부분만)
- HomePage.tsx에서 TodoEditModal 연결 제거
- TodoEditModal.tsx 삭제

### If Phase 5 Fails

**Steps to revert**:

- Restore to Phase 4 complete state
- TodoItem.tsx 복원: `git checkout -- src/presentation/components/todo/TodoItem.tsx`
- PriorityStars.tsx, DateBadge.tsx 삭제

---

## Progress Tracking

### Completion Status

- **Phase 3**: ⏳ 0%
- **Phase 4**: ⏳ 0%
- **Phase 5**: ⏳ 0%

**Overall Progress**: 0% complete

### Time Tracking

| Phase | Estimated | Actual | Variance |
| --- | --- | --- | --- |
| Phase 3 | 4 hours | - | - |
| Phase 4 | 2.5 hours | - | - |
| Phase 5 | 2 hours | - | - |
| **Total** | 8.5 hours | - | - |

---

## Notes & Learnings

### Implementation Notes

- (구현 시 추가)

### Code Review Learnings

**가독성 개선 사항**:
- (리뷰 후 추가)

**예측 가능성 개선 사항**:
- (리뷰 후 추가)

**응집도 개선 사항**:
- (리뷰 후 추가)

**결합도 개선 사항**:
- (리뷰 후 추가)

### Blockers Encountered

- (발생 시 기록)

### Improvements for Future Plans

- (완료 후 기록)

---

## References

### Documentation

- [vaul - Drawer component for React](https://github.com/emilkowalski/vaul)
- [shadcn/ui Drawer](https://ui.shadcn.com/docs/components/drawer)
- [lucide-react Icons](https://lucide.dev/icons/)

### Related Plans

- Plan A: `docs/plans/PLAN_todo-v2-foundation.md` (선행 — 디자인 토큰 + 데이터 모델)
- Plan C: `docs/plans/PLAN_todo-v2-calendar.md` (후행 — 달력 기능)

---

## File Change Summary

### Modified Files

| File | Phase | Changes |
| --- | --- | --- |
| `src/presentation/pages/HomePage.tsx` | 3, 4 | 헤더 변경, TodoForm→모달 교체, 수정 모달 연결 |
| `src/presentation/stores/uiStore.ts` | 4 | editingTodo 상태 + 액션 추가 |
| `src/presentation/components/todo/TodoItem.tsx` | 5 | DateBadge, PriorityStars 추가 |

### New Files

| File | Phase | Description |
| --- | --- | --- |
| `src/presentation/components/ui/drawer.tsx` | 3 | shadcn Drawer (vaul 기반) |
| `src/presentation/components/todo/PrioritySelector.tsx` | 3 | 중요도 선택 (모달용) |
| `src/presentation/components/todo/TodoAddModal.tsx` | 3 | TODO 추가 Bottom Sheet |
| `src/presentation/components/todo/TodoEditModal.tsx` | 4 | TODO 수정 Bottom Sheet |
| `src/presentation/components/todo/PriorityStars.tsx` | 5 | 중요도 별점 표시 (아이템용) |
| `src/presentation/components/common/DateBadge.tsx` | 5 | 날짜 배지 |

### Deleted Files

| File | Phase | Reason |
| --- | --- | --- |
| `src/presentation/components/todo/TodoForm.tsx` | 3 | TodoAddModal로 대체 |
| `src/presentation/components/todo/TodoForm.stories.tsx` | 3 | 위와 함께 삭제 |

---

## Final Checklist

**Before marking plan as COMPLETE**:

- [ ] All phases completed with quality gates passed
- [ ] Full integration testing performed
- [ ] Bottom Sheet 모달 UX 검증 (열기/닫기/드래그)
- [ ] priority/dueDate 추가/수정 E2E 동작 확인
- [ ] 기존 기능 회귀 테스트 통과
- [ ] Plan document archived for future reference

**Frontend Code Review Final Check** (프론트엔드 프로젝트 필수):

- [ ] `/frontend-code-review src/presentation/components/todo/` 전체 리뷰 완료
- [ ] `/frontend-code-review src/presentation/components/common/` 전체 리뷰 완료
- [ ] 모든 가독성 이슈 해결
- [ ] 모든 예측 가능성 이슈 해결
- [ ] 모든 응집도 이슈 해결
- [ ] 모든 결합도 이슈 해결
- [ ] 코드 리뷰 학습 내용 Notes에 기록

---

**Plan Status**: ⏳ Pending
**Next Action**: Plan A 완료 대기
**Blocked By**: Plan A (PLAN_todo-v2-foundation.md)
