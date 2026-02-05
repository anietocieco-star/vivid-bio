import { users } from "./users.js";

let cache = {};

export default async function handler(req, res) {
  // BOT zapisuje presence
  if (req.method === "POST") {
    const data = req.body;
    cache[data.id] = data;
    return res.status(200).json({ ok: true });
  }

  // FRONTEND pobiera presence
  if (req.method === "GET") {
    const { user } = req.query;

    const id = users[user];

    if (!id) {
      return res.status(404).json({ error: "user not found" });
    }

    const presence = cache[id];

    if (!presence) {
      return res.status(200).json({
        username: user,
        status: "offline",
        activities: []
      });
    }

    return res.status(200).json(presence);
  }

  res.status(405).end();
}
