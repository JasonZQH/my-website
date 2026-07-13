import { test, expect } from "@playwright/test";

// Section headings whose content is revealed client-side (framer-motion whileInView).
// If the JS fails to load or hydrate, these render blank — exactly the "empty
// content" regression this guards against. (v3 headings.)
const SECTION_HEADINGS: RegExp[] = [
  /^about me$/i, // About
  /^experience$/i, // Experience
  /^projects$/i, // Static editorial project cards (Work.tsx)
  /let.?s talk/i, // Contact
];

test("homepage loads with no failed _next assets (catches 404'd JS chunks)", async ({ page }) => {
  const failed: string[] = [];
  page.on("response", (res) => {
    if (res.url().includes("/_next/") && res.status() >= 400) {
      failed.push(`${res.status()} ${res.url()}`);
    }
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(failed, `Broken _next requests:\n${failed.join("\n")}`).toEqual([]);
});

test("hero heading renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("mobile hero portrait is centered", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const portrait = page.locator("[data-hero-portrait]");
  await expect(portrait).toBeVisible();
  const portraitBox = await portrait.evaluate((element) => ({
    x: (element as HTMLElement).offsetLeft,
    y: (element as HTMLElement).offsetTop,
    width: (element as HTMLElement).offsetWidth,
    height: (element as HTMLElement).offsetHeight,
  }));

  expect(Math.abs(portraitBox.x + portraitBox.width / 2 - 195)).toBeLessThanOrEqual(1);
  expect(Math.abs(portraitBox.y + portraitBox.height / 2 - 422)).toBeLessThanOrEqual(1);
});

test("every section heading renders (not stuck blank)", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  for (const name of SECTION_HEADINGS) {
    const heading = page.getByRole("heading", { name }).first();
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible();
  }
});

test("capability marquee and project cards render their complete art sets", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const capabilities = page.locator(".capability-card:not([aria-hidden='true'])");
  const projects = page.locator(".project-card");
  await expect(capabilities).toHaveCount(12);
  await expect(projects).toHaveCount(3);
  await expect(projects.locator("h3")).toHaveText(["CURATOR", "YourPassenger", "EmojiCam"]);

  await expect(capabilities.locator("img").first()).toHaveAttribute("alt", /smoked-glass/i);
  await expect(projects.locator("img").first()).toHaveAttribute("alt", /agent workbench/i);

  await expect(page.locator("#capabilities .capability-marquee-row")).toHaveCount(2);
  await expect(page.locator("#capabilities .capability-marquee-row").first().locator(".capability-card")).toHaveCount(18);
  await expect(page.locator(".project-motion-card")).toHaveCount(3);
  await expect(page.locator(".project-motion-card").first()).toHaveCSS("position", "sticky");
});

test("card galleries do not create horizontal overflow on narrow screens", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page.locator(".capability-card").first()).toBeVisible();
  await expect(page.locator(".project-card").first()).toBeVisible();
  await expect(page.locator(".project-card-media").first()).toBeHidden();
  await expect(page.locator(".project-motion-card").first()).toHaveCSS("position", "sticky");
  const hasNoHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth <= document.documentElement.clientWidth
  );
  expect(hasNoHorizontalOverflow).toBeTruthy();
});

test("project cards collapse cleanly when a desktop window is narrowed", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const projectArt = page.locator(".project-card-media").first();
  await expect(projectArt).toBeVisible();

  await page.setViewportSize({ width: 768, height: 844 });
  await expect(projectArt).toBeHidden();
  await expect(page.locator(".project-motion-card").first()).toHaveCSS("position", "sticky");
});

test("card artwork sources are available", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const artwork = page.locator(".capability-card:not([aria-hidden='true']) img, .project-card img");
  const sources = new Set<string>();

  for (let index = 0; index < await artwork.count(); index++) {
    const image = artwork.nth(index);
    const source = await image.getAttribute("src");
    if (source) sources.add(source);
  }

  for (const source of sources) {
    const response = await page.request.get(source);
    expect(response.ok(), `Artwork source should return successfully: ${source}`).toBeTruthy();
  }
});
