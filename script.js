
let map = L.map('map').setView([46.603354, 1.888334], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let alumniList = document.getElementById('alumni-list');
let searchInput = document.getElementById('search');

fetch('data/alumni.json')
    .then(response => response.json())
    .then(data => {
        window.alumniData = data;
        displayAlumni(data);
    });

function displayAlumni(data) {
    alumniList.innerHTML = '';
    data.forEach((alumnus, index) => {
        let entry = document.createElement('div');
        entry.className = 'entry';
        if (alumnus.nom === "Karl RICHARD") entry.classList.add("moderator");
        entry.innerHTML = `
            <strong>${alumnus.nom}</strong> - ${alumnus.ville}<br>
            ${alumnus.établissement || ""} (${alumnus.filière || ""})<br>
            ${alumnus.promo || ""}<br>
            ${alumnus.mail ? `<a href="mailto:${alumnus.mail}">Mail</a> ` : ""}
            ${alumnus.linkedin ? `<a href="${alumnus.linkedin}" target="_blank">LinkedIn</a> ` : ""}
            ${alumnus.instagram ? `<a href="https://instagram.com/${alumnus.instagram}" target="_blank">Instagram</a> ` : ""}
            ${alumnus.telephone ? `<br>Tél: ${alumnus.telephone}` : ""}
        `;
        alumniList.appendChild(entry);

        L.marker([alumnus.lat, alumnus.lng])
            .addTo(map)
            .bindPopup(`<strong>${alumnus.nom}</strong><br>${alumnus.ville}`);

        if (alumnus.nom === "Karl RICHARD") entry.id = "moderator-anchor";
    });
}

searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = window.alumniData.filter(a => a.nom.toLowerCase().includes(query) || a.ville.toLowerCase().includes(query));
    displayAlumni(filtered);
});

document.getElementById("add-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newEntry = {};
    formData.forEach((value, key) => newEntry[key] = value);
    newEntry.lat = parseFloat(newEntry.lat);
    newEntry.lng = parseFloat(newEntry.lng);
    window.alumniData.push(newEntry);
    displayAlumni(window.alumniData);
    e.target.reset();
});

function scrollToModerator() {
    const el = document.getElementById("moderator-anchor");
    if (el) el.scrollIntoView({ behavior: "smooth" });
}
