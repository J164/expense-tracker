import { expect, test } from "@playwright/test";

test("demo auth can create a transaction and a recurring rule", async ({
    page
}) => {
    await page.goto("/login");
    await page
        .getByRole("button", { name: "Sign in with Demo Account" })
        .click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole("heading", { name: /hello/i })).toBeVisible();

    await page.goto("/dashboard/transactions/create");
    await page.locator("#name").fill("Coffee Run");
    await page.locator("#amount").fill("4.50");
    await page.locator("#category").selectOption("dining");
    await page.getByRole("button", { name: "Create Transaction" }).click();

    await expect(page).toHaveURL(/\/dashboard\/transactions$/);
    await expect(
        page.locator("tbody tr").filter({ hasText: "Coffee Run" }).first()
    ).toBeVisible();

    await page.goto("/dashboard/recurring/create");
    await page.locator("#name").fill("Gym Plan");
    await page.locator("#amount").fill("30");
    await page.locator("#frequency").selectOption("MONTHLY");
    await page.locator("#category").selectOption("fitness");
    await page
        .getByRole("button", { name: "Create Recurring Transaction" })
        .click();

    await expect(page).toHaveURL(/\/dashboard\/recurring$/);
    await expect(
        page.locator("tbody tr").filter({ hasText: "Gym Plan" }).first()
    ).toBeVisible();
});
