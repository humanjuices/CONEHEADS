const img_array = document.getElementsByClassName("image");

for (var i = 0; i < img_array.length; i++) {
  img_array[i].style.top = Math.floor(Math.random()*5500)+"px";
  img_array[i].style.left = Math.floor(Math.random()*90)+"vw";
}

// document.getElementById("safety-first-button").addEventListener("click", loadAudio());

let __autoScrollRaf = 0;
let __autoScrollActive = false;

function stopAutoScroll() {
  __autoScrollActive = false;
  if (__autoScrollRaf) cancelAnimationFrame(__autoScrollRaf);
  __autoScrollRaf = 0;
}

function ensureScrollableHeight() {
  // Absolute-positioned elements don't necessarily extend document height.
  // Compute the lowest bottom edge and set body height so the page can scroll.
  const els = Array.from(document.querySelectorAll('#container img, #container button'));
  let maxBottom = 0;
  for (const el of els) {
    const r = el.getBoundingClientRect();
    // Convert viewport coords -> document coords
    const bottom = r.bottom + window.scrollY;
    if (Number.isFinite(bottom)) maxBottom = Math.max(maxBottom, bottom);
  }

  // Add breathing room so the user can scroll past the last element.
  const target = Math.max(maxBottom + 800, window.innerHeight + 2000);
  document.body.style.height = `${Math.ceil(target)}px`;
}

function startAutoScroll() {
  if (__autoScrollActive) return;
  __autoScrollActive = true;

  // Ensure the page is actually scrollable before we start.
  ensureScrollableHeight();

  // Very slow scroll (px/sec) — slow but perceptible
  const SPEED = 18;
  let lastT = performance.now();

  const tick = (t) => {
    if (!__autoScrollActive) return;
    const dt = Math.min(0.05, Math.max(0, (t - lastT) / 1000));
    lastT = t;

    // Recompute occasionally in case layout shifts after images load.
    // (cheap enough, and keeps autoscroll reliable)
    ensureScrollableHeight();

    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    if (window.scrollY >= maxScroll - 1) {
      stopAutoScroll();
      return;
    }

    window.scrollTo(0, window.scrollY + SPEED * dt);
    __autoScrollRaf = requestAnimationFrame(tick);
  };

  // Stop auto-scroll if the user manually scrolls/touches.
  window.addEventListener('wheel', stopAutoScroll, { passive: true, once: true });
  window.addEventListener('touchstart', stopAutoScroll, { passive: true, once: true });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ' || e.key === 'End') {
      stopAutoScroll();
    }
  }, { once: true });

  __autoScrollRaf = requestAnimationFrame((t) => {
    lastT = t;
    tick(t);
  });
}

function loadAudio() {

  console.log("Entered loadAudio()")

  var audio_module = document.createElement("audio");
  audio_module.src = "audio/musictoears.mp3";
  // audio_module.controls = 'controls autoplay';
  audio_module.setAttribute("preload", "auto");
  audio_module.setAttribute("controls", "autoplay");
  audio_module.style.display = "none";
  audio_module.type = 'audio/mp3';

  document.body.appendChild(audio_module);

  audio_module.play();

  document.getElementById("safety-first-button").style.display = "none";
}
