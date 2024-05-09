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


