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
 await mkdir('src/pages/ar',{recursive:true});await writeFile(`src/pages/ar/${route}.astro`,source);
}
