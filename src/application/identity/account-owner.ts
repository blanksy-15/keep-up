import type { AccountOwnerId } from "../../domain";
export interface AuthenticatedAccount { ownerId:AccountOwnerId; email:string; displayName:string; }
export interface AuthenticatedContext { account:AuthenticatedAccount; }
export interface UseCaseContext { ownerId:AccountOwnerId; }
