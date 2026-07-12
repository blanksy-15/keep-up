import type { ReactNode } from "react";
import { DesktopSidebar } from "./desktop-sidebar";
import { MobileNavigation } from "./mobile-navigation";
import type { AuthenticatedAccount } from "@/application";
import { SignOutButton } from "./sign-out-button";

export function AppShell({ children,account }: { children: ReactNode;account:AuthenticatedAccount }) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <DesktopSidebar account={account} />
      <main id="main-content" className="app-main" tabIndex={-1}>
        <div className="app-content">{children}</div>
      </main>
      <MobileNavigation />
      <SignOutButton />
    </div>
  );
}
