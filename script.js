const API_URL = "http://localhost:8000/predict-file"; // altere se preciso

document.addEventListener("DOMContentLoaded", () => {

    const fileInput = document.getElementById("fileInput");
    const terms = document.getElementById("acceptTerms");
    const submitBtn = document.getElementById("sendBtn");

    const loading = document.getElementById("loading");

    const modal = document.getElementById("resultModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");
    const closeModal = document.getElementById("closeModal");

    terms.addEventListener("change", () => {
        submitBtn.disabled = !terms.checked;
    });

    closeModal.onclick = () => modal.style.display = "none";
    window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };


    submitBtn.addEventListener("click", async () => {

        if (!fileInput.files.length) {
            alert("Selecione um arquivo.");
            return;
        }

        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append("file", file);

        loading.style.display = "block";

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            loading.style.display = "none";

            // se erro da API
            if (data.error) {
                showModal(
                    "Erro",
                    `<div class='status-pill malware-pill'>${data.error}</div>`
                );
                return;
            }

            // ------------------------------------------
            //        ARQUIVO PE (EXE)
            // ------------------------------------------
            if (data.prediction !== undefined) {

                if (data.prediction === 1) {
                    showModal(
                        "⚠️ Malware detectado",
                        `
                        <div class="status-pill malware-pill">O arquivo apresenta risco.</div>
                        <div class="instructions">
                          • Não execute este arquivo.<br>
                          • Recomendado excluir imediatamente.<br>
                          • Evite reenviar ou compartilhar.<br>
                        </div>
                        `
                    );
                } else {
                    showModal(
                        "✔️ Arquivo seguro",
                        `
                        <div class="status-pill safe-pill">Nenhuma ameaça encontrada.</div>
                        <div class="instructions">
                          • Arquivo analisado com sucesso.<br>
                          • Continue mantendo práticas seguras.<br>
                        </div>
                        `
                    );
                }

                return;
            }

            // ------------------------------------------
            //        CSV (VARIAS PREDIÇÕES)
            // ------------------------------------------
            if (data.predictions) {

                let table = `
                  <table class="result-table">
                    <tr><th>Linha</th><th>Resultado</th></tr>
                `;

                data.predictions.forEach((p, i) => {
                    table += `
                      <tr>
                        <td>${i + 1}</td>
                        <td>${p === 1 ? "Malware" : "Seguro"}</td>
                      </tr>
                    `;
                });

                table += "</table>";

                showModal(
                    "Resultado CSV",
                    `
                    <div class="instructions">
                      Arquivo CSV analisado. Veja abaixo o resultado linha a linha:
                    </div>
                    ${table}
                    `
                );

                return;
            }

        } catch (err) {

            loading.style.display = "none";

            showModal(
                "Erro inesperado",
                `
                <div class='status-pill malware-pill'>
                  Falha ao conectar com a API.
                </div>
                `
            );
        }

    });


    // UTIL: mostra modal com conteúdo estilizado
    function showModal(title, html) {
        modalTitle.textContent = title;
        modalBody.innerHTML = html;
        modal.style.display = "flex";
    }

});
