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

const headerFields = { "Content-Type": "text/html" };



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
  response.status(405).type('text/plain').send('Method Not Allowed');
};

// Handle the request routes
// add delete route
app
  .route("/signup")
  .post(async (request, response) => {
    const options = request.query;
    //signup(response, username, password);
  })
  .all(MethodNotAllowedHandler);

app
  .route("/login")
  .get(async (request, response) => {
    const options = request.query;
    //login(response, username, password);
  })
  .all(MethodNotAllowedHandler);

app
  .route("/trackEmissions")
  .put(async (request, response) => {
    const options = request.query;
    //trackEmissions(response, username, distance, transport);
  })
  .all(MethodNotAllowedHandler);

app
  .route("/getLeaderboard")
  .get(async (request, response) => {
    const options = request.query;
    //getLeaderboard(response);
  })
  .all(MethodNotAllowedHandler);


// default not found route
app.route("*").all(async (request, response) => {
  response.status(404).send(`Not found: ${request.path}`);
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
