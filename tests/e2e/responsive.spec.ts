import { test, expect } from "@playwright/test";
import { signIn, signUp, syntheticAccount } from "./support/accounts";
import { monitorBrowserErrors } from "./support/console-monitor";
import { addOutcome, overflowIsAbsent, saveFoundation, startDraft } from "./support/workflow";

test("keeps authenticated season setup usable at the configured viewport", async ({ page }, testInfo) => {
  const assertNoErrors = monitorBrowserErrors(page);
  const account = syntheticAccount(`responsive-${testInfo.project.name}`);
  await signUp(page, account);
  const mobile = testInfo.project.name === "mobile-chromium";
  if (mobile) {
    await expect(page.locator("nav[aria-label='Primary navigation']")).toBeVisible();
    await expect(page.locator("aside[aria-label='Primary navigation']")).toBeHidden();
  } else {
    await expect(page.locator("nav[aria-label='Primary navigation']")).toBeHidden();
    await expect(page.locator("aside[aria-label='Primary navigation']")).toBeVisible();
  }
  await expect(page.getByRole("main")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await overflowIsAbsent(page);

  await page.goto("/sign-in");
  await overflowIsAbsent(page);
  await signIn(page, account);
  const title = `Responsive ${account.email}`;
  await startDraft(page, title);
  await overflowIsAbsent(page);
  await saveFoundation(page, title, "Keep the plan readable on a small screen.");
  await page.getByPlaceholder("Add a proposed goal").fill("Responsive goal");
  await page.getByRole("button", { name: "Add goal" }).click();
  await addOutcome(page, "Responsive goal", "boolean", "Reach the goal");
  await overflowIsAbsent(page);
  await page.getByRole("button", { name: "Review setup" }).click();
  await expect(page).toHaveURL(/\/season\/setup\/[^/]+\/review$/);
  await overflowIsAbsent(page);
  await expect(page.getByRole("button", { name: "Confirm and lock setup" })).toBeVisible();
  await page.getByRole("button", { name: "Confirm and lock setup" }).click();
  await expect(page).toHaveURL(/\/season\/setup\/[^/]+\/complete$/);
  await overflowIsAbsent(page);
  await page.getByRole("button", { name: "Create draft season" }).click();
  await expect(page).toHaveURL(/\/season\/[^/]+$/);
  await overflowIsAbsent(page);
  await expect(page.getByText("This season is a draft and is not active yet.")).toBeVisible();
  await assertNoErrors();
});
