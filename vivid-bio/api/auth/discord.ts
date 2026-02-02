import type { VercelRequest, VercelResponse } from "@vercel/node";
export const config = {
  runtime: "edge"
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const code = typeof req.query.code === "string" ? req.query.code : null;

  // 1️⃣ Redirect do Discorda
  if (!code) {
    const url =
      "https://discord.com/api/oauth2/authorize" +
      "?client_id=" + process.env.DISCORD_CLIENT_ID +
      "&redirect_uri=" + encodeURIComponent(process.env.DISCORD_REDIRECT_URI || "") +
      "&response_type=code" +
      "&scope=identify";

    res.statusCode = 302;
    res.setHeader("Location", url);
    res.end();
    return;
  }

  // 2️⃣ Wymiana code → token
  const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID || "",
      client_secret: process.env.DISCORD_CLIENT_SECRET || "",
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.DISCORD_REDIRECT_URI || ""
    })
  });

  const token = await tokenRes.json();

  if (!token || !token.access_token) {
    res.status(400).send("OAuth failed");
    return;
  }

  // 3️⃣ Cookie
  res.setHeader(
    "Set-Cookie",
    `discord_token=${token.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax`
  );

  // 4️⃣ Powrót
  res.statusCode = 302;
  res.setHeader("Location", "/");
  res.end();
}

