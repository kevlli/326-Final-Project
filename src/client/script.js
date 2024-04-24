// Placeholder for application state
const appState = {
    currentView: "",
};

// Function to dynamically load view content
function loadView(view) {
    fetch(`${view}/${view}.html`) // Assuming each view has a corresponding HTML file
        .then((response) => response.text())
        .then((html) => {
        document.getElementById("view-container").innerHTML = html;
        appState.currentView = view;
        window.history.pushState({ view: view }, `${view}`, `#${view}`);
        });
}

// Event listeners for navigation links
document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        const viewName = this.getAttribute("href").substring(1);
        loadView(viewName);
    });
});

// Handle browser back and forward buttons
window.addEventListener("popstate", (e) => {
    if (e.state && e.state.view) {
        loadView(e.state.view);
    }
});

// Load the initial view based on the URL
const initialView = window.location.hash
    ? window.location.hash.substring(1)
    : "home";
loadView(initialView);