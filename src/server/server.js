/**
 * ECOmmute Management Server Module
 *
 * This module provides a comprehensive suite of functionalities for managing
 * ECOmmute data via HTTP requests. It leverages a set of core operations
 * including login, signup, tracking emissions, and getting leaderboard. These
 * operations are exposed through a basic HTTP server setup that routes incoming
 * requests to the appropriate action based on the URL path and query parameters.
 *
 * Core Functionalities:
 * - `signup(response, username, password)` : Create new account with a username
 *  and associated password. If username or password is not provided, it responds
 *  with a 400 status code indicating a bad request.
 * - `login(response, username, password)` : Reads the user's username and password
 *  and successfully logs in if password matches username. If the username or password
 *  is not found, it responds with a 401 status code.
 * - `trackEmissions(response, username, distance, transport)` : Creates entry for 'Total
 *  Emissions' tracker.
 * - `getLeaderboard(response)` : Gets the emissions leaderboard from the database.
 *
 * Usage: This module is designed to be deployed as part of a Node.js server
 * environment. It handles HTTP requests related to ECOmmute data management,
 * making it suitable for applications requiring basic ECOmmute functionalities
 * with HTTP interfaces.
 */

// Import ExpressJS
import express from "express";
import logger from "morgan";
import * as db from "./db.js";

const headerFields = { "Content-Type": "application/json" };

/**
 * Asynchronously writes the users emissions to the database.
 * 
 * @param {object} response - HTTP response.
 * @param {string} user - The user of the emission. If not
 * provided, the function will respond with an error message.
 * @param {string} amount - The amount of emissions logged. If not
 * provided, the function will respond with an error message.
 */
async function logEmission(response, user, amount) {
  if (user === undefined || amount === undefined) {
    response.writeHead(400, headerFields);
    response.write("Username and Amount Required");
    response.end();
  } else {
    try {
      await db.logEmission(user, amount, new Date().toLocaleString());
      response.writeHead(200, headerFields);
      response.write(`Emission for ${user} successfully logged`);
      response.end();
    } catch (err) {
      response.writeHead(500, headerFields);
      response.write("Internal Server Error");
      response.write("Unable to log emission");
      response.write(`This is likely a connectivity issue!`);
      response.end();
    }
  }
}

/**
 * Asynchronously gets the user's emissions from the database.
 * 
 * @param {object} response - HTTP response.
 * @param {string} user - The user of the emission. If not
 * provided, the function will respond with an error message.
 */
async function loadUserEmissions(response, user) {
  if (user === undefined) {
    response.writeHead(400, headerFields);
    response.write("Username Required");
    response.end();
  } else {
    try {
      const data = await db.loadUserEmissions(user);
      response.writeHead(200, headerFields);
      response.write(JSON.stringify(data));
      response.end();
    } catch (err) {
      response.writeHead(500, headerFields);
      response.write("Internal Server Error");
      response.write("Unable to log emission");
      response.write(`This is likely a connectivity issue!`);
      response.end();
    }
  }
}

/**
 * Asynchronously gets the emissions leaderboard from the database and sorts
 * them in ascending order based on emissions amount.
 * 
 * @param {object} response - HTTP response. 
 */
async function getLeaderboard(response) {
  try {
    const data = await db.loadAllEmissions();
    let cumulative = {};
    data.forEach((x) => {
      if (x.name in cumulative) cumulative[x.name] += x.amount;
      else cumulative[x.name] = x.amount;
    });
    cumulative = Object.entries(cumulative);
    const sorted = cumulative.sort(function compareScores(a, b) {
      return a[1] < b[1] ? -1 : b[1] < a[1] ? 1 : 0;
    });
    response.writeHead(200, headerFields);
    response.write(JSON.stringify(sorted));
    response.end();
  } catch (err) {
    response.writeHead(500, headerFields);
    response.write("Internal Server Error");
    response.write("Unable to load all emissions");
    response.write(`This is likely a connectivity issue!`);
    response.end();
  }
}

/**
 * Asynchronously creates a new user in the database.
 * 
 * @param {object} response - HTTP response.
 * @param {string} username - The username of the user. If not
 * provided, the function will respond with an error message.
 * @param {string} password - The password of the user. If not
 * provided, the function will respond with an error message.
 */
async function register(response, username, password) {
  if (username === undefined || password === undefined) {
    response.writeHead(400, headerFields);
    response.write("Username and Password Required");
    response.end();
  } else {
    try {
      const result = await db.checkUserExists(username);
      if (result) throw new error();
      const success = await db.createUser(username, password);
      response.writeHead(200, headerFields);
      response.write("Successfully registered");
      response.end();
    } catch (err) {
      response.writeHead(500, headerFields);
      response.write(`Username already taken`);
      response.end();
    }
  }
}

/**
 * Asynchronously deletes an existing user from the database.
 * 
 * @param {object} response - HTTP response.
 * @param {string} username - The username of the user. If not
 * provided, the function will respond with an error message.
 * @param {string} password - The password of the user. If not
 * provided, the function will respond with an error message.
 */
async function deleteUser(response, username, password) {
  if (username === undefined || password === undefined) {
    response.writeHead(400, headerFields);
    response.write("Username and Password Required");
    response.end();
  } else {
    try {
      const result = await db.verifyLogin(username, password);
      if (!result) throw new error();
      const res = await db.deleteUser(username, password);
      response.writeHead(200, headerFields);
      response.write(`Successfully deleted ${username}`);
      response.end();
    } catch (err) {
      response.writeHead(500, headerFields);
      response.write(`Username or password incorrect, deletion denied`);
      response.end();
    }
  }
}

/**
 * Asynchronously updates the password of an existing user in the database.
 * 
 * @param {object} response - HTTP response.
 * @param {string} username - The username of the user. If not
 * provided, the function will respond with an error message.
 * @param {string} oldPassword - The current password of the user. If not
 * provided, the function will respond with an error message.
 * @param {string} newPassword - The new password of the user. If not
 * provided, the function will respond with an error message.
 */
async function changePassword(response, username, oldPassword, newPassword) {
  if (
    username === undefined ||
    oldPassword === undefined ||
    newPassword === undefined
  ) {
    response.writeHead(400, headerFields);
    response.write("Username and Passwords Required");
    response.end();
  } else {
    try {
      const result = await db.verifyLogin(username, oldPassword);
      if (!result) throw new error();
      const res = await db.changePassword(username, newPassword);
      response.writeHead(200, headerFields);
      response.write(`Successfully changed password of ${username}`);
      response.end();
    } catch (err) {
      response.writeHead(500, headerFields);
      response.write(
        `Username or password incorrect, change of password denied`
      );
      response.end();
    }
  }
}

/**
 * Asynchronously verifies that username and password are in the database.
 * @param {object} response - HTTP response.
 * @param {string} username - The username of the user. If not
 * provided, the function will respond with an error message.
 * @param {string} password - The password of the user. If not
 * provided, the function will respond with an error message.
 */
async function login(response, username, password) {
  if (username === undefined || password === undefined) {
    response.writeHead(400, headerFields);
    response.write("Username and Password Required");
    response.end();
  } else {
    try {
      const result = await db.verifyLogin(username, password);
      if (!result) throw new error();
      response.writeHead(200, headerFields);
      response.write("Successfully logged in");
      response.end();
    } catch (err) {
      response.writeHead(500, headerFields);
      response.write(`Username or password incorrect`);
      response.end();
    }
  }
}
/**
 * Asynchronously handles HTTP requests for various ECOmmute operations based on
 * the request URL. The function parses the query parameters from the
 * request URL to determine the requested action and the name of the user (if
 * applicable). It then delegates the request to the corresponding function
 * based on the URL's path.
 *
 * The server responds differently depending on the path:
 *
 * - `/signup` : Create new account with a username and associated password. If
 *  username or password is not provided, it responds  with a 400 status code
 *  indicating a bad request.
 * - `/login` : Reads the user's username and password
 *  and successfully logs in if password matches username. If the username or password
 *  is not found, it responds with a 401 status code.
 * - `/trackEmissions` : Creates entry for 'Total
 *  Emissions' tracker.
 * - `/getLeaderboard` : Gets the emissions leaderboard from the database.
 */

// check ExpressJS documentation at https://expressjs.com/en/5x/api.html#app
const app = express();
const port = 3260;
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// The following code handles static file requests for the client-side code.
app.use(express.static("src/client"));

// If the HTTP method is not explicitly defined for a matching route,
// respond with a 405 status code.
const MethodNotAllowedHandler = async (request, response) => {
  response.status(405).type("text/plain").send("Method Not Allowed");
};

// Handle the request routes
app
  .route("/signup")
  .post(async (request, response) => {
    const options = request.query;
    register(response, options.user, options.pass);
  })
  .delete(async (request, response) => {
    const options = request.query;
    deleteUser(response, options.user, options.pass);
  })
  .put(async (request, response) => {
    const options = request.query;
    changePassword(response, options.user, options.oldpass, options.newpass);
  })
  .all(MethodNotAllowedHandler);

app
  .route("/login")
  .get(async (request, response) => {
    const options = request.query;
    login(response, options.user, options.pass);
  })
  .all(MethodNotAllowedHandler);

app
  .route("/trackEmissions")
  .post(async (request, response) => {
    const options = request.query;
    logEmission(response, options.user, parseInt(options.amount));
  })
  .get(async (request, response) => {
    const options = request.query;
    loadUserEmissions(response, options.user);
  })
  .all(MethodNotAllowedHandler);

app
  .route("/getLeaderboard")
  .get(async (request, response) => {
    const options = request.query;
    getLeaderboard(response);
  })
  .all(MethodNotAllowedHandler);

// default not found route
app.route("*").all(async (request, response) => {
  response.status(404).send(`Not found: ${request.path}`);
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
