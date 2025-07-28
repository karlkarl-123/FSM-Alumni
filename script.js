const map = L.map('map').setView([46.5, 2.5], 6);
L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

fetch('data/alumni.json')
  .then(response => response.json())
  .then(data => {
    const listContainer = document.getElementById('alumni-list');
    const searchInput = document.getElementById('search');

    function updateList(filtered) {
      listContainer.innerHTML = '';
      filtered.forEach(alumnus => {
        const div = document.createElement('div');
        div.className = 'alumni-entry';
        div.innerHTML = \`
          <strong>\${alumnus.nom}</strong> - \${alumnus.ville}<br>
          Promo: \${alumnus.promo || '-'} | \${alumnus.établissement || '-'}<br>
          \${alumnus.filière || ''}<br>
          <a href="mailto:\${alumnus.mail}">\${alumnus.mail}</a><br>
          \${alumnus.linkedin ? '<a href="' + alumnus.linkedin + '">LinkedIn</a><br>' : ''}
          \${alumnus.instagram ? 'Insta: ' + alumnus.instagram + '<br>' : ''}
          \${alumnus.telephone ? 'Tel: ' + alumnus.telephone + '<br>' : ''}
        \`;
        listContainer.appendChild(div);
      });
    }

    updateList(data);

    data.forEach(alumnus => {
      if (alumnus.lat && alumnus.lng) {
        const marker = L.marker([alumnus.lat, alumnus.lng]).addTo(map);
        marker.bindPopup(\`<strong>\${alumnus.nom}</strong><br>\${alumnus.ville}<br>\${alumnus.établissement || ''}\`);
      }
    });

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      const filtered = data.filter(a =>
        a.nom.toLowerCase().includes(query) ||
        a.ville.toLowerCase().includes(query)
      );
      updateList(filtered);
    });
  });