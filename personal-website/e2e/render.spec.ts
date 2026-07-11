import { test, expect } from "@playwright/test";

// Section headings whose content is revealed client-side (framer-motion whileInView).
// If the JS fails to load or hydrate, these render blank — exactly the "empty
// content" regression this guards against.
const SECTION_HEADINGS: RegExp[] = [
  /Engineer at the intersection/i, // About
  /The stack I build with/i, // Stack
  /Experience .* education/i, // Experience
  /Projects .* publications/i, // Work
  /Let.?s build/i, // Contact
];

test("homepage loads with no failed _next assets (catches 404'd JS chunks)", async ({ page }) => {
  const failed: string[] = [];
  page.on("response", (res) => {
    if (res.url().includes("/_next/") && res.status() >= 400) {
      failed.push(`${res.status()} ${res.url()}`);
    }
  });
  await page.goto("/", { waitUntil: "networkidle" });
  expect(failed, `Broken _next requests:\n${failed.join("\n")}`).toEqual([]);
});

test("hero heading renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("every section heading renders (not stuck blank)", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  for (const name of SECTION_HEADINGS) {
    const heading = page.getByRole("heading", { name }).first();
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible();
  }
});
