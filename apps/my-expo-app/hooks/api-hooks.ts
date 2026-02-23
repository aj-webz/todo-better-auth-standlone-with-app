
import { useQueryClient } from "@tanstack/react-query";
import { $api } from "@/lib/api-client";
const todosQueryKey = $api.queryOptions("get", "/api/todos").queryKey;

export function useTodoQuery() {
  return $api.useQuery("get", "/api/todos", undefined, {
    staleTime: 1000 * 60,        
    refetchOnWindowFocus: false,
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return $api.useMutation("post", "/api/todos", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todosQueryKey });
    },
  });
}

export function useUpdateTodoStatus() {
  const queryClient = useQueryClient();

  return $api.useMutation("patch", "/api/todos/{id}/status", {
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todosQueryKey });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return $api.useMutation("delete", "/api/todos/{id}", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todosQueryKey });
    },
  });
}