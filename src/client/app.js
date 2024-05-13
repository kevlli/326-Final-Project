import { updateAuth } from "./index.js";

const multipliers = {
  Walk: 20,
  Bike: 9,
  Train: 177,
  Bus: 299,
};

export class App {
  #root;
  #currentView;

  constructor(baseElement) {
    this.#root = baseElement;
    this.#currentView = null;
  }

  async render(view) {
    if (view === this.#currentView) return;

    const response = await fetch(`pages/${view}.html`);
    const text = await response.text();
    this.#root.innerHTML = text;
    this.#currentView = view;

    if (view === "emissions") await setupEmissions();
    else if (view === "leaderboard") await setupLeaderboard();
    else if (view === "login") await setupLogin(this);
  }
}

async function setupEmissions() {
  const renderEmission = async () => {
    const emissionsList = document.getElementById("emissionsList");
    emissionsList.innerHTML = "";
    let sum = 0;

    const username = localStorage.getItem("user");
    const emissions = await fetch(
      `http://localhost:3260/trackEmissions?user=${username}`
    ).then((response) => response.json());
    console.log(emissions);
    emissions.forEach((task) => {
      sum += task.amount;
      const taskElement = document.createElement("li");
      taskElement.innerHTML = `
            <span>${task.amount} grams of CO2</span>
            <span>${task.date}</span>`;
      emissionsList.appendChild(taskElement);
    });

    const taskElement = document.createElement("li");
    taskElement.innerHTML = `
            <h4><b>Total Emissions</b></h4>
            <h4>${sum} grams of CO2</h4>`;
    emissionsList.appendChild(taskElement);
  };

  document.getElementById("log").addEventListener("click", async () => {
    const distance = document.getElementById("distance").value;
    const mode = document.getElementById("mode").value;
    const username = localStorage.getItem("user");
    if (username === null) {
      alert("You must be logged in to log your emissions");
    } else if (distance == null) {
      alert("Please enter a number");
    } else {
      await fetch(
        `http://localhost:3260/trackEmissions?user=${username}&amount=${distance * (multipliers[mode] ?? 440)}`,
        {
          method: "POST",
        }
      );
      await renderEmission();
    }
  });

  await renderEmission();
}

async function setupLeaderboard() {
  const leaderboardBody = document.querySelector("#leaderboard tbody");
  leaderboardBody.innerHTML = "";

  const sortedUsers = await fetch(`http://localhost:3260/getLeaderboard`).then(
    (response) => response.json()
  );
  let rank = 1;
  sortedUsers.forEach((player) => {
    const row = `<tr> <td>${rank++}</td> <td>${player[0]}</td> <td>${player[1]} grams of CO2</td> </tr>`;
    leaderboardBody.innerHTML += row;
  });
}

async function setupLogin(app) {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const loginUsername = document.getElementById("loginUsername");
  const loginPassword = document.getElementById("loginPassword");
  const signupUsername = document.getElementById("signupUsername");
  const signupPassword = document.getElementById("signupPassword");

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = loginUsername.value;
    const password = loginPassword.value;
    const response = await fetch(
      `http://localhost:3260/login?user=${username}&pass=${password}`
    );
    if (response.status !== 200) {
      alert("Wrong Username or Password");
    } else {
      localStorage.setItem("user", username);
      updateAuth();
      await app.render("home");
    }
  });

  signupForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = signupUsername.value;
    const password = signupPassword.value;
    const response = await fetch(
      `http://localhost:3260/signup?user=${username}&pass=${password}`,
      {
        method: "POST",
      }
    );
    if (response.status !== 200) {
      alert(await response.text());
    } else {
      alert(await response.text());
      localStorage.setItem("user", username);
      updateAuth();
      await app.render("home");
    }
  });
}
