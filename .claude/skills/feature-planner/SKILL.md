---
name: feature-planner
description: Creates phase-based feature plans with quality gates and incremental delivery structure. Use when planning features, organizing work, breaking down tasks, creating roadmaps, or structuring development strategy. Keywords: plan, planning, phases, breakdown, strategy, roadmap, organize, structure, outline.
---

# Feature Planner

## Purpose

Generate structured, phase-based plans where:

- Each phase delivers complete, runnable functionality
- Quality gates enforce validation before proceeding
- User approves plan before any work begins
- Progress tracked via markdown checkboxes
- Each phase is 1-4 hours maximum

## Planning Workflow

### Step 1: Requirements Analysis

1. Read relevant files to understand codebase architecture
2. Identify dependencies and integration points
3. Assess complexity and risks
4. Determine appropriate scope (small/medium/large)

### Step 2: Phase Breakdown with TDD Integration

Break feature into 3-7 phases where each phase:

- **Test-First**: Write tests BEFORE implementation
- Delivers working, testable functionality
- Takes 1-4 hours maximum
- Follows Red-Green-Refactor cycle
- Has measurable test coverage requirements
- Can be rolled back independently
- Has clear success criteria

**Phase Structure**:

- Phase Name: Clear deliverable
- Goal: What working functionality this produces
- **Test Strategy**: What test types, coverage target, test scenarios
- Tasks (ordered by TDD workflow):
  1. **RED Tasks**: Write failing tests first
  2. **GREEN Tasks**: Implement minimal code to make tests pass
  3. **REFACTOR Tasks**: Improve code quality while tests stay green
- Quality Gate: TDD compliance + validation criteria
- Dependencies: What must exist before starting
- **Coverage Target**: Specific percentage or checklist for this phase

### Step 3: Plan Document Creation

Use plan-template.md to generate: `docs/plans/PLAN_<feature-name>.md`

Include:

- Overview and objectives
- Architecture decisions with rationale
- Complete phase breakdown with checkboxes
- Quality gate checklists
- Risk assessment table
- Rollback strategy per phase
- Progress tracking section
- Notes & learnings area

### Step 4: User Approval

**CRITICAL**: Use AskUserQuestion to get explicit approval before proceeding.

Ask:

- "Does this phase breakdown make sense for your project?"
- "Any concerns about the proposed approach?"
- "Should I proceed with creating the plan document?"

Only create plan document after user confirms approval.

### Step 5: Document Generation

1. Create `docs/plans/` directory if not exists
2. Generate plan document with all checkboxes unchecked
3. Add clear instructions in header about quality gates
4. Inform user of plan location and next steps

## Quality Gate Standards

Each phase MUST validate these items before proceeding to next phase:

**Build & Compilation**:

- [ ] Project builds/compiles without errors
- [ ] No syntax errors

**Test-Driven Development (TDD)**:

- [ ] Tests written BEFORE production code
- [ ] Red-Green-Refactor cycle followed
- [ ] Unit tests: ≥80% coverage for business logic
- [ ] Integration tests: Critical user flows validated
- [ ] Test suite runs in acceptable time (<5 minutes)

**Testing**:

- [ ] All existing tests pass
- [ ] New tests added for new functionality
- [ ] Test coverage maintained or improved

**Code Quality**:

- [ ] Linting passes with no errors
- [ ] Type checking passes (if applicable)
- [ ] Code formatting consistent

**Functionality**:

- [ ] Manual testing confirms feature works
- [ ] No regressions in existing functionality
- [ ] Edge cases tested

**Security & Performance**:

- [ ] No new security vulnerabilities
- [ ] No performance degradation
- [ ] Resource usage acceptable

**Documentation**:

- [ ] Code comments updated
- [ ] Documentation reflects changes

## Progress Tracking Protocol

Add this to plan document header:

```markdown
**CRITICAL INSTRUCTIONS**: After completing each phase:

1. ✅ Check off completed task checkboxes
2. 🧪 Run all quality gate validation commands
3. ⚠️ Verify ALL quality gate items pass
4. 🔍 **Run `/frontend-code-review`** (for frontend phases)
5. 📅 Update "Last Updated" date
6. 📝 Document learnings in Notes section
7. ➡️ Only then proceed to next phase

⛔ DO NOT skip quality gates or proceed with failing checks
```

## Frontend Code Review Integration

**IMPORTANT**: 프론트엔드 구현이 포함된 계획에서는 반드시 `/frontend-code-review` 스킬을 연동합니다.

### 언제 Code Review를 실행하는가?

프론트엔드 코드가 포함된 Phase 완료 시 **반드시** `/frontend-code-review` 스킬을 호출합니다:

| Phase 유형 | 리뷰 대상 | 리뷰 실행 |
|-----------|----------|----------|
| UI 컴포넌트 구현 | `src/components/`, `src/presentation/` | ✅ 필수 |
| 페이지/화면 구현 | `src/pages/`, `src/views/` | ✅ 필수 |
| 커스텀 훅 구현 | `src/hooks/` | ✅ 필수 |
| 상태 관리 구현 | `src/stores/`, `src/context/` | ✅ 필수 |
| 백엔드/API만 | - | ⏭️ 생략 |
| 설정/인프라만 | - | ⏭️ 생략 |

### Code Review 4축 기준

`/frontend-code-review` 스킬은 다음 4가지 축으로 코드를 평가합니다:

1. **가독성(Readability)**: 매직 넘버, 조건부 렌더링, 삼항 연산자, 추상화 수준
2. **예측 가능성(Predictability)**: 반환 타입 일관성, 숨겨진 부작용, 네이밍
3. **응집도(Cohesion)**: 폼 응집도, 기능별 코드 조직, 상수-로직 연관성
4. **결합도(Coupling)**: Props 드릴링, 상태 관리 범위, 성급한 추상화

### Plan 생성 시 추가할 내용

프론트엔드 구현이 포함된 계획서에는 다음을 **자동으로 추가**합니다:

1. **Quality Gate에 Code Review 체크리스트 추가**:
   ```markdown
   **🔍 Code Review (프론트엔드 Phase 필수)**:
   - [ ] `/frontend-code-review [대상 경로]` 실행
   - [ ] 가독성 이슈 수정
   - [ ] 예측 가능성 이슈 수정
   - [ ] 응집도 이슈 수정
   - [ ] 결합도 이슈 수정
   - [ ] 리뷰 결과 Notes 섹션에 기록
   ```

2. **Validation Commands에 리뷰 명령어 추가**:
   ```bash
   # Frontend Code Review
   /frontend-code-review src/components/
   /frontend-code-review src/hooks/
   /frontend-code-review src/pages/
   ```

3. **Final Checklist에 최종 리뷰 추가**:
   ```markdown
   - [ ] 전체 프론트엔드 코드 `/frontend-code-review` 완료
   - [ ] 모든 리뷰 이슈 해결 확인
   ```

### 리뷰 결과 반영 워크플로우

```
Phase 구현 완료
    ↓
Quality Gate 검증 (빌드, 테스트, 린트)
    ↓
/frontend-code-review 실행
    ↓
리뷰 이슈 발견? ──Yes──→ 이슈 수정 → 재리뷰
    ↓ No
Notes 섹션에 학습 내용 기록
    ↓
다음 Phase 진행
```

## Phase Sizing Guidelines

**Small Scope** (2-3 phases, 3-6 hours total):

- Single component or simple feature
- Minimal dependencies
- Clear requirements
- Example: Add dark mode toggle, create new form component

**Medium Scope** (4-5 phases, 8-15 hours total):

- Multiple components or moderate feature
- Some integration complexity
- Database changes or API work
- Example: User authentication system, search functionality

**Large Scope** (6-7 phases, 15-25 hours total):

- Complex feature spanning multiple areas
- Significant architectural impact
- Multiple integrations
- Example: AI-powered search with embeddings, real-time collaboration

## Risk Assessment

Identify and document:

- **Technical Risks**: API changes, performance issues, data migration
- **Dependency Risks**: External library updates, third-party service availability
- **Timeline Risks**: Complexity unknowns, blocking dependencies
- **Quality Risks**: Test coverage gaps, regression potential

For each risk, specify:

- Probability: Low/Medium/High
- Impact: Low/Medium/High
- Mitigation Strategy: Specific action steps

## Rollback Strategy

For each phase, document how to revert changes if issues arise.
Consider:

- What code changes need to be undone
- Database migrations to reverse (if applicable)
- Configuration changes to restore
- Dependencies to remove

## Test Specification Guidelines

### Test-First Development Workflow

**For Each Feature Component**:

1. **Specify Test Cases** (before writing ANY code)
   - What inputs will be tested?
   - What outputs are expected?
   - What edge cases must be handled?
   - What error conditions should be tested?

2. **Write Tests** (Red Phase)
   - Write tests that WILL fail
   - Verify tests fail for the right reason
   - Run tests to confirm failure
   - Commit failing tests to track TDD compliance

3. **Implement Code** (Green Phase)
   - Write minimal code to make tests pass
   - Run tests frequently (every 2-5 minutes)
   - Stop when all tests pass
   - No additional functionality beyond tests

4. **Refactor** (Blue Phase)
   - Improve code quality while tests remain green
   - Extract duplicated logic
   - Improve naming and structure
   - Run tests after each refactoring step
   - Commit when refactoring complete

### Test Types

**Unit Tests**:

- **Target**: Individual functions, methods, classes
- **Dependencies**: None or mocked/stubbed
- **Speed**: Fast (<100ms per test)
- **Isolation**: Complete isolation from external systems
- **Coverage**: ≥80% of business logic

**Integration Tests**:

- **Target**: Interaction between components/modules
- **Dependencies**: May use real dependencies
- **Speed**: Moderate (<1s per test)
- **Isolation**: Tests component boundaries
- **Coverage**: Critical integration points

**End-to-End (E2E) Tests**:

- **Target**: Complete user workflows
- **Dependencies**: Real or near-real environment
- **Speed**: Slow (seconds to minutes)
- **Isolation**: Full system integration
- **Coverage**: Critical user journeys

### Test Coverage Calculation

**Coverage Thresholds** (adjust for your project):

- **Business Logic**: ≥90% (critical code paths)
- **Data Access Layer**: ≥80% (repositories, DAOs)
- **API/Controller Layer**: ≥70% (endpoints)
- **UI/Presentation**: Integration tests preferred over coverage

**Coverage Commands by Ecosystem**:

```bash
# JavaScript/TypeScript
jest --coverage
nyc report --reporter=html

# Python
pytest --cov=src --cov-report=html
coverage report

# Java
mvn jacoco:report
gradle jacocoTestReport

# Go
go test -cover ./...
go tool cover -html=coverage.out

# .NET
dotnet test /p:CollectCoverage=true /p:CoverageReporter=html
reportgenerator -reports:coverage.xml -targetdir:coverage

# Ruby
bundle exec rspec --coverage
open coverage/index.html

# PHP
phpunit --coverage-html coverage
```

### Common Test Patterns

**Arrange-Act-Assert (AAA) Pattern**:

```
test 'description of behavior':
  // Arrange: Set up test data and dependencies
  input = createTestData()

  // Act: Execute the behavior being tested
  result = systemUnderTest.method(input)

  // Assert: Verify expected outcome
  assert result == expectedOutput
```

**Given-When-Then (BDD Style)**:

```
test 'feature should behave in specific way':
  // Given: Initial context/state
  given userIsLoggedIn()

  // When: Action occurs
  when userClicksButton()

  // Then: Observable outcome
  then shouldSeeConfirmation()
```

**Mocking/Stubbing Dependencies**:

```
test 'component should call dependency':
  // Create mock/stub
  mockService = createMock(ExternalService)
  component = new Component(mockService)

  // Configure mock behavior
  when(mockService.method()).thenReturn(expectedData)

  // Execute and verify
  component.execute()
  verify(mockService.method()).calledOnce()
```

### Test Documentation in Plan

**In each phase, specify**:

1. **Test File Location**: Exact path where tests will be written
2. **Test Scenarios**: List of specific test cases
3. **Expected Failures**: What error should tests show initially?
4. **Coverage Target**: Percentage for this phase
5. **Dependencies to Mock**: What needs mocking/stubbing?
6. **Test Data**: What fixtures/factories are needed?

## Mobile-First Design Guidelines

**웹 프론트엔드 프로젝트는 모바일 뷰를 기준으로 UI를 설계합니다.**

### 기본 원칙

| 항목 | 모바일 기준 | 확장 |
|------|------------|------|
| 기준 뷰포트 | **375px** (iPhone SE) | 768px+ (tablet), 1024px+ (desktop) |
| 레이아웃 | 단일 컬럼 | 점진적으로 멀티 컬럼 |
| 터치 타겟 | 최소 **44x44px** | 유지 |
| CSS 작성 | 기본 스타일 = 모바일 | `sm:`, `md:`, `lg:` 접두사로 확장 |

### Plan 생성 시 적용 사항

프론트엔드 프로젝트 계획서에 다음을 **자동으로 포함**합니다:

1. **Architecture Decisions에 Mobile-First 추가**
2. **Storybook 설정**: 기본 뷰포트를 375px로 설정
3. **Playwright 설정**: 기본 테스트 디바이스를 모바일로 설정
4. **컴포넌트 스타일**: 모바일 기준 스타일 → 데스크톱 점진적 확장
5. **E2E 테스트**: 모바일 뷰포트 테스트 우선 실행

### Tailwind 반응형 전략

```css
/* 기본 스타일 = 모바일 */
.component {
  @apply px-4 py-3;           /* 모바일 기본 */
  @apply md:px-6 md:py-4;     /* 태블릿 확장 */
  @apply lg:px-8 lg:py-6;     /* 데스크톱 확장 */
}
```

## Supporting Files Reference

- [plan-template.md](plan-template.md) - Complete plan document template
