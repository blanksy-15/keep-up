import type { CalendarDate, DailyCheckInId, Timestamp } from "./shared";

/** Minimal by design; the structured wellness fields remain a product question. */
export interface DailyCheckIn {
  id: DailyCheckInId;
  date: CalendarDate;
  note?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
