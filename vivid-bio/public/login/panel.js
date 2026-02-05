const supabase = window.supabase.createClient(
  "https://bvodndbkwybvbvyrlsgx.supabase.co",
  "sb_publishable_ZBlIE-DOImuY_i9iphHMxw_T5yDvzy6"
);

async function loadProfile() {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    location.href = "/login";
    return;
  }

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (data) {
    username.value = data.username || "";
    display.value = data.display_name || "";
    bio.value = data.bio || "";
    updatePreview();
  }
}

async function saveProfile() {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  await supabase.from("profiles").update({
    username: username.value,
    display_name: display.value,
    bio: bio.value
  }).eq("id", user.id);

  alert("Zapisano");
  updatePreview();
}

function updatePreview() {
  preview.src = "/bio/" + username.value + ".html";
}

save.onclick = saveProfile;
username.oninput = updatePreview;
display.oninput = updatePreview;
bio.oninput = updatePreview;

loadProfile();