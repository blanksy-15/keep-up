export interface OutcomeRecord {
  ownerId: string;
  id: string;
  goalId: string;
  description: string;
  type: string;
  targetValue: number | null;
  unit: string | null;
  progressValue: number | null;
  progressNote: string | null;
  progressRecordedAt: string | null;
}
