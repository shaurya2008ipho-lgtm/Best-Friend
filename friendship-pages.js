document.addEventListener('DOMContentLoaded', () => {
  const openButton = document.getElementById('openFirstMemory');
  const note = document.getElementById('firstMemoryNote');
  if (openButton && note) {
    openButton.addEventListener('click', () => {
      const isOpen = openButton.getAttribute('aria-expanded') === 'true';
      openButton.setAttribute('aria-expanded', String(!isOpen));
      if (isOpen) {
        note.classList.remove('is-open');
        window.setTimeout(() => { note.hidden = true; }, 220);
      } else {
        note.hidden = false;
        window.requestAnimationFrame(() => note.classList.add('is-open'));
        openButton.innerHTML = 'Close this memory <span aria-hidden="true">↙</span>';
      }
      if (isOpen) openButton.innerHTML = 'Open this memory <span aria-hidden="true">↗</span>';
    });
  }

  // Soft, restrained star twinkle with motion disabled automatically for accessibility.
  const sky = document.querySelector('.night-sky');
  if (sky && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const count = 42;
    for (let i = 0; i < count; i += 1) {
      const star = document.createElement('span');
      star.className = 'generated-star';
      star.style.left = `${(i * 37.7 + 11) % 100}%`;
      star.style.top = `${(i * 61.3 + 7) % 76}%`;
      star.style.setProperty('--twinkle-delay', `${(i % 9) * -0.47}s`);
      star.style.setProperty('--twinkle-duration', `${2.2 + (i % 5) * 0.55}s`);
      sky.appendChild(star);
    }
  }
});
