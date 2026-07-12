import { redirect } from "next/navigation";
import { getAuthenticatedAccount } from "@/auth/session";
export const dynamic="force-dynamic";

export default async function Home() {
  redirect((await getAuthenticatedAccount())?"/today":"/sign-in");
}
