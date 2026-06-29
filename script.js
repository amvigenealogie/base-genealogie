document.addEventListener("DOMContentLoaded", function () {

    // ------------------------------------------------------------
    // AJOUT DU BANDEAU D’INTRODUCTION EN HAUT DE LA PAGE
    // ------------------------------------------------------------
    const intro = document.createElement("div");
    intro.style.background = "#333";
    intro.style.color = "#ffd700";
    intro.style.padding = "15px";
    intro.style.margin = "0 0 20px 0";
    intro.style.borderBottom = "3px solid #ffd700";
    intro.style.fontSize = "1.1em";
    intro.style.textShadow = "1px 1px 2px #000";

    intro.innerHTML = `
        <strong>
            Cette base est le fruit de relevés effectués dans différents documents disponibles aux archives départementales de la Haute‑Garonne ou de l’Aude ainsi que dans divers documents privés.
        </strong><br>
        Bonne recherche à tous.<br>
        Contact : <a href="mailto:gilamiel31@gmail.com" style="color:#ffd700; text-decoration: underline;">gilamiel31@gmail.com</a>
    `;

    document.body.prepend(intro);

    // ------------------------------------------------------------
    // CHARGEMENT DU CSV
    // ------------------------------------------------------------
    fetch("data.csv")
        .then(response => response.text())
        .then(data => {
            const rows = data.split("\n").map(row => row.split(";"));

            const tableBody = document.querySelector("#resultTable tbody");
            const communeSelect = document.querySelector("#commune");
            const typeSelect = document.querySelector("#type");
            const sourceSelect = document.querySelector("#source");
            const anneeSelect = document.querySelector("#annee");

            let communes = new Set();
            let types = new Set();
            let sources = new Set();
            let annees = new Set();

            rows.forEach((row, index) => {
                if (index === 0) return; // ignore header

                const [num, pre, nom, j, m, a, com, source, type, cote, lien, photo] = row;

                // Remplissage des filtres
                if (com) communes.add(com);
                if (type) types.add(type);
                if (source) sources.add(source);
                if (a) annees.add(a);

                // Ajout au tableau
                const tr = document.createElement("tr");

                tr.innerHTML = `
                    <td>${num}</td>
                    <td>${pre}</td>
                    <td>${nom}</td>
                    <td>${j}</td>
                    <td>${m}</td>
                    <td>${a}</td>
                    <td>${com}</td>
                    <td>${source}</td>
                    <td>${type}</td>
                    <td>${cote}</td>
                    <td>${lien ? `<a href="${lien}" target="_blank">Voir</a>` : ""}</td>
                    <td>${photo ? `<img src="${photo}" width="80">` : ""}</td>
                `;

                tableBody.appendChild(tr);
            });

            // Remplissage des listes déroulantes
            communes.forEach(c => communeSelect.innerHTML += `<option value="${c}">${c}</option>`);
            types.forEach(t => typeSelect.innerHTML += `<option value="${t}">${t}</option>`);
            sources.forEach(s => sourceSelect.innerHTML += `<option value="${s}">${s}</option>`);
            annees.forEach(an => anneeSelect.innerHTML += `<option value="${an}">${an}</option>`);
        });
});

// ------------------------------------------------------------
// FONCTION POUR EFFACER LES FILTRES
// ------------------------------------------------------------
function resetFilters() {
    document.querySelector("#commune").value = "";
    document.querySelector("#type").value = "";
    document.querySelector("#source").value = "";
    document.querySelector("#annee").value = "";
}
