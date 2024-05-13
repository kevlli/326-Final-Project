const old_emissions_db = new PouchDB("emissions");
await old_emissions_db.destroy();
const old_users_db = new PouchDB("users");
await old_users_db.destroy();

const emission_db = new PouchDB("emissions");
const user_db = new PouchDB("users");

emission_db.post({ user: "clara", emissions: 55, date: "4/24/2024, 12:00:00 AM" });
emission_db.post({ user: "takuto", emissions: 70, date: "4/24/2024, 6:32:17 AM" });
emission_db.post({ user: "kevin", emissions: 40, date: "4/25/2024, 2:15:49 PM" });
emission_db.post({ user: "kevin", emissions: 60, date: "4/26/2024, 9:45:23 PM" });
emission_db.post({ user: "aryan", emissions: 55, date: "4/27/2024, 4:19:08 AM" });
emission_db.post({ user: "takuto", emissions: 70, date: "4/28/2024, 11:54:32 AM" });
emission_db.post({ user: "takuto", emissions: 55, date: "4/29/2024, 7:28:04 PM" });
emission_db.post({ user: "kevin", emissions: 70, date: "4/30/2024, 3:01:27 AM" });
emission_db.post({ user: "aryan", emissions: 70, date: "5/1/2024, 10:35:51 AM" });
emission_db.post({ user: "clara", emissions: 60, date: "5/1/2024, 6:08:14 PM" });

user_db.post({ user: "takuto", password: "takuto" });
user_db.post({ user: "kevin", password: "kevin" });
user_db.post({ user: "clara", password: "clara" });
user_db.post({ user: "aryan", password: "aryan" });

const multipliers = {
    "Walk": 20,
    "Bike": 9,
    "Train": 177,
    "Bus": 299
};

async function logEmission(user, distance, mode) {
    const emissions = distance * (multipliers[mode] ?? 440);
    await emission_db.post({ user, emissions, date: new Date().toLocaleString()});
}

async function getUserEmission(user) {
    return await emission_db.allDocs({ include_docs: true}).then(response => response.rows.map(row => row.doc))
        .then(docs => docs.filter(doc => doc.user === user));
}

async function getCumulativeEmission() {
    return await emission_db.allDocs({ include_docs: true}).then(response => response.rows.map(row => row.doc))
        .then(docs => docs.reduce((acc, doc) => {
            acc[doc.user] = (acc[doc.user] ?? 0) + doc.emissions;
            return acc;
        }, {}))
        .then(user_to_emi => Object.entries(user_to_emi).toSorted((a, b) => a[1] - b[1]));
}

async function checkUserExists(user) {
    return await user_db.allDocs({ include_docs: true}).then(response => response.rows.map(row => row.doc))
        .then(docs => docs.some(doc => doc.user === user));
}

async function createUser(user, password) {
    await user_db.post({ user, password });
}

async function checkPassword(user, password) {
    return await user_db.allDocs({ include_docs: true}).then(response => response.rows.map(row => row.doc))
        .then(docs => docs.some(doc => doc.user === user && doc.password === password));
}

export { logEmission, getUserEmission, getCumulativeEmission, checkUserExists, createUser, checkPassword };