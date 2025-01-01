const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const { MONGODB_URI } = process.env;

mongoose
  .connect(MONGODB_URI)
  .catch((error) => console.log(error));

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MONGODB connected successfully.');
});