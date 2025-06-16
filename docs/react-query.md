# 🧠 TanStack React Query Best Practices for React (v5)

> TanStack Query is a powerful data-fetching and caching library for React. Follow these best practices to get the most out of it in your applications.

---

## 📦 Installation

```bash
npm install @tanstack/react-query
```

Set up the `QueryClient` and `QueryClientProvider` at the root of your app:

```tsx
// src/main.tsx or App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

---

## ✅ Best Practices

### 1. **Use Custom Hooks for Queries**

Encapsulate query logic in custom hooks for reuse and readability.

```tsx
// hooks/useTodos.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchTodos = async () => {
  const { data } = await axios.get('/api/todos');
  return data;
};

export const useTodos = () => {
  return useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });
};
```

### 2. **Use `queryKey` Consistently**

Always define clear and unique `queryKey`s to avoid cache collisions and enable proper invalidation.

✅ Good:

```ts
queryKey: ['todos'];
queryKey: ['user', userId];
```

🚫 Avoid:

```ts
queryKey: ['data']; // too generic
```

### 3. **Normalize API Layer (Axios + Error Handling)**

Use a centralized API utility with consistent error handling.

```ts
// lib/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Optional: response interceptor for unified error messages
```

### 4. **Use Placeholders and Optimistic Updates**

Avoid loading spinners when possible; use `placeholderData` for smooth UX:

```tsx
useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  placeholderData: [],
});
```

For mutations, use `onMutate`, `onError`, and `onSettled` for optimistic updates:

```tsx
useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    await queryClient.cancelQueries(['todos']);
    const previousTodos = queryClient.getQueryData(['todos']);
    queryClient.setQueryData(['todos'], (old) =>
      old.map((todo) => (todo.id === newTodo.id ? { ...todo, ...newTodo } : todo)),
    );
    return { previousTodos };
  },
  onError: (_err, _newTodo, context) => {
    queryClient.setQueryData(['todos'], context?.previousTodos);
  },
  onSettled: () => {
    queryClient.invalidateQueries(['todos']);
  },
});
```

### 5. **Avoid Over-Fetching**

Use `enabled: false` with controlled execution:

```tsx
const { data, refetch } = useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  enabled: false,
});
```

Trigger manually:

```tsx
<Button onClick={() => refetch()}>Load User</Button>
```

### 6. **Use `select` for Derived Data**

Avoid unnecessary mapping in components:

```tsx
useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  select: (data) => data.filter((todo) => !todo.completed),
});
```

### 7. **Invalidate Queries on Mutations**

Always invalidate affected queries after mutations:

```tsx
useMutation({
  mutationFn: addTodo,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  },
});
```

---

## 🧪 Testing Queries

Mock queries in unit tests using `MockedProvider` or create a mock `QueryClient`.

```ts
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
```

---

## 🧰 Useful Query Options

| Option                 | Purpose                                                      |
| ---------------------- | ------------------------------------------------------------ |
| `staleTime`            | Time before data becomes stale (avoid unnecessary refetches) |
| `cacheTime`            | Time unused data stays in cache                              |
| `retry`                | Retry count on error (default: 3)                            |
| `refetchOnWindowFocus` | Avoid surprise refetches                                     |
| `enabled`              | Conditional fetching logic                                   |
| `placeholderData`      | Prefill UI while loading real data                           |

---

## 🧼 Clean-Up & Performance Tips

- Prefetch on hover using `queryClient.prefetchQuery`
- Paginate with `useInfiniteQuery` if loading lots of data
- Avoid storing large response data if not needed
- Group related queries using `queryKey` scopes (e.g. `['projects', projectId, 'tasks']`)

---

## 🔗 Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Query GitHub](https://github.com/TanStack/query)
- [React Query Devtools](https://tanstack.com/query/latest/docs/framework/react/devtools)

```

```
