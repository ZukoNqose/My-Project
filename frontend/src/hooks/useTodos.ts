import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../services/api';
import type { TodoItem } from '../types/todo.js';

export function useTodos() {
  return useQuery<TodoItem[]>({
    queryKey: ['todos'],
    queryFn: api.getTodos,
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (todo: TodoItem) => api.updateTodo(todo.id, todo),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });
}
