export interface SeasonRecord {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  intentStatement: string | null;
  createdAt: string;
  updatedAt: string;
  activatedAt: string | null;
  completedAt: string | null;
  archivedAt: string | null;
}
