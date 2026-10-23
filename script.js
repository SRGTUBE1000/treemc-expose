(() => {
  const buttons = [...document.querySelectorAll('.image-button')];
  const lightbox = document.getElementById('lightbox');
  const image = document.getElementById('lightbox-image');
  const stage = document.querySelector('.lightbox-stage');
  const count = document.getElementById('lightbox-count');
  const caption = document.getElementById('lightbox-caption');
  const zoomReadout = document.getElementById('zoom-readout');
  let current = 0;
  let lastFocused = null;
  let zoom = 1;
  let zoomOrigin = { x: 50, y: 50 };

  const setZoom = (value, origin = zoomOrigin) => {
    zoom = Math.min(2.5, Math.max(1, value));
    zoomOrigin = origin;
    image.style.transform = `scale(${zoom})`;
    image.style.transformOrigin = `${zoomOrigin.x}% ${zoomOrigin.y}%`;
    zoomReadout.textContent = `${Math.round(zoom * 100)}%`;
  };

  const sourceFor = (index) => buttons[index].querySelector('img');
  const render = (index) => {
    current = (index + buttons.length) % buttons.length;
    const source = sourceFor(current);
    image.src = source.currentSrc || source.src;
    image.alt = source.alt;
    caption.textContent = `${source.alt.replace('TreeMC evidence ', '')}.png`;
    count.textContent = `${String(current + 1).padStart(2, '0')} / ${buttons.length}`;
    setZoom(1, { x: 50, y: 50 });
  };
  const open = (index) => {
    lastFocused = document.activeElement;
    render(index);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    lightbox.querySelector('.lightbox-close').focus();
  };
  const close = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
    image.src = '';
    setZoom(1, { x: 50, y: 50 });
    if (lastFocused) lastFocused.focus();
  };

  buttons.forEach((button) => button.addEventListener('click', () => open(Number(button.dataset.index))));
  lightbox.querySelector('[data-close]').addEventListener('click', close);
  lightbox.querySelector('[data-prev]').addEventListener('click', () => render(current - 1));
  lightbox.querySelector('[data-next]').addEventListener('click', () => render(current + 1));
  lightbox.querySelector('[data-zoom-out]').addEventListener('click', () => setZoom(zoom - 0.25));
  lightbox.querySelector('[data-zoom-reset]').addEventListener('click', () => setZoom(1, { x: 50, y: 50 }));
  lightbox.querySelector('[data-zoom-in]').addEventListener('click', () => setZoom(zoom + 0.25));

  stage.addEventListener('wheel', (event) => {
    if (!lightbox.classList.contains('is-open')) return;
    event.preventDefault();
    const rect = image.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
    const direction = event.deltaY < 0 ? 0.25 : -0.25;
    setZoom(zoom + direction, { x, y });
  }, { passive: false });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') render(current - 1);
    if (event.key === 'ArrowRight') render(current + 1);
    if (event.key === '+' || event.key === '=') setZoom(zoom + 0.25);
    if (event.key === '-') setZoom(zoom - 0.25);
    if (event.key === '0') setZoom(1, { x: 50, y: 50 });
  });
})();
