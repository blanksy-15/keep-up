import { AppShell } from "@/components/app-shell";
import { requireAuthenticatedAccount } from "@/auth/session";
export const dynamic="force-dynamic";

export default async function ProductLayout({ children }: { children: React.ReactNode }) {
  const account=await requireAuthenticatedAccount();
  return <AppShell account={account}>{children}</AppShell>;
}
