import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const output = path.resolve(process.env.SCREENSHOT_DIR ?? 'artifacts/home-review');
const previewUrl = process.env.PREVIEW_URL ?? 'http://127.0.0.1:4321/';
await fs.mkdir(output, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});
const viewports = [
  ['desktop', 1440, 1000, 1],
  ['desktop-retina', 1440, 1000, 2],
  ['tablet', 834, 1112, 1],
  ['mobile', 390, 844, 1],
];

for (const [name, width, height, deviceScaleFactor] of viewports) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => response.status() >= 400 && errors.push(`${response.status()} ${response.url()}`));
  await page.goto(previewUrl, { waitUntil: 'networkidle' });
  await page.locator('img').evaluateAll((images) => images.forEach((image) => { image.loading = 'eager'; }));
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += Math.max(360, window.innerHeight * 0.7)) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(600);
  await page.addStyleTag({ content: '.skip-link{transform:translateY(-160%)!important}' });
  await page.screenshot({ path: path.join(output, `${name}.png`), fullPage: true });
  if (errors.length) throw new Error(`${name}: ${errors.join('\n')}`);
  await context.close();
}

const reduced = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
const reducedPage = await reduced.newPage();
await reducedPage.goto(previewUrl, { waitUntil: 'networkidle' });
await reducedPage.locator('img').evaluateAll((images) => images.forEach((image) => { image.loading = 'eager'; }));
await reducedPage.evaluate(async () => {
  for (let y = 0; y < document.documentElement.scrollHeight; y += 500) {
    window.scrollTo(0, y);
    await new Promise((resolve) => setTimeout(resolve, 60));
  }
  window.scrollTo(0, 0);
});
await reducedPage.waitForTimeout(600);
await reducedPage.addStyleTag({ content: '.skip-link{transform:translateY(-160%)!important}' });
await reducedPage.screenshot({ path: path.join(output, 'mobile-reduced-motion.png'), fullPage: true });
await reduced.close();
await browser.close();
console.log(output);
