import type { DateRange, SeasonId, Timestamp } from "./shared";

export type SeasonStatus = "draft" | "active" | "completed" | "archived";

export interface SeasonIntent {
  statement: string;
}

export interface Season {
  id: SeasonId;
  name: string;
  dates: DateRange;
  status: SeasonStatus;
  intent?: SeasonIntent;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
