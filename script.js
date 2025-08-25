let map = L.map('map').setView([46.5, 2.2], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let alumniData = [];
let markerClusterGroup = L.markerClusterGroup();
let listContainer = document.getElementById('alumniList');
map.addLayer(markerClusterGroup);

// --- Création des dropdowns multi-select avec label dynamique ---
function createMultiSelect(idContainer, options) {
  const container = document.getElementById(idContainer);
  const dropdown = container.querySelector('.multi-select-dropdown');
  const label = container.querySelector('.multi-select-label');

  const initialLabel = label.textContent;
  container.dataset.label = initialLabel;

  dropdown.classList.add('hidden');
  dropdown.innerHTML = '';

  options.forEach(opt => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = opt.toLowerCase(); // valeur pour comparer

    const lbl = document.createElement('label');
    lbl.appendChild(checkbox);
    lbl.appendChild(document.createTextNode(' ' + opt)); // affichage joli

    dropdown.appendChild(lbl);

    checkbox.addEventListener('change', () => {
      updateLabel();
      if (alumniData.length) updateUI(); // seulement si données chargées
    });
  });

  function updateLabel() {
    const checked = dropdown.querySelectorAll('input:checked');
    if (checked.length === 0) {
      label.textContent = container.dataset.label;
    } else if (checked.length === 1) {
      label.textContent = checked[0].nextSibling.textContent;
    } else {
      label.textContent = checked.length + " sélectionnés";
    }
  }

  updateLabel();

  label.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelectorAll('.multi-select-dropdown').forEach(drop => {
      if (drop !== dropdown) drop.classList.add('hidden');
    });
    dropdown.classList.toggle('hidden');
  });
}

// --- Récupérer les valeurs cochées ---
function getMultiSelectValues(idContainer) {
  const container = document.getElementById(idContainer);
  const checked = container.querySelectorAll('input:checked');
  return Array.from(checked).map(i => i.value); // déjà en lowercase
}

// --- Listener global pour fermer tous les dropdowns si clic à l'extérieur ---
document.addEventListener('click', () => {
  document.querySelectorAll('.multi-select-dropdown').forEach(drop => {
    drop.classList.add('hidden');
  });
});

// --- Mise à jour de l'affichage ---
function updateUI() {
  if (!alumniData.length) return;

  const promos = getMultiSelectValues('filterPromoContainer');
  const villes = getMultiSelectValues('filterVilleContainer');
  const etabs = getMultiSelectValues('filterEtablissementContainer');
  const filieres = getMultiSelectValues('filterFiliereContainer');
  const search = document.getElementById('searchInput').value.toLowerCase();

  const filtered = alumniData.filter(a => {
    const matchFilters =
      (!promos.length || promos.includes(a.promo.toLowerCase())) &&
      (!villes.length || villes.includes(a.ville.toLowerCase())) &&
      (!etabs.length || etabs.includes(a.établissement.toLowerCase())) &&
      (!filieres.length || filieres.includes(a.filière.toLowerCase()));

    const searchText = [
      a.nom, a.ville, a.promo, a.établissement, a.filière
    ].join(' ').toLowerCase();

    return matchFilters && (!search || searchText.includes(search));
  });

  filtered.sort((a, b) => a.nom.localeCompare(b.nom));
  listContainer.innerHTML = '';
  markerClusterGroup.clearLayers();
  const locations = {};

  filtered.forEach(alum => {
    const li = document.createElement('li');
    li.className = 'alumni-item';
    li.innerHTML = `
      <strong>${alum.nom}${alum.nom === "Karl RICHARD" ? ' <span class="badge">Modérateur</span>' : ''}</strong> - <em>${alum.promo}</em>
      <div class="details">
        ${alum.ville ? `🏙️ ${alum.ville}<br>` : ''}
        ${alum.établissement ? `🏫 ${alum.établissement}<br>` : ''}
        ${alum.filière ? `🎯 ${alum.filière}<br>` : ''}
        ${alum.mail ? `📧 ${alum.mail}<br>` : ''}
        ${alum.instagram ? `📸 (insta) ${alum.instagram}<br>` : ''}
        ${alum.linkedin ? `🔗 <a href="${alum.linkedin}" target="_blank">LinkedIn</a><br>` : ''}
        ${alum.telephone ? `📞 ${alum.telephone}<br>` : ''}
      </div>
    `;
    li.addEventListener('click', () => li.classList.toggle('expanded'));
    listContainer.appendChild(li);

    if (alum.lat && alum.lng) { // sécurité pour la carte
      const key = `${alum.lat},${alum.lng}`;
      if (!locations[key]) locations[key] = [];
      locations[key].push(alum);
    }
  });

  Object.entries(locations).forEach(([coords, people]) => {
    const [lat, lng] = coords.split(',').map(Number);
    const content = (() => {
      const preview = people.slice(0, 5).map(a => `<strong>${a.nom}</strong>`).join('<br>');
      const more = people.length > 5 ? '<br>et autre...' : '';
      const header = `<em>${people[0].établissement}</em><hr>`;
      return header + preview + more;
    })();
    const marker = L.marker([lat, lng]).bindPopup(content);
    markerClusterGroup.addLayer(marker);
  });
}

// --- Initialisation dropdowns après chargement des données ---
function populateFilters(data) {
  createMultiSelect('filterPromoContainer', [...new Set(data.map(p => p.promo))].sort());
  createMultiSelect('filterVilleContainer', [...new Set(data.map(p => p.ville))].sort());
  createMultiSelect('filterEtablissementContainer', [...new Set(data.map(p => p.établissement))].sort());
  createMultiSelect('filterFiliereContainer', [...new Set(data.map(p => p.filière))].sort());
}

// --- Event recherche ---
document.getElementById('searchInput').addEventListener('input', updateUI);

// --- Burger sidebar ---
document.getElementById('burger').addEventListener('click', () => {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
  sidebar.classList.toggle('closed');
});

// --- Popup d'aide ---
document.getElementById('helpButton').addEventListener('click', () => {
  document.getElementById('helpPopup').classList.remove('hidden');
});
document.getElementById('closeHelpPopup').addEventListener('click', () => {
  document.getElementById('helpPopup').classList.add('hidden');
});
document.getElementById('gotoKarl').addEventListener('click', () => {
  map.setView([44.80562, -0.604816], 14);
});

// --- Chargement des données ---
fetch("https://script.google.com/macros/s/AKfycbxJjaKN27sdqPunjfqEFi6pIAH5TqtiiCwHem6J0jBL3qy4x34v0ZY2BkI3ixh0IRrU/exec")
  .then(res => res.json())
  .then(data => {
    alumniData = data;
    populateFilters(data);
    updateUI();
  })
  .catch(err => console.error("Erreur chargement données Sheets :", err));
