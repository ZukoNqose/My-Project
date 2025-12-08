import axios from 'axios';
import type { TodoItem } from '../types/todo.js';

const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'http://localhost:5000');

console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('API_BASE (final):', API_BASE);
console.log('Is DEV mode:', import.meta.env.DEV);

export async function getTodos(): Promise<TodoItem[]> {
  const res = await axios.get(`${API_BASE}/api/todo`);
  return res.data;
}

export async function getTodo(id: number): Promise<TodoItem> {
  const res = await axios.get(`${API_BASE}/api/todo/${id}`);
  return res.data;
}

export async function createTodo(todo: Omit<TodoItem, 'id'>): Promise<TodoItem> {
  const res = await axios.post(`${API_BASE}/api/todo`, todo);
  return res.data;
}

export async function updateTodo(id: number, todo: TodoItem): Promise<void> {
  await axios.put(`${API_BASE}/api/todo/${id}`, todo);
}

export async function deleteTodo(id: number): Promise<void> {
  await axios.delete(`${API_BASE}/api/todo/${id}`);
}
