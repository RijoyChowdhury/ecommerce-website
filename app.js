const express = require('express');
const createError = require("http-errors");
const apiRoutes = require("./routes/index");

const app = express();
app.use(express.json());

// api routes
app.use("/api", apiRoutes);

// on route not found
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        status: 'failure',
        message: err.message,
    });
});

const port = process.env.PORT || 3000;
app.set('port', port);

app.listen(port, () => {
  console.log('Server listening on port:', port);
});

module.exports = app;