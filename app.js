const ApiBuilder = require("claudia-api-builder"),
  api = new ApiBuilder();

const mysql = require("mysql2");
const { Op, Sequelize } = require("sequelize");
// const { S3 } = require("@aws-sdk/client-s3");

module.exports = api;

api.get("/users", function () {
  return new Promise((resolve, reject) => {
    loadDatabase()
      .then((db) => {
        console.log(db);
        resolve(getUsers(db));
      })
      .catch((err) => {
        reject(`Ok, something went seriously wrong...\n ${err.message}`);
      });
  });

  function loadDatabase() {
    return new Promise((resolve, reject) => {
      const db = {};
      const sequelize = new Sequelize("titan", "admin", "teamtitan", {
        host: "titan.cjsrixc7budk.eu-west-2.rds.amazonaws.com", //"titan.l4yxy1ug4g.eu-west-2.rds.amazonaws.com",
        dialect: "mysql",
        port: "3306",
        pool: {
          max: 5,
          min: 0,
          idle: 300,
        },
      });
      sequelize
        .authenticate()
        .then(() => {
          console.log("Connection has been established successfully.");
          //Models/tables
          db.users = require("./models/users.js")(sequelize, Sequelize);
          db.Sequelize = Sequelize;
          db.sequelize = sequelize;
          db.op = Op;
          resolve(db);
        })
        .catch((err) => {
          console.error("Unable to connect to the database:", err);
          reject(err);
        });
    });
  }

  function getUsers(db) {
    return new Promise((resolve, reject) => {
      db.users
        .findAll()
        .then(function (result) {
          db.sequelize.connectionManager.close();
          resolve(result);
        })
        .error(function (err) {
          console.log("Error:" + err);
          reject(err);
        });
    });
  }
});

// const connection = mysql.createConnection({
//   host: "titan.cjsrixc7budk.eu-west-2.rds.amazonaws.com",
//   user: "admin",
//   password: "teamtitan",
//   database: "titan",
// });
// connection.connect((err) => {
//   if (err) throw err;
//   console.log("Connected!");
// });

// connection.query("SELECT * FROM users", (err, rows) => {
//   if (err) throw err;

//   console.log("Data received");
//   console.log(rows);
// });
