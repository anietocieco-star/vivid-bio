import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token =
    req.cookies && typeof req.cookies.discord_token === "string"
      ? req.cookies.discord_token
      : null;

  if (!token) {
    res.status(401).json({ error: "not_logged_in" });
    return;
  }

  const userRes = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  if (!userRes.ok) {
    res.status(401).json({ error: "invalid_token" });
    return;
  }

  const user = await userRes.json();

  res.json({
    username: user.username,
    avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
    status: "online" // fallback UI (legalne)
  });
}
