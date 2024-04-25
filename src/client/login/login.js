//import PouchDB from "pouchdb";

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const container = document.getElementById("container");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const signupUsername = document.getElementById("signupUsername");
const signupPassword = document.getElementById("signupPassword");

restoreState();
render();

function render() {
  if (localStorage.getItem("loggedIn") !== null) {
    container.innerHTML = `Successfully Logged In! Press logo to proceed. <button id="logout">Log Out</button>`;
    document.getElementById("logout").addEventListener("click", logout);
  }
}

function logout() {
  localStorage.removeItem("loggedIn");
  container.innerHTML = `<div class="form-container">
  <form id="loginForm" class="input-form">
    <h2>Login</h2>
    <input
      type="text"
      id="loginUsername"
      placeholder="Username"
      required
    />
    <input
      type="password"
      id="loginPassword"
      placeholder="Password"
      required
    />
    <button type="submit">Login</button>
  </form>
  <form id="signupForm" class="input-form">
    <h2>Sign Up</h2>
    <input
      type="text"
      id="signupUsername"
      placeholder="Username"
      required
    />
    <input
      type="password"
      id="signupPassword"
      placeholder="Password"
      required
    />
    <button type="submit">Sign Up</button>
  </form>
</div>`;
}

function saveState() {
  const state = {
    loginUsername: loginUsername.value,
    signupUsername: signupUsername.value,
  };
  localStorage.setItem("state", JSON.stringify(state));
}

function restoreState() {
  const state = localStorage.getItem("state");
  if (state === null) return;
  const stateObject = JSON.parse(state);
  loginUsername.value = stateObject.loginUsername;
  signupUsername.value = stateObject.signupUsername;
}

function clearState() {
  localStorage.removeItem("state");
}

loginUsername.addEventListener("keyup", saveState);
signupUsername.addEventListener("keyup", saveState);

// Mock account data
let accounts = [
  { username: "kevin", password: "kevin" },
  { username: "steven", password: "bruh" },
];

async function createAccount(user, pass) {
  return new Promise((resolve, reject) => {
    setTimeout(
      () => {
        if (accounts.some((obj) => obj.username === user))
          reject("Username taken! Try again.");
        else {
          accounts.push({ username: user, password: pass });
          resolve("Account successfully created!");
        }
      },
      Math.random() * 2000 + 1000
    );
  });
}

async function login(user, pass) {
  return new Promise((resolve, reject) => {
    setTimeout(
      () => {
        if (
          accounts.some((obj) => obj.username === user && obj.password === pass)
        )
          resolve("Success");
        else if (accounts.some((obj) => obj.username === user)) {
          reject("Incorrect password!");
        } else {
          reject("Account does not exist");
        }
      },
      Math.random() * 2000 + 1000
    );
  });
}

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  clearState();
  const username = loginUsername.value;
  const password = loginPassword.value;
  await login(username, password).then(
    (result) => {
      alert(result);
      container.innerHTML = `Successfully Logged In! Press logo to proceed.`;
      localStorage.setItem("loggedIn", "true");
      render();
    },
    (error) => {
      alert(error);
      loginUsername.value = "";
      loginPassword.value = "";
    }
  );
});

signupForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const username = signupUsername.value;
  const password = signupPassword.value;
  await createAccount(username, password).then(
    (result) => {
      alert(result);
    },
    (error) => {
      alert(error);
    }
  );
  signupUsername.value = "";
  signupPassword.value = "";
  saveState();
});
