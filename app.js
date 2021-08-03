const ApiBuilder = require("claudia-api-builder");
const { request } = require("express");
const api = new ApiBuilder();
//const mysql = require("mysql2/promise");
//const express = require("express");
const pool = require("./middleware/pool");

console.log(pool);

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
	"/categories/:category",
	async function () {
		//const params = request.queryString.category
		const rows = await pool.query(`SELECT * FROM categories WHERE slug=${category} ;`);
		const result = Object.values(JSON.parse(JSON.stringify(rows[0])));
		return { orgs: result };
	},
	{ success: { contentType: "application/json" }, error: { code: 403 } }
);


api.get(
	"/categories",
	async function () {
		const rows = await pool.query("SELECT * FROM categories;");
		const result = Object.values(JSON.parse(JSON.stringify(rows[0])));
		return { orgs: result };
	},
	{ success: { contentType: "application/json" }, error: { code: 403 } }
);

// api


api.get("/", function () {
	return "Hello world!";
});

module.exports = api;