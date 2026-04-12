import { test, expect } from '@playwright/test';

test.describe('Navigation & shell', () => {
  test('dashboard loads with masthead and weekly card', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /Σ Jujugre/i })).toBeVisible();
    await expect(page.getByText(/Weekly progression/i)).toBeVisible();
    await expect(page.getByText(/Focus areas/i)).toBeVisible();
    await expect(page.getByText(/Next actions/i)).toBeVisible();
  });

  test('primary nav routes (desktop)', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 1280, height: 800 });

    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Study Plan' }).click();
    await expect(page).toHaveURL(/\/study-plan\/?$/);
    await expect(page.getByRole('heading', { name: /Your study plan/i })).toBeVisible({ timeout: 15_000 });

    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Topics' }).click();
    await expect(page).toHaveURL(/\/topic-mastery$/);
    await expect(page.getByRole('heading', { name: /Topic mastery/i })).toBeVisible({ timeout: 15_000 });

    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Errors' }).click();
    await expect(page).toHaveURL(/\/error-log$/);
    await expect(page.getByRole('heading', { name: /Error log/i })).toBeVisible({ timeout: 15_000 });

    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Coach' }).click();
    await expect(page).toHaveURL(/\/coach$/);
    await expect(page.getByRole('heading', { name: /Quant coach/i })).toBeVisible();

    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Settings' }).click();
    await expect(page).toHaveURL(/\/settings$/);
    await expect(page.getByRole('heading', { name: /^Settings$/i })).toBeVisible({ timeout: 15_000 });

    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Dashboard' }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('Study session CTA goes to plan or onboarding', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 1280, height: 800 });
    // Visible text is "Study session" but aria-label wins for getByRole(name=…)
    await page.getByRole('link', { name: /current study module|continue onboarding/i }).click();
    await expect(page).toHaveURL(/\/(onboarding|study-plan)/);
  });
});

test.describe('Study plan & module', () => {
  test('module detail mod1', async ({ page }) => {
    await page.goto('/study-plan/mod1');
    await expect(page.getByText(/Loading/i)).toBeHidden({ timeout: 15_000 });
    await expect(page.getByRole('heading', { name: /Integers/i })).toBeVisible({ timeout: 15_000 });
  });
});

test.describe('Onboarding', () => {
  test('step 1 visible', async ({ page }) => {
    await page.goto('/onboarding');
    await expect(page.getByRole('heading', { name: /Welcome/i })).toBeVisible();
    // CardTitle renders as a div, not a heading role
    await expect(page.getByText(/When is your GRE/i)).toBeVisible();
  });
});

test.describe('Coach UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      (url) => url.pathname === '/api/coach',
      async (route) => {
        if (route.request().method() !== 'POST') {
          await route.continue();
          return;
        }
        let wantStream = false;
        try {
          const data = route.request().postDataJSON() as { stream?: boolean } | null;
          wantStream = data?.stream === true;
        } catch {
          /* ignore */
        }
        if (wantStream) {
          await route.fulfill({
            status: 200,
            contentType: 'application/x-ndjson; charset=utf-8',
            body:
              '{"c":"E2E mock coach reply."}\n{"done":true,"protocolCompliant":true}\n',
          });
          return;
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json; charset=utf-8',
          body: JSON.stringify({
            content: 'E2E mock coach reply.',
            protocolCompliant: true,
          }),
        });
      }
    );
  });

  test('send message shows mocked coach reply', async ({ page }) => {
    await page.goto('/coach');
    await page.getByPlaceholder(/Ask your coach/i).fill('E2E smoke question');
    await page.getByRole('button', { name: /Send message/i }).click();
    await expect(page.getByText(/E2E mock coach reply/i)).toBeVisible({ timeout: 20_000 });
  });
});

test.describe('API routes', () => {
  test('GET study-plan returns JSON', async ({ request }) => {
    const res = await request.get('/api/study-plan');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data).toBeTruthy();
  });

  test('POST coach non-stream returns content', async ({ request }) => {
    const res = await request.post('/api/coach', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        messages: [{ role: 'user', content: 'Hello from Playwright' }],
        stream: false,
      },
    });
    expect(res.ok()).toBeTruthy();
    const ct = res.headers()['content-type'] ?? '';
    expect(ct).toMatch(/json/i);
    const body = await res.json();
    expect(typeof body.content).toBe('string');
    expect(body.content.length).toBeGreaterThan(10);
  });
});

test.describe('404', () => {
  test('unknown path returns 404', async ({ page }) => {
    const res = await page.goto('/this-route-should-not-exist-xyz');
    expect(res?.status()).toBe(404);
  });
});
