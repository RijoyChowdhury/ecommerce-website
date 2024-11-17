const express = require('express');
const createError = require("http-errors");
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const apiRoutes = require("./routes/index");
const cors = require("cors");

dotenv.config();

const { PORT, MONGODB_URI} = process.env;
const app = express();

// mongodb configuration
mongoose
  .connect(MONGODB_URI)
  .catch((error) => console.log(error));
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MONGODB connected successfully.');
});

app.use(cors());
app.use(express.json());
app.use(cookieParser());


// api routes
app.use("/api", apiRoutes);

// on route not found
app.use(function (req, res, next) {
  next(createError(404, 'Route not found!'));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    status: 'failure',
    message: err.message,
  });
});

app.set('port', PORT);

app.listen(PORT, () => {
  console.log('Server listening on port:', PORT);
});

module.exports = app;