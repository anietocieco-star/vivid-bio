const nameEl = document.getElementById("rpcName");
const textEl = document.getElementById("rpcText");
const dotEl = document.getElementById("rpcDot");
const avatarEl = document.getElementById("rpcAvatar");

async function updatePresence() {
  try {
    const res = await fetch(
      "https://YOUR-RAILWAY-URL/presence"
    );
    const data = await res.json();

    dotEl.className = "rpc-dot " + data.status;

    if (data.activities?.length) {
      const act = data.activities[0];

      nameEl.textContent = act.name;

      if (act.type === 2 && act.assets) {
        textEl.textContent = "Listening to Spotify";
      } else {
        textEl.textContent = data.status;
      }
    } else {
      nameEl.textContent = "MrTost";
      textEl.textContent = data.status;
    }
  } catch {}
}

updatePresence();
setInterval(updatePresence, 5000);
