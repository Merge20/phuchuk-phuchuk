document.addEventListener("DOMContentLoaded", async function () {

    const container = document.getElementById("resultsContainer");
    const symptoms = JSON.parse(localStorage.getItem("selectedSymptoms")) || [];

    if (symptoms.length === 0) {
        container.innerHTML = "<p>No symptoms selected.</p>";
        return;
    }

    container.innerHTML = "<p>Analyzing symptoms...</p>";

    try {
        const response = await fetch("http://127.0.0.1:8000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ symptoms })
        });

        const data = await response.json();

        container.innerHTML = "";

        data.predictions.forEach(function (item) {
            const card = document.createElement("div");
            card.className = "result-card";

            card.innerHTML = `
                <h3>${item.disease}</h3>
                <div class="confidence">
                    Possibility: ${(item.confidence * 100).toFixed(1)}%
                </div>
                <div class="description">
                    ${item.description}
                </div>
                <div class="recommendation-title">
                    Recommendations:
                </div>
                <ul class="recommendation-list">
                    ${item.precautions.map(p => `<li>${p}</li>`).join("")}
                </ul>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        container.innerHTML = "<p>Unable to connect to diagnosis server.</p>";
    }

});