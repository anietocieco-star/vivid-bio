import fetch from "node-fetch";

export default async function handler(req, res) {
  const userId = process.env.DISCORD_USER_ID;
  const botToken = process.env.DISCORD_BOT_TOKEN;

  const r = await fetch(
    `https://discord.com/api/v10/users/${userId}`,
    {
      headers: {
        Authorization: `Bot ${botToken}`
      }
    }
  );

  const user = await r.json();

  res.json({
    username: user.username,
    avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
  });
}
