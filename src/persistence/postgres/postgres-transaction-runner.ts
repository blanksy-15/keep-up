import type { KeepUpDatabase } from "../../database";
import type { PersistenceResult } from "../errors";
import { persistenceFailure } from "../errors";
import type { PlanningTransactionRunner, TransactionContext } from "../contracts";
import { PostgresPlanningUnitOfWork } from "./postgres-planning-repositories";
import { PostgresWorkflowRepositories } from "./postgres-workflow-repositories";
class RollbackResult<T> extends Error {constructor(readonly result:PersistenceResult<T>){super("Transaction operation failed.");}}
export class PostgresTransactionRunner implements PlanningTransactionRunner {constructor(private readonly db:KeepUpDatabase){}async runInTransaction<T>(operation:(context:TransactionContext)=>Promise<PersistenceResult<T>>):Promise<PersistenceResult<T>>{try{return await this.db.transaction(async tx=>{const result=await operation({planning:new PostgresPlanningUnitOfWork(tx as KeepUpDatabase),workflow:new PostgresWorkflowRepositories(tx as KeepUpDatabase)});if(!result.ok)throw new RollbackResult(result);return result;});}catch(c){if(c instanceof RollbackResult)return c.result;return persistenceFailure({code:"storage_failure",message:"Database transaction failed.",cause:c});}}}
