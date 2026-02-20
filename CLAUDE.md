# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 이 저장소의 코드를 다룰 때 참고하는 가이드입니다.

## 명령어

```bash
pnpm dev              # Vite 개발 서버 (포트 5173)
pnpm build            # tsc 타입 체크 + Vite 빌드
pnpm lint             # ESLint 검사
pnpm lint:fix         # ESLint 자동 수정
pnpm format           # Prettier 포맷팅 (import 정렬 포함)
pnpm format:check     # 포맷팅 확인
pnpm type-check       # TypeScript 타입 검증 (출력 없음)
pnpm test             # Vitest watch 모드
pnpm test:run         # Vitest 단일 실행 (CI용)
pnpm test:coverage    # 커버리지 리포트 (v8)
pnpm test:e2e         # Playwright E2E 테스트
pnpm test:e2e:ui      # Playwright 인터랙티브 UI
pnpm storybook        # Storybook 개발 서버 (포트 6006)
```

## 아키텍처

React 19 + Vite + TypeScript TODO 앱으로, **클린 아키텍처 레이어** 구조와 Supabase 백엔드를 사용합니다.

### 레이어 구조

```
src/
├── domain/          # 순수 비즈니스 로직, 프레임워크 의존성 없음
│   ├── entities/    # Todo, Category (팩토리 함수 & 유효성 검증)
│   ├── repositories/  # ITodoRepository, ICategoryRepository (인터페이스)
│   └── usecases/    # CreateTodo, UpdateTodo, DeleteTodo, GetTodos
├── data/            # Supabase 레포지토리 구현체
│   └── repositories/  # SupabaseTodoRepository, SupabaseCategoryRepository
├── infrastructure/  # DI 컨테이너 (싱글턴), Supabase 클라이언트 설정
├── presentation/    # React UI 레이어
│   ├── components/  # ui/ (shadcn/Button,Checkbox,Drawer...) + todo/ + category/ + common/
│   ├── hooks/       # useTodos, useCategories, useTodosRealtime
│   ├── stores/      # uiStore (Zustand: 필터, 모달 상태)
│   ├── pages/       # HomePage
│   └── providers/   # QueryProvider (React Query)
└── shared/          # cn() 유틸, Result 타입, 날짜 유틸
```

### 데이터 흐름

- **UI 상태** (필터, 모달): Zustand 스토어 (`uiStore`) + selector 훅 사용
- **서버 상태** (todos, categories): TanStack React Query + Supabase
- **실시간 동기화**: `useTodosRealtime`이 Supabase `postgres_changes`를 구독하여 쿼리 무효화
- **의존성 주입**: `getContainer()` 싱글턴이 레포지토리 제공 → 훅에 props로 전달
- **유효성 검증**: 엔티티 팩토리 함수(`createTodo`, `createCategory`)가 저장 전 검증 수행
- **매퍼**: 레포지토리 레이어에서 snake_case DB 행 ↔ camelCase 도메인 엔티티 변환

### 경로 별칭 (Path Aliases)

```
@domain/*           → src/domain/*
@data/*             → src/data/*
@presentation/*     → src/presentation/*
@infrastructure/*   → src/infrastructure/*
@shared/*           → src/shared/*
```

## 테스팅

- **유닛 테스트**: `tests/unit/**/*.{test,spec}.{ts,tsx}` — Vitest + jsdom + React Testing Library
  - 셋업 파일: `tests/setup.ts` (Supabase 모킹), `tests/setup-vaul-mock.ts` (jsdom용 Drawer 모킹)
- **E2E 테스트**: `tests/e2e/**/*.spec.ts` — Playwright (iPhone 12 Chrome/Safari + Desktop Chrome)
- **Storybook**: `src/**/*.stories.tsx` — a11y, vitest, docs 애드온 포함
- Vitest 설정에 두 개 프로젝트 존재: `unit`과 `storybook` (Playwright 기반 브라우저 테스트)

## 코드 스타일

- TypeScript strict 모드, 미사용 지역 변수/매개변수 금지
- Prettier: 100자 폭, 쌍따옴표, es5 트레일링 콤마
- import 순서 (자동 정렬): react → 서드파티 → @domain → @data → @presentation → @infrastructure → @shared → 상대경로
- Tailwind CSS + CSS 변수 기반 디자인 토큰 (bg-bg-primary, text-txt-primary, accent-primary 등)
- 컴포넌트: shadcn/ui (Radix 프리미티브) + Vaul (drawer/sheet 모달)

## 핵심 패턴

- **레포지토리 인터페이스 패턴**: 도메인이 인터페이스 정의, 데이터 레이어가 Supabase로 구현
- **DI 컨테이너**: `infrastructure/di/container.ts`의 싱글턴 — 테스트 시 `setContainer()`로 교체 가능
- **Zustand selector**: 개별 selector 훅 (`useStatusFilter`, `useCategoryFilter`) 내보내기로 렌더링 최적화
- **React Query mutations**: 성공 시 쿼리 캐시 무효화; mutationFn에서 엔티티 팩토리로 유효성 검증
- **Supabase 폴백**: 환경 변수(`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) 없으면 모의 클라이언트 생성

## 커밋 규칙

- 항상 작은 단위로 커밋한다
- `prefix: name` 형식으로 작성한다
