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
              '{"c":"E2E stub coach reply."}\n{"done":true,"protocolCompliant":true}\n',
          });
          return;
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json; charset=utf-8',
          body: JSON.stringify({
            content: 'E2E stub coach reply.',
            protocolCompliant: true,
          }),
        });
      }
    );
  });

  test('send message shows stub coach reply', async ({ page }) => {
    await page.goto('/coach');
    await page.getByPlaceholder(/Ask your coach/i).fill('E2E smoke question');
    await page.getByRole('button', { name: /Send message/i }).click();
    await expect(page.getByText(/E2E stub coach reply/i)).toBeVisible({ timeout: 20_000 });
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

test.describe('Error log create + persistence', () => {
  test('can add an error with screenshot and keep it after reload', async ({ page }) => {
    await page.goto('/error-log');
    await page.getByRole('button', { name: /Add error/i }).click();

    const form = page.getByRole('form', { name: 'Add error form' });
    // "Subtopic" contains "topic"; use exact label match for Topic.
    await form.getByLabel('Topic', { exact: true }).fill('algebra_linear_equations');
    await form.getByLabel('Subtopic').fill('solving_linear');
    await form.getByLabel('Error category').fill('sign_error');
    await form.getByLabel('Question type').fill('multiple_choice_single');
    await form.getByLabel('Problem statement').fill('If -3x > 9, what is x?');
    await form.getByLabel('Your answer').fill('x > -3');
    await form.getByLabel('Correct answer').fill('x < -3');
    await form.getByLabel('Explanation').fill('You must flip the inequality when dividing by a negative.');
    await form.getByLabel(/Review in days/i).fill('2');
    await form.locator('#error-screenshot').setInputFiles('e2e/fixtures/error-shot.png');

    await form.getByRole('button', { name: /Save error/i }).click();

    await expect(page.getByText('If -3x > 9, what is x?')).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('img', { name: /Attached screenshot/i })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Total errors').locator('..').locator('..').getByText('1')).toBeVisible({
      timeout: 15000,
    });

    await page.reload();
    await expect(page.getByText('If -3x > 9, what is x?')).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('img', { name: /Attached screenshot/i })).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Error log persistence', () => {
  test('add error with screenshot and persists after reload', async ({ page }) => {
    await page.goto('/error-log');

    await page.getByRole('button', { name: /Add error/i }).click();

    await page.locator('input[name="topic"]').fill('algebra_linear_equations');
    await page.locator('input[name="subtopic"]').fill('solving_linear');
    await page.locator('input[name="errorCategory"]').fill('conceptual_misunderstanding');
    await page.locator('input[name="questionType"]').fill('multiple_choice_single');
    await page.locator('input[name="sourceReference"]').fill('E2E test source');
    await page
      .locator('textarea[name="problem"]')
      .fill('E2E test problem about linear equation.');
    await page.locator('input[name="studentAnswer"]').fill('x = 5');
    await page.locator('input[name="correctAnswer"]').fill('x = 3');
    await page.locator('textarea[name="explanation"]').fill('E2E explanation body.');
    await page
      .locator('input[name="protocolElements"]')
      .fill('concept_linear, avoid_sign_error');
    await page.locator('input[name="reviewInDays"]').fill('1');

    const screenshotDataUri =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgQv0X4QAAAAASUVORK5CYII=';
    await page.locator('input[name="screenshot"]').setInputFiles({
      name: 'e2e-proof.png',
      mimeType: 'image/png',
      buffer: Buffer.from(screenshotDataUri.split(',')[1], 'base64'),
    });

    await page.getByRole('button', { name: /Save error/i }).click();

    await expect(page.getByText(/E2E test problem about linear equation\./i)).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByAltText(/e2e-proof\.png|Attached screenshot/i)).toBeVisible({
      timeout: 15000,
    });

    await page.reload();
    await expect(page.getByText(/E2E test problem about linear equation\./i)).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByAltText(/e2e-proof\.png|Attached screenshot/i)).toBeVisible({
      timeout: 15000,
    });
  });
});
