let activities = JSON.parse(localStorage.getItem("farmActivities")) || [];

function saveData() {
    localStorage.setItem(
        "farmActivities",
        JSON.stringify(activities)
    );
}

function addActivity() {
    const month = document.getElementById("month").value;
    const type = document.getElementById("type").value;
    const field = document.getElementById("field").value;
    const crop = document.getElementById("crop").value;

    if (!month || !field || !crop) {
        alert("Please fill all fields");
        return;
    }

    activities.push({
        id: Date.now(),
        month,
        type,
        field,
        crop
    });

    saveData();
    renderActivities();
}

function deleteActivity(id) {
    activities = activities.filter(a => a.id !== id);
    saveData();
    renderActivities();
}

function renderActivities() {
    activities.sort((a,b) =>
        a.month.localeCompare(b.month)
    );

    const container =
        document.getElementById("activities");

    container.innerHTML = "";

    activities.forEach(activity => {
        const div = document.createElement("div");

        div.className = "activity";

        div.innerHTML = `
            <strong>${activity.month}</strong><br>
            ${activity.type}<br>
            Field: ${activity.field}<br>
            Item: ${activity.crop}<br>
            <button class="delete-btn"
                onclick="deleteActivity(${activity.id})">
                Delete
            </button>
        `;

        container.appendChild(div);
    });
}

renderActivities();
