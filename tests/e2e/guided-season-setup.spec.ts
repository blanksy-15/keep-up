import { test, expect } from "@playwright/test";
import { signIn, signOut, signUp, syntheticAccount } from "./support/accounts";
import { monitorBrowserErrors } from "./support/console-monitor";
import { countSeasonGraph, openE2EDatabase } from "./support/database";
import { addOutcome, saveFoundation, startDraft } from "./support/workflow";

test("completes, persists, locks, and converts a guided season setup", async ({ page, context }) => {
  const assertNoErrors = monitorBrowserErrors(page);
  const account = syntheticAccount("happy-path");
  const title = `Focused season ${account.email}`;
  const intent = "Make steady progress on a meaningful personal project.";

  await signUp(page, account);
  await page.goto("/season");
  await expect(page.getByRole("heading", { name: "Seasons with intention" })).toBeVisible();
  await expect(page.getByText("No seasons yet")).toBeVisible();
  const draftId = await startDraft(page, title);
  const setupUrl = page.url();
  expect(draftId).toBeTruthy();
  expect(page.url()).toContain(`/season/setup/${draftId}`);

  await saveFoundation(page, title, intent);
  await page.getByLabel("New constraint").fill("Two focused evenings per week.");
  await page.locator("form.inline-form").filter({ has: page.getByPlaceholder("Add a constraint") }).getByRole("button", { name: "Add", exact: true }).click();
  await expect(page.getByText("Two focused evenings per week.")).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Season title")).toHaveValue(title);
  await expect(page.getByLabel("Intent")).toHaveValue(intent);
  await expect(page.getByLabel("Start date")).toHaveValue("2026-08-01");
  await signOut(page);
  await signIn(page, account);
  await page.goto("/season/setup");
  await expect(page.getByText(title, { exact: true })).toBeVisible();
  const resumeHref = await page.getByRole("link", { name: "Resume" }).getAttribute("href");
  expect(resumeHref).toMatch(/\/season\/setup\/[^/]+$/);
  await page.goto(resumeHref!);
  await expect(page.getByLabel("Season title")).toHaveValue(title);

  for (const priority of ["Protect deep work", "Keep scope humane", "Make progress visible"]) {
    await page.getByPlaceholder("Add a priority idea").fill(priority);
    await page.locator("form.inline-form").filter({ has: page.getByPlaceholder("Add a priority idea") }).getByRole("button", { name: "Add", exact: true }).click();
    await expect(page.getByText(priority, { exact: true })).toBeVisible();
  }
  const firstPriority = page.locator("div.setup-row").filter({ hasText: "Protect deep work" }).first();
  await firstPriority.locator('input[type="checkbox"]').click();
  await page.reload();
  const selectedPriority = page.locator("div.setup-row").filter({ hasText: "Protect deep work" }).first().locator('input[type="checkbox"]');
  await expect(selectedPriority).toBeChecked();
  await selectedPriority.click();
  await page.reload();
  const firstPriorityAfterToggle = page.locator("div.setup-row").filter({ hasText: "Protect deep work" }).first();
  await expect(firstPriorityAfterToggle.locator('input[type="checkbox"]')).not.toBeChecked();
  await firstPriorityAfterToggle.locator('input[name="text"]').fill("Protect deliberate deep work");
  await firstPriorityAfterToggle.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Protect deliberate deep work", { exact: true })).toBeVisible();
  await page.locator("div.setup-row").filter({ hasText: "Keep scope humane" }).first().getByRole("button", { name: "Remove" }).click();
  await expect(page.getByText("Keep scope humane", { exact: true })).toHaveCount(0);

  const firstGoal = "Ship a useful first version";
  const secondGoal = "Practice a slower, more generous pace";
  for (const goal of [firstGoal, secondGoal]) {
    await page.getByPlaceholder("Add a proposed goal").fill(goal);
    await page.getByRole("button", { name: "Add goal" }).click();
    await expect(page.getByText(goal, { exact: true })).toBeVisible();
  }
  const firstGoalEditor = page.locator("section.goal-editor").filter({ hasText: firstGoal }).first();
  await firstGoalEditor.getByLabel("Goal title").fill("Ship a useful first version this season");
  await firstGoalEditor.getByRole("button", { name: "Save goal" }).click();
  await expect(page.getByText("Ship a useful first version this season", { exact: true })).toBeVisible();

  await addOutcome(page, "Ship a useful first version this season", "boolean", "Publish the first version");
  await addOutcome(page, "Ship a useful first version this season", "numeric", "Complete focused work", "24", "hours");
  await addOutcome(page, secondGoal, "percentage", "Reach meaningful completeness", "80", "%");
  await addOutcome(page, secondGoal, "count", "Share useful updates", "4", "updates");

  const editedOutcome = page.locator("section.goal-editor").filter({ hasText: "Ship a useful first version this season" }).locator(".outcome-editor").first();
  await editedOutcome.getByLabel("Outcome").fill("Publish the first useful version");
  await editedOutcome.getByRole("button", { name: "Save outcome" }).click();
  await expect(page.getByText("Publish the first useful version", { exact: true })).toBeVisible();
  const removableOutcome = page.locator("section.goal-editor").filter({ hasText: secondGoal }).locator(".outcome-editor").last();
  await removableOutcome.getByRole("button", { name: "Remove outcome" }).click();
  await addOutcome(page, secondGoal, "count", "Share a replacement update", "5", "updates");

  await page.getByRole("button", { name: "Review setup" }).click();
  await expect(page).toHaveURL(/\/season\/setup\/[^/]+\/review$/);
  await expect(page.getByRole("heading", { name: "Ready to confirm" })).toBeVisible();
  await expect(page.getByText(intent)).toBeVisible();
  await expect(page.getByText("Publish the first useful version", { exact: true })).toBeVisible();
  await expect(page.getByText(/percentage/)).toBeVisible();
  await expect(page.getByText(/count/)).toBeVisible();

  await page.getByRole("button", { name: "Confirm and lock setup" }).click();
  await expect(page).toHaveURL(/\/season\/setup\/[^/]+\/complete$/);
  const completionUrl = page.url();
  await expect(page.getByRole("heading", { name: "Create your draft season" })).toBeVisible();
  const staleCompletion = await context.newPage();
  const assertStaleErrors = monitorBrowserErrors(staleCompletion);
  await staleCompletion.goto(completionUrl);
  await expect(staleCompletion.getByRole("button", { name: "Create draft season" })).toBeVisible();

  const editResponse = await page.goto(setupUrl);
  expect(editResponse?.status()).toBe(404);
  await page.goto(completionUrl);
  await expect(page.getByRole("heading", { name: "Create your draft season" })).toBeVisible();
  await page.getByRole("button", { name: "Create draft season" }).click();
  await expect(page).toHaveURL(/\/season\/[^/]+$/);
  const seasonId = page.url().split("/").at(-1)!;
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
  await expect(page.getByText("Season · draft")).toBeVisible();
  await expect(page.getByText(intent)).toBeVisible();
  await expect(page.getByText("Publish the first useful version", { exact: true })).toBeVisible();
  await expect(page.getByText("Complete focused work", { exact: true })).toBeVisible();
  await expect(page.getByText("Reach meaningful completeness", { exact: true })).toBeVisible();

  await staleCompletion.getByRole("button", { name: "Create draft season" }).click();
  await expect(staleCompletion).toHaveURL(/\/season\/setup\/[^/]+\/complete\?error=already-converted$/);
  await expect(staleCompletion.getByRole("status")).toContainText("already created a season");
  await expect(staleCompletion.getByRole("link", { name: "Open existing season" })).toHaveAttribute("href", `/season/${seasonId}`);
  await staleCompletion.close();

  await page.goto("/season");
  await expect(page.getByRole("link", { name: "Open season" }).first()).toHaveAttribute("href", `/season/${seasonId}`);
  const database = openE2EDatabase();
  try {
    await expect.poll(async () => countSeasonGraph(database, title)).toEqual({ seasons: 1, goals: 2, outcomes: 4 });
  } finally {
    await database.end();
  }
  expect(seasonId).toBeTruthy();
  await assertStaleErrors();
  await assertNoErrors();
});
