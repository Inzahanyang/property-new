### 📚 **클라이언트 컴포넌트(Client Components) 예제와 Next.js 네비게이션 훅**

---

**좋아요! 이번 영상에서는 두 가지를 다룰 거예요:**

1. **클라이언트 컴포넌트(Client Component) 예제**
2. **Next.js 네비게이션 훅(Navigation Hooks) 사용 방법**

---

## 🚀 **1. 클라이언트 컴포넌트(Client Component)**

### ✅ **1.1 클라이언트 컴포넌트로 변환하기**

기본적으로 Next.js는 모든 컴포넌트를 **서버 컴포넌트(Server Component)**로 렌더링합니다.  
**클라이언트 컴포넌트(Client Component)**로 렌더링하려면 상단에 `"use client"`를 추가해야 합니다.

```tsx
"use client";

export default function PropertyPage() {
  console.log("Property Page Component (Client)");

  return <div>Property Page</div>;
}
```

- **`"use client"`**를 선언하면 해당 컴포넌트는 클라이언트에서 렌더링됩니다.
- 서버에서도 여전히 해당 컴포넌트를 읽기 때문에 터미널과 브라우저 양쪽에서 `console.log`가 출력됩니다.

---

## 🚀 **2. Next.js 네비게이션 훅 (Navigation Hooks)**

Next.js는 다양한 네비게이션 훅을 제공합니다. 이들은 클라이언트 및 서버 컴포넌트에서 다르게 동작합니다.

---

### ✅ **2.1 `useRouter`: 라우터 훅**

**`useRouter`**는 라우팅 관련 메서드를 제공합니다.

```tsx
"use client";
import { useRouter } from "next/navigation";

export default function PropertyPage() {
  const router = useRouter();

  return (
    <div>
      <h1>Property Page</h1>
      <button onClick={() => router.replace("/")}>Go Home</button>
    </div>
  );
}
```

#### **주요 메서드:**

- **`router.replace(path)`**: 현재 페이지를 새로운 경로로 교체합니다.
- **`router.push(path)`**: 새로운 경로를 브라우저 기록 스택에 추가합니다.
- **`router.back()`**: 이전 페이지로 이동합니다.
- **`router.forward()`**: 다음 페이지로 이동합니다.
- **`router.prefetch(path)`**: 페이지를 미리 로드합니다.

---

### ✅ **2.2 `useParams`: 동적 파라미터 읽기**

**`useParams`**를 사용하면 동적 라우트의 파라미터를 읽을 수 있습니다.

**폴더 구조:**

```
/app
  ├── properties
      ├── [id]
          ├── page.tsx
```

**코드 예시:**

```tsx
"use client";
import { useParams } from "next/navigation";

export default function PropertyPage() {
  const params = useParams();

  return (
    <div>
      <h1>Property ID: {params.id}</h1>
    </div>
  );
}
```

- `/properties/123`로 접근하면 `Property ID: 123`가 출력됩니다.
- `[id]`는 `params.id`로 접근할 수 있습니다.

---

### ✅ **2.3 `useSearchParams`: 쿼리 문자열 읽기**

**`useSearchParams`**는 URL의 쿼리 문자열을 읽습니다.

**예시 URL:** `/properties/123?name=Brad`

```tsx
"use client";
import { useSearchParams } from "next/navigation";

export default function PropertyPage() {
  const searchParams = useSearchParams();

  return (
    <div>
      <h1>Property Page</h1>
      <p>Name: {searchParams.get("name")}</p>
    </div>
  );
}
```

- `searchParams.get('name')`을 통해 `?name=Brad`에서 `Brad`를 가져옵니다.

---

### ✅ **2.4 `usePathname`: 현재 경로 읽기**

**`usePathname`**은 현재 경로를 반환합니다.

```tsx
"use client";
import { usePathname } from "next/navigation";

export default function PropertyPage() {
  const pathname = usePathname();

  return (
    <div>
      <h1>Current Path: {pathname}</h1>
    </div>
  );
}
```

- `/properties/123`로 접근하면 `Current Path: /properties/123`가 출력됩니다.

---

## 🚀 **3. 서버 컴포넌트(Server Component)에서 파라미터 사용하기**

### ✅ **3.1 `params` 사용하기**

**폴더 구조:**

```
/app
  ├── properties
      ├── [id]
          ├── page.tsx
```

**코드 예시:**

```tsx
interface PropertyPageProps {
  params: { id: string };
}

export default function PropertyPage({ params }: PropertyPageProps) {
  return (
    <div>
      <h1>Property ID: {params.id}</h1>
    </div>
  );
}
```

- `params`는 `id` 값을 포함합니다.
- `/properties/123` → `Property ID: 123`

---

### ✅ **3.2 `searchParams` 사용하기**

**예시 URL:** `/properties/123?name=Brad`

```tsx
interface PropertyPageProps {
  params: { id: string };
  searchParams: { name?: string };
}

export default function PropertyPage({
  params,
  searchParams,
}: PropertyPageProps) {
  return (
    <div>
      <h1>Property ID: {params.id}</h1>
      <p>Name: {searchParams.name}</p>
    </div>
  );
}
```

- `searchParams.name`를 통해 `Brad`를 출력합니다.

---

## 🚀 **4. 정리**

| **훅/방법**       | **클라이언트 컴포넌트** | **서버 컴포넌트** |
| ----------------- | ----------------------- | ----------------- |
| `useRouter`       | ✅ 사용 가능            | ❌ 사용 불가      |
| `useParams`       | ✅ 사용 가능            | ❌ 사용 불가      |
| `useSearchParams` | ✅ 사용 가능            | ❌ 사용 불가      |
| `usePathname`     | ✅ 사용 가능            | ❌ 사용 불가      |
| `params`          | ❌ 사용 불가            | ✅ 사용 가능      |
| `searchParams`    | ❌ 사용 불가            | ✅ 사용 가능      |

---

## 🚀 **5. 다음 단계**

- 클라이언트와 서버 컴포넌트를 이해하고 적절하게 사용하는 것이 중요합니다.
- 다음 영상에서는 **네비게이션 바(Nav Bar)**를 만들 것입니다.
  - 드롭다운 메뉴
  - 반응형 디자인
  - 로그인 상태에 따라 다른 UI 표시

---

이제 클라이언트 및 서버 컴포넌트와 Next.js 네비게이션 훅의 핵심을 이해하셨을 거예요! 🚀✨
