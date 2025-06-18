const produkPerKategori = {
  "Free Fire": [],
  "Mobile Legends": [],
  "PES Mobile": [],
  "PUBG Mobile": [],
};
const produkKey = "produkHariIni";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

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
    container.innerHTML = "";
    if (!produkPerKategori[k] || produkPerKategori[k].length === 0) {
      container.style.display = "none";
      if (titleEl) titleEl.style.display = "none";
      continue;
    }
    container.style.display = "flex";
    if (titleEl) titleEl.style.display = "block";
    produkPerKategori[k].forEach((p) => {
      const html = `
        <div class="col-md-4 mb-3"><div class="card">
          <img src="${p.imageUrl}" class="card-img-top" alt="${p.judul}">
          <div class="card-body">
            <h5 class="card-title">${p.judul}</h5>
            <p>${p.deskripsi}</p><p class="text-muted">Rp ${p.harga}</p>
          </div></div></div>`;
      container.insertAdjacentHTML("beforeend", html);
    });
  }
}

function scrollToKategori(kategori) {
  const el = document.getElementById(kategori);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.getElementById("uploadForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const feedback = document.getElementById("uploadFeedback");
  const judul = document.getElementById("judul").value;
  const deskripsi = document.getElementById("deskripsi").value;
  const harga = document.getElementById("harga").value;
  const kategori = document.getElementById("kategori").value;
  const file = document.getElementById("gambar").files[0];

  if (!judul || !deskripsi || !harga || !kategori || !File) {
    feedback.innerHTML = `<div class="alert alert-danger">Semua kolom harus diisi dan gambar harus dipilih!</div>`;
    setTimeout(() => {
      feedback.innerHTML = ""; // hilang setelah 4 detik
    }, 4000);
    return;
  }
  if (!file || !produkPerKategori[kategori]) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    produkPerKategori[kategori].push({
      judul,
      deskripsi,
      harga,
      imageUrl: ev.target.result,
      tanggal: getTodayDate(),
    });
    saveProduk();
    renderSemuaProduk();
    e.target.reset();
    feedback.innerHTML = `<div class="alert alert-success">Produk berhasil diupload dan ditampilkan!</div>`;
    setTimeout(() => {
      feedback.innerHTML = ""; // hilang setelah 4 detik
    }, 4000);
  };
  reader.readAsDataURL(file);
});

loadProduk();
