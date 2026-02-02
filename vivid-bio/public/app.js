/* =========================
   ELEMENTS
========================= */
const audio = document.getElementById("audio");
const gate = document.getElementById("audioGate");
const volume = document.getElementById("volume");
const bg = document.querySelector(".bg-video");
const hud = document.querySelector(".audio-hud");
const hudIcon = hud.querySelector("i");

/* =========================
   STATE
========================= */
let unlocked = false;
let playing = false;
let idleTimer = null;
let lastSliderVolume = 1;

/* =========================
   HUD VISIBILITY
========================= */
function showHud() {
  hud.classList.add("show");
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    hud.classList.remove("show");
  }, 3000);
}

["mousemove", "mousedown", "keydown", "touchstart"].forEach(evt => {
  document.addEventListener(evt, () => {
    if (unlocked) showHud();
  });
});

hud.addEventListener("mouseenter", showHud);

/* =========================
   LOAD SAVED SETTINGS
========================= */
const savedSlider = localStorage.getItem("volume");
const savedPlaying = localStorage.getItem("playing");

const startSlider = savedSlider !== null ? Number(savedSlider) : 1;
volume.value = startSlider * 100;
lastSliderVolume = startSlider;

audio.volume = startSlider; // LINEAR volume — vivid-bio style
playing = savedPlaying === "1";
updateIcon();

/* =========================
   AUDIO UNLOCK (NO FADE @ 100)
========================= */
gate.addEventListener("click", async () => {
  if (unlocked) return;
  unlocked = true;

  await audio.play();
  playing = true;

  // jeśli slider = 100%, ustaw 1 od razu
  const slider = volume.value / 100;
  audio.volume = slider;

  gate.classList.add("hide");
  showHud();
  updateIcon();
});

/* =========================
   PLAY / PAUSE (SPACE)
========================= */
document.addEventListener("keydown", e => {
  if (e.code === "Space") {
    e.preventDefault();
    togglePlay();
  }
});

function togglePlay() {
  if (!unlocked) return;

  playing = !playing;
  playing ? audio.play() : audio.pause();

  localStorage.setItem("playing", playing ? "1" : "0");
  updateIcon();
  showHud();
}

/* =========================
   VOLUME SLIDER
========================= */
volume.addEventListener("input", () => {
  const slider = volume.value / 100;
  audio.volume = slider;

  if (slider > 0) lastSliderVolume = slider;
  localStorage.setItem("volume", slider);

  updateIcon();
  showHud();
});

/* =========================
   MUTE / UNMUTE
========================= */
hudIcon.addEventListener("click", e => {
  e.stopPropagation();

  const slider = volume.value / 100;
  if (slider > 0) {
    lastSliderVolume = slider;
    audio.volume = 0;
    volume.value = 0;
  } else {
    audio.volume = lastSliderVolume || 1;
    volume.value = (lastSliderVolume || 1) * 100;
    if (unlocked && audio.paused) audio.play();
  }

  localStorage.setItem("volume", lastSliderVolume);
  updateIcon();
  showHud();
});

/* =========================
   ICON UPDATE
========================= */
function updateIcon() {
  hudIcon.className =
    audio.volume === 0
      ? "fa-solid fa-volume-xmark"
      : "fa-solid fa-volume-high";
}

/* sync icon on play/pause */
audio.addEventListener("play", updateIcon);
audio.addEventListener("pause", updateIcon);

/* =========================
   PARALLAX (DESKTOP)
========================= */
document.addEventListener("pointermove", e => {
  const x = (e.clientX / innerWidth - 0.5) * 10;
  const y = (e.clientY / innerHeight - 0.5) * 10;
  bg.style.transform = `scale(1.08) translate(${x}px,${y}px)`;
});

/* =========================
   GYRO (MOBILE)
========================= */
async function enableGyro() {
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    const res = await DeviceOrientationEvent.requestPermission();
    if (res !== "granted") return;
  }

  window.addEventListener("deviceorientation", e => {
    const x = (e.gamma || 0) / 4;
    const y = (e.beta || 0) / 6;
    bg.style.transform = `scale(1.08) translate(${x}px,${y}px)`;
  });
}

gate.addEventListener("click", enableGyro);
