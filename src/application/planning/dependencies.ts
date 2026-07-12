import type { PlanningUnitOfWork } from "../../persistence/contracts";
import type { Clock, IdGenerator } from "../contracts";

export interface PlanningApplicationDependencies {
  persistence: PlanningUnitOfWork;
  clock: Clock;
  ids: IdGenerator;
}
