require("dotenv").config();

module.exports = {
  uri: process.env.DB_URI,
  dbName: process.env.DB_NAME,
  secret: process.env.JWT_SECRET,
};
