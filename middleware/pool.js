const mysql = require("mysql2/promise");

const dotenv = require("dotenv");

dotenv.config();

const pool = mysql.createPool({
	connectionLimit: 10,
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
});

pool.on("connection", function (connection) {
	console.log("DB Connection established");

	connection.on("error", function (err) {
		console.error(new Date(), "MySQL error", err.code);
	});
	connection.on("close", function (err) {
		console.error(new Date(), "MySQL close", err);
	});
});

module.exports = pool;
