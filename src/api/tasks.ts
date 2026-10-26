import type { Task, TaskDraft } from '../types/task';
import { request } from './client';

export async function getTasks(): Promise<Task[]> {
  const data = await request<unknown>('/api/tasks');
  return data as Task[];
}

export function createTask(draft: TaskDraft): Promise<Task> {
  return request<Task>('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(draft),
  });
}
