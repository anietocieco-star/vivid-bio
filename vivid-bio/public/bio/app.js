/* =========================
   ELEMENTS
========================= */
const audio = document.getElementById("audio"); // <video id="audio">
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
let lastSliderVolume = 1;

/* =========================
   HUD – ONLY HOVER (START HIDDEN)
========================= */
hud.classList.remove("show");

hud.addEventListener("mouseenter", () => {
  if (!unlocked) return;
  hud.classList.add("show");
});

hud.addEventListener("mouseleave", () => {
  hud.classList.remove("show");
});

/* =========================
   LOAD SAVED SETTINGS
========================= */
const savedSlider = localStorage.getItem("volume");
const savedPlaying = localStorage.getItem("playing");

const startSlider = savedSlider !== null ? Number(savedSlider) : 1;
volume.value = startSlider * 100;
lastSliderVolume = startSlider;

audio.volume = startSlider;
audio.muted = true;
playing = savedPlaying === "1";
updateIcon();

gate.addEventListener("click", () => {
  if (unlocked) return;
  unlocked = true;

  audio.pause();          // 🔥 RESET
  audio.currentTime = 0;  // 🔥 WYMUSZENIE STARTU
  audio.muted = false;
  audio.volume = volume.value / 100;

  audio.play().then(() => {
    playing = true;
    updateIcon();
  }).catch(() => {
    console.warn("Video audio blocked by browser");
  });

  gate.classList.add("hide");
});


/* =========================
   PLAY / PAUSE (SPACE)
========================= */
document.addEventListener("keydown", e => {
  if (e.code !== "Space") return;
  e.preventDefault();
  if (!unlocked) return;

  playing = !playing;
  playing ? audio.play() : audio.pause();

  localStorage.setItem("playing", playing ? "1" : "0");
  updateIcon();
});

/* =========================
   VOLUME SLIDER (MP4)
========================= */
volume.addEventListener("input", () => {
  const v = volume.value / 100;
  audio.volume = v;

  if (v > 0) lastSliderVolume = v;
  localStorage.setItem("volume", v);

  updateIcon();
});

/* =========================
   MUTE / UNMUTE
========================= */
hudIcon.addEventListener("click", e => {
  e.stopPropagation();
  if (!unlocked) return;

  if (audio.volume > 0) {
    lastSliderVolume = audio.volume;
    audio.volume = 0;
    volume.value = 0;
  } else {
    audio.volume = lastSliderVolume || 1;
    volume.value = audio.volume * 100;
    audio.play().catch(()=>{});
  }

  localStorage.setItem("volume", lastSliderVolume);
  updateIcon();
});

/* =========================
   ICON UPDATE
========================= */
function updateIcon() {
  hudIcon.className =
    audio.volume === 0 || audio.muted
      ? "fa-solid fa-volume-xmark"
      : "fa-solid fa-volume-high";
}

audio.addEventListener("play", () => {
  playing = true;
  updateIcon();
});

audio.addEventListener("pause", () => {
  playing = false;
  updateIcon();
});

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
enableGyro();