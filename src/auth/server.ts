import "server-only";
import { createDatabaseConnection } from "../database";
import { createBetterAuth } from "./configuration";

function buildAuth(){const databaseUrl=process.env.DATABASE_URL?.trim(),secret=process.env.BETTER_AUTH_SECRET?.trim();if(!databaseUrl)throw new Error("DATABASE_URL is required for authentication.");if(!secret)throw new Error("BETTER_AUTH_SECRET is required for authentication.");const connection=createDatabaseConnection({connectionString:databaseUrl});return createBetterAuth(connection.database,{secret,baseURL:process.env.BETTER_AUTH_URL,allowPublicSignUp:process.env.ALLOW_PUBLIC_SIGN_UP==="true"});}
let cached:ReturnType<typeof buildAuth>|undefined;
export function getAuth():ReturnType<typeof buildAuth>{return cached??(cached=buildAuth());}
