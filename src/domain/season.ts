import type { DateRange, SeasonId, Timestamp } from "./shared";
import type { AccountOwnerId } from "./identity";

export type SeasonStatus = "draft" | "active" | "completed" | "archived";

export interface SeasonIntent {
  statement: string;
}

export interface Season {
  ownerId: AccountOwnerId;
  id: SeasonId;
  name: string;
  dates: DateRange;
  status: SeasonStatus;
  intent?: SeasonIntent;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  activatedAt?: Timestamp;
  completedAt?: Timestamp;
  archivedAt?: Timestamp;
}
