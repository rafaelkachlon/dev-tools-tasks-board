export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  assignee: TeamMember | null;
  estimateHours: number;
  urgent: boolean;
  createdAt: string;
}

export interface TaskDraft {
  title: string;
  assigneeId: string | null;
  estimateHours: number;
  urgent: boolean;
}

export type StatusFilter = 'all' | TaskStatus;
