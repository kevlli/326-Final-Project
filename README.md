# 326-Final-Project

This is the Final Project for COMPSCI 326: Web Programming.

Current Progress

- Milestone 1 (`src/docs/milestone-01`): Overview of Project
- Milestone 2 (`src/client`): Frontend
- Milestone 3 (`src/server/server.js`): Backend

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
npm run milestone-03
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
    │   ├── db.js                  ... PouchDB Requests
    │   ├── index.html             ... Base Page
    │   ├── styles.css             ... Formatting
    │   ├── index.js               ... Initial Script
    │   ├── pages                  ... Various Pages
    │   │   ├── about.html
    │   │   ├── emissions.html
    │   │   ├── home.html
    │   │   ├── leaderboard.html
    │   │   ├── login.html
    │   │   └── resources.html
    │   └── imgs                   ... Images
    └── docs/milestone-01          ... Documentation
    ├── server 
        ├── db.js                  ... ECOmmute DB Management
        ├── server.js              ... ECOmmute HTTP Server
```
