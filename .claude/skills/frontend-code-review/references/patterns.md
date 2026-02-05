# 프론트엔드 설계 패턴 레퍼런스

4축(가독성·예측 가능성·응집도·결합도)별 권장 패턴 코드 모음.
리뷰 또는 코드 작성 시 구체적인 예시가 필요할 때 참조.

## 목차

- [1. 가독성 패턴](#1-가독성-패턴)
- [2. 예측 가능성 패턴](#2-예측-가능성-패턴)
- [3. 응집도 패턴](#3-응집도-패턴)
- [4. 결합도 패턴](#4-결합도-패턴)

---

## 1. 가독성 패턴

### 1-1. 매직 넘버에 이름 붙이기

```typescript
// ❌ BAD
await delay(300);

// ✅ GOOD
const ANIMATION_DELAY_MS = 300;
await delay(ANIMATION_DELAY_MS);
```

### 1-2. 구현 세부사항 추상화 — Auth Guard

```tsx
// ✅ 래퍼 컴포넌트로 인증 로직 캡슐화
function App() {
  return (
    <AuthGuard>
      <LoginStartPage />
    </AuthGuard>
  );
}

function AuthGuard({ children }) {
  const status = useCheckLoginStatus();
  useEffect(() => {
    if (status === 'LOGGED_IN') location.href = '/home';
  }, [status]);
  return status !== 'LOGGED_IN' ? children : null;
}
```

### 1-3. 구현 세부사항 추상화 — 전용 인터랙션 컴포넌트

```tsx
// ✅ 다이얼로그 로직을 InviteButton으로 격리
function InviteButton({ name }) {
  const handleClick = async () => {
    const canInvite = await overlay.openAsync(({ isOpen, close }) => (
      <ConfirmDialog title={`Share with ${name}`} />
    ));
    if (canInvite) await sendPush();
  };
  return <Button onClick={handleClick}>Invite</Button>;
}
```

### 1-4. 조건부 렌더링 분리

```tsx
// ✅ 역할별 별도 컴포넌트
function SubmitButton() {
  const isViewer = useRole() === 'viewer';
  return isViewer ? <ViewerSubmitButton /> : <AdminSubmitButton />;
}

function ViewerSubmitButton() {
  return <TextButton disabled>Submit</TextButton>;
}

function AdminSubmitButton() {
  useEffect(() => {
    showAnimation();
  }, []);
  return <Button type="submit">Submit</Button>;
}
```

### 1-5. 삼항 연산자 → IIFE

```typescript
// ❌ BAD: 중첩 삼항
const status = ACondition
  ? BCondition
    ? 'BOTH'
    : 'A'
  : BCondition
  ? 'B'
  : 'NONE';

// ✅ GOOD: IIFE + if
const status = (() => {
  if (ACondition && BCondition) return 'BOTH';
  if (ACondition) return 'A';
  if (BCondition) return 'B';
  return 'NONE';
})();
```

### 1-6. 시선 이동 줄이기 — 인라인 정책 객체

```tsx
// ✅ 간단한 정책을 사용처 바로 위에 정의
function Page() {
  const user = useUser();
  const policy = {
    admin: { canInvite: true, canView: true },
    viewer: { canInvite: false, canView: true },
  }[user.role];

  if (!policy) return null;
  return (
    <div>
      <Button disabled={!policy.canInvite}>Invite</Button>
      <Button disabled={!policy.canView}>View</Button>
    </div>
  );
}
```

### 1-7. 복잡한 조건에 이름 붙이기

```typescript
// ✅ 조건의 의미를 변수명으로 드러냄
const isSameCategory = product.categories.some(
  (cat) => cat.id === targetCategory.id
);
const isPriceInRange = product.prices.some(
  (price) => price >= minPrice && price <= maxPrice
);
return isSameCategory && isPriceInRange;
```

---

## 2. 예측 가능성 패턴

### 2-1. 반환 타입 표준화 — API 훅

```typescript
// ✅ 항상 UseQueryResult 반환
function useUser(): UseQueryResult<UserType, Error> {
  return useQuery({ queryKey: ['user'], queryFn: fetchUser });
}

function useServerTime(): UseQueryResult<Date, Error> {
  return useQuery({ queryKey: ['serverTime'], queryFn: fetchServerTime });
}
```

### 2-2. 반환 타입 표준화 — 유효성 검증 (판별된 유니온)

```typescript
type ValidationResult = { ok: true } | { ok: false; reason: string };

function checkIsNameValid(name: string): ValidationResult {
  if (name.length === 0) return { ok: false, reason: 'Name cannot be empty.' };
  if (name.length >= 20) return { ok: false, reason: 'Name too long.' };
  return { ok: true };
}
```

### 2-3. 숨겨진 로직 드러내기 (SRP)

```typescript
// ❌ BAD: fetch 안에 로깅이 숨겨져 있음
async function fetchBalance() {
  const balance = await http.get<number>('...');
  logging.log('balance_fetched'); // 숨겨진 부작용
  return balance;
}

// ✅ GOOD: 호출자가 명시적으로 로깅
async function fetchBalance() {
  return await http.get<number>('...');
}

async function handleUpdateClick() {
  const balance = await fetchBalance();
  logging.log('balance_fetched'); // 명시적
  await syncBalance(balance);
}
```

### 2-4. 고유하고 설명적인 이름

```typescript
// ❌ BAD: 원본 라이브러리와 구분 안 됨
export const http = {
  get(url) {
    /* 인증 헤더 추가 */
  },
};

// ✅ GOOD: 동작이 이름에 드러남
export const httpService = {
  async getWithAuth(url: string) {
    const token = await fetchToken();
    return httpLibrary.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
```

---

## 3. 응집도 패턴

### 3-1. 폼 응집도 — 필드 수준

```tsx
// ✅ 각 필드가 자체 validate 함수 보유 (독립적 필드)
<input
  {...register('email', {
    validate: (value) =>
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
        ? true
        : 'Invalid email.',
  })}
/>
```

### 3-2. 폼 응집도 — 폼 수준 (Zod 스키마)

```tsx
// ✅ 단일 스키마가 전체 폼 유효성 정의 (상호의존적 필드)
const schema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
});

const { register, handleSubmit } = useForm({
  resolver: zodResolver(schema),
});
```

**선택 기준:** 필드가 독립적 → 필드 수준, 필드 간 의존 → 폼 수준.

### 3-3. 기능/도메인별 디렉토리 구성

```
// ❌ BAD: 유형별
src/components/  src/hooks/  src/utils/

// ✅ GOOD: 도메인별
src/domains/user/components/  src/domains/user/hooks/
src/domains/product/components/  src/domains/product/hooks/
src/components/  ← 공유 컴포넌트만
```

### 3-4. 매직 넘버-로직 연관성

```typescript
// ✅ 상수를 사용하는 로직 바로 위에 정의
const ANIMATION_DELAY_MS = 300;

async function onLikeClick() {
  await postLike(url);
  await delay(ANIMATION_DELAY_MS);
  await refetchPostLike();
}
```

---

## 4. 결합도 패턴

### 4-1. 성급한 추상화 지양

추상화 전 자문: "이 로직이 모든 사용처에서 동일하게 유지될 것인가?"
분기 가능성이 있으면 중복을 허용하고 각자 진화하게 놔두는 것이 더 나을 수 있다.

### 4-2. 상태 관리 범위 한정

```typescript
// ❌ BAD: 모든 쿼리 파라미터를 하나의 훅에서 관리
function useAllQueryParams() {
  /* cardId, dateRange, filter 모두 포함 */
}

// ✅ GOOD: 관심사별 분리
function useCardIdQueryParam() {
  const [cardId, setCardId] = useQueryParam('cardId', NumberParam);
  return [cardId ?? undefined, setCardId] as const;
}
// useDateRangeQueryParam, useFilterQueryParam 등 별도
```

### 4-3. 컴포지션으로 Props 드릴링 제거

```tsx
// ❌ BAD: 중간 컴포넌트가 자기가 안 쓰는 props를 전달만 함
function ItemEditBody({ keyword, items, recommendedItems, onConfirm }) {
  return <ItemEditList keyword={keyword} items={items} ... />;
}

// ✅ GOOD: 중간 컴포넌트 제거, Modal에서 직접 렌더링
function ItemEditModal({ open, items, recommendedItems, onConfirm, onClose }) {
  const [keyword, setKeyword] = useState("");
  return (
    <Modal open={open} onClose={onClose}>
      <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <ItemEditList
        keyword={keyword}
        items={items}
        recommendedItems={recommendedItems}
        onConfirm={onConfirm}
      />
    </Modal>
  );
}
```
