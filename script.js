// Charger les données depuis alumni.json
fetch("data/alumni.json")
  .then((response) => response.json())
  .then((data) => {
    initMap(data);
    displayAlumniList(data);
    setupSearch(data);
  });

// Initialiser la carte
function initMap(alumniData) {
  const map = L.map("map").setView([46.5, 2.2], 6.2); // Vue centrée sur la France

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  alumniData.forEach((a) => {
    const popupContent = `
      <strong>${a.nom}</strong><br>
      ${a.ville}<br>
      ${a.promo ? `Promo : ${a.promo}<br>` : ""}
      ${a.filiere ? `Filière : ${a.filiere}<br>` : ""}
      ${a.etablissement ? `Établissement : ${a.etablissement}<br>` : ""}
      ${a.mail ? `📧 <a href="mailto:${a.mail}">${a.mail}</a><br>` : ""}
      ${a.linkedin ? `🔗 <a href="${a.linkedin}" target="_blank">LinkedIn</a><br>` : ""}
      ${a.instagram ? `📸 <a href="https://instagram.com/${a.instagram}" target="_blank">${a.instagram}</a><br>` : ""}
      ${a.telephone ? `📞 <a href="tel:${a.telephone}">${a.telephone}</a>` : ""}
    `;

    L.marker([a.lat, a.lng])
      .addTo(map)
      .bindPopup(popupContent);
  });
}

// Afficher la liste des alumni
function displayAlumniList(alumniData) {
  const liste = document.getElementById("liste-alumni");
  liste.innerHTML = "";

  // Tri alphabétique par ville
  alumniData.sort((a, b) => a.ville.localeCompare(b.ville));

  alumniData.forEach((a) => {
    const item = document.createElement("div");
    item.className = "alumni-item";
    item.innerHTML = `
      <h3>${a.nom}</h3>
      <p><strong>Ville :</strong> ${a.ville}</p>
      ${a.promo ? `<p><strong>Promo :</strong> ${a.promo}</p>` : ""}
      ${a.filiere ? `<p><strong>Filière :</strong> ${a.filiere}</p>` : ""}
      ${a.etablissement ? `<p><strong>Établissement :</strong> ${a.etablissement}</p>` : ""}
      ${a.mail ? `<p><strong>Email :</strong> <a href="mailto:${a.mail}">${a.mail}</a></p>` : ""}
      ${a.linkedin ? `<p><strong>LinkedIn :</strong> <a href="${a.linkedin}" target="_blank">Profil</a></p>` : ""}
      ${a.instagram ? `<p><strong>Instagram :</strong> <a href="https://instagram.com/${a.instagram}" target="_blank">${a.instagram}</a></p>` : ""}
      ${a.telephone ? `<p><strong>Téléphone :</strong> <a href="tel:${a.telephone}">${a.telephone}</a></p>` : ""}
    `;
    liste.appendChild(item);
  });
}

// Rechercher un alumni
function setupSearch(alumniData) {
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", function () {
    const term = this.value.toLowerCase();

    const filtered = alumniData.filter((a) => {
      const fullText = `
        ${a.nom} ${a.ville} ${a.promo || ""} ${a.filiere || ""}
        ${a.etablissement || ""} ${a.mail || ""} ${a.linkedin || ""}
        ${a.instagram || ""} ${a.telephone || ""}
      `.toLowerCase();

      return fullText.includes(term);
    });

    displayAlumniList(filtered);
  });
}
