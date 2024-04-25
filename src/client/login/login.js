const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const container = document.getElementById("container");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const signupUsername = document.getElementById("signupUsername");
const signupPassword = document.getElementById("signupPassword");

restoreState();
render();

/**
 * Renders the page depending on if the user is logged in or not
 * @example
 * If user is already logged in, shows a log out button and removes the login/sign up forms
 *
 * @returns {null}
 */
function render() {
  if (localStorage.getItem("loggedIn") !== null) {
    container.innerHTML = `Successfully Logged In! Press logo to proceed. <button id="logout">Log Out</button>`;
    document.getElementById("logout").addEventListener("click", logout);
  }
}

/**
 * Function for logging out
 * Replaces log out button with the log in sign up form.
 * @returns {null}
 */
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

/**
 * Saves the state, aka the username inputs
 * Does not save password state for security reasons
 * @example
 *  Login username: kevin
 *  After refresh
 *  Login username: kevin
 * @returns {null}
 */
function saveState() {
  const state = {
    loginUsername: loginUsername.value,
    signupUsername: signupUsername.value,
  };
  localStorage.setItem("state", JSON.stringify(state));
}

/**
 * Restores the state
 * @example
 *  Login username: kevin
 *  After refresh
 *  Login username: kevin
 * @returns {null}
 */
function restoreState() {
  const state = localStorage.getItem("state");
  if (state === null) return;
  const stateObject = JSON.parse(state);
  loginUsername.value = stateObject.loginUsername;
  signupUsername.value = stateObject.signupUsername;
}

/**
 * Clears the state, typically called after exiting the login page
 * @example
 *  Login username: kevin
 *  Exiting page
 *  Login username:
 * @returns {null}
 */
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

/**
 * Mock function for creating an account
 * @example
 *  returns a promise that resolves if account creation is successful and rejects otherwise
 *  createAccount(kevin, 1234);
 * @returns {Promise}
 */
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

/**
 * Mock function for logging in
 * @example
 *  returns a promise that resolves if logging in is successful and rejects with reason otherwise
 *  login(kevin, 1234);
 * @returns {Promise}
 */
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

/**
 * When attempting to log in, it calls the login function
 * If promise is successful, we update the page according
 * If it rejects, we send an alert
 */
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

/**
 * Similarly, when attempting to create a new account, we call the createaccount function
 * If promise is successful, we send an alert that it was successful
 * If it rejects, we send an alert with reason for rejection
 */
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
