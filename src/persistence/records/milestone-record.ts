export interface MilestoneRecord {
  id: string;
  goalId: string;
  title: string;
  status: string;
  targetDate: string | null;
  completedAt: string | null;
  skippedAt: string | null;
  updatedAt: string | null;
}
