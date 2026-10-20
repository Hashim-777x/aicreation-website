import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const origin=process.env.SITE_URL||'http://127.0.0.1:4330';
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
try{
 for(const width of [360,390,768,900,1280,1440,1920]){
  const page=await browser.newPage({viewport:{width,height:900}});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  for(const route of ['/ar','/ar/work','/ar/ai-creative','/ar/agents','/ar/studio','/ar/contact','/ar/privacy','/ar/terms']){
   const response=await page.goto(origin+route);
   assert.equal(response.status(),200);
   await page.evaluate(()=>document.fonts.ready);
   await page.waitForTimeout(650);
   const state=await page.evaluate(()=>({
    overflow:document.documentElement.scrollWidth>innerWidth,
    headings:[...document.querySelectorAll('h1,h2,h3')].filter(e=>e.offsetWidth&&e.scrollWidth>e.clientWidth+3).map(e=>e.textContent),
    rtl:document.documentElement.dir,
   }));
   assert(!state.overflow,`${width} ${route}: horizontal overflow`);
   assert.deepEqual(state.headings,[],`${width} ${route}: heading overflow`);
   assert.equal(state.rtl,'rtl');
   if(route==='/ar'&&width>=900){
    await page.evaluate(()=>document.documentElement.style.scrollBehavior='auto');
    for(const y of [0,120,300,120,0]){
     await page.evaluate(scroll=>window.scrollTo(0,scroll),y);await page.waitForTimeout(220);
     for(const x of [2,width-2]){
      await page.mouse.move(x,180);await page.waitForTimeout(220);
      const bounds=await page.locator('.hero-copy h1>span').evaluateAll(es=>es.map(e=>({left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right})));
      for(const box of bounds)assert(box.left>=-1&&box.right<=width+1,`${width}: RTL animation escapes viewport at scroll ${y}: ${JSON.stringify(box)}`);
     }
    }
   }
  }
  assert.deepEqual(errors,[]);await page.close();console.log(`PASS ${width}px: Arabic pages and live hero motion`);
 }
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await page.goto(origin+'/ar');await page.waitForTimeout(200);
 const transforms=await page.locator('.hero-copy h1>span').evaluateAll(es=>es.map(e=>getComputedStyle(e).transform));
 assert(transforms.every(value=>value==='none'),'Reduced-motion transform remains');
 console.log('PASS reduced motion');await page.close();
}finally{await browser.close();}
