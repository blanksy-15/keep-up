import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { AuthenticatedAccount } from "../application";
import { getAuth } from "./server";
import { mapSessionUser } from "./identity-mapping";
export async function getAuthenticatedAccount():Promise<AuthenticatedAccount|null>{const session=await getAuth().api.getSession({headers:await headers()});return session?mapSessionUser(session.user):null;}
export async function requireAuthenticatedAccount(){const account=await getAuthenticatedAccount();if(!account)redirect("/sign-in");return account;}
