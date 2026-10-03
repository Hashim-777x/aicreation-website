import { chromium } from '@playwright/test';
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
for (const viewport of [{ width: 390, height: 844 }, { width: 834, height: 1112 }]) {
  const page = await browser.newPage({ viewport });
  await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
  await page.locator('img').evaluateAll((images) => images.forEach((image) => { image.loading = 'eager'; }));
  await page.waitForTimeout(1500);
  console.log(viewport.width, await page.locator('img').evaluateAll((images) => images.map((image) => ({
    alt: image.alt,
    complete: image.complete,
    naturalWidth: image.naturalWidth,
    src: image.currentSrc.split('/').pop(),
    rect: [image.getBoundingClientRect().width, image.getBoundingClientRect().height],
  }))));
  await page.close();
}
await browser.close();
