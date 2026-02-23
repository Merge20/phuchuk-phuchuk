document.addEventListener("DOMContentLoaded", async function () {

    const symptomInput = document.getElementById("symptom");
    const commonContainer = document.querySelector(".main-common-symptoms");
    const nextBtn = document.querySelector(".next");

    let allSymptoms = [];
    let selectedSymptoms = [];

    const fallbackSymptoms = [
        "itching",
        "skin rash",
        "nodal skin eruptions",
        "continuous sneezing",
        "shivering",
        "chills",
        "joint pain",
        "stomach pain",
        "acidity",
        "vomiting",
        "fatigue",
        "weight loss",
        "restlessness",
        "lethargy",
        "high fever",
        "headache",
        "cough",
        "chest pain",
        "abdominal pain",
        "diarrhoea"
    ];

    try {
        const response = await fetch("http://127.0.0.1:8000/symptoms");
        const data = await response.json();
        allSymptoms = data.symptoms;
    } catch (error) {
        allSymptoms = fallbackSymptoms;
    }

    function renderSelected() {
        commonContainer.innerHTML = "";
        selectedSymptoms.forEach(symptom => {
            const btn = document.createElement("button");
            btn.className = "symptom-btn selected";
            btn.textContent = symptom;

            btn.onclick = function () {
                selectedSymptoms = selectedSymptoms.filter(s => s !== symptom);
                renderSelected();
                updateNextButton();
            };

            commonContainer.appendChild(btn);
        });
    }

    function updateNextButton() {
        nextBtn.disabled = selectedSymptoms.length === 0;
    }

    const dropdown = document.createElement("div");
    dropdown.className = "dropdown";
    symptomInput.parentNode.appendChild(dropdown);

    symptomInput.addEventListener("input", function () {
        const value = this.value.toLowerCase();
        dropdown.innerHTML = "";

        if (value === "") return;

        const matches = allSymptoms.filter(symptom =>
            symptom.toLowerCase().includes(value) &&
            !selectedSymptoms.includes(symptom)
        );

        matches.slice(0, 6).forEach(symptom => {
            const item = document.createElement("div");
            item.className = "dropdown-item";
            item.textContent = symptom;

            item.onclick = function () {
                selectedSymptoms.push(symptom);
                symptomInput.value = "";
                dropdown.innerHTML = "";
                renderSelected();
                updateNextButton();
            };

            dropdown.appendChild(item);
        });
    });

    nextBtn.addEventListener("click", function () {
        localStorage.setItem("selectedSymptoms", JSON.stringify(selectedSymptoms));
        window.location.href = "../pages/cure.html";
    });

});