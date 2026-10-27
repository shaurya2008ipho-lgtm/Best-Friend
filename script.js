const revealEls = document.querySelectorAll('.reveal-on-scroll');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });
revealEls.forEach(el => observer.observe(el));

const sketchReveal = document.getElementById('sketchReveal');
const drawingHand = document.getElementById('drawingHand');
const drawShadow = document.getElementById('drawShadow');
const drawCaption = document.getElementById('drawCaption');
const progressText = document.getElementById('progressText');
const progressFill = document.getElementById('progressFill');
const drawAgain = document.getElementById('drawAgain');
const lines = [...document.querySelectorAll('.line')];
let drawingTimer = null;

const captions = [
  [0, 'first strokes…'],
  [22, 'finding the shape…'],
  [45, 'adding those little details…'],
  [70, 'bringing out the smile…'],
  [90, 'almost there…'],
  [100, 'done. ♡']
];

function captionFor(p){
  let current = captions[0][1];
  for (const [threshold, text] of captions) if (p >= threshold) current = text;
  return current;
}

function setDrawing(progress){
  const p = Math.max(0, Math.min(100, progress));
  // Reveal more of the portrait from bottom to top as the hand travels.
  sketchReveal.style.clipPath = `inset(${100-p}% 0 0 0)`;
  progressFill.style.width = `${p}%`;
  progressText.textContent = `${Math.round(p)}%`;
  drawCaption.textContent = captionFor(p);
  drawCaption.style.opacity = p > 3 ? '1' : '0';

  const y = 78 - p * 0.59;
  const x = 14 + 70 * Math.sin((p / 100) * Math.PI * 1.35) + 12 * (p/100);
  drawingHand.style.left = `${x}%`;
  drawingHand.style.top = `${y}%`;
  drawingHand.style.opacity = p > 0 && p < 100 ? '1' : p >= 100 ? '0' : '0';
  drawingHand.style.transform = `translate(-50%,-50%) rotate(${ -17 + Math.sin(p/14)*7 }deg) scale(${window.innerWidth < 640 ? .78 : 1})`;
  drawShadow.style.opacity = p > 7 && p < 92 ? '.55' : '0';

  lines.forEach((line, i) => {
    const start = [10, 32, 58, 76][i];
    const local = Math.max(0, Math.min(1, (p-start)/22));
    line.style.strokeDashoffset = `${900*(1-local)}`;
  });
}

function playDrawing(){
  clearInterval(drawingTimer);
  let p = 0;
  setDrawing(0);
  const start = performance.now();
  const duration = 7200;
  function frame(now){
    p = ((now-start)/duration)*100;
    // Slow-start / slow-finish so it feels like a person drawing.
    const eased = p < 50 ? 2*(p/100)*(p/100)*100 : 100-(Math.pow(-2*p/100+2,2)/2)*100;
    setDrawing(p);
    if (p < 100) requestAnimationFrame(frame);
    else { setDrawing(100); drawingHand.style.opacity='0'; }
  }
  requestAnimationFrame(frame);
}

drawAgain.addEventListener('click', playDrawing);

const drawingObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      playDrawing();
      drawingObserver.disconnect();
    }
  });
}, { threshold: 0.32 });

drawingObserver.observe(document.getElementById('drawingStage'));

// Tiny paper-scribble parallax on mouse movement.
window.addEventListener('pointermove', e => {
  const x = (e.clientX/window.innerWidth - .5);
  const y = (e.clientY/window.innerHeight - .5);
  document.querySelectorAll('.doodle, .sparkle').forEach((el, i) => {
    el.style.transform = `translate(${x*(8+i*2)}px, ${y*(6+i*1.5)}px) rotate(${i%2?4:-3}deg)`;
  });
});
