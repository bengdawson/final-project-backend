const ApiBuilder = require("claudia-api-builder");
const { request } = require("express");
const api = new ApiBuilder();
//const mysql = require("mysql2/promise");
const express = require("express");
const pool = require("./middleware/pool");

// USERS

//PATCH single user by username
api.patch(
  "/users/{username}",
  async function ({ body, pathParams }) {
    const { username } = pathParams;
    const newUsername = body.newUsername;
    const newAvatar_url = body.newAvatar_url;
    let queryStr = "UPDATE users SET ";
    if (newUsername) {
      queryStr += `username="${newUsername}"`;
    }
    if (newUsername && newAvatar_url) {
      queryStr += ", ";
    }
    if (newAvatar_url) {
      queryStr += `avatar_url="${newAvatar_url}"`;
    }
    queryStr += `WHERE username="${username}";`;

    console.log(queryStr);

    const patchedUser = await pool.query(queryStr);
    return { user_updated: "you updated the user!" };
    // UPDATE user SET username="${newUsername}", avatar_url="${newAvatar_url}" WHERE username="${username}";
  },
  { success: { contentType: "application/json" }, error: { code: 403 } }
);

// GET single user by username

api.get(
  "/users/{username}",
  async function ({ pathParams }) {
    const params = pathParams.username;
    const rows = await pool.query(
      `SELECT * FROM users WHERE username="${params}";`
    );
    const result = Object.values(JSON.parse(JSON.stringify(rows[0])));
    return { user: result };
  },
  { success: { contentType: "application/json" }, error: { code: 403 } }
);

// GET all users
api.get(
  "/users",
  async function () {
    const rows = await pool.query("SELECT * FROM users;");
    const result = Object.values(JSON.parse(JSON.stringify(rows[0])));
    return { users: result };
  },
  { success: { contentType: "application/json" }, error: { code: 403 } }
);

// POST a user

api.post(
  "/users",
  async function ({ body }, res) {
    const {
      username,
      avatar_url,
      firstname,
      lastname,
      dbs,
      drive,
      email,
      password,
    } = body;
    const newUserFromApi = await pool.query(
      `INSERT INTO users (username,
    avatar_url,
    firstname,
    lastname,
    dbs,
    drive,
    email, password) VALUES ("${username}", "${avatar_url}", "${firstname}", "${lastname}", "${dbs}", "${drive}", "${email}", "${password}");`
      //   username,
      //   avatar_url,
      //   firstname,
      //   lastname,
      //   dbs,
      //   drive,
      //   email,
      //   password
    );
    console.log(newUserFromApi);
    console.log(Object.values(JSON.parse(JSON.stringify(newUserFromApi[0]))));
    return { user_posted: "new user posted" };
  },
  { success: { contentType: "application/json" }, error: { code: 403 } }
);

// ORGANISATIONS

//POST org

api.post(
  "/orgs",
  async function ({ body }, res) {
    const { org_name, avatar_url, description, email, password } = body;
    const newOrgFromApi = await pool.query(
      `INSERT INTO orgs (org_name,
        avatar_url,
        description,
        email,
        password) VALUES ("${org_name}", "${avatar_url}", "${description}", "${email}", "${password}");`
    );
    return { org_posted: "new org posted" };
  },
  { success: { contentType: "application/json" }, error: { code: 403 } }
);

//GET all orgs
api.get(
  "/orgs",
  async function () {
    const rows = await pool.query("SELECT * FROM orgs;");
    const result = Object.values(JSON.parse(JSON.stringify(rows[0])));
    return { orgs: result };
  },
  { success: { contentType: "application/json" }, error: { code: 403 } }
);

// GET all the opportunities by organisation name.

api.get(
  "/opportunities/orgs/{opp_owner}",
  async function ({ pathParams }) {
    const params = pathParams["opp_owner"].replace(/%20/g, " ");
    const rows = await pool.query(
      `SELECT * FROM opportunities WHERE opp_owner= "${params}";`
    );
    const result = Object.values(JSON.parse(JSON.stringify(rows[0])));
    return { opportunities: result };
  },
  { success: { contentType: "application/json" }, error: { code: 403 } }
);

//OPPORTUNITIES

//DELETE opportunities by id

api.delete(
  "/opportunities/delete/{opp_id}",
  async function ({ pathParams }) {
    const { opp_id } = pathParams;
    const deletedOpp = await pool.query(
      `DELETE FROM opportunities WHERE opp_id= "${opp_id}"`
    );
    return { opportunity_deleted: "you deleted the opportunity" };
  },
  { success: { contentType: "application/json" }, error: { code: 403 } }
);

//GET opportunities by category

api.get(
  "/opportunities/{category}",
  async function ({ pathParams }) {
    const params = pathParams["category"].replace(/%20/g, " ");
    // const paramsReplaced = params.replaceAll("%20", " ");
    console.log(params, "<<< params");
    const rows = await pool.query(
      `SELECT * FROM opportunities WHERE categories="${params}";`
    );
    const result = Object.values(JSON.parse(JSON.stringify(rows[0])));
    return { opportunities: result };
  },
  { success: { contentType: "application/json" }, error: { code: 403 } }
);

//GET all opportunities

api.get(
  "/opportunities",
  async function () {
    const rows = await pool.query("SELECT * FROM opportunities;");
    const result = Object.values(JSON.parse(JSON.stringify(rows[0])));
    return { opportunities: result };
  },
  { success: { contentType: "application/json" }, error: { code: 403 } }
);

//POST opportunities

api.post(
  "/opportunities",
  async function ({ body }, res) {
    const { name, description, opp_date, dbs, drive, categories, opp_owner } =
      body;
    const newOppFromApi = await pool.query(
      `INSERT INTO opportunities (name, description, opp_date, dbs, drive, categories, opp_owner) VALUES ("${name}", "${description}", "${opp_date}", "${dbs}", "${drive}", "${categories}", "${opp_owner}");`
    );
    return { opp_posted: "new opportunity posted" };
  },
  { success: { contentType: "application/json" }, error: { code: 403 } }
);

//APPLICATIONS

//GET applications by username

api.post(
  "/applications",
  async function ({ body }, res) {
    const { username, opp_id } = body;
    const newAppFromApi = await pool.query(
      `INSERT INTO applications (username, opp_id) VALUES ("${username}", "${opp_id}");`
    );
    return { application_posted: "new application submitted" };
  },
  { success: { contentType: "application/json" }, error: { code: 403 } }
);

api.get(
  "/applications/{username}",
  async function ({ pathParams }) {
    const params = pathParams.username;
    const rows = await pool.query(
      `SELECT * FROM opportunities RIGHT JOIN applications ON opportunities.opp_id = applications.opp_id WHERE applications.username = "${params}"; `
    );
    const result = Object.values(JSON.parse(JSON.stringify(rows[0])));
    return { applications: result };
  },
  { success: { contentType: "application/json" }, error: { code: 403 } }
);

//DELETE application by id

api.delete(
  "/applications/delete/{app_id}",
  async function ({ pathParams }) {
    const { app_id } = pathParams;
    const deletedApp = await pool.query(
      `DELETE FROM applications WHERE app_id= "${app_id}"`
    );
    return { application_deleted: "you deleted the application" };
  },
  { success: { contentType: "application/json" }, error: { code: 403 } }
);

// GET applicants by opportunity id.

api.get(
  "/applications/opportunities/{opp_id}",
  async function ({ pathParams }) {
    const params = pathParams.opp_id;
    const rows = await pool.query(
      `SELECT username, status, name, opp_date FROM applications RIGHT JOIN opportunities ON applications.opp_id = opportunities.opp_id WHERE applications.opp_id ="${params}" ; `
    );
    const result = Object.values(JSON.parse(JSON.stringify(rows[0])));
    return { applicants: result };
  },
  { success: { contentType: "application/json" }, error: { code: 403 } }
);

//CATEGORIES

//GET all categories

api.get(
  "/categories",
  async function () {
    const rows = await pool.query("SELECT * FROM categories;");
    const result = Object.values(JSON.parse(JSON.stringify(rows[0])));
    return { categories: result };
  },
  { success: { contentType: "application/json" }, error: { code: 403 } }
);

//API

//ADD THE ENDPOINTS TO HERE

api.get("/", function () {
  return "Hello world!";
});

module.exports = api;
