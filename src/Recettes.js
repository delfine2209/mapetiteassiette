```javascript
// =========================
// AFFICHAGE LISTE RECETTES
// =========================

async function afficherRecettes() {

    const container =
        document.getElementById("liste-recettes");

    if (!container) return;

    try {

        const response =
            await fetch("../recettes.json");

        if (!response.ok) {
            throw new Error("Impossible de charger recettes.json");
        }

        const recettes =
            await response.json();

        container.innerHTML = "";

        if (!recettes || recettes.length === 0) {

            container.innerHTML =
                "<p>Aucune recette disponible.</p>";

            return;
        }

        recettes.forEach(recette => {

            container.innerHTML += `

                <a href="Recette.html?id=${encodeURIComponent(recette.id)}"
                   class="recipe-card">

                    <h3>${recette.nom || "Recette sans nom"}</h3>

                    <p>⏱ ${recette.temps || "—"} min</p>

                    <p>🥩 ${recette.proteines || "—"} g protéines</p>

                </a>

            `;

        });

    } catch (error) {

        container.innerHTML =
            "<p>Erreur de chargement des recettes.</p>";

        console.error(
            "Erreur de chargement des recettes :",
            error
        );

    }

}


// =========================
// AFFICHAGE FICHE RECETTE
// =========================

async function afficherRecette() {

    const fiche =
        document.getElementById("fiche-recette");

    if (!fiche) return;

    try {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const id =
            params.get("id");

        if (!id) {

            fiche.innerHTML =
                "<h2>Recette introuvable</h2>";

            return;
        }

        const response =
            await fetch("../recettes.json");

        if (!response.ok) {
            throw new Error("Impossible de charger recettes.json");
        }

        const recettes =
            await response.json();

        const recette =
            recettes.find(
                r => String(r.id) === String(id)
            );

        if (!recette) {

            fiche.innerHTML =
                "<h2>Recette introuvable</h2>";

            return;
        }


        // =========================
        // INFORMATIONS PRINCIPALES
        // =========================

        fiche.innerHTML = `

            <h1>${recette.nom || "Recette"}</h1>

            <div class="recipe-card">

                <p>
                    ⏱ ${recette.temps || "—"} min
                </p>

                <p>
                    🥩 ${recette.proteines || "—"} g protéines
                </p>

                ${
                    recette.texture
                        ? `<p>🧵 Texture : ${recette.texture}</p>`
                        : ""
                }

            </div>


            <h2>Compatible avec</h2>

            <ul>

                ${
                    recette.petitAppetit
                        ? "<li>✅ Petit appétit</li>"
                        : ""
                }

                ${
                    recette.preOperatoire
                        ? "<li>✅ Pré-opératoire</li>"
                        : ""
                }

                ${
                    recette.postOperatoire
                        ? "<li>✅ Post-opératoire</li>"
                        : ""
                }

                ${
                    recette.sansGluten
                        ? "<li>✅ Sans gluten</li>"
                        : ""
                }

                ${
                    recette.sansLactose
                        ? "<li>✅ Sans lactose</li>"
                        : ""
                }

                ${
                    recette.vegetarien
                        ? "<li>✅ Végétarien</li>"
                        : ""
                }

                ${
                    recette.vegetalien
                        ? "<li>✅ Végétalien</li>"
                        : ""
                }

            </ul>


            <h2>Envies associées</h2>

            <ul>

                ${
                    recette.envies &&
                    recette.envies.length > 0

                    ? recette.envies
                        .map(
                            envie =>
                                `<li>${envie}</li>`
                        )
                        .join("")

                    : "<li>Aucune envie associée</li>"
                }

            </ul>


            <h2>Ingrédients</h2>

            <ul>

                ${
                    recette.ingredients &&
                    recette.ingredients.length > 0

                    ? recette.ingredients
                        .map(
                            ingredient =>
                                `<li>${ingredient}</li>`
                        )
                        .join("")

                    : "<li>Ingrédients non renseignés</li>"
                }

            </ul>


            <h2>Préparation</h2>

            <ol>

                ${
                    recette.preparation &&
                    recette.preparation.length > 0

                    ? recette.preparation
                        .map(
                            etape =>
                                `<li>${etape}</li>`
                        )
                        .join("")

                    : "<li>Préparation non renseignée</li>"
                }

            </ol>

        `;

    } catch (error) {

        fiche.innerHTML =
            "<p>Erreur de chargement de la recette.</p>";

        console.error(
            "Erreur fiche recette :",
            error
        );

    }

}

// Variable globale qui contient le tableau de vos recettes après le fetch
let mesRecettesJson = [];

// ==========================================
// 1. CHARGEMENT DE LA BASE DE DONNÉES (FETCH)
// ==========================================
function chargerDonneesRecettes() {
  // Utilisation de votre chemin relatif exact
  fetch("../recettes.json") 
    .then(response => {
      if (!response.ok) {
        throw new Error("Erreur lors du chargement du fichier JSON (" + response.status + ")");
      }
      return response.json();
    })
    .then(data => {
      mesRecettesJson = data; // Stockage des recettes dans notre variable globale
      console.log("Base de données initialisée avec succès via fetch().");
      
      // Affiche toutes les recettes par défaut au premier chargement de l'écran
      mettreAJourAffichage(mesRecettesJson);
    })
    .catch(error => {
      console.error("Impossible de charger les recettes depuis le chemin indiqué :", error);
      const zoneAffichage = document.getElementById('zone-recettes');
      if (zoneAffichage) {
        zoneAffichage.innerHTML = "<p class='error'>Erreur lors de la récupération des données.</p>";
      }
    });
}

// ==========================================
// 6. GESTION DE "MON MENU" (LOCALSTORAGE)
// ==========================================

// Structure par défaut d'un menu hebdomadaire vide
const menuVide = {
  lundi: { petitDejeuner: null, dejeuner: null, diner: null },
  mardi: { petitDejeuner: null, dejeuner: null, diner: null },
  mercredi: { petitDejeuner: null, dejeuner: null, diner: null },
  jeudi: { petitDejeuner: null, dejeuner: null, diner: null },
  vendredi: { petitDejeuner: null, dejeuner: null, diner: null },
  samedi: { petitDejeuner: null, dejeuner: null, diner: null },
  dimanche: { petitDejeuner: null, dejeuner: null, diner: null }
};

/**
 * Récupère le menu stocké dans l'appareil ou en crée un vide si inexistant
 */
function obtenirMenu() {
  const menuStocke = localStorage.getItem('monMenuHebdo');
  return menuStocke ? JSON.parse(menuStocke) : { ...menuVide };
}

/**
 * Enregistre une recette dans le planning hebdomadaire
 * @param {string} jour - Ex: 'lundi'
 * @param {string} repas - Ex: 'dejeuner'
 * @param {string} recetteId - Ex: 'REC100'
 */
function ajouterAuMenu(jour, repas, recetteId) {
  const menuActuel = obtenirMenu();
  menuActuel[jour][repas] = recetteId;
  localStorage.setItem('monMenuHebdo', JSON.stringify(menuActuel));
  console.log(`Recette ${recetteId} ajoutée au ${repas} du ${jour}.`);
}

/**
 * Supprime un repas spécifique du planning
 */
function supprimerDuMenu(jour, repas) {
  const menuActuel = obtenirMenu();
  menuActuel[jour][repas] = null;
  localStorage.setItem('monMenuHebdo', JSON.stringify(menuActuel));
  afficherMenuEcran(); // Rafraîchit l'affichage
}

/**
 * Rendu graphique du menu sur la page menu.html
 */
function afficherMenuEcran() {
  const conteneurMenu = document.getElementById('planning-hebdo');
  if (!conteneurMenu) return; // Sécurité si on n'est pas sur menu.html

  const menu = obtenirMenu();

  // Attendre que la base de données globale soit chargée pour faire la correspondance d'ID
  if (mesRecettesJson.length === 0) {
    setTimeout(afficherMenuEcran, 100); // Réessaye un peu plus tard si le fetch n'est pas fini
    return;
  }

  conteneurMenu.innerHTML = "";

  // Boucle à travers chaque jour de la semaine
  Object.keys(menu).forEach(jour => {
    let htmlJour = `
      <div class="colonne-jour">
        <h2>${jour.charAt(0).toUpperCase() + jour.slice(1)}</h2>
        <div class="repas-blocs">
    `;

    // Boucle à travers les 3 types de repas
    ['petitDejeuner', 'dejeuner', 'diner'].forEach(repas => {
      const nomRepasAffiche = repas === 'petitDejeuner' ? '🌅 Matin' : repas === 'dejeuner' ? '☀️ Midi' : '🌙 Soir';
      const idRecette = menu[jour][repas];
      
      // Recherche de la recette associée dans notre JSON globale
      const recette = idRecette ? mesRecettesJson.find(r => r.id === idRecette) : null;

      htmlJour += `
        <div class="case-repas ${recette ? 'occupee' : 'vide'}">
          <span class="label-moment">${nomRepasAffiche}</span>
          ${recette ? `
            <div class="details-repas-choisi">
              <h4>\${recette.nom}</h4>
              <p>⏱️ recette.temps min | 💪 {recette.proteines}g P</p>
              <div class="actions-case">
                <a href="Recette.html?id=\${recette.id}" class="btn-lien">Voir</a>
                <button onclick="supprimerDuMenu('jour', '{repas}')" class="btn-supprimer">❌</button>
              </div>
            </div>
          ` : `
            <div class="details-repas-vide">
              <p>Aucun plat sélectionné</p>
              <a href="MesEnvies.html?choix=\({jour}_\){repas}" class="btn-ajouter-plat">+ Choisir</a>
            </div>
          `}
        </div>
      `;
    });

    htmlJour += `
        </div>
      </div>
    `;
    conteneurMenu.insertAdjacentHTML('beforeend', htmlJour);
  });
}

// Ajouter le rafraîchissement au chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
  // Si nous sommes sur la page du menu, on l'affiche
  if (document.getElementById('planning-hebdo')) {
    // Petit délai technique pour laisser le temps au fetch("../recettes.json") de peupler la variable globale
    setTimeout(afficherMenuEcran, 200);
  }
});


```
