const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const narrow = matchMedia('(max-width: 767px)');
type Connection = { saveData?: boolean };
const connection = (navigator as Navigator & { connection?: Connection }).connection;
for (const stage of document.querySelectorAll<HTMLElement>('[data-loop-media]')) {
  const video = stage.querySelector('video')!;
  const toggle = stage.querySelector<HTMLButtonElement>('button')!;
  let visible = false;
  let pausedByUser = false;
  let failed = false;
  let generation = 0;
  const source = () => narrow.matches ? stage.dataset.mobile : stage.dataset.desktop;
  const reset = () => {
    generation++;
    video.pause(); video.removeAttribute('src'); video.load();
    stage.removeAttribute('data-playing'); toggle.hidden = true;
  };
  const update = async () => {
    if (!visible || document.hidden || reduced.matches || connection?.saveData || pausedByUser || failed || !source()) {
      video.pause(); return;
    }
    if (!video.hasAttribute('src')) { video.src = source()!; video.muted = true; video.load(); }
    const current = ++generation;
    try {
      await video.play();
      if (current !== generation || !visible || document.hidden || reduced.matches || pausedByUser) { video.pause(); return; }
      stage.setAttribute('data-playing', ''); toggle.hidden = false;
      toggle.textContent = 'Pause'; toggle.setAttribute('aria-label','Pause video');
    } catch { if (current === generation) { stage.removeAttribute('data-playing'); toggle.hidden = true; } }
  };
  toggle.addEventListener('click', () => {
    pausedByUser = !pausedByUser;
    toggle.textContent = pausedByUser ? 'Play' : 'Pause';
    toggle.setAttribute('aria-label', pausedByUser ? 'Play video' : 'Pause video');
    void update();
  });
  video.addEventListener('error', () => { failed = true; reset(); });
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting; if (!visible) generation++; void update();
  }, {threshold: .15});
  observer.observe(stage);
  reduced.addEventListener('change', () => { reset(); void update(); });
  narrow.addEventListener('change', () => { failed = false; reset(); void update(); });
  document.addEventListener('visibilitychange', () => { generation++; void update(); });
}

export {};
