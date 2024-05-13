/**
 * ECOmmute Management Module
 *
 * This module provides a set of asynchronous functions for
 *
 * Functions:
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

export async function loadUserEmissions(name) {
  try {
    const data = await db.get("emissions");
    return data.emissions.filter((x) => x.name === name);
  } catch (e) {
    return [];
  }
}

export async function loadAllEmissions() {
  try {
    const data = await db.get("emissions");
    return data.emissions;
  } catch (e) {
    return [];
  }
}

export async function createUser(username, password) {
  try {
    const data = await db.get("users");
    data.users.push({ username, password });
    await db.put(data);
  } catch (e) {
    await db.put({ _id: "users", users: [{ username, password }] });
  }
}

export async function deleteUser(username, password) {
  try {
    const data = await db.get("users");
    data.users = data.users.filter((x) => x.username !== username);
    await db.put(data);
  } catch (e) {
    await db.put({ _id: "users", users: [] });
  }
}

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

export async function checkUserExists(username) {
  try {
    const data = await db.get("users");
    return data.users.some((x) => x.username === username);
  } catch (e) {
    return false;
  }
}

export async function verifyLogin(username, password) {
  try {
    const data = await db.get("users");
    if (
      data.users.some((x) => x.username === username && x.password === password)
    )
      return true;
    return false;
  } catch (e) {
    await db.put({ _id: "users", users: [{ username, password }] });
    return false;
  }
}
