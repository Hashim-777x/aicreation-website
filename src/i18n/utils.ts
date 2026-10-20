import ar from './ar.json';
const dictionary = ar as Record<string,string>;
export const isArabic = (path:string) => /^\/ar(?:\/|$)/.test(path);
export const basePath = (path:string) => path.replace(/^\/ar(?=\/|$)/,'').replace(/\/$/,'') || '/';
export function localizeHref(href:string, arabic:boolean){
 if(!arabic || !href.startsWith('/') || href.startsWith('//') || /^\/ar(?:\/|$)/.test(href))return href;
 return href==='/'?'/ar':`/ar${href}`;
}
export const translate = (text:string, arabic:boolean) => arabic ? dictionary[text] ?? text : text;
