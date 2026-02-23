"use client";
import { useQueryClient } from "@tanstack/react-query";
import { $api } from "@/lib/api-client";
import type { paths } from "@/lib/api-client";

type Todo = paths["/api/todos"]["get"]["responses"][200]["content"]["application/json"][number];

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
    onMutate: async ({ params, body }) => {
      await queryClient.cancelQueries({ queryKey: todosQueryKey });

      const previousTodos = queryClient.getQueryData<Todo[]>(todosQueryKey);

      if (previousTodos) {
        queryClient.setQueryData<Todo[]>(todosQueryKey, (old) =>
          old?.map((todo) =>
            todo.id === params.path.id
              ? {
                  ...todo,
                  status: body?.status ?? todo.status,
                  completed: body?.status === "completed",        
                  completedAt: body?.status === "completed"
                    ? new Date().toISOString()
                    : null,
                }
              : todo
          )
        );
      }

      return { previousTodos };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(todosQueryKey, context.previousTodos);
      }
    },

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