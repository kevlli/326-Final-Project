// Mock emissions data for user
let emissions = [
  { user: "kevin", emissions: 40, date: "Wed Apr 24 2024 22:20:37" },
  { user: "kevin", emissions: 60, date: "Wed Apr 24 2024 22:21:00" },
];

/**
 * Mock function that mimicks logging emissions into database
 * @example
 * // logEmissions()
 * Adds emissions to database with user info, emissions, and date
 * @returns {Promise} Returns a promise that fulfills if able to add to database
 */
async function logEmissions() {
  return new Promise((resolve, reject) => {
    setTimeout(
      () => {
        const distance = document.getElementById("distance").value;
        const mode = document.getElementById("mode").value;
        const date = new Date().toString();
        const dateParsed = date.slice(0, date.indexOf("GMT") - 1);
        let multiplier = 440;
        if (mode === "Walk") multiplier = 20;
        else if (mode === "Bike") multiplier = 9;
        else if (mode === "Train") multiplier = 177;
        else if (mode === "Bus") multiplier = 299;
        emissions.push({
          username: "kevin",
          emissions: multiplier * distance,
          date: dateParsed,
        });
        resolve("Successfully logged");
        renderEmissions();
      },
      Math.random() * 2000 + 1000
    );
  });
}

/**
 * Mock function that mimicks rendering the emissions for a user
 * @example
 * // renderEmissions()
 * Extracts the emissions for that user from the database and displays them
 * @returns {Promise} Returns a promise that fulfills if able to render
 */
async function renderEmissions() {
  return new Promise((resolve, reject) => {
    setTimeout(
      () => {
        let sum = 0;
        const emissionsList = document.getElementById("emissionsList");
        emissionsList.innerHTML = "";
        emissions.forEach((task) => {
          sum += task.emissions;
          const taskElement = document.createElement("li");
          taskElement.innerHTML = `
                    <span>${task.emissions} grams of CO2</span>
                    <span>${task.date}</span>
                `;
          emissionsList.appendChild(taskElement);
        });
        const taskElement = document.createElement("li");
        taskElement.innerHTML = `
                    <span><b>Total Emissions</b></span>
                    <span>${sum} grams of CO2</span>
                `;
        emissionsList.appendChild(taskElement);
      },
      Math.random() * 2000 + 1000
    );
  });
}

// Initial rendering
document.getElementById("log").addEventListener("click", logEmissions);
renderEmissions();
