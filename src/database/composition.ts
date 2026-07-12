import { readDatabaseConfig } from "../config";
import { PostgresPlanningUnitOfWork, PostgresTransactionRunner, PostgresWorkflowRepositories } from "../persistence";
import { createDatabaseConnection } from "./client";
export function composePostgresPersistence(environment:NodeJS.ProcessEnv=process.env){const connection=createDatabaseConnection(readDatabaseConfig(environment));return{connection,planning:new PostgresPlanningUnitOfWork(connection.database),workflow:new PostgresWorkflowRepositories(connection.database),transactions:new PostgresTransactionRunner(connection.database)};}
