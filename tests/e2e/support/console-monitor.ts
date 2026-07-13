import { expect, type Page } from "@playwright/test";

export function monitorBrowserErrors(page: Page) {
  const failures: string[] = [];
  page.on("pageerror", error => failures.push(`pageerror: ${error.message}`));
  page.on("console", message => {
    if (message.type() === "error") failures.push(`console.error: ${message.text()}`);
    if (message.type() === "warning" && /hydration|unhandled|react/i.test(message.text())) failures.push(`console.warning: ${message.text()}`);
  });
  return async function assertNoBrowserErrors() {
    expect(failures, failures.join("\n")).toEqual([]);
  };
}
