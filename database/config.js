const db = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const pool = db.createPool({
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DATABASE,
});

module.exports = pool.promise();
