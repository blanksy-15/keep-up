import type { ReactNode } from "react";

export const navigationItems = [
  { href: "/today", label: "Today", icon: "today" },
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/season", label: "Season", icon: "season" },
  { href: "/reflection", label: "Reflection", icon: "reflection" },
  { href: "/settings", label: "Settings", icon: "settings" },
] as const;

export function NavigationIcon({ name }: { name: (typeof navigationItems)[number]["icon"] }) {
  const paths: Record<typeof name, ReactNode> = {
    today: <><path d="M5 3v3M15 3v3M3 8h14" /><rect x="3" y="5" width="14" height="12" rx="2" /><path d="m7 13 2 2 4-5" /></>,
    dashboard: <><rect x="3" y="3" width="6" height="6" rx="1" /><rect x="11" y="3" width="6" height="4" rx="1" /><rect x="3" y="11" width="6" height="6" rx="1" /><rect x="11" y="9" width="6" height="8" rx="1" /></>,
    season: <><circle cx="10" cy="10" r="7" /><path d="M10 6v4l3 2" /><path d="M4 16 2.5 17.5M16 16l1.5 1.5" /></>,
    reflection: <><path d="M4 4h12v10H8l-4 3V4Z" /><path d="M7 8h6M7 11h4" /></>,
    settings: <><circle cx="10" cy="10" r="3" /><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.3 4.3l1.4 1.4M14.3 14.3l1.4 1.4M15.7 4.3l-1.4 1.4M5.7 14.3l-1.4 1.4" /></>,
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}
