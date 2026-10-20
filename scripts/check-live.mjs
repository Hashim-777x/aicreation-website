import assert from 'node:assert/strict';
const origin=process.env.SITE_URL||'https://aicreation.pro';
const routes=['/','/work','/ai-creative','/agents','/studio','/contact','/ar','/ar/work','/ar/ai-creative','/ar/agents','/ar/studio','/ar/contact'];
async function check(){
 for(const route of routes){
  const response=await fetch(new URL(route,origin),{headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(15000)});
  assert.equal(response.status,200,`${route}: HTTP ${response.status}`);
  const html=await response.text();
  assert(html.includes(`href="https://aicreation.pro${route}"`),`${route}: missing production canonical`);
  assert(!/name="robots"[^>]*content="[^"]*noindex/.test(html),`${route}: noindex`);
  assert(html.includes(route.startsWith('/ar')?'lang="ar"':'lang="en"'),`${route}: incorrect locale`);
 }
 for(const path of ['/robots.txt','/sitemap-index.xml','/sitemap-0.xml','/favicon.ico']){
  const response=await fetch(new URL(path,origin),{signal:AbortSignal.timeout(15000)});
  assert.equal(response.status,200,`${path}: HTTP ${response.status}`);
  const text=path.endsWith('.ico')?'':await response.text();
  if(path.endsWith('.xml'))assert(text.includes('<?xml'),`${path}: not XML`);
  if(path==='/robots.txt')assert(text.includes('Sitemap: https://aicreation.pro/sitemap-index.xml'));
 }
 const missing=await fetch(new URL('/__deployment-check-missing-page',origin),{signal:AbortSignal.timeout(15000)});
 assert.equal(missing.status,404,'Missing routes must return 404');
}
for(let attempt=1;attempt<=6;attempt++){
 try{await check();console.log('Live bilingual routes, canonical URLs, crawler files and 404 checks passed.');break;}
 catch(error){if(attempt===6)throw error;console.log(`Deployment not fully visible yet; retry ${attempt}/6: ${error.message}`);await new Promise(resolve=>setTimeout(resolve,5000));}
}
