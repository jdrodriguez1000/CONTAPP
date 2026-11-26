import { test, expect, type Page } from "@playwright/test";

// P-6 (plan VS-001 §3 and §5.1; F-001 CA-2, CA-3, CA-7, CA-8): counting while typing.
// Counts are written as "vowel/consonant/digit/other".

const GROUP_KEYS = ["vowel", "consonant", "digit", "other"];
const ZERO = "0/0/0/0";
const GRINNING_FACE = "\u{1F600}";

// One single read, with no retries: §5.1 says the counts are already up to date.
async function readCounts(page: Page) {
  const values: string[] = [];
  for (const key of GROUP_KEYS) {
    values.push((await page.getByTestId(`count-${key}`).textContent()) ?? "");
  }
  return values.join("/");
}

async function openApp(page: Page) {
  await page.goto("/");
  const field = page.getByTestId("text-field");
  await expect(field).toBeVisible();
  await expect.poll(() => readCounts(page)).toBe(ZERO);
  return field;
}

// Saves the counts as they are when each change event ends. A listener on window
// runs after the ones on the field, so a delayed update would be recorded as stale.
async function recordCountsAtEndOfEachChange(page: Page) {
  await page.evaluate((keys) => {
    const log: string[] = [];
    (window as unknown as { countsLog: string[] }).countsLog = log;
    window.addEventListener("input", () => {
      log.push(
        keys
          .map((key) => document.querySelector(`[data-testid="count-${key}"]`)?.textContent ?? "")
          .join("/"),
      );
    });
  }, GROUP_KEYS);
}

async function recordedCounts(page: Page) {
  return page.evaluate(() => (window as unknown as { countsLog: string[] }).countsLog);
}

test('TC-002 — escribir "casa" letra por letra cambia los conteos al instante con cada letra (C-001)', async ({
  page,
}) => {
  const field = await openApp(page);
  await recordCountsAtEndOfEachChange(page);

  await field.pressSequentially("c");
  await expect(field).toHaveValue("c");
  expect(await readCounts(page)).toBe("0/1/0/0");

  await field.pressSequentially("asa");
  await expect(field).toHaveValue("casa");
  expect(await readCounts(page)).toBe("2/2/0/0");

  // c, ca, cas, casa: already right when each change event ends (no delay).
  expect(await recordedCounts(page)).toEqual(["0/1/0/0", "1/1/0/0", "1/2/0/0", "2/2/0/0"]);
});

test("TC-002 — pegar una frase, o reemplazarla, también cuenta al instante los 4 grupos (C-006, C-007, C-008)", async ({
  page,
}) => {
  const field = await openApp(page);
  await field.focus();

  const phrase = `¡Hola, 2026! ${GRINNING_FACE}`;
  await page.keyboard.insertText(phrase);
  await expect(field).toHaveValue(phrase);
  expect(await readCounts(page)).toBe("2/2/4/4");

  // Pasting over the whole selection replaces the counts; they do not add up.
  await field.selectText();
  await page.keyboard.insertText("rey 7");
  await expect(field).toHaveValue("rey 7");
  expect(await readCounts(page)).toBe("1/2/1/0");
});

test('TC-003 — borrar una letra de "casa" baja los conteos y borrar todo deja los 4 en 0 (C-012)', async ({
  page,
}) => {
  const field = await openApp(page);
  await field.pressSequentially("casa");
  await expect(field).toHaveValue("casa");
  expect(await readCounts(page)).toBe("2/2/0/0");

  await field.press("Backspace");
  await expect(field).toHaveValue("cas");
  expect(await readCounts(page)).toBe("1/2/0/0");

  // Letter by letter down to empty.
  await field.press("Backspace");
  expect(await readCounts(page)).toBe("1/1/0/0");
  await field.press("Backspace");
  expect(await readCounts(page)).toBe("0/1/0/0");
  await field.press("Backspace");
  await expect(field).toHaveValue("");
  expect(await readCounts(page)).toBe(ZERO);

  // Everything at once.
  await field.pressSequentially("casa");
  expect(await readCounts(page)).toBe("2/2/0/0");
  await field.selectText();
  await field.press("Backspace");
  await expect(field).toHaveValue("");
  expect(await readCounts(page)).toBe(ZERO);
});

test("TC-003 — al borrar hasta dejar solo espacios y saltos de línea, los 4 quedan en 0 (C-012, C-008)", async ({
  page,
}) => {
  const field = await openApp(page);
  await field.pressSequentially("  ");
  await field.press("Enter");
  await field.pressSequentially("a");
  await expect(field).toHaveValue("  \na");
  expect(await readCounts(page)).toBe("1/0/0/0");

  await field.press("Backspace");
  await expect(field).toHaveValue("  \n");
  expect(await readCounts(page)).toBe(ZERO);
});

test('TC-024 — escribir "casa" y recargar deja el campo vacío y los 4 en 0, sin guardar nada (C-010)', async ({
  page,
  context,
}) => {
  const field = await openApp(page);
  await field.pressSequentially("casa");
  await expect(field).toHaveValue("casa");

  // Nothing typed is kept in the browser.
  const stored = await page.evaluate(async () => ({
    local: JSON.stringify({ ...localStorage }),
    session: JSON.stringify({ ...sessionStorage }),
    cookies: document.cookie,
    databases: (await indexedDB.databases()).length,
    caches: "caches" in window ? (await caches.keys()).length : 0,
  }));
  expect(stored).toEqual({ local: "{}", session: "{}", cookies: "", databases: 0, caches: 0 });
  expect(await context.cookies()).toEqual([]);

  await page.reload();
  await expect(field).toBeVisible();
  await expect(field).toHaveValue("");
  await expect.poll(() => readCounts(page)).toBe(ZERO);

  // Opening the address again, in a new tab of the same browser.
  const secondTab = await context.newPage();
  const secondField = await openApp(secondTab);
  await expect(secondField).toHaveValue("");
});

test('TC-025 — al escribir "casa" no sale ninguna petición y ninguna lleva el texto (C-010)', async ({
  page,
  context,
}) => {
  const requests: string[] = [];
  const sockets: string[] = [];
  context.on("request", (request) => {
    requests.push(`${request.url()} ${request.postData() ?? ""} ${JSON.stringify(request.headers())}`);
  });
  page.on("websocket", (socket) => {
    sockets.push(socket.url());
    socket.on("framesent", (frame) => sockets.push(String(frame.payload)));
  });

  const field = await openApp(page);
  await page.waitForLoadState("networkidle");
  const requestsAfterLoad = requests.length;
  // Proves the listener works: loading the page itself was seen.
  expect(requestsAfterLoad).toBeGreaterThan(0);

  const addressBefore = page.url();
  await field.pressSequentially("casa");
  await field.blur();
  await expect(field).toHaveValue("casa");
  await page.waitForLoadState("networkidle");

  expect(requests.slice(requestsAfterLoad)).toEqual([]);
  expect(page.url()).toBe(addressBefore);

  // Leaving the page must not send the text either.
  await page.reload();
  await page.waitForLoadState("networkidle");
  expect(requests.filter((request) => request.toLowerCase().includes("casa"))).toEqual([]);
  expect(sockets).toEqual([]);
});

test('TC-027 — escribir "cas" y esperar: el texto sigue "cas" y la app no propone nada (C-009)', async ({
  page,
}) => {
  const field = await openApp(page);
  await field.pressSequentially("cas");
  await expect(field).toHaveValue("cas");

  // The only fixed wait allowed in this slice (plan VS-001 §3, P-6).
  await page.waitForTimeout(2000);

  await expect(field).toHaveValue("cas");
  // Only title, label, names and numbers on screen: no proposed word or notice.
  const visibleText = (await page.locator("body").innerText()).replace(/\s+/g, " ").trim();
  expect(visibleText.replace(/\d+/g, "#")).toBe(
    "Contapp Escribe una palabra o frase Vocales # Consonantes # Números # Otros #",
  );
  await expect(
    page.locator(
      '[role="alert"], [role="status"], [role="dialog"], [role="listbox"], [aria-live], dialog, datalist',
    ),
  ).toHaveCount(0);
});
