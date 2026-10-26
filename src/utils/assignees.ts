import type { Task, TeamMember } from '../types/task';

export function getUniqueAssignees(tasks: Task[]): TeamMember[] {
  const byId = new Map<string, TeamMember>();
  for (const task of tasks) {
    const member: TeamMember | null = task.assignee;
    if (member && !byId.has(member.id)) byId.set(member.id, member);
  }
  return [...byId.values()];
}
