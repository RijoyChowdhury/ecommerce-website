const express = require('express');
const createError = require("http-errors");
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const apiRoutes = require("./routes/index");
const cors = require("cors");
const Razorpay = require("razorpay");
const shortId = require("shortid");
const crypto = require("crypto");

dotenv.config();

const { PORT, MONGODB_URI, RAZRPAY_PUBLIC_KEY, RAZRPAY_PRIVATE_KEY, WEBHOOK_SECERET } = process.env;
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

const razorpayInstance = new Razorpay({
  key_id: RAZRPAY_PUBLIC_KEY,
  key_secret: RAZRPAY_PRIVATE_KEY,
});

// initial booking
app.post("/checkout", async function (req, res, next) {
  const amount = 500;
  const currency = "INR";
  const payment_capture = 1;
  try {
    const options = {
      amount: amount * 100,
      currency: currency,
      receipt: shortId.generate(),
      payment_capture: payment_capture
    }
    const orderObject = await razorpayInstance.orders.create(options);
    // send to frontend 
    res.status(200).json({
      status: "success",
      message: {
        id: orderObject.id,
        currency: orderObject.currency,
        amount: orderObject.amount
      }
    })
  } catch (err) {
    next(err);
  }
})

// payment verification
app.post("/verification", async function (req, res, next) {
  try {
    // this object -> sha256+webhook_secret
    const shasum = crypto.createHmac("sha256", WEBHOOK_SECERET);
    shasum.update(JSON.stringify(req.body));
    const freshSignature = shasum.digest("hex");
    const razorPaySign = req.headers["x-razorpay-signature"];
    if (freshSignature === razorPaySign) {
      res.status(200).json({
        message: "OK",
      });
    } else {
      throw createError.Forbidden('Invalid Payment.')
    }
  } catch (err) {
    next(err);
  }
})

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