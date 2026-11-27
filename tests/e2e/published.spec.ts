import { test, expect, type Page, type TestInfo } from "@playwright/test";
import { expectNoNotice, expectNothingStored, readCounts, type App } from "./field-helpers";

// Runs only in the "published" project, whose baseURL is E2E_BASE_URL (plan VS-001 §5.3).
test("P-2: la dirección publicada abre con el título Contapp", async ({ page }) => {
  // Without this guard, a missing variable would fail with an unclear navigation error.
  expect(
    process.env.E2E_BASE_URL,
    "E2E_BASE_URL must hold the published address",
  ).toBeTruthy();

  await page.goto("/");

  await expect(page).toHaveTitle("Contapp");
  await expect(page.getByTestId("app-title")).toHaveText("Contapp");
  await expect(page.locator("html")).toHaveAttribute("lang", "es-CO");
});

// P-10 (plan VS-001 §3 and §5.1): the whole journey on the published version.
// Counts are written as "vowel/consonant/digit/other".

const ZERO = "0/0/0/0";
const EVIDENCE = "_project/slices/VS-002/evidence/published";
const CARDS = [
  { key: "vowel", name: "Vocales" },
  { key: "consonant", name: "Consonantes" },
  { key: "digit", name: "Números" },
  { key: "other", name: "Otros" },
];

async function openPublished(page: Page): Promise<App> {
  const publishedUrl = process.env.E2E_BASE_URL;
  expect(publishedUrl, "E2E_BASE_URL must hold the published address").toBeTruthy();

  const dialogs: string[] = [];
  page.on("dialog", (dialog) => {
    dialogs.push(dialog.message());
    void dialog.dismiss();
  });

  const response = await page.goto("/");

  // The address itself serves the app: no error page and no platform login.
  expect(response?.status(), "HTTP status of the published address").toBe(200);
  expect(new URL(page.url()).origin, "no redirect to another site").toBe(
    new URL(publishedUrl ?? "").origin,
  );
  await expect(page).toHaveTitle("Contapp");
  return { page, field: page.getByTestId("text-field"), dialogs };
}

// Empty field, the four names in order, each one with its "0".
async function expectEmptyScreen({ page, field }: App) {
  await expect(field).toBeVisible();
  await expect(field).toHaveValue("");
  await expect(page.getByTestId("count-grid").locator("dt")).toHaveText(
    CARDS.map((card) => card.name),
  );
  for (const card of CARDS) {
    const locator = page.getByTestId(`count-card-${card.key}`);
    await expect(locator).toBeVisible();
    await expect(locator.locator("dt")).toHaveText(card.name);
    await expect(page.getByTestId(`count-${card.key}`)).toHaveText(/^0$/);
  }
}

// A fixed folder: `npm run test:published` runs without --output.
async function saveEvidence(page: Page, testInfo: TestInfo, fileName: string) {
  const path = `${EVIDENCE}/${fileName}`;
  await page.screenshot({ path, scale: "css" });
  await testInfo.attach(fileName, { path, contentType: "image/png" });
}

test("TC-001 — publicada: campo vacío, los 4 grupos en 0 y sin pantalla de cuenta (C-010, C-012)", async ({
  page,
}, testInfo) => {
  const app = await openPublished(page);

  await expectEmptyScreen(app);
  await expect(app.field).not.toBeFocused();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Contapp");
  await expect(page.getByLabel("Escribe una palabra o frase")).toHaveAttribute(
    "data-testid",
    "text-field",
  );
  await expect(page.locator("html")).toHaveAttribute("lang", "es-CO");

  // No account screen: same path, no password, and the text field is the only control.
  expect(new URL(page.url()).pathname).toBe("/");
  await expect(page.locator('input[type="password"]')).toHaveCount(0);
  expect((await page.locator("body").innerText()).replace(/\s+/g, " ").trim()).toBe(
    "Contapp Escribe una palabra o frase Vocales 0 Consonantes 0 Números 0 Otros 0",
  );
  await expectNoNotice(app);

  await saveEvidence(page, testInfo, "tc-001-al-abrir.png");
});

test('TC-002 — publicada: escribir "casa" letra por letra cambia los conteos con cada letra (C-001)', async ({
  page,
}, testInfo) => {
  const app = await openPublished(page);
  await expectEmptyScreen(app);

  // readCounts reads once, with no retries: §5.1 says the counts are already up to date.
  await app.field.pressSequentially("c");
  await expect(app.field).toHaveValue("c");
  expect(await readCounts(page), 'counts after "c"').toBe("0/1/0/0");

  await app.field.pressSequentially("a");
  await expect(app.field).toHaveValue("ca");
  expect(await readCounts(page), 'counts after "ca"').toBe("1/1/0/0");

  await app.field.pressSequentially("s");
  await expect(app.field).toHaveValue("cas");
  expect(await readCounts(page), 'counts after "cas"').toBe("1/2/0/0");

  await app.field.pressSequentially("a");
  await expect(app.field).toHaveValue("casa");
  expect(await readCounts(page), 'counts after "casa"').toBe("2/2/0/0");
  await expectNoNotice(app);

  await saveEvidence(page, testInfo, "tc-002-casa.png");
});

// CA-7 only. That the counts change while typing is proved by TC-002.
test('TC-024 — publicada: escribir "casa" y recargar deja el campo vacío y los 4 en 0, sin guardar nada (C-010)', async ({
  page,
  context,
}, testInfo) => {
  const app = await openPublished(page);
  await expectEmptyScreen(app);
  await app.field.pressSequentially("casa");
  await expect(app.field).toHaveValue("casa");

  await expectNothingStored(page, context);

  await page.reload();
  await expectEmptyScreen(app);
  expect(await readCounts(page), "counts after reload").toBe(ZERO);
  await expectNoNotice(app);

  await saveEvidence(page, testInfo, "tc-024-despues-de-recargar.png");

  // Opening the address again, in a new tab of the same browser.
  await expectEmptyScreen(await openPublished(await context.newPage()));
});
