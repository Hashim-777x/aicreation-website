import { chromium } from '@playwright/test';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage({viewport:{width:1440,height:900}});page.on('console',message=>console.log('console',message.type(),message.text()));page.on('pageerror',error=>console.log('pageerror',error.message));
await page.goto('http://127.0.0.1:4321/',{waitUntil:'networkidle'});
const state=()=>page.locator('[data-project]').evaluateAll(elements=>elements.map(element=>({project:element.dataset.project,current:element.getAttribute('aria-current')})));
console.log('before',await state());await page.locator('[data-project="form-in-motion"]').focus();await page.waitForTimeout(100);console.log('after',await state());await browser.close();
