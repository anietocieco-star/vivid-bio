const SUPABASE_URL = "https://bvodndbkwybvbvyrlsgx.supabase.co";
const SUPABASE_KEY = "sb_publishable_ZBlIE-DOImuY_i9iphHMxw_T5yDvzy6";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const email = document.getElementById("email");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");
const msg = document.getElementById("msg");

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const toggle = document.getElementById("toggle");
const title = document.getElementById("title");

let registerMode = false;

function show(text, ok=false){
  msg.textContent = text;
  msg.style.color = ok ? "#7CFFB2" : "#ff7c7c";
}

/* =========================
   TOGGLE LOGIN/REGISTER
========================= */
toggle.onclick = () => {
  registerMode = !registerMode;

  if(registerMode){
    title.textContent = "Rejestracja";
    password2.classList.remove("hidden");
    registerBtn.classList.remove("hidden");
    loginBtn.classList.add("hidden");
    toggle.textContent = "Masz konto? Zaloguj się";
  }else{
    title.textContent = "Logowanie";
    password2.classList.add("hidden");
    registerBtn.classList.add("hidden");
    loginBtn.classList.remove("hidden");
    toggle.textContent = "Nie masz konta? Zarejestruj się";
  }
};

/* =========================
   LOGIN
========================= */
loginBtn.onclick = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  });

  if(error) return show(error.message);

  location.href = "/login/panel.html";
};

/* =========================
   REGISTER
========================= */
registerBtn.onclick = async () => {
  if(password.value !== password2.value)
    return show("Hasła nie są takie same");

  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options:{
      emailRedirectTo: location.origin + "/login"
    }
  });

  if(error) return show(error.message);

  show("Sprawdź skrzynkę email", true);
};

/* =========================
   RESET
========================= */
document.getElementById("reset").onclick = async () => {
  const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo: location.origin + "/login"
  });

  if(error) return show(error.message);

  show("Mail resetujący wysłany", true);
};

/* =========================
   OAUTH
========================= */
document.getElementById("google").onclick = () => {
  supabase.auth.signInWithOAuth({
    provider: "google",
    options:{ redirectTo: location.origin + "/login/panel.html" }
  });
};

document.getElementById("github").onclick = () => {
  supabase.auth.signInWithOAuth({
    provider: "github",
    options:{ redirectTo: location.origin + "/login/panel.html" }
  });
};
