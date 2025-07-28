let map = L.map('map').setView([46.5, 2.2], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let alumniData = [];
let markers = [];
let listContainer = document.getElementById('alumniList');

fetch('data.json')
  .then(res => res.json())
  .then(data => {
    alumniData = data;
    populateFilters(data);
    updateUI();
  });

function populateFilters(data) {
  const promos = [...new Set(data.map(p => p.promo))].sort();
  const villes = [...new Set(data.map(p => p.ville))].sort();
  const etabs = [...new Set(data.map(p => p.établissement))].sort();
  const filieres = [...new Set(data.map(p => p.filière))].sort();

  fillSelect('filterPromo', promos);
  fillSelect('filterVille', villes);
  fillSelect('filterEtablissement', etabs);
  fillSelect('filterFiliere', filieres);
}

function fillSelect(id, options) {
  const select = document.getElementById(id);
  options.forEach(opt => {
    const o = document.createElement('option');
    o.value = opt;
    o.textContent = opt;
    select.appendChild(o);
  });
}

['filterPromo', 'filterVille', 'filterEtablissement', 'filterFiliere'].forEach(id => {
  document.getElementById(id).addEventListener('change', updateUI);
});

document.getElementById('searchInput').addEventListener('input', updateUI);

function updateUI() {
  const promo = document.getElementById('filterPromo').value.toLowerCase();
  const ville = document.getElementById('filterVille').value.toLowerCase();
  const etab = document.getElementById('filterEtablissement').value.toLowerCase();
  const filiere = document.getElementById('filterFiliere').value.toLowerCase();
  const search = document.getElementById('searchInput').value.toLowerCase();

  const filtered = alumniData.filter(a => {
    const matchFilters =
      (!promo || a.promo.toLowerCase() === promo) &&
      (!ville || a.ville.toLowerCase() === ville) &&
      (!etab || a.établissement.toLowerCase() === etab) &&
      (!filiere || a.filière.toLowerCase() === filiere);

    const searchText = [
      a.nom, a.ville, a.promo, a.établissement, a.filière
    ].join(' ').toLowerCase();

    return matchFilters && (!search || searchText.includes(search));
  });

  listContainer.innerHTML = '';
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  filtered.forEach(alum => {
    const li = document.createElement('li');
    li.className = 'alumni-item';
    li.innerHTML = `
      <strong>${alum.nom}${alum.nom === "Karl RICHARD" ? ' <span class="badge">Modérateur</span>' : ''}</strong><br>
      <em>${alum.ville} — ${alum.établissement} — ${alum.promo}</em>
      <div class="details">
        ${alum.mail ? `📧 ${alum.mail}<br>` : ''}
        ${alum.instagram ? `📸 ${alum.instagram}<br>` : ''}
        ${alum.linkedin ? `🔗 <a href="${alum.linkedin}" target="_blank">LinkedIn</a><br>` : ''}
        ${alum.telephone ? `📞 ${alum.telephone}<br>` : ''}
      </div>
    `;
    li.addEventListener('click', () => {
      li.classList.toggle('expanded');
    });
    listContainer.appendChild(li);

    const marker = L.marker([alum.lat, alum.lng]).addTo(map)
      .bindPopup(`<strong>${alum.nom}</strong>`);

    marker.on('click', () => {
      document.querySelectorAll('#alumniList li').forEach(el => el.classList.remove('highlight'));
      li.classList.add('highlight');
      document.getElementById('sidebar').classList.add('open');
      document.getElementById('sidebar').classList.remove('closed');
    });

    markers.push(marker);
  });
}

document.getElementById('burger').addEventListener('click', () => {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
  sidebar.classList.toggle('closed');
});