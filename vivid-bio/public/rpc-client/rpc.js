/* =========================
   ELEMENTS
========================= */
const rpc = document.querySelector(".rpc");
const rpcText = document.getElementById("rpcText");
const dot = rpc.querySelector(".dot");
const audio = document.getElementById("audio");

/* =========================
   STATE
========================= */
let loopTimer = null;
let idleTimer = null;
let fadeTimer = null;
let isIdle = false;
let started = false;

/* =========================
   CONFIG
========================= */
const STATES = [
  { text: "Watching YouTube", dot: "online" },
  { text: "Browsing profiles", dot: "online" },
  { text: "In voice channel", dot: "online" },
  { text: "Idle", dot: "idle" }
];

/* =========================
   TYPING EFFECT
========================= */
function typeText(text) {
  rpcText.textContent = "typing…";

  setTimeout(() => {
    let i = 0;
    function step() {
      if (i <= text.length) {
        rpcText.textContent = text.slice(0, i);
        i++;
        setTimeout(step, 22);
      }
    }
    step();
  }, 400);
}

/* =========================
   SET PRESENCE
========================= */
function setPresence(text, state) {
  showRPC();
  dot.className = "dot " + state;
  typeText(text);
}

/* =========================
   LOOP
========================= */
function loopPresence() {
  if (isIdle) return;

  const s = STATES[Math.floor(Math.random() * STATES.length)];
  setPresence(s.text, s.dot);

  loopTimer = setTimeout(loopPresence, 2400 + Math.random() * 2000);
}

/* =========================
   IDLE / FADE
========================= */
function showRPC() {
  rpc.classList.remove("fade");
  clearTimeout(fadeTimer);

  fadeTimer = setTimeout(() => {
    rpc.classList.add("fade");
  }, 9000);
}

function resetIdle() {
  isIdle = false;
  clearTimeout(idleTimer);

  idleTimer = setTimeout(() => {
    isIdle = true;
    setPresence("Do Not Disturb", "dnd");
  }, 8000);
}

/* =========================
   AUDIO SYNC
========================= */
audio.addEventListener("play", () => {
  setPresence("Listening to music", "online");
  resetIdle();
});

audio.addEventListener("pause", () => {
  setPresence("Idle", "idle");
  resetIdle();
});

/* =========================
   USER ACTIVITY
========================= */
["mousemove", "mousedown", "keydown", "touchstart"].forEach(evt => {
  document.addEventListener(evt, () => {
    if (!started) return;
    showRPC();
    resetIdle();
  });
});

/* =========================
   START (FIX)
========================= */
function startRPC() {
  if (started) return;
  started = true;

  dot.className = "dot online";
  rpcText.textContent = "Connecting to Discord…";

  setTimeout(() => {
    setPresence("Online", "online");
    resetIdle();
    loopPresence();
  }, 1200);
}

/* HARD START */
setTimeout(startRPC, 1000);
window.addEventListener("load", startRPC);
