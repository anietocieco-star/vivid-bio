import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const { username } = req.query;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!data) {
    res.status(404).send("Not found");
    return;
  }

  res.writeHead(302, {
    Location: `/bio/${username}.html`
  });
  res.end();
}
