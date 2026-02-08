const SUPABASE_URL = "https://bvodndbkwybvbvyrlsgx.supabase.co";
const SUPABASE_KEY = "sb_publishable_ZBlIE-DOImuY_i9iphHMxw_T5yDvzy6";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const username = document.getElementById("username");
const display = document.getElementById("display_name");
const bio = document.getElementById("bio");
const privateBox = document.getElementById("private");
const avatar = document.getElementById("avatar");
const background = document.getElementById("background");
const frame = document.getElementById("previewFrame");

const saveBtn = document.getElementById("save");
const logoutBtn = document.getElementById("logout");

const linksContainer = document.getElementById("linksContainer");
const addLinkBtn = document.getElementById("addLink");

let userId = null;
let links = [];

/* =========================
   LOAD PROFILE
========================= */
async function init() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return location.href = "/login";

  userId = user.id;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (data) {
    username.value = data.username || "";
    display.value = data.display_name || "";
    bio.value = data.bio || "";
    privateBox.checked = data.is_private || false;

    if (data.links) {
      links = data.links;
      renderLinks();
    }

    updatePreview(data.username);
  }
}

init();

/* =========================
   TABS
========================= */
document.querySelectorAll(".tab").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".tab")
      .forEach(t => t.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".section")
      .forEach(s => s.classList.remove("active"));

    document.getElementById(btn.dataset.tab)
      .classList.add("active");
  };
});

/* =========================
   LINKS SYSTEM
========================= */
function renderLinks() {
  linksContainer.innerHTML = "";

  links.forEach((link, i) => {
    const row = document.createElement("div");
    row.className = "linkRow";

    row.innerHTML = `
      <input value="${link.name}" placeholder="Nazwa">
      <input value="${link.url}" placeholder="URL">
      <button class="ghost">✕</button>
    `;

    const inputs = row.querySelectorAll("input");
    const remove = row.querySelector("button");

    inputs[0].oninput = e => links[i].name = e.target.value;
    inputs[1].oninput = e => links[i].url = e.target.value;

    remove.onclick = () => {
      links.splice(i, 1);
      renderLinks();
    };

    linksContainer.appendChild(row);
  });
}

addLinkBtn.onclick = () => {
  links.push({ name: "", url: "" });
  renderLinks();
};

/* =========================
   UPLOAD FILE
========================= */
async function upload(file, bucket) {
  const path = `${userId}/${Date.now()}_${file.name}`;

  const { error } = await supabase
    .storage
    .from(bucket)
    .upload(path, file);

  if (error) {
    console.error(error);
    return null;
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

/* =========================
   SAVE PROFILE
========================= */
saveBtn.onclick = async () => {
  let avatarUrl = null;
  let bgUrl = null;

  if (avatar.files[0]) {
    avatarUrl = await upload(avatar.files[0], "avatars");
  }

  if (background.files[0]) {
    bgUrl = await upload(background.files[0], "backgrounds");
  }

  await supabase
    .from("profiles")
    .upsert({
      id: userId,
      username: username.value,
      display_name: display.value,
      bio: bio.value,
      avatar: avatarUrl,
      background: bgUrl,
      is_private: privateBox.checked,
      links: links
    });

  updatePreview(username.value);
};

/* =========================
   LIVE PREVIEW
========================= */
function updatePreview(name) {
  if (!name) return;
  frame.src = `/bio/profile.html?u=${name}&t=${Date.now()}`;
}

username.oninput = () => updatePreview(username.value);

/* =========================
   LOGOUT
========================= */
logoutBtn.onclick = async () => {
  await supabase.auth.signOut();
  location.href = "/login";
};
