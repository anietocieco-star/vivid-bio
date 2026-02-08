const rpcText = document.getElementById("rpcText");
const rpcDot = document.querySelector(".rpc .dot");

// pobiera nazwę z URL
const path = window.location.pathname.split("/").pop();
const USER = path || "mrtost";

function renderActivity(data) {
  let text = data.username;

  if (data.activities && data.activities.length > 0) {
    const act = data.activities[0];

    // Spotify
    if (act.type === 2) {
      text = `Listening to ${act.details || act.name}`;
    }
    // gra lub inna aktywność
    else if (act.name) {
      text = act.name;
    }
  }

  rpcText.textContent = text;
  rpcDot.className = "dot " + data.status;
}

async function updatePresence() {
  try {
    const res = await fetch(`/api/presence?user=${USER}`);
    const data = await res.json();
    renderActivity(data);
  } catch {}
}

updatePresence();
setInterval(updatePresence, 4000);
