import { expect, type Page } from "@playwright/test";

export interface SyntheticAccount { name: string; email: string; password: string; }

let sequence = 0;
const runId = `${Date.now().toString(36)}-${process.pid}`;

export function syntheticAccount(label: string): SyntheticAccount {
  sequence += 1;
  return {
    name: `E2E ${label}`,
    email: `e2e-${runId}-${sequence}-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}@example.test`,
    password: `E2e!${runId.replace(/[^a-z0-9]/gi, "")}#${sequence}Strong`,
  };
}

export async function signUp(page: Page, account: SyntheticAccount) {
  await page.goto("/sign-up");
  await expect(page.getByRole("heading", { name: "Create your account" })).toBeVisible();
  await page.getByLabel("Name").fill(account.name);
  await page.getByLabel("Email").fill(account.email);
  await page.getByRole("textbox", { name: "Password", exact: true }).fill(account.password);
  await page.getByLabel("Confirm password").fill(account.password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/today$/);
}

export async function signIn(page: Page, account: SyntheticAccount) {
  await page.goto("/sign-in");
  await page.getByLabel("Email").fill(account.email);
  await page.getByRole("textbox", { name: "Password", exact: true }).fill(account.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/today$/);
}

export async function signOut(page: Page) {
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/sign-in$/);
}
