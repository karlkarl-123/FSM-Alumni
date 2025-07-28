let map = L.map('map').setView([46.5, 2.5], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

fetch('data/alumni.json')
    .then(response => response.json())
    .then(data => {
        const list = document.getElementById('alumni-list');
        const search = document.getElementById('search');

        function displayList(filtered) {
            list.innerHTML = '';
            filtered.forEach(alum => {
                let li = document.createElement('li');
                li.className = 'alumni-entry';
                li.innerHTML = `<strong>${alum.nom}</strong> (${alum.ville})<br>
                    <a href="mailto:${alum.mail}">${alum.mail}</a><br>
                    ${alum.linkedin ? `<a href="${alum.linkedin}" target="_blank">LinkedIn</a> ` : ''}
                    ${alum.instagram ? `<a href="${alum.instagram}" target="_blank">Instagram</a> ` : ''}
                    ${alum.telephone ? `<br>Tél: ${alum.telephone}` : ''}`;
                list.appendChild(li);
            });
        }

        displayList(data);

        search.addEventListener('input', () => {
            const query = search.value.toLowerCase();
            const filtered = data.filter(a =>
                a.nom.toLowerCase().includes(query) ||
                a.ville.toLowerCase().includes(query)
            );
            displayList(filtered);
        });

        data.forEach(alum => {
            if (alum.lat && alum.lng) {
                L.marker([alum.lat, alum.lng])
                    .addTo(map)
                    .bindPopup(`<strong>${alum.nom}</strong><br>${alum.ville}`);
            }
        });
    });
