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

function updateUI() {
  const promo = document.getElementById('filterPromo').value;
  const ville = document.getElementById('filterVille').value;
  const etab = document.getElementById('filterEtablissement').value;
  const filiere = document.getElementById('filterFiliere').value;

  const filtered = alumniData.filter(a => {
    return (!promo || a.promo === promo) &&
           (!ville || a.ville === ville) &&
           (!etab || a.établissement === etab) &&
           (!filiere || a.filière === filiere);
  });

  listContainer.innerHTML = '';
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  filtered.forEach(alum => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${alum.nom}${alum.nom === "Karl RICHARD" ? ' <span class="badge">Modérateur</span>' : ''}</strong><br>
      ${alum.mail ? `📧 ${alum.mail}<br>` : ''}
      ${alum.instagram ? `📸 ${alum.instagram}<br>` : ''}
      ${alum.linkedin ? `🔗 <a href="${alum.linkedin}" target="_blank">LinkedIn</a><br>` : ''}
      ${alum.telephone ? `📞 ${alum.telephone}<br>` : ''}
    `;
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