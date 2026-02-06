const SUPABASE_URL = "https://bvodndbkwybvbvyrlsgx.supabase.co";
const SUPABASE_KEY = "sb_publishable_ZBlIE-DOImuY_i9iphHMxw_T5yDvzy6";

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const email = document.getElementById("email");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");
const otp = document.getElementById("otp");

const title = document.getElementById("title");
const msg = document.getElementById("msg");

const mainBtn = document.getElementById("mainBtn");
const verifyBtn = document.getElementById("verifyBtn");
const toggle = document.getElementById("toggle");
const reset = document.getElementById("reset");

let isRegister = true;
let waitingForOtp = false;

function show(text) {
  msg.textContent = text;
}

function setMode(register) {
  isRegister = register;
  waitingForOtp = false;

  otp.classList.add("hidden");
  verifyBtn.classList.add("hidden");

  if (register) {
    title.textContent = "Rejestracja";
    password2.classList.remove("hidden");
    mainBtn.textContent = "Utwórz konto";
    toggle.textContent = "Masz konto? Zaloguj się";
    reset.classList.add("hidden");
  } else {
    title.textContent = "Logowanie";
    password2.classList.add("hidden");
    mainBtn.textContent = "Zaloguj";
    toggle.textContent = "Nie masz konta? Zarejestruj się";
    reset.classList.remove("hidden");
  }
}

setMode(true);

/* przełączanie trybu */
toggle.onclick = () => {
  setMode(!isRegister);
  msg.textContent = "";
};

/* główny przycisk */
mainBtn.onclick = async () => {
  if (isRegister) {
    if (password.value !== password2.value) {
      return show("Hasła nie są takie same");
    }

    const { error } = await sb.auth.signUp({
      email: email.value,
      password: password.value
    });

    if (error) return show(error.message);

    show("Kod został wysłany na email");

    otp.classList.remove("hidden");
    verifyBtn.classList.remove("hidden");
    waitingForOtp = true;

  } else {
    const { error } = await sb.auth.signInWithPassword({
      email: email.value,
      password: password.value
    });

    if (error) return show(error.message);

    location.href = "/panel";
  }
};

/* weryfikacja kodu */
verifyBtn.onclick = async () => {
  const { error } = await sb.auth.verifyOtp({
    email: email.value,
    token: otp.value,
    type: "email"
  });

  if (error) return show(error.message);

  location.href = "/panel";
};

/* reset hasła */
reset.onclick = async () => {
  const { error } = await sb.auth.resetPasswordForEmail(email.value, {
    redirectTo: location.origin + "/login"
  });

  if (error) return show(error.message);
  show("Mail resetujący został wysłany");
};

/* OAuth */
document.getElementById("google").onclick = () => {
  sb.auth.signInWithOAuth({ provider: "google" });
};

document.getElementById("github").onclick = () => {
  sb.auth.signInWithOAuth({ provider: "github" });
};

/* auto redirect */
sb.auth.onAuthStateChange((event, session) => {
  if (session) {
    window.location.href = "/panel";
  }
});
