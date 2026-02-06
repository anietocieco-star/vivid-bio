(async () => {
  const data = navigator.userAgent + screen.width + screen.height;
  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(data)
  );

  const id = [...new Uint8Array(hash)].reduce((a, b) => a + b, 0);
  let score = Number(localStorage.getItem("fp_score")) || 0;

  score = Math.min(score + 1, 100);
  localStorage.setItem("fp_score", score);

  const hue = 260 - score * 1.4; // purple → red
  document.documentElement.style.setProperty(
    "--aura",
    `hsl(${hue}, 90%, 70%)`
  );
})();
