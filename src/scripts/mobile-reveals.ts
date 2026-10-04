const mobile = window.matchMedia('(max-width: 899px)');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
let observer: IntersectionObserver | undefined;
const initialize = () => {
 observer?.disconnect();
 document.querySelectorAll<HTMLElement>('[data-mobile-ready]').forEach(el => el.removeAttribute('data-mobile-ready'));
 if (!mobile.matches || reduced.matches) return;
 document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => el.dataset.visible = 'true');
 observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
   if (!entry.isIntersecting) return;
   const element = entry.target as HTMLElement;
   element.dataset.mobileVisible = 'true';
   observer?.unobserve(element);
  });
 }, { threshold: .05, rootMargin: '0px 0px -24px 0px' });
 const targets = document.querySelectorAll<HTMLElement>('main h1, main h2, main h3, main p, main picture, main .cta, .hero-copy h1>span, .workflow-node-wrap, .project-sequence__copy, .workflow-story li, .detail-node, .footer-message h2, .footer-content .contact-form, .footer-nav');
 targets.forEach((el, index) => {
  if (el.matches('.hero h1') || el.closest('.work-stage,.hero-media,.workflow-node-wrap,.project-sequence__copy,.workflow-story li,.detail-node') !== null && !el.matches('.workflow-node-wrap,.project-sequence__copy,.workflow-story li,.detail-node')) return;
  if (el.dataset.mobileVisible === 'true') return;
  el.dataset.mobileReveal = 'true';
  el.dataset.mobileReady = 'true';
  const distance = el.matches('.cta') ? 10 : el.matches('p') ? 14 : el.matches('picture') ? 18 : 20;
  el.style.setProperty('--mobile-reveal-y', `${distance}px`);
  el.style.setProperty('--mobile-reveal-delay', `${index % 3 * 60}ms`);
  observer?.observe(el);
 });
};
initialize();
mobile.addEventListener('change', initialize);
reduced.addEventListener('change', initialize);
