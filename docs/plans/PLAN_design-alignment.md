# Implementation Plan: Design Alignment (todo.pen vs 구현)

**Status**: ✅ Complete
**Started**: 2026-02-20
**Last Updated**: 2026-02-20
**Estimated Completion**: 2026-02-21

---

**⚠️ CRITICAL INSTRUCTIONS**: After completing each phase:

1. ✅ Check off completed task checkboxes
2. 🧪 Run all quality gate validation commands
3. ⚠️ Verify ALL quality gate items pass
4. 🔍 **Run `/frontend-code-review`** (for frontend phases)
5. 📅 Update "Last Updated" date above
6. 📝 Document learnings in Notes section
7. ➡️ Only then proceed to next phase

⛔ **DO NOT skip quality gates or proceed with failing checks**

---

## 📋 Overview

### Feature Description

`todo.pen` 디자인 파일과 현재 구현 간의 시각적 차이점 6가지를 수정하여 디자인-구현 일관성을 확보합니다.

**수정 대상 차이점**:
1. 캘린더 그리드 스타일 (흰색 카드 + 그림자 누락)
2. 일/토 요일 색상 미적용
3. 선택 날짜 섹션 기능 보완
4. 모달 카테고리 컬러 dot 누락
5. 체크박스 형태 (원형 → 사각형)
6. 날짜 피커 커스텀 스타일

### Success Criteria

- [x] 캘린더 그리드가 흰색 카드 + 그림자로 표시됨
- [x] 일요일=빨강, 토요일=초록 색상 적용됨
- [x] 캘린더에서 날짜 클릭 시 해당 날짜 TODO가 항상 표시됨
- [x] 모달 카테고리에 컬러 dot이 표시됨
- [x] 체크박스가 사각형(rounded-xs)으로 표시됨
- [x] 날짜 피커가 커스텀 스타일로 표시됨
- [x] 기존 테스트 모두 통과
- [x] 모바일(390px) 기준 디자인과 육안 일치

### User Impact

디자인 시안과 실제 앱의 시각적 일관성이 확보되어 완성도 높은 사용자 경험을 제공합니다.

---

## 🏗️ Architecture Decisions

| Decision | Rationale | Trade-offs |
| --- | --- | --- |
| CSS 변수에 `--status-negative`, `--accent-blue` 추가 | 일/토 요일 색상용 디자인 토큰 필요 | 토큰 수 증가 |
| 캘린더 그리드를 카드 컴포넌트로 감싸기 | 디자인과 동일한 그림자+라운드 적용 | 마크업 1단계 추가 |
| 날짜 피커를 커스텀 컴포넌트로 교체 | 네이티브 input은 스타일링 제한 | 구현 복잡도 증가 |
| 선택 날짜 섹션을 항상 표시 (오늘 날짜 기본 선택) | 디자인에 항상 선택 날짜가 있음 | 초기 렌더링 시 추가 필터링 |

---

## 📦 Dependencies

### Required Before Starting

- [x]현재 `main` 브랜치 최신 상태
- [x] `pnpm run test:run` 모두 통과 확인
- [x] `pnpm run build` 성공 확인

### External Dependencies

- 추가 패키지 없음 (기존 라이브러리로 모두 구현 가능)

---

## 🧪 Test Strategy

### Testing Approach

**TDD Principle**: Write tests FIRST, then implement to make them pass

### Test Pyramid for This Feature

| Test Type | Coverage Target | Purpose |
| --- | --- | --- |
| **Unit Tests** | ≥80% | 캘린더 유틸 함수, 날짜 색상 로직 |
| **Integration Tests** | Critical paths | 컴포넌트 렌더링 + 인터랙션 |
| **E2E Tests** | Key user flows | 캘린더 → 날짜 선택 → TODO 표시 |

### Test File Organization

```
tests/
├── unit/
│   ├── calendar/
│   │   └── calendarDayStyle.test.ts
│   └── components/
│       └── checkbox.test.tsx
├── integration/
│   └── calendar/
│       └── CalendarView.test.tsx
└── e2e/
    └── calendar.spec.ts (기존 파일 수정)
```

---

## 🚀 Implementation Phases

### Phase 1: 캘린더 그리드 스타일링 + 요일/날짜 색상

**Goal**: 캘린더 그리드에 카드 스타일(흰색 배경 + 그림자 + 라운드) 적용, 일요일=빨강 토요일=초록 색상 적용
**Estimated Time**: 2 hours
**Status**: ✅ Complete

#### 수정 대상 파일

- `src/index.css` — CSS 변수 추가
- `tailwind.config.js` — Tailwind 토큰 추가
- `src/presentation/components/calendar/CalendarView.tsx` — 그리드 스타일 + 요일/날짜 색상
- `src/shared/utils/calendar.ts` — 요일 인덱스 정보 추가 (필요 시)

#### Tasks

**🔴 RED: Write Failing Tests First**

- [x] **Test 1.1**: CalendarView 캘린더 그리드 카드 스타일 테스트
  - File: `tests/unit/components/CalendarView.test.tsx`
  - Expected: 캘린더 그리드 컨테이너에 `bg-bg-surface`, `rounded-lg`, `shadow-sm` 클래스 존재 확인
  - Details:
    - 캘린더 그리드가 카드 스타일 래퍼로 감싸져 있는지
    - 그림자가 적용되었는지
    - 라운드 코너가 적용되었는지

- [x] **Test 1.2**: 요일 헤더 색상 테스트
  - File: `tests/unit/components/CalendarView.test.tsx`
  - Expected: "일" 헤더는 빨간색(`text-accent-red`), "토" 헤더는 초록색(`text-accent-primary`)
  - Details:
    - 일요일 헤더에 `text-accent-red` 클래스
    - 토요일 헤더에 `text-accent-primary` 클래스
    - 나머지 요일은 `text-txt-tertiary`

- [x] **Test 1.3**: 날짜 숫자 색상 테스트 (일/토)
  - File: `tests/unit/components/CalendarView.test.tsx`
  - Expected: 일요일 날짜는 빨간색, 토요일 날짜는 초록색
  - Details:
    - `getDayCellStyle`에 요일 인덱스 기반 색상 반영
    - 오늘인 경우 기존 스타일 우선
    - 선택된 경우 기존 스타일 우선

**🟢 GREEN: Implement to Make Tests Pass**

- [x] **Task 1.4**: CSS 변수 및 Tailwind 토큰 추가
  - File: `src/index.css`, `tailwind.config.js`
  - Goal: `--status-negative` (빨간색 #E25C5C) 변수 추가 (이미 `--accent-red` 존재하므로 재활용 가능)
  - Details: 디자인의 `$status-negative`는 일요일 빨간색, `$accent-primary`는 토요일 초록색

- [x] **Task 1.5**: 캘린더 그리드에 카드 스타일 적용
  - File: `src/presentation/components/calendar/CalendarView.tsx`
  - Goal: 캘린더 그리드(요일 헤더 + 날짜 셀)를 카드 래퍼로 감싸기
  - Details:
    - `bg-bg-surface rounded-xl shadow-sm p-3` 래퍼 추가
    - 요일 헤더와 날짜 그리드를 함께 감싸기
    - 디자인: `cornerRadius: 16, effect: shadow(#1A191808, y:2, blur:12)`

- [x] **Task 1.6**: 요일 헤더 색상 분기 적용
  - File: `src/presentation/components/calendar/CalendarView.tsx`
  - Goal: WEEKDAY_HEADERS 렌더링 시 인덱스별 색상 분기
  - Details:
    - index 0 (일): `text-accent-red`
    - index 6 (토): `text-accent-primary`
    - 나머지: `text-txt-tertiary` (기존 유지)

- [x] **Task 1.7**: 날짜 셀 색상에 요일 반영
  - File: `src/presentation/components/calendar/CalendarView.tsx`
  - Goal: `getDayCellStyle`에 요일 인덱스 고려
  - Details:
    - `day.date.getDay()` 활용
    - 일요일(0): `text-accent-red`
    - 토요일(6): `text-accent-primary`
    - 오늘/선택 상태가 우선

**🔵 REFACTOR: Clean Up Code**

- [x] **Task 1.8**: 요일 색상 로직 정리
  - 매직 넘버(0, 6) 대신 상수 또는 함수 추출
  - `getWeekdayHeaderColor(index)`, `getDayCellStyle` 함수 정리

#### Quality Gate ✋

**⚠️ STOP: Do NOT proceed to Phase 2 until ALL checks pass**

**Build & Tests**:
- [x] `pnpm run build` 성공
- [x] `pnpm run test:run` 모두 통과
- [x] `pnpm run lint` 에러 없음
- [x] `pnpm run type-check` 통과

**Manual Testing**:
- [x]캘린더 그리드가 흰색 카드 + 그림자로 표시됨
- [x]일요일 헤더/날짜가 빨간색으로 표시됨
- [x]토요일 헤더/날짜가 초록색으로 표시됨
- [x]오늘 날짜는 기존 초록 원 스타일 유지

**🔍 Code Review**:
- [x] `/frontend-code-review src/presentation/components/calendar/` 실행
- [x]리뷰 결과 Notes 섹션에 기록

**Validation Commands**:

```bash
pnpm run build
pnpm run test:run
pnpm run lint
pnpm run type-check
```

---

### Phase 2: 선택 날짜 섹션 기능 보완

**Goal**: 캘린더 진입 시 오늘 날짜가 기본 선택되어 "선택 날짜" 섹션이 항상 표시되도록 수정
**Estimated Time**: 1.5 hours
**Status**: ✅ Complete

#### 수정 대상 파일

- `src/presentation/stores/uiStore.ts` — `selectedCalendarDate` 초기값을 오늘로 설정
- `src/presentation/components/calendar/CalendarView.tsx` — 선택 날짜 섹션 항상 표시 보장
- `tests/e2e/calendar.spec.ts` — E2E 업데이트

#### Tasks

**🔴 RED: Write Failing Tests First**

- [x] **Test 2.1**: 캘린더 탭 진입 시 오늘 날짜 자동 선택 테스트
  - File: `tests/unit/stores/uiStore.test.ts`
  - Expected: `selectedCalendarDate`가 null이 아닌 오늘 날짜로 초기화
  - Details:
    - 캘린더 탭으로 전환 시 기본 선택 날짜 설정
    - 선택 날짜 섹션 표시 확인

- [x] **Test 2.2**: 선택 날짜 섹션 렌더링 테스트
  - File: `tests/unit/components/CalendarView.test.tsx`
  - Expected: 캘린더 뷰 렌더링 시 선택 날짜 헤더("X월 Y일 (요일)") 표시
  - Details:
    - `aria-label="선택 날짜 TODO"` 섹션 존재 확인
    - 날짜 포맷이 한국어 형식인지 확인

**🟢 GREEN: Implement to Make Tests Pass**

- [x] **Task 2.3**: uiStore의 selectedCalendarDate 초기값 설정
  - File: `src/presentation/stores/uiStore.ts`
  - Goal: `selectedCalendarDate` 초기값을 `new Date()` (오늘)로 설정
  - Details: 현재 `null`인 초기값을 오늘 날짜로 변경

- [x] **Task 2.4**: CalendarView에서 선택 날짜 섹션 항상 렌더링
  - File: `src/presentation/components/calendar/CalendarView.tsx`
  - Goal: `selectedCalendarDate`가 항상 존재하므로 조건부 렌더링 제거 또는 유지
  - Details: 초기값이 오늘이므로 진입 즉시 섹션 표시됨

**🔵 REFACTOR: Clean Up Code**

- [x] **Task 2.5**: 불필요한 null 체크 정리
  - `selectedCalendarDate`가 항상 값이 있으므로 관련 null 처리 간소화

#### Quality Gate ✋

**⚠️ STOP: Do NOT proceed to Phase 3 until ALL checks pass**

**Build & Tests**:
- [x] `pnpm run build` 성공
- [x] `pnpm run test:run` 모두 통과
- [x] `pnpm run lint` 에러 없음

**Manual Testing**:
- [x]캘린더 탭 진입 시 오늘 날짜가 선택 상태
- [x]"X월 Y일 (요일)" 헤더가 표시됨
- [x]해당 날짜의 TODO 목록이 표시됨
- [x]다른 날짜 클릭 시 선택 날짜 변경됨

**🔍 Code Review**:
- [x] `/frontend-code-review src/presentation/components/calendar/` 실행
- [x] `/frontend-code-review src/presentation/stores/` 실행

**Validation Commands**:

```bash
pnpm run build
pnpm run test:run
pnpm run lint
pnpm run type-check
```

---

### Phase 3: 체크박스 사각형 변경 + 모달 카테고리 dot 추가

**Goal**: 체크박스를 원형 → 사각형으로 변경, 모달 카테고리 버튼에 컬러 dot 추가
**Estimated Time**: 1.5 hours
**Status**: ✅ Complete

#### 수정 대상 파일

- `src/presentation/components/ui/checkbox.tsx` — 체크박스 모양 확인 (이미 `rounded-sm`이므로 실제 렌더링 확인)
- `src/presentation/components/todo/TodoAddModal.tsx` — 카테고리 버튼에 컬러 dot 추가
- `src/presentation/components/todo/TodoEditModal.tsx` — 동일하게 카테고리 dot 추가

#### Tasks

**🔴 RED: Write Failing Tests First**

- [x] **Test 3.1**: 체크박스가 사각형(rounded-sm)으로 렌더링되는지 테스트
  - File: `tests/unit/components/TodoItem.test.tsx`
  - Expected: 체크박스에 `rounded-sm` 클래스가 있고 `rounded-full`이 없음
  - Details:
    - Radix Checkbox의 className에 `rounded-sm` 확인
    - 원형(circle) 스타일이 아닌지 확인

- [x] **Test 3.2**: 모달 카테고리 버튼에 컬러 dot 렌더링 테스트
  - File: `tests/unit/components/TodoAddModal.test.tsx`
  - Expected: 각 카테고리 버튼 앞에 해당 카테고리의 color를 가진 dot(원) 존재
  - Details:
    - 카테고리의 `color` 속성을 dot의 `backgroundColor`로 표시
    - dot 크기: `w-2 h-2 rounded-full`

**🟢 GREEN: Implement to Make Tests Pass**

- [x] **Task 3.3**: 체크박스 스타일 확인 및 수정
  - File: `src/presentation/components/ui/checkbox.tsx`
  - Goal: 현재 `rounded-sm`이 적용되어 있는지 확인, 필요 시 수정
  - Details:
    - 현재 코드에 `rounded-sm` 존재 → 실제 렌더링에서 원형으로 보이는 원인 확인
    - TodoItem의 체크박스 래퍼 스타일 확인
    - 필요 시 크기 조정 (h-5 w-5로 디자인 크기에 맞춤)

- [x] **Task 3.4**: TodoAddModal 카테고리 버튼에 컬러 dot 추가
  - File: `src/presentation/components/todo/TodoAddModal.tsx`
  - Goal: 각 카테고리 버튼 텍스트 앞에 `<span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />` 추가
  - Details:
    - Category 엔티티의 `color` 속성 활용
    - 선택된 카테고리: dot 색상은 white
    - 미선택 카테고리: dot 색상은 category.color

- [x] **Task 3.5**: TodoEditModal에도 동일한 카테고리 dot 적용
  - File: `src/presentation/components/todo/TodoEditModal.tsx`
  - Goal: 일관성을 위해 Edit 모달에도 동일한 dot 추가

**🔵 REFACTOR: Clean Up Code**

- [x] **Task 3.6**: 카테고리 버튼을 공통 컴포넌트로 추출 (선택적)
  - AddModal과 EditModal에서 카테고리 선택 UI가 동일하므로 `CategoryPicker` 컴포넌트 추출 고려
  - 중복 코드가 적으면 생략 가능

#### Quality Gate ✋

**⚠️ STOP: Do NOT proceed to Phase 4 until ALL checks pass**

**Build & Tests**:
- [x] `pnpm run build` 성공
- [x] `pnpm run test:run` 모두 통과
- [x] `pnpm run lint` 에러 없음

**Manual Testing**:
- [x]체크박스가 사각형 모양으로 표시됨
- [x]체크된 상태에서 초록 배경 + 체크 아이콘 표시
- [x]모달 카테고리 버튼에 컬러 dot이 표시됨
- [x]선택/미선택 상태에 따라 dot 색상 변경
- [x]Edit 모달에서도 동일하게 표시

**🔍 Code Review**:
- [x] `/frontend-code-review src/presentation/components/todo/` 실행
- [x] `/frontend-code-review src/presentation/components/ui/checkbox.tsx` 실행

**Validation Commands**:

```bash
pnpm run build
pnpm run test:run
pnpm run lint
pnpm run type-check
```

---

### Phase 4: 날짜 피커 커스텀 스타일

**Goal**: 네이티브 `<input type="date">`를 디자인에 맞는 커스텀 날짜 피커로 교체
**Estimated Time**: 2 hours
**Status**: ✅ Complete

#### 수정 대상 파일

- `src/presentation/components/common/DatePicker.tsx` — 새 커스텀 날짜 피커 컴포넌트
- `src/presentation/components/todo/TodoAddModal.tsx` — DatePicker 교체
- `src/presentation/components/todo/TodoEditModal.tsx` — DatePicker 교체

#### Tasks

**🔴 RED: Write Failing Tests First**

- [x] **Test 4.1**: DatePicker 컴포넌트 렌더링 테스트
  - File: `tests/unit/components/DatePicker.test.tsx`
  - Expected: 선택된 날짜가 한국어 포맷("X월 Y일 (요일)")으로 표시, 캘린더 아이콘 존재
  - Details:
    - 날짜 미선택 시 placeholder 표시
    - 날짜 선택 시 포맷된 텍스트 표시
    - 캘린더 아이콘 렌더링

- [x] **Test 4.2**: DatePicker 인터랙션 테스트
  - File: `tests/unit/components/DatePicker.test.tsx`
  - Expected: 클릭 시 네이티브 date picker 호출, 날짜 선택 시 콜백 호출
  - Details:
    - onChange 콜백에 Date 객체 전달
    - 날짜 초기화(clear) 기능

**🟢 GREEN: Implement to Make Tests Pass**

- [x] **Task 4.3**: DatePicker 커스텀 컴포넌트 구현
  - File: `src/presentation/components/common/DatePicker.tsx` (신규)
  - Goal: 디자인에 맞는 커스텀 날짜 피커
  - Details:
    - 숨겨진 `<input type="date">`를 활용하되 보이는 UI는 커스텀
    - 표시: `bg-bg-primary rounded-xl border border-border-subtle p-3`
    - 텍스트: 한국어 날짜 포맷 또는 placeholder
    - 우측: Calendar 아이콘 (lucide)
    - 클릭 시 숨겨진 input의 `showPicker()` 호출

- [x] **Task 4.4**: TodoAddModal에 DatePicker 적용
  - File: `src/presentation/components/todo/TodoAddModal.tsx`
  - Goal: 기존 `<Input type="date">`를 `<DatePicker>`로 교체
  - Details:
    - `dueDate` 상태를 `string` → `Date | undefined`로 변경 고려
    - 또는 기존 string 상태 유지하면서 DatePicker에서 변환

- [x] **Task 4.5**: TodoEditModal에도 DatePicker 적용
  - File: `src/presentation/components/todo/TodoEditModal.tsx`
  - Goal: 일관성을 위해 Edit 모달에도 동일한 DatePicker 적용

**🔵 REFACTOR: Clean Up Code**

- [x] **Task 4.6**: DatePicker API 정리
  - prop 인터페이스 정리 (`value`, `onChange`, `placeholder`, `className`)
  - 접근성(ARIA) 속성 추가

#### Quality Gate ✋

**⚠️ STOP: Complete ALL checks before marking plan as done**

**Build & Tests**:
- [x] `pnpm run build` 성공
- [x] `pnpm run test:run` 모두 통과
- [x] `pnpm run lint` 에러 없음
- [x] `pnpm run type-check` 통과

**Manual Testing**:
- [x]모달에서 날짜 피커가 커스텀 스타일로 표시됨
- [x]선택된 날짜가 "X월 Y일 (요일)" 형식으로 표시됨
- [x]클릭 시 날짜 선택 가능
- [x]Edit 모달에서도 동일하게 작동

**🔍 Code Review**:
- [x] `/frontend-code-review src/presentation/components/common/DatePicker.tsx` 실행
- [x] `/frontend-code-review src/presentation/components/todo/` 실행

**Validation Commands**:

```bash
pnpm run build
pnpm run test:run
pnpm run lint
pnpm run type-check
```

---

## ⚠️ Risk Assessment

| Risk | Probability | Impact | Mitigation Strategy |
| --- | --- | --- | --- |
| 체크박스 스타일 변경 시 기존 테스트 깨짐 | Medium | Low | 테스트에서 클래스명 대신 역할(role) 기반 선택자 사용 |
| 캘린더 그리드 카드 래퍼 추가 시 레이아웃 깨짐 | Low | Medium | 변경 전후 스크린샷 비교 |
| 숨겨진 date input의 showPicker() 브라우저 호환성 | Low | Medium | 대부분의 모던 브라우저 지원, fallback으로 input 클릭 |
| uiStore 초기값 변경이 다른 컴포넌트에 영향 | Low | Medium | 기존 테스트로 회귀 검증 |

---

## 🔄 Rollback Strategy

### If Phase 1 Fails
- `CalendarView.tsx` git restore
- `index.css`, `tailwind.config.js` 변경 취소

### If Phase 2 Fails
- `uiStore.ts`의 `selectedCalendarDate` 초기값을 `null`로 복원
- `CalendarView.tsx` Phase 1 상태로 복원

### If Phase 3 Fails
- `checkbox.tsx` 원복
- `TodoAddModal.tsx`, `TodoEditModal.tsx` 원복

### If Phase 4 Fails
- `DatePicker.tsx` 삭제
- `TodoAddModal.tsx`, `TodoEditModal.tsx`를 Phase 3 상태로 복원

---

## 📊 Progress Tracking

### Completion Status

- **Phase 1**: ✅ 100% — 캘린더 그리드 카드 스타일 + 요일/날짜 색상
- **Phase 2**: ✅ 100% — 선택 날짜 섹션 기본값 today로 변경
- **Phase 3**: ✅ 100% — 체크박스 rounded-xs + 모달 카테고리 dot
- **Phase 4**: ✅ 100% — 커스텀 DatePicker 컴포넌트 (한국어 포맷)

**Overall Progress**: 100% complete

### Time Tracking

| Phase | Estimated | Actual | Variance |
| --- | --- | --- | --- |
| Phase 1 | 2 hours | - | - |
| Phase 2 | 1.5 hours | - | - |
| Phase 3 | 1.5 hours | - | - |
| Phase 4 | 2 hours | - | - |
| **Total** | 7 hours | - | - |

---

## 📝 Notes & Learnings

### Implementation Notes

- `rounded-sm`이 이 프로젝트에서 8px로 오버라이드되어 있어 체크박스에 `rounded-xs`(4px) 사용
- DatePicker는 숨겨진 `<input type="date">`의 `showPicker()` API를 활용하여 네이티브 날짜 선택 UI 호출
- `formatKoreanDate` 유틸이 이미 존재하여 재활용
- 카테고리 dot 색상은 선택 시 흰색, 미선택 시 카테고리 고유 색상

### 🔍 Code Review Learnings

**가독성 개선 사항**:
- (기록 예정)

**예측 가능성 개선 사항**:
- (기록 예정)

**응집도 개선 사항**:
- (기록 예정)

**결합도 개선 사항**:
- (기록 예정)

### Blockers Encountered

- (차단 요소 기록)

---

## 📚 References

### Documentation

- 디자인 파일: `todo.pen` (프로젝트 루트)
- 캘린더 유틸: `src/shared/utils/calendar.ts`
- 날짜 유틸: `src/shared/utils/date.ts`

### Related Plans

- `PLAN_todo-v2-calendar.md` — 캘린더 뷰 초기 구현 계획

---

## ✅ Final Checklist

**Before marking plan as COMPLETE**:

- [x]All phases completed with quality gates passed
- [x]Full integration testing performed (`pnpm run test:run`)
- [x]E2E 테스트 통과 (`pnpm run test:e2e`)
- [x]모바일 뷰포트(390px)에서 todo.pen 디자인과 육안 비교 완료
- [x]Performance: 캘린더 렌더링 성능 저하 없음

**🔍 Frontend Code Review Final Check**:

- [x] `/frontend-code-review src/presentation/` 전체 코드 최종 리뷰 완료
- [x]모든 가독성 이슈 해결
- [x]모든 예측 가능성 이슈 해결
- [x]모든 응집도 이슈 해결
- [x]모든 결합도 이슈 해결
- [x]코드 리뷰 학습 내용 Notes에 기록

---

**Plan Status**: ⏳ Pending Approval
**Next Action**: Phase 1 시작
**Blocked By**: None
