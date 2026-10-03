import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const base = process.env.PREVIEW_URL ?? 'http://127.0.0.1:4321';
const output = process.env.SCREENSHOT_DIR ?? 'artifacts/site-validation';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless:true, executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const routes = ['/', '/work', '/ai-creative', '/agents', '/studio', '/contact'];
const viewports = [['desktop',1440,900],['laptop',1280,720],['tablet',768,1024],['mobile',390,844]];
const report = [];

for (const route of routes) {
  for (const [name,width,height] of viewports) {
    const context = await browser.newContext({ viewport:{width,height}, reducedMotion:'no-preference', hasTouch:name==='mobile' });
    const page = await context.newPage(); const errors=[];
    page.on('pageerror', error=>errors.push(error.message));
    page.on('response', response=>response.status()>=400&&errors.push(`${response.status()} ${response.url()}`));
    const response = await page.goto(`${base}${route}`, { waitUntil:'networkidle' });
    const overflow = await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1);
    if (route==='/' && name==='desktop') {
      await page.locator('[data-project="form-in-motion"]').focus();
      const selected = await page.locator('[data-project="form-in-motion"]').getAttribute('aria-current');
      if (selected!=='true') errors.push('Selected Work keyboard activation failed');
    }
    if (route==='/' && name==='mobile') {
      await page.locator('[data-project="still-water"]').tap();
      const selected = await page.locator('[data-project="still-water"]').getAttribute('aria-current');
      if (selected!=='true') errors.push('Selected Work touch activation failed');
    }
    await page.screenshot({ path:path.join(output,`${route==='/'?'home':route.slice(1)}-${name}.png`), fullPage:true });
    report.push({route,name,status:response?.status(),overflow,errors}); await context.close();
  }
}
const reduced = await browser.newContext({ viewport:{width:390,height:844}, reducedMotion:'reduce' });
const reducedPage = await reduced.newPage(); await reducedPage.goto(`${base}/`,{waitUntil:'networkidle'});
const reducedCheck = await reducedPage.evaluate(()=>({marquee:getComputedStyle(document.querySelector('.project-marquee span')).animationName,hero:getComputedStyle(document.querySelector('[data-hero-left]')).transform}));
await reduced.close(); await browser.close();
await fs.writeFile(path.join(output,'report.json'),JSON.stringify({report,reducedCheck},null,2));
console.log(JSON.stringify({report,reducedCheck},null,2));
