import anime from 'animejs/lib/anime.es.js';

export const animateStagger = (selector, delay = 100) => {
  anime({
    targets: selector,
    translateY: [20, 0],
    opacity: [0, 1],
    easing: 'easeOutExpo',
    duration: 800,
    delay: anime.stagger(delay)
  });
};
