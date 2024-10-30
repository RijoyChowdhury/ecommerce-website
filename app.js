const express = require('express');

const app = express();

app.use((req, res) => {
    res.status(200);
    res.json({
        state: 'success',
        message: 'Received the request'
    })
});

const port = process.env.PORT || 3000;

app.set('port', port);

app.listen(port, () => {
  console.log('Server listening on port:', port);
});

module.exports = app;