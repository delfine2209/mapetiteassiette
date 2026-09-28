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
```
