// ======= Login.js =======
const users = [
  { username: "adminArisStore28", password: "290408", role: "admin" },
  { username: "user", password: "1234", role: "user" },
];

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const uname = document.getElementById("username").value.trim();
  const pwd = document.getElementById("password").value.trim();
  const feedback = document.getElementById("loginFeedback");

  // Validasi input kosong
  if (!uname || !pwd) {
    feedback.innerHTML = `<div class="alert alert-warning">Username dan password wajib diisi.</div>`;
    return;
  }

  const found = users.find((u) => u.username === uname && u.password === pwd);

  if (found) {
    localStorage.setItem("loggedInUser", JSON.stringify(found));
    feedback.innerHTML = `<div class="alert alert-success">Login berhasil! Mengalihkan...</div>`;
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  } else {
    feedback.innerHTML = `<div class="alert alert-danger">Username atau password salah!</div>`;
  }
});
