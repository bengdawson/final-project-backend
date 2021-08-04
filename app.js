const ApiBuilder = require("claudia-api-builder");
const { request } = require("express");
const api = new ApiBuilder();
//const mysql = require("mysql2/promise");
const express = require("express");
const pool = require("./middleware/pool");

// USERS

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

//OPPORTUNITIES

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
  { success: { contentType: "application/json" }, error: { code: 404 } }
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
