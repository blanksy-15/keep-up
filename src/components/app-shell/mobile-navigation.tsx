"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationIcon, navigationItems } from "./navigation-items";

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav className="mobile-navigation" aria-label="Primary navigation">
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
  );
}
