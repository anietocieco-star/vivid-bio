import { Client, GatewayIntentBits } from "discord.js";
import fetch from "node-fetch";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildPresences
  ]
});

const API_URL = process.env.API_URL;

client.once("clientReady", () => {
  console.log(`Bot online jako ${client.user.tag}`);
});

client.on("presenceUpdate", async (_, presence) => {
  if (!presence?.userId) return;

  const user = presence.user;

  const activities = presence.activities.map(a => ({
    name: a.name,
    type: a.type,
    details: a.details,
    state: a.state
  }));

  const data = {
    id: user.id,
    username: user.username,
    avatar: user.displayAvatarURL(),
    status: presence.status,
    activities
  };

  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  } catch (e) {
    console.error("Presence error:", e);
  }
});

client.login(process.env.BOT_TOKEN);
