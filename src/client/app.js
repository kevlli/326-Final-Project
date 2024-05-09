import { checkPassword, checkUserExists, createUser, getCumulativeEmission, getUserEmission, logEmission } from "./db.js";
import { updateAuth } from "./index.js";

export class App {
    #root;
    #currentView;

    constructor(baseElement) {
        this.#root = baseElement;
        this.#currentView = null;
    }

    async render(view) {
        if (view === this.#currentView) return;

        const response = await fetch(`${view}/${view}.html`);
        const text = await response.text();
        this.#root.innerHTML = text;
        this.#currentView = view;

        if (view === "emissions") await setupEmissions();
        else if (view === "leaderboard") await setupLeaderboard();
        else if (view === "login") await setupLogin(this);
    }
};

async function setupEmissions() {
    const renderEmission = async () => {
        const emissionsList = document.getElementById("emissionsList");
        emissionsList.innerHTML = "";
        let sum = 0;

        const username = localStorage.getItem("user");
        const emissions = await getUserEmission(username ?? "null");
        console.log(emissions);
        emissions.forEach((task) => {
            sum += task.emissions;
            const taskElement = document.createElement("li");
            taskElement.innerHTML = `
            <span>${task.emissions} grams of CO2</span>
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
        }
        else {
            await logEmission(username, distance, mode);
            await renderEmission();
        }
    });

    await renderEmission();
}

async function setupLeaderboard() {
    const leaderboardBody = document.querySelector("#leaderboard tbody");
    leaderboardBody.innerHTML = "";
    
    const sortedUsers = await getCumulativeEmission();
    let rank = 1;
    sortedUsers.forEach((player) => {
        const row = `<tr> <td>${rank++}</td> <td>${player[0]}</td> <td>${player[1]} grams of CO2</td> </tr>`;
        leaderboardBody.innerHTML += row;
    });
}

const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");

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
        const success = await checkPassword(username, password);
        if (!success) {
            alert("Wrong Username or Password");
        }
        else {
            localStorage.setItem("user", username);
            updateAuth();
            await app.render("home");
        }
    });

    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const username = signupUsername.value;
        const password = signupPassword.value;
        const userexists = await checkUserExists(username);
        if (userexists) {
            alert("Username already exists");
        }
        else {
            await createUser(username, password);
            localStorage.setItem("user", username);
            updateAuth();
            await app.render("home");
        }
    });
}