import type { Goal } from "../../domain/goal";
import type { Season } from "../../domain/season";
import type { CalendarDate, SeasonId } from "../../domain/shared";
import { applicationFailure, fromPersistence, type ApplicationResult } from "../errors";
import type { PlanningApplicationDependencies } from "./dependencies";
import { canAddGoalToSeason } from "./policies";
import { loadSeason } from "./shared";

export interface CreateSeasonInput {
  title: string;
  intent: string;
  startDate: CalendarDate;
  endDate: CalendarDate;
}

export interface CreateGoalInput {
  seasonId: SeasonId;
  title: string;
  description: string;
}

function validCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

export async function createSeason(
  dependencies: PlanningApplicationDependencies,
  input: CreateSeasonInput,
): Promise<ApplicationResult<Season>> {
  const errors = [];
  if (input.title.trim().length === 0) errors.push({ code: "validation_failed" as const, field: "title", message: "A season title is required." });
  if (input.intent.trim().length === 0) errors.push({ code: "validation_failed" as const, field: "intent", message: "A season intent is required." });
  if (!validCalendarDate(input.startDate)) errors.push({ code: "validation_failed" as const, field: "startDate", message: "A valid season start date is required." });
  if (!validCalendarDate(input.endDate)) errors.push({ code: "validation_failed" as const, field: "endDate", message: "A valid season end date is required." });
  if (validCalendarDate(input.startDate) && validCalendarDate(input.endDate) && input.startDate > input.endDate) {
    errors.push({ code: "validation_failed" as const, field: "dates", message: "The season start date must not be after its end date." });
  }
  if (errors.length > 0) return { ok: false, errors };

  const id = dependencies.ids.nextSeasonId();
  const existing = fromPersistence(await dependencies.persistence.seasons.findById(id));
  if (!existing.ok) return existing;
  if (existing.value) return applicationFailure({ code: "conflict", field: "id", message: "The generated season ID already exists." });

  const timestamp = dependencies.clock.now();
  const season: Season = {
    id,
    name: input.title.trim(),
    dates: { startDate: input.startDate, endDate: input.endDate },
    status: "draft",
    intent: { statement: input.intent.trim() },
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  return fromPersistence(await dependencies.persistence.seasons.save(season));
}

export async function createGoal(
  dependencies: PlanningApplicationDependencies,
  input: CreateGoalInput,
): Promise<ApplicationResult<Goal>> {
  const errors = [];
  if (input.title.trim().length === 0) errors.push({ code: "validation_failed" as const, field: "title", message: "A goal title is required." });
  if (input.description.trim().length === 0) errors.push({ code: "validation_failed" as const, field: "description", message: "A goal description is required." });
  if (errors.length > 0) return { ok: false, errors };

  const parent = await loadSeason(dependencies, input.seasonId);
  if (!parent.ok) return parent;
  if (!canAddGoalToSeason(parent.value)) {
    return applicationFailure({ code: "validation_failed", field: "seasonId", message: "Goals cannot be added to a completed or archived season." });
  }

  const id = dependencies.ids.nextGoalId();
  const existing = fromPersistence(await dependencies.persistence.goals.findById(id));
  if (!existing.ok) return existing;
  if (existing.value) return applicationFailure({ code: "conflict", field: "id", message: "The generated goal ID already exists." });

  const timestamp = dependencies.clock.now();
  const goal: Goal = {
    id,
    seasonId: parent.value.id,
    title: input.title.trim(),
    description: input.description.trim(),
    status: "draft",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  return fromPersistence(await dependencies.persistence.goals.save(goal));
}
