export function structuredDataFor(route: string, canonical: string, title: string, description: string, language = 'en') {
  const origin = 'https://aicreation.pro';
  const organization = {
    '@type': 'Organization', '@id': `${origin}/#organization`, name: 'AIcreation.pro',
    url: `${origin}/`, logo: `${origin}/media/logo-symbol-black.svg`,
    description: 'A creative and engineering studio for human-directed AI imagery, films and workflow automation.',
  };
  const pageType = route === '/contact' ? 'ContactPage' : route === '/studio' ? 'AboutPage' : route === '/work' ? 'CollectionPage' : 'WebPage';
  const service = route === '/ai-creative' ? { name: 'AI creative production', serviceType: ['AI product imagery', 'Fashion campaign imagery', 'Property visuals', 'Short brand films'] }
    : route === '/agents' ? { name: 'AI workflow automation', serviceType: ['Enquiry workflows', 'Property lead workflows', 'Content approval workflows'] } : undefined;
  const page = {
    '@type': pageType, '@id': `${canonical}#webpage`, url: canonical, name: title, description,
    inLanguage: language, isPartOf: {'@id':`${origin}/#website`}, about: {'@id':organization['@id']},
    ...(service ? {mainEntity: {'@id':`${canonical}#service`}} : {}),
  };
  return {'@context':'https://schema.org', '@graph':[
    organization,
    {'@type':'WebSite','@id':`${origin}/#website`,url:`${origin}/`,name:'AIcreation.pro',publisher:{'@id':organization['@id']},inLanguage:['en','ar']},
    page,
    ...(service ? [{'@type':'Service','@id':`${canonical}#service`,...service,url:canonical,description,provider:{'@id':organization['@id']}}] : []),
  ]};
}
