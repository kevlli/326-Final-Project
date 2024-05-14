/**
 * ECOmmute Management Module
 *
 * This module provides a set of asynchronous functions for logging and loading 
 * emission data, creating and deleting a user, changing a users password, and 
 * verifying a user and login credentials exists in a PouchDB database.
 *
 * Functions:
 * - `logEmission(name, amount, date)`: saves a new emissions log to the database 
 * with a specified name and amount.
 * 
 * - `loadUserEmissions(name)`: gets the users logged emissions from the database.
 * 
 * - `loadAllEmissions()`: gets all logged emmissions from the database.
 * 
 * - `createUser(username, password)`:  saves a new user to the database with a 
 * specified username and password.
 * 
 * - `deleteUser(username, password)`: deletes a user from the database by their 
 * username and password.
 * 
 * - `changePassword(username, password)`: changes a user's password in the database.
 * 
 * - `checkUserExists(username)`: verifies if a user with the given username exists
 * in the database.
 * 
 * - `verifyLogin(username, password)`: erifies if a user with the given username and
 * coorelated password exists in the database.
 *
 * Dependencies:
 * - PouchDB: Used for data storage and retrieval operations. Ensure PouchDB is
 *   installed and properly configured.
 *
 * Note: This module is currently works with a PouchDB database named
 * 'ecommuteDB'. Make sure the database is accessible and correctly initialized
 * before using these functions.
 *
 * Note: This module can easily change the database implementation to another
 * database system by changing the import statement and the database connection
 * initialization. The rest of the functions should work as expected with minor
 * modifications.
 */
import PouchDB from "pouchdb";

const db = new PouchDB("ecommuteDB");

/**
 * Asynchronously saves a new emissions log to the database with a specified name and
 * amount.
 *
 * @async
 * @param {string} name - The user of the emission.
 * @param {number} amount - The amount of emissions to be logged.
 * @param {string} date - The date at which the emission was logged
 * @returns {Promise<void>} - A promise that resolves when the emission has been
 * successfully logged.
 * @throws {Error} - Throws an error if the operation fails, e.g., due to
 * database connectivity issues.
 */
export async function logEmission(name, amount, date) {
  try {
    const data = await db.get("emissions");
    data.emissions.push({ name, amount, date });
    await db.put(data);
  } catch (e) {
    await db.put({ _id: "emissions", emissions: [{ name, amount, date }] });
  }
}

/**
 * Asynchronously gets the users logged emissions from the database.
 * 
 * @async
 * @param {string} name - The users name.
 * @returns {Promise<Object>} - A promise that resolves to the emissions data.
 * @throws {Error} - Throws an error if there is a problem accessing the
 * database.
 */
export async function loadUserEmissions(name) {
  try {
    const data = await db.get("emissions");
    return data.emissions.filter((x) => x.name === name);
  } catch (e) {
    return [];
  }
}
/**
 * Asynchronously gets all logged emmissions from the database.
 * 
 * @async
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of
 * logged emissions.
 * @throws {Error} - Throws an error if there is a problem accessing the
 * database.
 */
export async function loadAllEmissions() {
  try {
    const data = await db.get("emissions");
    return data.emissions;
  } catch (e) {
    return [];
  }
}

/**
 * Asynchronously saves a new user to the database with a specified 
 * username and password. 
 * 
 * @async
 * @param {string} username - The unique username for the user.
 * @param {string} password - The password for the user.
 * @returns {Promise<void>} - A promise that resolves when the user has been
 * successfully created.
 * @throws {Error} - Throws an error if the operation fails, e.g., due to
 * database connectivity issues.
 */
export async function createUser(username, password) {
  try {
    const data = await db.get("users");
    data.users.push({ username, password });
    await db.put(data);
  } catch (e) {
    await db.put({ _id: "users", users: [{ username, password }] });
  }
}

/**
 * Asynchronously deletes a user from the database by their username and 
 * password.
 * 
 * @asynch
 * @param {string} username - The unique username for the user.
 * @param {string} password - The password for the user.
 * @returns {Promise<void>} - A promise that resolves when the user has been
 * successfully deleted.
 * @throws {Error} - Throws an error if the user cannot be removed, e.g., it
 * does not exist or due to database issues.
 */
export async function deleteUser(username, password) {
  try {
    const data = await db.get("users");
    data.users = data.users.filter((x) => x.username !== username);
    await db.put(data);
  } catch (e) {
    await db.put({ _id: "users", users: [] });
  }
}

/**
 *Asynchronously changes a user's password in the database.
 * 
 * @asynch
 * @param {string} username - The unique username for the user.
 * @param {string} password - The new password for the user.
 * @returns {Promise<void>} - A promise that resolves when the user's password
 * has been successfully changed.
 * @throws {Error} - Throws an error if the operation fails, e.g., the user
 * does not exist or database issues.
 */
export async function changePassword(username, password) {
  try {
    const data = await db.get("users");
    console.log(data);
    data.users.forEach((x) => {
      if (x.username === username) x.password = password;
    });
    console.log(data);
    await db.put(data);
  } catch (e) {
    await db.put({ _id: "users", users: [] });
  }
}

/**
 * Asynchronously verifies if a user with the given username exists
 * in the database.
 * 
 * @asynch
 * @param {string} username - The unique username for the user.
 * @returns {boolean} - Returns true if the user exists in the database
 * or false if the user does not exist in the database.
 * @throws {Error} - Throws an error if there is a problem accessing the
 * database.
 */
export async function checkUserExists(username) {
  try {
    const data = await db.get("users");
    return data.users.some((x) => x.username === username);
  } catch (e) {
    return false;
  }
}

/**
 * Asynchronously verifies if a user with the given username and coorelated
 * password exists in the database.
 * 
 * @asynch
 * @param {string} username - The unique username for the user.
 * @param {*} password - The specified password for the user.
 * @returns {boolean} - Returns true if the user with the given password exists
 * in the database or false if the user with the given password does not exist 
 * in the database.
 * @throws {Error} - Throws an error if there is a problem accessing the
 * database.
 */
export async function verifyLogin(username, password) {
  try {
    const data = await db.get("users");
    return data.users.some(
      (x) => x.username === username && x.password === password
    );
  } catch (e) {
    return false;
  }
}
