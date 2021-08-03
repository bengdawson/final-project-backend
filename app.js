const ApiBuilder = require("claudia-api-builder");
const { request } = require("express");
const api = new ApiBuilder();
//const mysql = require("mysql2/promise");
const express = require("express");
const pool = require("./middleware/pool");

//console.log(pool);

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

api.get(
  "/users",
  async function () {
    const rows = await pool.query("SELECT * FROM users;");
    const result = Object.values(JSON.parse(JSON.stringify(rows[0])));
    return { users: result };
  },
  { success: { contentType: "application/json" }, error: { code: 403 } }
);

api.get(
  "/opportunities",
  async function () {
    const rows = await pool.query("SELECT * FROM opportunities;");
    const result = Object.values(JSON.parse(JSON.stringify(rows[0])));
    return { users: result };
  },
  { success: { contentType: "application/json" }, error: { code: 403 } }
);

api.get(
  "/orgs",
  async function () {
    const rows = await pool.query("SELECT * FROM orgs;");
    const result = Object.values(JSON.parse(JSON.stringify(rows[0])));
    return { orgs: result };
  },
  { success: { contentType: "application/json" }, error: { code: 403 } }
);

api.get(
  "/opportunities/{category}",
  async function ({ pathParams }) {
    const params = pathParams.category;
    const rows = await pool.query(
      `SELECT * FROM opportunities WHERE categories="${params}";`
    );
    const result = Object.values(JSON.parse(JSON.stringify(rows[0])));
    return { opportunities: result };
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

api.get(
  "/categories",
  async function () {
    const rows = await pool.query("SELECT * FROM categories;");
    const result = Object.values(JSON.parse(JSON.stringify(rows[0])));
    return { categories: result };
  },
  { success: { contentType: "application/json" }, error: { code: 403 } }
);

//remove

api.get("/", function () {
  return "Hello world!";
});

module.exports = api;
