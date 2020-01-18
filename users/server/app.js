const express = require('express');
const routes = require('./routes/index.js');
const app = express();

const port = process.env.PORT || 8001;

app.use(express.json());
app.use('/users', routes);

module.exports = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

