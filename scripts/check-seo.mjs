import assert from 'node:assert/strict';
import {readFile, access} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve('dist');
const routes=['/','/work','/ai-creative','/agents','/studio','/contact','/privacy','/terms'];
const titles=new Set();
const descriptions=new Set();
const attr=(tag,key)=>tag.match(new RegExp(`\\b${key}="([^"]*)"`))?.[1];
const tagFor=(html,name,value)=>[...html.matchAll(/<(?:meta|link)\b[^>]*>/g)].map(m=>m[0]).find(tag=>attr(tag,name)===value);
for(const route of routes){
 const html=await readFile(resolve(root,route==='/'?'index.html':`${route.slice(1)}/index.html`),'utf8');
 const title=html.match(/<title>(.*?)<\/title>/s)?.[1];
 const description=attr(tagFor(html,'name','description')??'','content');
 assert(title&&description,`${route}: missing title or description`);
 assert(!titles.has(title)&&!descriptions.has(description),`${route}: duplicate metadata`);
 titles.add(title);descriptions.add(description);
 assert.equal((html.match(/<h1\b/g)??[]).length,1,`${route}: expected one h1`);
 assert.equal(attr(tagFor(html,'rel','canonical'),'href'),`https://aicreation.pro${route}`);
 assert.equal(attr(tagFor(html,'property','og:url'),'content'),`https://aicreation.pro${route}`);
 assert(!attr(tagFor(html,'name','robots'),'content').includes('noindex'),`${route}: production blocked`);
 assert(html.includes('id="main-content"'),`${route}: missing skip target`);
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
 assert(schema['@graph'].some(node=>node['@type']==='Organization'));
 assert(schema['@graph'].some(node=>node['@type']==='WebSite'));
 if(['/agents','/ai-creative'].includes(route))assert(schema['@graph'].some(node=>node['@type']==='Service'));
 for(const [tag] of html.matchAll(/<img\b[^>]*>/g)){
  assert.notEqual(attr(tag,'alt'),undefined,`${route}: image missing alt`);
  const src=attr(tag,'src');if(src?.startsWith('/'))await access(resolve(root,src.slice(1)));
 }
 for(const [tag] of html.matchAll(/<a\b[^>]*>/g)){
  const href=attr(tag,'href');if(!href?.startsWith('/'))continue;
  const path=href.split(/[?#]/)[0];
  await access(resolve(root,path==='/'?'index.html':path.includes('.')?path.slice(1):`${path.slice(1)}/index.html`));
 }
 console.log(`PASS ${route}: metadata, schema, headings, images and route links`);
}
const sitemap=await readFile(resolve(root,'sitemap-0.xml'),'utf8');
for(const route of routes)assert(sitemap.includes(`<loc>https://aicreation.pro${route}</loc>`));
assert(!sitemap.includes('/404'));
const robots=await readFile(resolve(root,'robots.txt'),'utf8');assert(robots.includes('Sitemap: https://aicreation.pro/sitemap-index.xml'));
const missing=await readFile(resolve(root,'404.html'),'utf8');assert(attr(tagFor(missing,'name','robots'),'content').includes('noindex'));
await access(resolve(root,'media/social-preview.jpg'));
console.log('PASS robots.txt, sitemap, social image and noindex 404');
