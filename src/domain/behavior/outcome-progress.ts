import type { Outcome, OutcomeProgress } from "../outcome";
import { failure, success, type DomainResult } from "./validation";

export interface ProgressCalculation {
  rawValue: number;
  normalizedProgress: number;
  isComplete: boolean;
}

function clamp(value: number): number {
  return Math.min(100, Math.max(0, value));
}

export function calculateOutcomeProgress(
  outcome: Outcome,
  progress: OutcomeProgress | undefined = outcome.progress,
): DomainResult<ProgressCalculation> {
  if (!progress || !Number.isFinite(progress.value)) {
    return failure({ code: "invalid_progress_value", field: "progress.value", message: "A finite progress value is required." });
  }

  const rawValue = progress.value;
  if (rawValue < 0) {
    return failure({ code: "invalid_progress_value", field: "progress.value", message: "Progress values cannot be negative." });
  }

  if (outcome.type === "boolean") {
    if (rawValue !== 0 && rawValue !== 1) {
      return failure({ code: "invalid_progress_value", field: "progress.value", message: "Boolean outcome progress must be 0 or 1." });
    }
    return success({ rawValue, normalizedProgress: rawValue === 1 ? 100 : 0, isComplete: rawValue === 1 });
  }

  if (outcome.type === "percentage") {
    const normalizedProgress = clamp(rawValue);
    return success({ rawValue, normalizedProgress, isComplete: normalizedProgress >= 100 });
  }

  const target = outcome.targetValue;
  if (!Number.isFinite(target) || target === undefined || target <= 0) {
    return failure({
      code: "invalid_progress_value",
      field: "targetValue",
      message: `${outcome.type === "count" ? "Count" : "Numeric"} targets must be greater than zero.`,
    });
  }
  if (outcome.type === "count" && !Number.isInteger(rawValue)) {
    return failure({ code: "invalid_progress_value", field: "progress.value", message: "Count progress must be a whole number." });
  }
  if (outcome.type === "count" && !Number.isInteger(target)) {
    return failure({ code: "invalid_progress_value", field: "targetValue", message: "Count targets must be whole numbers." });
  }

  const normalizedProgress = clamp((rawValue / target) * 100);
  return success({ rawValue, normalizedProgress, isComplete: rawValue >= target });
}
