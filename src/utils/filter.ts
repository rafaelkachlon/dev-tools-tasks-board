import type { StatusFilter, Task } from '../types/task';

export function filterTasks(tasks: Task[], status: StatusFilter, query: string): Task[] {
  const needle = query.trim().toLowerCase();

  return tasks.filter((task) => {
    if (status !== 'all' && task.status !== status) return false;
    if (!needle) return true;
    const haystack = [task.title, task.description, task.assignee?.name ?? ''].join(' ').toLowerCase();
    return haystack.includes(needle);
  });
}
