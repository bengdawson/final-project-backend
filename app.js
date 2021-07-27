const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "team-titan.cjsrixc7budk.eu-west-2.rds.amazonaws.com",
  user: "admin",
  password: "teamtitan",
  database: "titan",
});
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
});

connection.query("SELECT * FROM users", (err, rows) => {
  if (err) throw err;

  console.log("Data received");
  console.log(rows);
});
