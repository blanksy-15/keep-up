import { test, expect } from "@playwright/test";
import { signIn, signOut, signUp, syntheticAccount } from "./support/accounts";
import { monitorBrowserErrors } from "./support/console-monitor";

test("authenticates through the real sign-up and sign-in pages", async ({ page }) => {
  const assertNoErrors = monitorBrowserErrors(page);
  const account = syntheticAccount("auth");

  await page.goto("/season");
  await expect(page).toHaveURL(/\/sign-in$/);
  await page.goto("/season/setup/example");
  await expect(page).toHaveURL(/\/sign-in$/);
  await page.goto("/sign-up");
  await expect(page.getByRole("heading", { name: "Create your account" })).toBeVisible();

  await signUp(page, account);
  await expect(page).toHaveURL(/\/today$/);
  await signOut(page);

  await page.getByLabel("Email").fill(account.email);
  await page.getByLabel("Password").fill("wrong-password");
  await page.getByRole("button", { name: "Sign in" }).focus();
  await expect(page.getByRole("button", { name: "Sign in" })).toBeFocused();
  await page.getByLabel("Password").press("Enter");
  await expect(page.getByRole("alert")).toContainText("Sign-in was not completed");
  await expect(page).toHaveURL(/\/sign-in$/);
  await expect(page.locator("body")).not.toContainText("wrong-password");

  await signIn(page, account);
  await page.goto("/");
  await expect(page).toHaveURL(/\/today$/);
  await assertNoErrors();
});
