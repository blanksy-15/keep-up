import { expect, type Page } from "@playwright/test";

export async function overflowIsAbsent(page: Page) {
  const dimensions = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
  expect(dimensions.scrollWidth, JSON.stringify(dimensions)).toBeLessThanOrEqual(dimensions.clientWidth);
}

export async function startDraft(page: Page, title: string) {
  await page.goto("/season/setup/new");
  await page.getByLabel("Working title").fill(title);
  await page.getByRole("button", { name: "Start setup" }).click();
  await expect(page).toHaveURL(/\/season\/setup\/[0-9a-f-]{36}$/i);
  return page.url().split("/").at(-1)!;
}

export async function saveFoundation(page: Page, title: string, intent: string) {
  await page.getByLabel("Season title").fill(title);
  await page.getByLabel("Intent").fill(intent);
  await page.getByLabel("Start date").fill("2026-08-01");
  await page.getByLabel("End date").fill("2026-10-31");
  await page.getByRole("button", { name: "Save foundation" }).click();
  await expect(page.getByRole("status")).toContainText("Foundation saved");
}

export async function addOutcome(page: Page, goalText: string, type: string, text: string, target?: string, unit?: string) {
  const goal = page.locator("section.goal-editor").filter({ hasText: goalText }).first();
  const form = goal.locator("form.outcome-form").last();
  await form.getByLabel("Outcome").fill(text);
  await form.getByLabel("Type").selectOption(type);
  if (target) await form.getByLabel(/Target/).fill(target);
  if (unit) await form.getByLabel(/Unit/).fill(unit);
  await form.getByRole("button", { name: "Add outcome" }).click();
  await expect(goal.locator(".outcome-editor input[name=\"text\"]").last()).toHaveValue(text);
}
