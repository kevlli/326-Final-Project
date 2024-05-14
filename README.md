# 326-Final-Project

This is the Final Project for COMPSCI 326: Web Programming.

Current Progress

- Milestone 1 (`src/docs/milestone-01`): Overview of Project
- Milestone 2 (`src/client`): Frontend
- Milestone 3 (`src/server`): Backend

## Setup

1. Install repository

```
git clone https://github.com/kevlli/326-Final-Project.git
```

2. Install dependencies

```
npm install
```

3. Run project (Milestone 1)

```
npm run milestone-01
```

4. Run project (Milestone 2)

```
npm run milestone-02
```

5. Run project (Milestone 3)

```
npm start
```

## Project Structure

```
.
├── README.md
├── package-lock.json
├── package.json
└── src
    ├── client
    │   ├── app.js                 ... Rendering Script
    │   ├── index.html             ... Base Page
    │   ├── styles.css             ... Formatting
    │   ├── index.js               ... Initial Script
    │   ├── pages                  ... Various Pages
    │   │   ├── about.html
    │   │   ├── account.html
    │   │   ├── emissions.html
    │   │   ├── home.html
    │   │   ├── leaderboard.html
    │   │   ├── login.html
    │   │   └── resources.html
    │   └── imgs                   ... Images
    └── docs/milestone-01          ... Documentation
    ├── server
        ├── db.js                  ... ECOmmute DB Management
        ├── server.js              ... ECOmmute Express Server
```

## API routes

```
/signup                 ... Route for account functionality
├── POST : Given a username and password, registers a new account
├── DELETE : Given a username and password, deletes the account
└── PUT : Given a username, password, and newPassword, changes password

/login                  ... Route for login functionality
└── GET: Given a username and password, logs in if correct details

/trackEmissions         ... Route for logging emissions
├── POST: Given a username and number, logs the number for that user
└── GET: Given a username, loads all the emissions / logs for that user

/getLeaderboard         ... Route for leaderboard functionality
└── GET: Loads all stored emissions / logs, sorts them for leaderboard


```
