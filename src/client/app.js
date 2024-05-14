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
    else if (view === "account") await setupAccount(this);
  }
}

async function setupEmissions() {
  const renderEmission = async () => {
    const emissionsList = document.getElementById("emissionsList");
    emissionsList.innerHTML = "";
    let sum = 0;

    const username = localStorage.getItem("user");
    const emissions = await fetch(
      `/trackEmissions?user=${username}`
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
        `/trackEmissions?user=${username}&amount=${distance * (multipliers[mode] ?? 440)}`,
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

  const sortedUsers = await fetch(`/getLeaderboard`).then(
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
      `/login?user=${username}&pass=${password}`
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
      `/signup?user=${username}&pass=${password}`,
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

async function setupAccount(app) {
  const nameTitle = document.getElementById("name-title");
  nameTitle.innerText = `Welcome ${localStorage.getItem("user")}!`;

  const changeForm = document.getElementById("changeForm");
  const oldPassInput = document.getElementById("oldpass");
  const newPassInput = document.getElementById("newpass");

  changeForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const oldPass = oldPassInput.value;
    const newPass = newPassInput.value;
    const response = await fetch(
      `/signup?user=${localStorage.getItem("user")}&oldpass=${oldPass}&newpass=${newPass}`,
      {
        method: "PUT",
      }
    );
    if (response.status === 200) {
      alert("Successfully changed password");
    }
    else {
      alert(await response.text());
    }
  });

  const deleteForm = document.getElementById("deleteForm");
  const deletePass = document.getElementById("deletePass");

  deleteForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = localStorage.getItem("user");
    const password = deletePass.value;
    const response = await fetch(
      `/signup?user=${username}&pass=${password}`,
      {
        method: "DELETE",
      }
    )
    if (response.status === 200) {
      alert("Successfully deleted account");
      localStorage.removeItem("user");
      updateAuth();
      await app.render("login");
    }
    else {
      alert(await response.text());
    }
  });

  const logoutBtn = document.getElementById("logout-btn");

  logoutBtn.addEventListener("click", async () => {
    localStorage.removeItem("user");
    updateAuth();
    await app.render("login");
  });
}