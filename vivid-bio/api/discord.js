export default function handler(req, res) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirect = process.env.DISCORD_REDIRECT_URI;

  const url =
    "https://discord.com/api/oauth2/authorize" +
    `?client_id=${clientId}` +
    "&response_type=code" +
    "&scope=identify" +
    `&redirect_uri=${encodeURIComponent(redirect)}`;

  res.redirect(url);
}
