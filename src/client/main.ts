/**
 * Mirpo — script do cliente (ES module, carregado com defer implícito).
 */
import { initEngines } from './engine.ts';
import { initHeader, initMega, initDrawer, initReveal, initStatus, initCopy } from './ui.ts';
import { initVideos, initMap, initGallery } from './media.ts';
import { initForms } from './form.ts';
import { initAnalytics, initPrefetch } from './analytics.ts';

const run = (name: string, fn: () => void): void => {
  try {
    fn();
  } catch (err) {
    console.error(`[mirpo] ${name}`, err);
  }
};

run('header', initHeader);
run('mega', initMega);
run('drawer', initDrawer);
run('status', initStatus);
run('engine', initEngines);
run('reveal', initReveal);
run('forms', initForms);
run('videos', initVideos);
run('map', initMap);
run('gallery', initGallery);
run('copy', initCopy);
run('analytics', initAnalytics);
run('prefetch', initPrefetch);
