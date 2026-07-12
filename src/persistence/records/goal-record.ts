export interface GoalRecord {
  id: string;
  seasonId: string;
  title: string;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  activatedAt: string | null;
  pausedAt: string | null;
  completedAt: string | null;
  abandonedAt: string | null;
}
