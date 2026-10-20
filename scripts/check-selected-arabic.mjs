import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
const origin=process.env.SITE_URL||'http://127.0.0.1:4330';
try{
 for(const [width,height] of [[390,844],[768,1024],[1192,800],[1280,720],[1440,900],[1920,1080]]){
  const page=await browser.newPage({viewport:{width,height}});
  await page.goto(origin+'/ar');await page.evaluate(()=>document.fonts.ready);
  await page.evaluate(()=>document.documentElement.style.scrollBehavior='auto');
  const top=await page.locator('#work').evaluate(e=>e.offsetTop);
  if(width>=1280){
   for(const progress of [0,.4,.8,.4,0]){
    const y=await page.locator('#work').evaluate((e,p)=>e.offsetTop+(e.offsetHeight-innerHeight)*p,progress);
    await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(300);
    for(const index of [0,1,2]){
     await page.locator('[data-project-index]').nth(index).focus();await page.waitForTimeout(280);
     const state=await page.evaluate(()=>{
      const rect=s=>document.querySelector(s).getBoundingClientRect();
      const overlap=(a,b)=>Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1;
      const heading=rect('.work-heading'),summary=rect('.project-summary'),preview=rect('.project-preview'),marquee=rect('.project-marquee');
      const title=rect('[data-active-title]'),description=rect('[data-active-description]'),cta=rect('.project-summary .cta');
      return {overlaps:overlap(heading,summary)||overlap(heading,preview)||overlap(summary,preview)||overlap(summary,marquee)||overlap(title,description)||overlap(description,cta),title:document.querySelector('[data-active-title]').textContent,active:document.querySelector('.project-row[aria-current]')?.dataset.projectIndex,overflow:document.documentElement.scrollWidth>innerWidth};
     });
     assert(!state.overlaps,`${width}: overlapping layout`);assert(!state.overflow);
     assert.equal(Number(state.active),index);await page.locator('[data-project-index]').nth(index).evaluate(e=>e.blur());
    }
   }
  }else{
   await page.evaluate(y=>scrollTo(0,y),top);
   assert.equal(await page.locator('.work-stage').evaluate(e=>getComputedStyle(e).display),'none');
   for(const item of await page.locator('.project-sequence__item').all()){
    await item.scrollIntoViewIfNeeded();await page.waitForTimeout(150);
    const overlaps=await item.evaluate(e=>{const a=e.querySelector('.project-sequence__copy').getBoundingClientRect(),b=e.querySelector('picture').getBoundingClientRect();return Math.min(a.right,b.right)>Math.max(a.left,b.left)+1&&Math.min(a.bottom,b.bottom)>Math.max(a.top,b.top)+1});
    assert(!overlaps,`${width}: project copy overlaps image`);
   }
  }
  await page.close();console.log(`PASS ${width}x${height}: Arabic Selected Work geometry and project states`);
 }
}finally{await browser.close();}
