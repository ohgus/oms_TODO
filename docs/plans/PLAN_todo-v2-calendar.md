# Implementation Plan: TODO App v2 — Calendar (하단 탭 바 + 캘린더 뷰)

**Status**: ⏳ Pending
**Started**: -
**Last Updated**: 2026-02-19
**Estimated Completion**: -

**Plan Sequence**: Plan A (기반) → Plan B (핵심 UI) → **Plan C (달력)**

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

하단 탭 바(오늘/달력)를 추가하고, 기존 TODO 리스트를 "오늘" 탭으로 분리한다. "달력" 탭에 월별 캘린더 그리드 + 날짜별 TODO 목록 + 이번 주 TODO 섹션을 구현한다.

### Success Criteria

- [ ] 하단에 "오늘" / "달력" 2탭 탭 바 표시
- [ ] "오늘" 탭 = 기존 TODO 리스트 뷰 (필터 포함) 정상 동작
- [ ] "달력" 탭: 월별 캘린더 그리드 정상 렌더링
- [ ] 달력에서 TODO가 있는 날짜에 dot 표시
- [ ] 오늘 날짜 강조 (accent-primary 배경)
- [ ] 이전/다음 월 네비게이션 동작
- [ ] 날짜 클릭 시 해당 날짜의 TODO 목록 표시
- [ ] "이번 주 TODO" 섹션 표시
- [ ] 양쪽 탭에서 (+) 버튼으로 TODO 추가/수정/삭제 정상 동작

### User Impact

달력 뷰를 통해 마감일 기반의 시각적 일정 관리가 가능해지며, 주간/일별 TODO를 한눈에 파악할 수 있다.

---

## Architecture Decisions

| Decision | Rationale | Trade-offs |
| --- | --- | --- |
| 커스텀 캘린더 구현 (라이브러리 미사용) | 디자인 토큰과 완벽히 통합, 외부 의존성 최소화 | 직접 구현 비용, 복잡한 달력 로직 |
| useTodosByMonth 훅으로 월 단위 조회 | 탭 전환 시 한 번에 월간 데이터 로드, 날짜 선택 시 클라이언트 필터 | 데이터가 많을 경우 초기 로딩 지연 |
| Zustand에 캘린더 상태 관리 | 앱 전역에서 탭/날짜 상태 공유, 기존 uiStore 패턴 일관성 | store 크기 증가 |
| TodayView/Header 추출 후 탭 전환 | 기존 코드 최소 변경으로 탭 구조 도입 | HomePage props 증가 |

---

## Dependencies

### Required Before Starting

- [ ] **Plan A + Plan B 완료**: 디자인 토큰, priority/dueDate 데이터, 모달, TodoItem 변경 모두 완료
- [ ] 앱이 모달로 TODO 추가/수정 가능한 상태

### External Dependencies

- 신규 패키지 없음 (기존 의존성만 사용)

---

## Test Strategy

### Testing Approach

**TDD Principle**: Write tests FIRST, then implement to make them pass

### Test Pyramid for This Feature

| Test Type | Coverage Target | Purpose |
| --- | --- | --- |
| **Unit Tests** | ≥90% | calendar 유틸리티 (generateCalendarDays, getWeekRange 등) |
| **Integration Tests** | Critical paths | CalendarView 렌더링, 월 이동, 날짜 선택 |
| **E2E Tests** | Key user flows | 탭 전환, 달력 날짜 클릭 → TODO 표시 |

### Test File Organization

```
tests/
├── unit/
│   ├── shared/utils/calendar.test.ts          (신규)
│   ├── components/navigation/BottomTabBar.test.tsx (신규)
│   └── stores/uiStore.test.ts                 (캘린더 상태 추가)
├── integration/
│   ├── components/views/TodayView.test.tsx     (신규)
│   └── components/calendar/CalendarView.test.tsx (신규)
└── e2e/
    └── calendar-view.spec.ts                  (신규)
```

### Coverage Requirements by Phase

- **Phase 6 (탭 바)**: BottomTabBar ≥80%, TodayView 통합 테스트
- **Phase 7 (캘린더)**: calendar 유틸리티 ≥90%, CalendarView 통합 테스트

---

## Implementation Phases

### Phase 6: 하단 탭 바 + TodayView 추출

**Goal**: BottomTabBar 추가, 기존 필터+리스트를 TodayView로 추출, Header 컴포넌트 추출, 탭 전환 구조 구축
**Estimated Time**: 3 hours
**Status**: ⏳ Pending

#### Tasks

**RED: Write Failing Tests First**

- [ ] **Test 6.1**: uiStore 캘린더 상태 테스트
  - File(s): `tests/unit/stores/uiStore.test.ts`
  - Expected: Tests FAIL — activeTab, selectedCalendarDate, calendarMonth 미존재
  - Details:
    - `setActiveTab("calendar")` → activeTab 변경
    - `setSelectedCalendarDate(date)` → selectedCalendarDate 변경
    - `navigateCalendarMonth("next")` → 다음 달로 이동
    - `navigateCalendarMonth("prev")` → 이전 달로 이동
    - 초기값: activeTab="today", selectedCalendarDate=null

- [ ] **Test 6.2**: BottomTabBar 단위 테스트
  - File(s): `tests/unit/components/navigation/BottomTabBar.test.tsx`
  - Expected: Tests FAIL — BottomTabBar 컴포넌트 미존재
  - Details:
    - 2개 탭 렌더링 (오늘, 달력)
    - 활성 탭 스타일 (text-accent-primary)
    - 탭 클릭 시 onTabChange 호출
    - aria-current="page" 속성

- [ ] **Test 6.3**: TodayView 통합 테스트
  - File(s): `tests/integration/components/views/TodayView.test.tsx`
  - Expected: Tests FAIL — TodayView 컴포넌트 미존재
  - Details:
    - StatusFilter + CategoryFilter + TodoList 렌더링
    - isLoading=true 시 로딩 표시
    - todos 목록 렌더링
    - emptyMessage 표시

**GREEN: Implement to Make Tests Pass**

- [ ] **Task 6.4**: uiStore 확장 — 탭 + 캘린더 상태
  - File(s): `src/presentation/stores/uiStore.ts`
  - Goal: Test 6.1 통과
  - Details:
    - `ActiveTab` 타입: `"today" | "calendar"`
    - UIState 추가: `activeTab`, `selectedCalendarDate`, `calendarMonth`
    - UIActions 추가: `setActiveTab`, `setSelectedCalendarDate`, `navigateCalendarMonth`
    - 셀렉터 추가: `useActiveTab`, `useSelectedCalendarDate`, `useCalendarMonth`

- [ ] **Task 6.5**: BottomTabBar 구현
  - File(s): `src/presentation/components/navigation/BottomTabBar.tsx` (신규)
  - Goal: Test 6.2 통과
  - Details:
    - Props: `activeTab: ActiveTab`, `onTabChange: (tab) => void`
    - 탭: CheckSquare+오늘, Calendar+달력
    - fixed bottom, bg-bg-surface, border-t border-border-subtle, z-50
    - 활성: text-accent-primary font-semibold, 비활성: text-txt-tertiary

- [ ] **Task 6.6**: TodayView 추출
  - File(s): `src/presentation/components/views/TodayView.tsx` (신규)
  - Goal: Test 6.3 통과
  - Details:
    - 기존 HomePage에서 StatusFilter + CategoryFilter + TodoList 섹션을 추출
    - Props: todos, categories, isLoading, statusFilter, categoryFilter, 콜백들, emptyMessage

- [ ] **Task 6.7**: Header 컴포넌트 추출
  - File(s): `src/presentation/components/common/Header.tsx` (신규)
  - Goal: 양쪽 탭에서 공통 헤더 사용
  - Details:
    - Props: `onAddClick: () => void`
    - CheckSquare 아이콘 + "TODO" 타이틀 + Plus 버튼

- [ ] **Task 6.8**: HomePage 리팩터링
  - File(s): `src/presentation/pages/HomePage.tsx`
  - Goal: 인라인 코드를 Header/TodayView로 교체, 탭 전환 + BottomTabBar 추가
  - Details:
    - Header + 탭 조건부 렌더링 (today → TodayView, calendar → CalendarView placeholder)
    - BottomTabBar 하단 고정
    - `pb-20` 하단 여백 (탭 바 높이)
    - CalendarView는 Phase 7에서 구현, 여기서는 placeholder

**REFACTOR: Clean Up Code**

- [ ] **Task 6.9**: 리팩터링
  - Files: 이 Phase에서 변경/생성한 모든 파일
  - Goal: 코드 품질 개선, 테스트 통과 유지
  - Checklist:
    - [ ] HomePage에서 추출된 코드가 완전히 제거되었는지 확인
    - [ ] TodayView props가 과도하지 않은지 검토
    - [ ] BottomTabBar 접근성 확인 (nav role)
    - [ ] 탭 전환 시 상태 유지 확인

**🔍 CODE REVIEW: `/frontend-code-review` 실행 및 이슈 해결**

- [ ] **Review 6.10**: `/frontend-code-review` 실행
  - 대상 경로:
    - `src/presentation/components/navigation/BottomTabBar.tsx`
    - `src/presentation/components/views/TodayView.tsx`
    - `src/presentation/components/common/Header.tsx`
    - `src/presentation/stores/uiStore.ts`
    - `src/presentation/pages/HomePage.tsx`
  - 실행:
    - `/frontend-code-review src/presentation/components/navigation/BottomTabBar.tsx`
    - `/frontend-code-review src/presentation/components/views/TodayView.tsx`
    - `/frontend-code-review src/presentation/components/common/Header.tsx`
    - `/frontend-code-review src/presentation/pages/HomePage.tsx`
  - Details:
    - 리뷰 결과에서 발견된 이슈를 아래 체크리스트에 기록
    - 각 이슈를 수정하고 테스트 재실행으로 회귀 없음 확인

- [ ] **Review 6.10.1**: 가독성(Readability) 이슈 수정
  - 발견된 이슈: (리뷰 후 기록)
  - 수정 내용: (수정 후 기록)

- [ ] **Review 6.10.2**: 예측 가능성(Predictability) 이슈 수정
  - 발견된 이슈: (리뷰 후 기록)
  - 수정 내용: (수정 후 기록)

- [ ] **Review 6.10.3**: 응집도(Cohesion) 이슈 수정
  - 발견된 이슈: (리뷰 후 기록)
  - 수정 내용: (수정 후 기록)

- [ ] **Review 6.10.4**: 결합도(Coupling) 이슈 수정
  - 발견된 이슈: (리뷰 후 기록)
  - 수정 내용: (수정 후 기록)

- [ ] **Review 6.10.5**: 수정 후 테스트 재실행 통과 확인
  - `pnpm run test:run` → 100% PASS
  - `pnpm run build` → 에러 없음

#### Quality Gate

**STOP: Do NOT proceed to Phase 7 until ALL checks pass**

**TDD Compliance** (CRITICAL):

- [ ] **Red Phase**: Tests were written FIRST and initially failed
- [ ] **Green Phase**: Production code written to make tests pass
- [ ] **Refactor Phase**: Code improved while tests still pass
- [ ] **Coverage Check**: BottomTabBar ≥80%

**Build & Tests**:

- [ ] **Build**: `pnpm run build` 에러 없음
- [ ] **All Tests Pass**: `pnpm run test:run` 100% 통과
- [ ] **Test Performance**: 전체 테스트 5분 이내
- [ ] **No Flaky Tests**: 3회 반복 일관성

**Code Quality**:

- [ ] **Linting**: `pnpm run lint` 에러 없음
- [ ] **Type Safety**: TypeScript 컴파일 에러 없음

**Frontend Code Review** (프론트엔드 Phase 필수):

- [ ] `/frontend-code-review src/presentation/components/navigation/BottomTabBar.tsx` 실행
- [ ] `/frontend-code-review src/presentation/components/views/TodayView.tsx` 실행
- [ ] `/frontend-code-review src/presentation/components/common/Header.tsx` 실행
- [ ] `/frontend-code-review src/presentation/pages/HomePage.tsx` 실행
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

/frontend-code-review src/presentation/components/navigation/BottomTabBar.tsx
/frontend-code-review src/presentation/components/views/TodayView.tsx
/frontend-code-review src/presentation/components/common/Header.tsx
/frontend-code-review src/presentation/pages/HomePage.tsx
```

**Manual Test Checklist**:

- [ ] 하단 탭 바 2개 탭 표시 (오늘, 달력)
- [ ] "오늘" 탭 → 기존 TODO 리스트 + 필터 정상 동작
- [ ] "달력" 탭 → placeholder 표시 (Phase 7에서 구현)
- [ ] 탭 전환 시 기존 필터 상태 유지
- [ ] (+) 버튼으로 TODO 추가 정상 동작
- [ ] 하단 탭 바가 스크롤 시에도 고정

---

### Phase 7: CalendarView 구현

**Goal**: 월별 캘린더 그리드 + 날짜별 TODO 목록 + 이번 주 TODO 섹션
**Estimated Time**: 4 hours
**Status**: ⏳ Pending

#### Tasks

**RED: Write Failing Tests First**

- [ ] **Test 7.1**: calendar 유틸리티 단위 테스트
  - File(s): `tests/unit/shared/utils/calendar.test.ts` (신규)
  - Expected: Tests FAIL — calendar.ts 파일 미존재
  - Details:
    - `generateCalendarDays`:
      - 2026년 2월 → 정확한 주 수, 첫 주 일요일 시작
      - isCurrentMonth: 이전/다음 달 날짜 false
      - isToday: 오늘 날짜만 true
      - hasTodos: todoDateSet에 포함된 날짜만 true
    - `getWeekRange`:
      - 주어진 날짜 → 해당 주 일요일~토요일 반환
      - 월 경계 걸친 주 처리
    - `getMonthRange`:
      - 주어진 날짜 → 해당 월 1일~말일 반환
      - 2월(28/29일), 4월(30일), 12월(31일) 경계값
    - `toDateString`:
      - Date → "YYYY-MM-DD" 형식

- [ ] **Test 7.2**: useTodosByMonth 훅 테스트
  - File(s): `tests/unit/hooks/useTodosByMonth.test.ts`
  - Expected: Tests FAIL — useTodosByMonth 훅 미존재
  - Details:
    - 올바른 queryKey 생성
    - getMonthRange 기반 dueDateRange 필터 전달
    - 월 변경 시 데이터 재조회

- [ ] **Test 7.3**: CalendarView 통합 테스트
  - File(s): `tests/integration/components/calendar/CalendarView.test.tsx`
  - Expected: Tests FAIL — CalendarView 컴포넌트 미존재
  - Details:
    - 월 네비게이션 (이전/다음) 동작
    - 요일 헤더 (일~토) 표시
    - 캘린더 그리드 렌더링
    - 오늘 날짜 강조 스타일
    - 날짜 클릭 → 선택 상태
    - 선택 날짜의 TODO 목록 표시
    - "이번 주 TODO" 섹션 표시

**GREEN: Implement to Make Tests Pass**

- [ ] **Task 7.4**: calendar 유틸리티 구현
  - File(s): `src/shared/utils/calendar.ts` (신규)
  - Goal: Test 7.1 통과
  - Details:
    - `CalendarDay` 인터페이스: date, isCurrentMonth, isToday, hasTodos
    - `generateCalendarDays(year, month, todoDateSet)`: 7열 × 4~6주 2차원 배열
    - `getWeekRange(date)`: 해당 주 일~토 범위
    - `getMonthRange(date)`: 해당 월 1일~말일 범위
    - `toDateString(date)`: "YYYY-MM-DD" 변환

- [ ] **Task 7.5**: useTodosByMonth 훅 구현
  - File(s): `src/presentation/hooks/useTodosByMonth.ts` (신규)
  - Goal: Test 7.2 통과
  - Details:
    - `useTodosByMonth(repository, month)`: React Query로 월별 TODO 조회
    - queryKey: `["todos", "month", year, month]`
    - getMonthRange 기반 dueDateRange 필터

- [ ] **Task 7.6**: CalendarView 구현
  - File(s): `src/presentation/components/calendar/CalendarView.tsx` (신규)
  - Goal: Test 7.3 통과
  - Details:
    - Props: container, categories, onToggleComplete, onDelete, onEdit
    - 내부 로직:
      - useTodosByMonth로 월간 TODO 데이터 조회
      - todoDateSet (Set<string>) 생성 — TODO가 있는 날짜
      - generateCalendarDays로 캘린더 그리드 생성
      - selectedDateTodos — 선택 날짜의 TODO 필터
      - thisWeekTodos — 이번 주 TODO 필터
    - 렌더링 구조:
      - **월 네비게이션**: ← 2026년 2월 → (ChevronLeft/Right)
      - **요일 헤더**: 일 월 화 수 목 금 토
      - **캘린더 그리드**: 날짜 셀 + dot (TODO 있는 날짜)
        - 오늘: bg-accent-primary text-white font-bold
        - 선택: bg-accent-light text-accent-primary font-semibold
        - 이번 달: text-txt-primary
        - 다른 달: text-txt-tertiary
      - **선택 날짜 섹션**: formatKoreanDate(selectedDate) + TodoList
      - **이번 주 TODO 섹션**: TodoList 재사용

- [ ] **Task 7.7**: HomePage에 CalendarView 연결
  - File(s): `src/presentation/pages/HomePage.tsx`
  - Goal: Phase 6의 CalendarView placeholder를 실제 컴포넌트로 교체
  - Details:
    - CalendarView import + 렌더링
    - container, categories, 콜백 props 전달

**REFACTOR: Clean Up Code**

- [ ] **Task 7.8**: 리팩터링
  - Files: 이 Phase에서 변경/생성한 모든 파일
  - Goal: 코드 품질 개선, 테스트 통과 유지
  - Checklist:
    - [ ] CalendarView 내부 컴포넌트 분리 검토 (MonthNav, CalendarGrid 등)
    - [ ] useMemo 의존성 정확성 확인
    - [ ] 캘린더 그리드 키 유니크성 확인
    - [ ] 접근성: 날짜 셀 aria-label, 키보드 네비게이션

**🔍 CODE REVIEW: `/frontend-code-review` 실행 및 이슈 해결**

- [ ] **Review 7.9**: `/frontend-code-review` 실행
  - 대상 경로:
    - `src/shared/utils/calendar.ts`
    - `src/presentation/hooks/useTodosByMonth.ts`
    - `src/presentation/components/calendar/CalendarView.tsx`
    - `src/presentation/pages/HomePage.tsx`
  - 실행:
    - `/frontend-code-review src/shared/utils/calendar.ts`
    - `/frontend-code-review src/presentation/hooks/useTodosByMonth.ts`
    - `/frontend-code-review src/presentation/components/calendar/CalendarView.tsx`
    - `/frontend-code-review src/presentation/pages/HomePage.tsx`
  - Details:
    - 리뷰 결과에서 발견된 이슈를 아래 체크리스트에 기록
    - 각 이슈를 수정하고 테스트 재실행으로 회귀 없음 확인

- [ ] **Review 7.9.1**: 가독성(Readability) 이슈 수정
  - 발견된 이슈: (리뷰 후 기록)
  - 수정 내용: (수정 후 기록)

- [ ] **Review 7.9.2**: 예측 가능성(Predictability) 이슈 수정
  - 발견된 이슈: (리뷰 후 기록)
  - 수정 내용: (수정 후 기록)

- [ ] **Review 7.9.3**: 응집도(Cohesion) 이슈 수정
  - 발견된 이슈: (리뷰 후 기록)
  - 수정 내용: (수정 후 기록)

- [ ] **Review 7.9.4**: 결합도(Coupling) 이슈 수정
  - 발견된 이슈: (리뷰 후 기록)
  - 수정 내용: (수정 후 기록)

- [ ] **Review 7.9.5**: 수정 후 테스트 재실행 통과 확인
  - `pnpm run test:run` → 100% PASS
  - `pnpm run build` → 에러 없음

#### Quality Gate

**STOP: Do NOT proceed until ALL checks pass**

**TDD Compliance** (CRITICAL):

- [ ] **Red Phase**: Tests were written FIRST and initially failed
- [ ] **Green Phase**: Production code written to make tests pass
- [ ] **Refactor Phase**: Code improved while tests still pass
- [ ] **Coverage Check**: calendar 유틸리티 ≥90%, CalendarView 통합 테스트

**Build & Tests**:

- [ ] **Build**: `pnpm run build` 에러 없음
- [ ] **All Tests Pass**: `pnpm run test:run` 100% 통과
- [ ] **Test Performance**: 전체 테스트 5분 이내
- [ ] **No Flaky Tests**: 3회 반복 일관성

**Code Quality**:

- [ ] **Linting**: `pnpm run lint` 에러 없음
- [ ] **Type Safety**: TypeScript 컴파일 에러 없음

**Security & Performance**:

- [ ] **Performance**: 월 이동 시 캘린더 렌더링 부드러움
- [ ] **Memory**: useMemo로 불필요한 재계산 방지
- [ ] **Network**: 월 이동 시 API 호출 횟수 적정 (React Query 캐싱)

**Frontend Code Review** (프론트엔드 Phase 필수):

- [ ] `/frontend-code-review src/shared/utils/calendar.ts` 실행
- [ ] `/frontend-code-review src/presentation/hooks/useTodosByMonth.ts` 실행
- [ ] `/frontend-code-review src/presentation/components/calendar/CalendarView.tsx` 실행
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

/frontend-code-review src/shared/utils/calendar.ts
/frontend-code-review src/presentation/hooks/useTodosByMonth.ts
/frontend-code-review src/presentation/components/calendar/CalendarView.tsx
```

**Manual Test Checklist**:

- [ ] 달력 탭 → 현재 월 캘린더 그리드 표시
- [ ] 오늘 날짜 강조 (accent-primary 배경 + 흰색 텍스트)
- [ ] TODO가 있는 날짜에 dot 표시
- [ ] ← → 버튼으로 이전/다음 월 이동
- [ ] 날짜 클릭 → 해당 날짜 TODO 목록 표시
- [ ] "이번 주 TODO" 섹션 표시
- [ ] TODO 없는 날짜 클릭 → "이 날짜에 등록된 TODO가 없습니다" 표시
- [ ] 다양한 월(2월 28일, 4월 30일 등) 그리드 정상 생성
- [ ] 월 이동 후 돌아오면 캐시된 데이터 즉시 표시

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation Strategy |
| --- | --- | --- | --- |
| 캘린더 그리드 경계값 버그 (월초/월말) | Medium | Medium | 다양한 월(2월, 4월, 12월) 단위 테스트 |
| 월 이동 시 데이터 재조회 성능 | Low | Medium | React Query 캐싱으로 이전 월 데이터 유지 |
| TodayView 추출 시 기존 기능 회귀 | Medium | High | 기존 HomePage 동작을 통합 테스트로 먼저 보장 |
| BottomTabBar fixed 포지셔닝 모바일 이슈 | Low | Medium | safe-area-inset 대응, 실기기 테스트 |
| useTodosByMonth의 날짜 타임존 이슈 | Medium | Medium | toISOString().split("T")[0] 일관 사용 |

---

## Rollback Strategy

### If Phase 6 Fails

**Steps to revert**:

- HomePage.tsx 복원: `git checkout -- src/presentation/pages/HomePage.tsx`
- uiStore.ts 복원: `git checkout -- src/presentation/stores/uiStore.ts`
- 신규 파일 삭제: BottomTabBar.tsx, TodayView.tsx, Header.tsx

### If Phase 7 Fails

**Steps to revert**:

- Restore to Phase 6 complete state
- HomePage.tsx에서 CalendarView 연결 제거, placeholder 복원
- 신규 파일 삭제: calendar.ts, useTodosByMonth.ts, CalendarView.tsx

---

## Progress Tracking

### Completion Status

- **Phase 6**: ⏳ 0%
- **Phase 7**: ⏳ 0%

**Overall Progress**: 0% complete

### Time Tracking

| Phase | Estimated | Actual | Variance |
| --- | --- | --- | --- |
| Phase 6 | 3 hours | - | - |
| Phase 7 | 4 hours | - | - |
| **Total** | 7 hours | - | - |

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

- [React Query - useQuery](https://tanstack.com/query/latest/docs/react/reference/useQuery)
- [Zustand](https://github.com/pmndrs/zustand)
- [lucide-react Icons](https://lucide.dev/icons/)

### Related Plans

- Plan A: `docs/plans/PLAN_todo-v2-foundation.md` (선행 — 디자인 토큰 + 데이터 모델)
- Plan B: `docs/plans/PLAN_todo-v2-core-ui.md` (선행 — 핵심 UI)

---

## File Change Summary

### Modified Files

| File | Phase | Changes |
| --- | --- | --- |
| `src/presentation/stores/uiStore.ts` | 6 | activeTab, selectedCalendarDate, calendarMonth + 액션 |
| `src/presentation/pages/HomePage.tsx` | 6, 7 | Header/TodayView 추출, 탭 전환, BottomTabBar, CalendarView 연결 |

### New Files

| File | Phase | Description |
| --- | --- | --- |
| `src/presentation/components/navigation/BottomTabBar.tsx` | 6 | 하단 탭 바 |
| `src/presentation/components/views/TodayView.tsx` | 6 | 기존 필터+리스트 추출 |
| `src/presentation/components/common/Header.tsx` | 6 | 공통 헤더 추출 |
| `src/shared/utils/calendar.ts` | 7 | 캘린더 유틸리티 |
| `src/presentation/hooks/useTodosByMonth.ts` | 7 | 월별 TODO 훅 |
| `src/presentation/components/calendar/CalendarView.tsx` | 7 | 달력 뷰 |

### Deleted Files

없음.

---

## Final Component Tree (전체 플랜 완료 후)

```
App.tsx
└── QueryProvider
    └── HomePage
        ├── Header (체크 아이콘 + "TODO" + "+" 버튼)
        │
        ├── [activeTab === "today"]
        │   └── TodayView
        │       ├── StatusFilter
        │       ├── CategoryFilter
        │       └── TodoList
        │           └── TodoItem[] (Checkbox + Title + DateBadge + Badge + Stars + Edit/Delete)
        │
        ├── [activeTab === "calendar"]
        │   └── CalendarView
        │       ├── MonthNavigation (← 2026년 2월 →)
        │       ├── CalendarGrid (7×5 날짜 셀 + dot)
        │       ├── SelectedDateSection (TodoList 재사용)
        │       └── ThisWeekSection (TodoList 재사용)
        │
        ├── BottomTabBar (오늘 / 달력)
        │
        ├── TodoAddModal (Drawer + 폼: 제목/카테고리/중요도/날짜)
        └── TodoEditModal (Drawer + 폼: 기존 값 프리필)
```

---

## Final Checklist

**Before marking plan as COMPLETE**:

- [ ] All phases completed with quality gates passed
- [ ] Full integration testing performed
- [ ] 캘린더 다양한 월 경계값 테스트 (2월, 4월, 12월)
- [ ] 탭 전환 시 상태 유지/초기화 동작 확인
- [ ] 모바일 뷰포트에서 레이아웃 확인 (375px)
- [ ] 기존 기능 회귀 테스트 통과
- [ ] Plan document archived for future reference

**Frontend Code Review Final Check** (프론트엔드 프로젝트 필수):

- [ ] `/frontend-code-review src/presentation/` 전체 코드 최종 리뷰 완료
- [ ] 모든 가독성 이슈 해결
- [ ] 모든 예측 가능성 이슈 해결
- [ ] 모든 응집도 이슈 해결
- [ ] 모든 결합도 이슈 해결
- [ ] 코드 리뷰 학습 내용 Notes에 기록

---

**Plan Status**: ⏳ Pending
**Next Action**: Plan A + Plan B 완료 대기
**Blocked By**: Plan B (PLAN_todo-v2-core-ui.md)
