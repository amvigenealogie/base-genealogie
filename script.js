// Chargement du CSV
async function loadCSV() {
    const response = await fetch("data.csv");
    const text = await response.text();
    const lines = text.split("\n").map(l => l.split(","));
    
    const headers = lines[0];
    const data = lines.slice(1).map(row => {
        let obj = {};
        headers.forEach((h, i) => obj[h] = row[i]);
        return obj;
    });

    return data;
}

let allData = [];
let fuse;
let resultsPerPage = 20;
let currentPage = 1;
let sortAsc = true;

// Tri des résultats
function sortResults(results) {
    const column = document.getElementById("sortColumn").value;
    if (!column) return results;

    return results.sort((a, b) => {
        if (a[column] < b[column]) return sortAsc ? -1 : 1;
        if (a[column] > b[column]) return sortAsc ? 1 : -1;
        return 0;
    });
}

// Affichage des résultats
function renderResults(results) {
    results = sortResults(results);

    const start = (currentPage - 1) * resultsPerPage;
    const end = start + resultsPerPage;
    const pageData = results.slice(start, end);

    let html = "<table><tr>";

    // En-têtes
    Object.keys(pageData[0] || {}).forEach(k => html += `<th>${k}</th>`);
    html += "</tr>";

    // Lignes
    pageData.forEach(row => {
        html += "<tr>";

        Object.keys(row).forEach(key => {
            let value = row[key];

            // PHOTO : miniature cliquable
            if (key === "photo" && value) {
                html += `<td>
                            <a href="${value}" target="_blank">
                                <img src="${value}" style="height:60px; border-radius:4px;">
                            </a>
                         </td>`;
            }

            // LIEN : bouton "Voir"
            else if (key === "lien" && value) {
                html += `<td>
                            <a href="${value}" target="_blank"
                               style="display:inline-block; padding:6px 10px; background:#0078ff; color:white; border-radius:4px; text-decoration:none;">
                                Voir
                            </a>
                         </td>`;
            }

            // Affichage normal
            else {
                html += `<td>${value}</td>`;
            }
        });

        html += "</tr>";
    });

    html += "</table>";
    document.getElementById("results").innerHTML = html;

    renderPagination(results.length);
}

// Pagination
function renderPagination(total) {
    const pages = Math.ceil(total / resultsPerPage);
    let html = "";

    for (let i = 1; i <= pages; i++) {
        html += `<button onclick="goToPage(${i})">${i}</button>`;
    }

    document.getElementById("pagination").innerHTML = html;
}

function goToPage(p) {
    currentPage = p;
    updateResults();
}

// Mise à jour des résultats (recherche + tri)
function updateResults() {
    const query = document.getElementById("search").value;
    const results = query ? fuse.search(query).map(r => r.item) : allData;
    renderResults(results);
}

// Événements
document.getElementById("search").addEventListener("input", () => {
    currentPage = 1;
    updateResults();
});

document.getElementById("sortColumn").addEventListener("change", () => {
    currentPage = 1;
    updateResults();
});

document.getElementById("sortOrder").addEventListener("click", () => {
    sortAsc = !sortAsc;
    document.getElementById("sortOrder").innerText = sortAsc ? "Ordre croissant" : "Ordre décroissant";
    updateResults();
});

// Initialisation
loadCSV().then(data => {
    allData = data;

    fuse = new Fuse(allData, {
        keys: ["num", "pre", "nom", "j", "m", "a", "com", "source", "type", "cote", "lien", "photo"],
        threshold: 0.3
    });

    renderResults(allData);
});

