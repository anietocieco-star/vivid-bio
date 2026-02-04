import WebSocket from "ws";
import express from "express";

const TOKEN = process.env.DISCORD_USER_TOKEN;
const USER_ID = process.env.DISCORD_USER_ID;

let presence = {
  status: "offline",
  activities: []
};

const app = express();

app.get("/presence", (req, res) => {
  res.json(presence);
});

app.listen(3000, () => {
  console.log("Presence server running");
});

const ws = new WebSocket("wss://gateway.discord.gg/?v=10&encoding=json");

ws.on("message", (msg) => {
  const data = JSON.parse(msg);

  if (data.op === 10) {
    setInterval(() => {
      ws.send(JSON.stringify({ op: 1, d: null }));
    }, data.d.heartbeat_interval);

    ws.send(JSON.stringify({
      op: 2,
      d: {
        token: TOKEN,
        properties: {
          os: "linux",
          browser: "chrome",
          device: "chrome"
        }
      }
    }));
  }

  if (data.t === "PRESENCE_UPDATE") {
    if (data.d.user.id === USER_ID) {
      presence = {
        status: data.d.status,
        activities: data.d.activities
      };
    }
  }
});
