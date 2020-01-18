const express = require('express');
const routes = require('./routes/index.js');
const app = express();

const port = process.env.PORT || 8002;

app.use(express.json());
app.use('/tasks', routes);

module.exports = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

