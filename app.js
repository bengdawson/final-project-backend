const ApiBuilder = require("claudia-api-builder");
const { request } = require("express");
const api = new ApiBuilder();
//const mysql = require("mysql2/promise");
const express = require("express");
const pool = require("./middleware/pool");
const format = require("pg-format");

// USERS

//PATCH single user by username

api.patch(
  "/users/{username}",
  async function ({ body, pathParams }) {
    const { username } = pathParams;
    const { newUsername, newAvatar_url } = body;
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

    const patchedUser = await pool.query(queryStr);
    return { user_updated: "you updated the user!" };
    // UPDATE user SET username="${newUsername}", avatar_url="${newAvatar_url}" WHERE username="${username}";
  },
  { success: { contentType: "application/json" }, error: { code: 403 } }
);

//GET single user by username

api.get(
  "/users/{username}",
  async function ({ pathParams }) {
    const { username } = pathParams;
    const queryStr = format("SELECT * FROM users WHERE username = %L", [
      username,
    ]);
    const usersFromApi = await pool.query(queryStr);
    const result = Object.values(JSON.parse(JSON.stringify(usersFromApi[0])));
    return { users: result };
  },
  { success: { contentType: "application/json" }, error: { code: 403 } }
);

//GET all users
api.get(
  "/users",
  async function () {
    const usersFromApi = await pool.query("SELECT * FROM users;");
    const result = Object.values(JSON.parse(JSON.stringify(usersFromApi[0])));
    return { users: result };
  },
  { success: { contentType: "application/json" }, error: { code: 403 } }
);

//POST a user

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
    const queryStr = format(
      `INSERT INTO users (username,
      avatar_url,
      firstname,
      lastname,
      dbs,
      drive,
      email, password) VALUES (%L);`,
      [username, avatar_url, firstname, lastname, dbs, drive, email, password]
    );
    const newUserFromApi = await pool.query(queryStr);
    console.log(newUserFromApi, "<<< newUser");
    console.log(res, "<<<<RES");
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

//GET opportunities by id

api.get(
  "/opportunities/opportunity/{opp_id}",
  async function ({ pathParams }) {
    const { opp_id } = pathParams;
    const rows = await pool.query(
      `SELECT * FROM opportunities WHERE opp_id="${opp_id}";`
    );
    const result = Object.values(JSON.parse(JSON.stringify(rows[0])));
    return { opportunity: result };
  },
  { success: { contentType: "application/json" }, error: { code: 403 } }
);

//GET opportunities by category

api.get(
  "/opportunities/{category}",
  async function ({ pathParams }) {
    const params = pathParams["category"].replace(/%20/g, " ");
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
  async function ({ queryString }) {
    let queryStr = "SELECT * FROM opportunities";
    if (queryString.sort_by === "date_posted") {
      queryStr += " ORDER BY date_posted";
    } else if (queryString.sort_by === "opp_date") {
      queryStr += " ORDER BY opp_date";
    }
    queryStr += ";";
    const oppsFromApi = await pool.query(queryStr);
    const result = Object.values(JSON.parse(JSON.stringify(oppsFromApi[0])));
    return { opportunities: result };
  },
  { success: { contentType: "application/json" }, error: { code: 403 } }
);

api.get(
  "/opportunities/opportunity/{opp_id}",
  async function ({ pathParams }) {
    const {opp_id} = pathParams   
    const rows = await pool.query(
      `SELECT * FROM opportunities WHERE opp_id="${opp_id}";`
    );
    const result = Object.values(JSON.parse(JSON.stringify(rows[0])));
    return { opportunity: result };
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

// APPLICATIONS

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

// DELETE application by id

api.delete(
  "/applications/delete/{app_id}",
  async function ({ pathParams }) {
    const { app_id } = pathParams;
    const queryStr = format(`DELETE FROM applications WHERE app_id = %L`, [
      app_id,
    ]);
    const deletedApp = await pool.query(queryStr);
    return { application_deleted: "you deleted the application" };
  },
  { success: { contentType: "application/json" }, error: { code: 403 } }
);

//UP TO HERE (BEN)

// GET applicants by opportunity id.

api.get(
  "/applications/opportunities/{opp_id}",
  async function ({ pathParams }) {
    const { opp_id } = pathParams;
    const queryStr = format(
      `SELECT username, status, name, opp_date FROM applications RIGHT JOIN opportunities ON applications.opp_id = opportunities.opp_id WHERE applications.opp_id = %L;`,
      [opp_id]
    );
    const appFromApi = await pool.query(queryStr);
    const result = Object.values(JSON.parse(JSON.stringify(appFromApi[0])));
    return { applicants: result };
  },
  { success: { contentType: "application/json" }, error: { code: 403 } }
);

api.patch(
  "/applications/{username}",
  async function ({ body, pathParams }, res) {
    const { username } = pathParams;
    const { opp_id, newStatus } = body;
    const queryStr = format(
      `UPDATE applications SET status=%L WHERE username=%L AND opp_id=%L;`,
      [newStatus],
      [username],
      [opp_id]
    );
    await pool.query(queryStr);
    const queryStr2 = format(
      `SELECT * FROM applications WHERE username = %L AND opp_id = %L;`,
      [username],
      [opp_id]
    );
    const updatedApp = await pool.query(queryStr2);
    return { updated_user: updatedApp[0] };
  },
  { success: { contentType: "application/json" }, error: { code: 403 } }
);

// CATEGORIES

//GET all categories

api.get(
  "/categories",
  async function () {
    const categoriesFromApi = await pool.query("SELECT * FROM categories;");
    const result = Object.values(
      JSON.parse(JSON.stringify(categoriesFromApi[0]))
    );
    return { categories: result };
  },
  { success: { contentType: "application/json" }, error: { code: 403 } }
);

//API

api.get("/", function () {
  return {
    msg: "Welcome to ChariT! Below are the endpoints available,",
    "GET /categories": "Get all the available categories",
    "GET /users": "Get all users (volunteers)",
    "GET /users/:username": "Get a specific user by its username",
    "GET /orgs": "Get all organisations",
    "GET /opportunities":
      "Get all the opportunities - can add ?sort_by=opp_date or ?sort_by=date_posted for closest opportunities or most recent posted",
    "GET /opportunities/orgs/:opp_owner":
      "Get the opportunities availables by organisation name",
    "GET /opportunities/:category": "Get opportunities by its category",
    "GET /applications/:username": "Get applications by username",
    "GET /applications/opportunities/:opp_id":
      "Get applicants by opportunity id",
    "POST /users":
      "allow to post a create a new user { username: username, avatar_url: avatar_url, firstname: firstname, lastname: lastname, dbs: yes/no, drive: yes/no, email: email, password: password }",
    "POST /orgs":
      "allow to post a create a organistation { org_name: name, avatar_url: avatar_url, description: description, email: email, password: password }",
    "POST /opportunities":
      "allow to post a new opportunity { name: event_name, description: description, opp_date: event_date, dbs: yes/no, drive: yes/no, categories : category, opp_owner: org_name  }",
    "POST /applications":
      " allow users to apply for events { username: username, opp_id: opportunity_id }",
    "PATCH /users/:username":
      "Update the username and avatar_url by its username, it should be an object like { username: username, avatar_url:avatar:url  }",
    "DELETE /applications/delete/:opp_id":
      "allow user to delete a specific application by its opportunity id",
    "DELETE /opportunities/delete/:opp_id":
      "allow organisation to delete a specific application by its opportunity id",
  };
});

module.exports = api;
