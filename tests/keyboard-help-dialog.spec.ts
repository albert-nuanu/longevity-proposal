import { test, expect } from "@playwright/test";
import { resolve } from "node:path";

const INDEX_PATH = `file://${resolve(__dirname, "..", "index.html")}`;

test("keyboard help modal is visible to assistive technology", async ({ page }) => {
  await page.goto(INDEX_PATH);
  await page.getByRole("button", { name: /keyboard help/i }).click();

  const dialog = page.getByRole("dialog", { name: /keyboard shortcuts/i });
  await expect(dialog).toBeVisible();

  const hasHiddenAncestor = await dialog.evaluate((dialogElement) => {
    let node = dialogElement.parentElement;
    while (node) {
      if (node.getAttribute("aria-hidden") === "true") {
        return true;
      }
      node = node.parentElement;
    }
    return false;
  });

  expect(hasHiddenAncestor).toBe(false);
});
