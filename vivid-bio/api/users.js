import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const username = req.query.u;

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (!data) {
    res.status(404).send("Profil nie istnieje");
    return;
  }

  res.redirect(`/bio/${username}.html`);
}
