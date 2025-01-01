const express = require('express');
const createError = require("http-errors");
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const apiRoutes = require("./routes/index");
const cors = require("cors");
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require("./utils/connectDB");

dotenv.config();

const { PORT, MONGODB_URI} = process.env;
const app = express();

// dev: allowing all requests
const corsConfig = {
  origin: true,
  credentials: true,
};
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
})

app.use(limiter);
app.use(cors(corsConfig));
app.use(helmet())

app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());


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