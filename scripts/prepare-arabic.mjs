// Maintains equivalent source pages; shared UI/data translations live in src/i18n.
// Run intentionally after changing English page copy, then review the generated Arabic sources.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const dictionary=JSON.parse(await readFile('src/i18n/ar.json','utf8'));
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
for(const route of ['index','work','ai-creative','agents','studio','contact']){
 let source=await readFile(`src/pages/${route}.astro`,'utf8');
 // Keep imports, identifiers and scripts intact; only complete words/phrases are replaced.
 const pattern=new RegExp(`(?<![\\w-])(?:${Object.keys(dictionary).sort((a,b)=>b.length-a.length).map(escape).join('|')})(?![\\w-])`,'g');
 const parts=source.split(/(<script\b[\s\S]*?<\/script>)/g);
 source=parts.map(part=>part.startsWith('<script')?part:part.replace(pattern,key=>dictionary[key])).join('');
 source=source.replaceAll("from '@/data/site'","from '@/data/arabic-site'");
 source=source.replaceAll('href="/','href="/ar/').replaceAll("href:'/","href:'/ar/");
 if(route==='index'){
  source=source.replace("const desktopLayout = window.matchMedia('(min-width: 900px)');", "const desktopLayout = window.matchMedia('(min-width: 1280px)');");
  source=source.replace(/\s*const inward = Math.max\(48, Math.min\(110, window.innerWidth \* .065\)\);/,'');
  source=source.replace(/\s*const outward = Math.max\(16, Math.min\(34, window.innerWidth \* .02\)\);/,'');
  source=source.replace('const spread = inward - progress * (inward + outward);', `const rtlInward = Math.min(48, window.innerWidth * .035);
      const rtlOutward = Math.min(12, window.innerWidth * .008);
      const spread = -(rtlInward - progress * (rtlInward + rtlOutward));`);
  source=source.replaceAll('normalized * -24','normalized * 10').replaceAll('normalized * 24','normalized * -10');
 }
 await mkdir('src/pages/ar',{recursive:true});await writeFile(`src/pages/ar/${route}.astro`,source);
}
