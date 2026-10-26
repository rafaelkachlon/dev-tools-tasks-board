import type { TeamMember } from '../types/task';
import { request } from './client';

export function getTeam(): Promise<TeamMember[]> {
  return request<TeamMember[]>('/api/team');
}
