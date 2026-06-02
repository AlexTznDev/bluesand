import './styles/index.scss';
import './components/animation';

import './components/slider';
import './components/smoothScroll';

window.Webflow ||= [];
window.Webflow.push(() => {
  let lastWidth = window.innerWidth;
  let resizeTimeout;
  window.addEventListener('resize', () => {
    const currentWidth = window.innerWidth;
    if (currentWidth !== lastWidth) {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        location.reload();
      }, 500);
    }
    lastWidth = currentWidth;
  });
});
