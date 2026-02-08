document.addEventListener("DOMContentLoaded", () => {

const SUPABASE_URL = "https://bvodndbkwybvbvyrlsgx.supabase.co";
const SUPABASE_KEY = "sb_publishable_ZBlIE-DOImuY_i9iphHMxw_T5yDvzy6";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const email = document.getElementById("email");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");

const title = document.getElementById("title");
const msg = document.getElementById("msg");

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const toggle = document.getElementById("toggle");
const reset = document.getElementById("reset");

let isRegister = true;

/* komunikaty */
function show(text){
  msg.textContent = text;
}

/* tryb */
function setMode(register){
  isRegister = register;

  if(register){
    title.textContent = "Rejestracja";
    password2.classList.remove("hidden");
    loginBtn.classList.add("hidden");
    registerBtn.classList.remove("hidden");
    toggle.textContent = "Masz konto? Zaloguj się";
    reset.style.display = "none";
  }else{
    title.textContent = "Logowanie";
    password2.classList.add("hidden");
    loginBtn.classList.remove("hidden");
    registerBtn.classList.add("hidden");
    toggle.textContent = "Nie masz konta? Zarejestruj się";
    reset.style.display = "block";
  }
}

/* start: rejestracja */
setMode(true);

toggle.onclick = () => {
  setMode(!isRegister);
  msg.textContent = "";
};

/* LOGOWANIE */
loginBtn.onclick = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  });

  if(error){
    return show("Błędny email lub hasło");
  }

  location.href = "/panel";
};

/* REJESTRACJA */
registerBtn.onclick = async () => {

  if(password.value.length < 6){
    return show("Hasło musi mieć min. 6 znaków");
  }

  if(password.value !== password2.value){
    return show("Hasła nie są takie same");
  }

  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options:{
      emailRedirectTo: location.origin + "/panel"
    }
  });

  if(error){
    return show(error.message);
  }

  if(!data.session){
    location.href = "/login/check.html";
  }else{
    location.href = "/panel";
  }
};

/* RESET HASŁA */
reset.onclick = async () => {
  const { error } = await supabase.auth.resetPasswordForEmail(
    email.value,
    { redirectTo: location.origin + "/login" }
  );

  if(error) return show(error.message);

  show("Mail resetujący został wysłany");
};

/* OAUTH */
document.getElementById("google").onclick = () => {
  supabase.auth.signInWithOAuth({ provider: "google" });
};

document.getElementById("github").onclick = () => {
  supabase.auth.signInWithOAuth({ provider: "github" });
};

/* auto redirect jeśli zalogowany */
supabase.auth.getSession().then(({ data })=>{
  if(data.session){
    location.href = "/panel";
  }
});

});
