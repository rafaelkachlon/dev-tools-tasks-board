import type { StatusFilter, Task } from '../types/task';

export function calculateTotalHours(tasks: Task[]): number {
  let total = 0;
  for (const task of tasks) {
    total = total + task.estimateHours;
  }
  return total;
}

export function countCompleted(tasks: Task[]): number {
  return tasks.filter((task) => task.status === 'done').length;
}

export function countByStatus(tasks: Task[]): Record<StatusFilter, number> {
  const counts: Record<StatusFilter, number> = { all: tasks.length, todo: 0, 'in-progress': 0, done: 0 };
  for (const task of tasks) {
    counts[task.status] += 1;
  }
  return counts;
}
