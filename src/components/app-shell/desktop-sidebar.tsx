"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationIcon, navigationItems } from "./navigation-items";
import type { AuthenticatedAccount } from "@/application";

export function DesktopSidebar({account}:{account:AuthenticatedAccount}) {
  const pathname = usePathname();

  return (
    <aside className="desktop-sidebar" aria-label="Primary navigation">
      <Link className="wordmark" href="/today" aria-label="keep-up home">
        <span className="wordmark__mark" aria-hidden="true">k</span>
        <span>keep-up</span>
      </Link>
      <nav className="desktop-nav">
        {navigationItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={active ? "is-active" : undefined}>
              <NavigationIcon name={item.icon} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-future">
        <span className="avatar-placeholder" aria-hidden="true">{account.displayName.slice(0,1).toUpperCase()}</span>
        <div><strong>{account.displayName}</strong><span>{account.email}</span></div>
      </div>
    </aside>
  );
}
