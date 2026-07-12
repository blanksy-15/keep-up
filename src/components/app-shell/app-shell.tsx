import type { ReactNode } from "react";
import { DesktopSidebar } from "./desktop-sidebar";
import { MobileNavigation } from "./mobile-navigation";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <DesktopSidebar />
      <main id="main-content" className="app-main" tabIndex={-1}>
        <div className="app-content">{children}</div>
      </main>
      <MobileNavigation />
    </div>
  );
}
