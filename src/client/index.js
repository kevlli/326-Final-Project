import { App } from "./app.js";

const appElement = document.getElementById("app-container");
const app = new App(appElement);


// Event listeners for navigation links
document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", async function (e) {
        e.preventDefault();
        const viewName = this.getAttribute("href").substring(1);
        await app.render(viewName);
    });
});

// Handle browser back and forward buttons
window.addEventListener("popstate", async (e) => {
    if (e.state && e.state.view) {
        await app.render(e.state.view);
    }
});

// Load the initial view based on the URL
const initialView = window.location.hash
    ? window.location.hash.substring(1)
    : "home";
await app.render(initialView);

const loginBtn = document.getElementById("login-btn");
const acctBtn = document.getElementById("acct-btn");

function updateAuth() {
    if (localStorage.getItem("user") === null) {
        loginBtn.style.display = "inline";
        acctBtn.style.display = "none";
    }
    else {
        acctBtn.style.display = "inline";
        loginBtn.style.display = "none";
    }
}

updateAuth();

export { updateAuth };