const SUPABASE_URL = "https://bvodndbkwybvbvyrlsgx.supabase.co";
const SUPABASE_KEY = "sb_publishable_ZBlIE-DOImuY_i9iphHMxw_T5yDvzy6";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

document.getElementById("login").onclick = async () => {
  await supabase.auth.signInWithPassword({
    email: emailInput.value,
    password: passwordInput.value
  });

  location.href = "/login/panel.html";
};

document.getElementById("register").onclick = async () => {
  await supabase.auth.signUp({
    email: emailInput.value,
    password: passwordInput.value
  });

  alert("Sprawdź email i potwierdź konto");
};

document.getElementById("google").onclick = () => {
  supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: location.origin + "/login/panel.html"
    }
  });
};

document.getElementById("github").onclick = () => {
  supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: location.origin + "/login/panel.html"
    }
  });
};

document.getElementById("reset").onclick = async () => {
  const email = emailInput.value;

  if (!email) {
    alert("Podaj email do resetu hasła");
    return;
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: location.origin + "/login/panel.html"
  });

  if (error) {
    alert("Błąd: " + error.message);
  } else {
    alert("Link do resetu hasła został wysłany na email");
  }
};
