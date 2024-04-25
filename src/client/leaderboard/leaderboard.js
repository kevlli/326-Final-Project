// Mock emissions data for all users
let emissions = [
  { user: "steven", emissions: 55, date: "Wed Apr 24 2024 22:20:37" },
  { user: "takuto", emissions: 70, date: "Wed Apr 24 2024 22:21:00" },
  { user: "kevin", emissions: 40, date: "Wed Apr 24 2024 22:20:37" },
  { user: "kevin", emissions: 60, date: "Wed Apr 24 2024 22:21:00" },
  { user: "steven", emissions: 55, date: "Wed Apr 24 2024 22:20:37" },
  { user: "steven", emissions: 70, date: "Wed Apr 24 2024 22:21:00" },
  { user: "takuto", emissions: 55, date: "Wed Apr 24 2024 22:20:37" },
  { user: "steven", emissions: 70, date: "Wed Apr 24 2024 22:21:00" },
  { user: "aryan", emissions: 70, date: "Wed Apr 24 2024 22:21:00" },
  { user: "clara", emissions: 60, date: "Wed Apr 24 2024 22:21:00" },
];

/**
 * Mock async function that calculates the total emissions for each user from the database
 * @example
 * // calculateLeaderboard()
 * Returns all the users and their total emissions in ascending order
 * @returns {Promise} Returns a promise that fulfills if able to calculate total emissions
 */
async function calculateLeaderboard() {
  return new Promise((resolve, reject) => {
    setTimeout(
      () => {
        let totalEmissions = {};
        emissions.forEach((entry) => {
          if (entry.user in totalEmissions)
            totalEmissions[entry.user] += entry.emissions;
          else totalEmissions[entry.user] = entry.emissions;
        });
        let entries = Object.entries(totalEmissions);
        let sorted = entries.sort((a, b) => a[1] - b[1]);
        resolve(sorted);
      },
      Math.random() * 1000 + 500
    );
  });
}

/**
 * Async function that calls calculateLeaderboard() to render the leaderboard dynamically
 * @example
 * // renderLeaderboard()
 * Renders the html for the leaderboard based on the promise returned from calculateLeaderboard()
 * @returns {null} Returns nothing, only updates html
 */
async function renderLeaderboard() {
  const leaderboardBody = document.querySelector("#leaderboard tbody");
  leaderboardBody.innerHTML = ""; // Clear previous content

  const sortedUsers = await calculateLeaderboard();
  let rank = 1;
  sortedUsers.forEach((player) => {
    const row = `<tr>
                        <td>${rank++}</td>
                        <td>${player[0]}</td>
                        <td>${player[1]}</td>
                    </tr>`;
    leaderboardBody.innerHTML += row;
  });
}

let currentColumn = 0; // initially the column is sorted by rank
let sortOrder = 1; // 1 if ascending, -1 if descending

/**
 * Function that resorts the table
 * @example
 * // sortTable(1)
 * Resorts the table according to the 1-index column, aka name.
 * Dynamically updates the leaderboard after resorting
 * @returns {null} Returns nothing, only updates html
 */
function sortTable(index) {
  const table = document.getElementById("leaderboard");
  const tbody = table.querySelector("tbody");
  let rows = Array.from(tbody.querySelectorAll("tr"));

  //toggle between ascending and descending
  if (currentColumn === index) {
    sortOrder *= -1;
  } else {
    currentColumn = index;
    sortOrder = 1; // Default to ascending order if sorting by a new column
  }

  rows.sort((a, b) => {
    const aValue = a.children[index].textContent.trim();
    const bValue = b.children[index].textContent.trim();
    if (index === 0 || index === 2) {
      // integers
      return sortOrder * (parseInt(aValue) - parseInt(bValue));
    } else {
      return sortOrder * aValue.localeCompare(bValue);
    }
  });

  // Reorder the rows
  tbody.innerHTML = "";
  rows.forEach((row) => {
    tbody.appendChild(row);
  });
}

document.getElementById("rank").addEventListener("click", () => sortTable(0));
document.getElementById("name").addEventListener("click", () => sortTable(1));
document
  .getElementById("emissions")
  .addEventListener("click", () => sortTable(2));
await renderLeaderboard();
