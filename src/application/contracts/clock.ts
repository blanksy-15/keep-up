import type { CalendarDate, Timestamp } from "../../domain/shared";

export interface Clock {
  now(): Timestamp;
  today(): CalendarDate;
}
