import {projects as englishProjects, worlds as englishWorlds} from './site';
import {homeWorkflow as englishWorkflow} from './workflows';
import {translate, localizeHref} from '@/i18n/utils';
const t=(text:string)=>translate(text,true);
export const worlds=englishWorlds.map(world=>({...world,title:t(world.title)}));
export const projects=englishProjects.map(project=>({...project,title:t(project.title),marqueeLabel:t(project.marqueeLabel),category:t(project.category),description:t(project.description),href:localizeHref(project.href,true)}));
export const homeWorkflow=englishWorkflow;
