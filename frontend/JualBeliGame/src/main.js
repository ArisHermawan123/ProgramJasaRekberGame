// =======================
// KONFIGURASI DASAR
// =======================
const produkKey = "produkHariIni";
const testimoniKey = "testimoniList";

// =======================
// CEK LOGIN
// =======================
const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (!currentUser) {
  window.location.href = "login.html";
}
const isAdmin = currentUser.role === "admin";

// =======================
// UTILITAS
// =======================
function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function showFeedback(elementId, message, type = "success") {
  const box = document.getElementById(elementId);
  box.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
  setTimeout(() => {
    box.innerHTML = "";
  }, 4000);
}

// =======================
// DATA PRODUK PER KATEGORI
// =======================
const produkPerKategori = {
  "Free Fire": [],
  "Mobile Legends": [],
  "PES Mobile": [],
  "PUBG Mobile": [],
};

// =======================
// PRODUK: LOAD, SAVE, RENDER
// =======================
function loadProduk() {
  const data = JSON.parse(localStorage.getItem(produkKey)) || {};
  const today = getTodayDate();
  for (const k in produkPerKategori) {
    if (data[k]) {
      produkPerKategori[k] = data[k].filter((p) => p.tanggal === today);
    }
  }
  renderSemuaProduk();
}

function saveProduk() {
  localStorage.setItem(produkKey, JSON.stringify(produkPerKategori));
}

function renderSemuaProduk() {
  for (const k in produkPerKategori) {
    const container = document.getElementById("produk-" + k);
    const titleEl = document.getElementById(k);
    if (!container || !titleEl) continue;

    container.innerHTML = "";

    if (produkPerKategori[k].length === 0) {
      container.style.display = "none";
      titleEl.style.display = "none";
      continue;
    }

    container.style.display = "flex";
    titleEl.style.display = "block";

    produkPerKategori[k].forEach((p) => {
      const html = `
        <div class="col-md-4 mb-3">
          <div class="card h-100">
            <img src="${p.imageUrl}" class="card-img-top" alt="${p.judul}" style="object-fit:cover; height: 200px;">
            <div class="card-body">
              <h5 class="card-title">${p.judul}</h5>
              <p>${p.deskripsi}</p>
              <p class="text-muted">Rp ${p.harga}</p>
            </div>
          </div>
        </div>`;
      container.insertAdjacentHTML("beforeend", html);
    });
  }
}

function scrollToKategori(kategori) {
  const el = document.getElementById(kategori);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// =======================
// PRODUK: UPLOAD FORM
// =======================
const uploadForm = document.getElementById("uploadForm");
if (uploadForm) {
  uploadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const judul = document.getElementById("judul").value;
    const deskripsi = document.getElementById("deskripsi").value;
    const harga = document.getElementById("harga").value;
    const kategori = document.getElementById("kategori").value;
    const file = document.getElementById("gambar").files[0];

    if (!judul || !deskripsi || !harga || !kategori || !file) {
      showFeedback("uploadFeedback", "Semua kolom harus diisi dan gambar harus dipilih!", "danger");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const produk = {
        judul,
        deskripsi,
        harga: parseInt(harga),
        imageUrl: ev.target.result,
        tanggal: getTodayDate(),
      };

      produkPerKategori[kategori].push(produk);
      saveProduk();
      renderSemuaProduk();
      uploadForm.reset();

      showFeedback("uploadFeedback", "Produk berhasil diupload dan ditampilkan!");
    };
    reader.readAsDataURL(file);
  });
}

// =======================
// TESTIMONI: RENDER
// =======================
let testimoniList = JSON.parse(localStorage.getItem(testimoniKey)) || [];

function renderTestimoni() {
  const container = document.getElementById("testimoniList");
  if (!container) return;
  container.innerHTML = "";
  testimoniList.forEach((item) => {
    const html = `
      <div class="col-md-6 mb-3">
        <div class="card h-100 shadow-sm">
          <img src="${item.imageUrl}" class="card-img-top" style="object-fit: cover; height: 250px;" />
          <div class="card-body">
            <p class="card-text">${item.teks}</p>
          </div>
        </div>
      </div>`;
    container.insertAdjacentHTML("beforeend", html);
  });
}

// =======================
// TESTIMONI: UPLOAD FORM (KHUSUS ADMIN)
// =======================
if (isAdmin) {
  // Tampilkan section upload testimoni
  const testimoniSection = document.getElementById("uploadTestimoniSection");
  if (testimoniSection) {
    testimoniSection.style.display = "block";
  }

  // Tangani form submit
  const form = document.getElementById("uploadTestimoniForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const file = document.getElementById("gambarTestimoni").files[0];
      const teks = document.getElementById("isiTestimoni").value;

      if (!file || !file.type.startsWith("image/")) {
        console.log("Gambar tidak valid:", file);
        showFeedback("testimoniFeedback", "Pilih gambar yang valid!", "danger");
        return;
      }

      if (file.size > 500000) {
        showFeedback("testimoniFeedback", "Ukuran gambar terlalu besar! Maks 500KB.", "danger");
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        const testimoni = {
          imageUrl: e.target.result,
          teks,
        };

        try {
          let list = JSON.parse(localStorage.getItem("testimoniList")) || [];
          list.push(testimoni);

          // Maksimal 5 testimoni disimpan
          if (list.length > 5) {
            list = list.slice(-5);
          }

          localStorage.setItem("testimoniList", JSON.stringify(list));
          renderTestimoni();
          form.reset();
          showFeedback("testimoniFeedback", "Berhasil upload testimoni!");
        } catch (err) {
          console.error("Gagal simpan ke localStorage:", err);
          showFeedback("testimoniFeedback", "Gagal menyimpan data. Gambar terlalu besar?", "danger");
        }
      };

      reader.readAsDataURL(file);
    });
  }
}

// =======================
// LOGOUT
// =======================
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

// =======================
// JALANKAN SAAT LOAD
// =======================
loadProduk();
renderTestimoni();
