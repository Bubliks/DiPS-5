const express = require('express');
const routes = require('./routes/index.js');
const app = express();

const port = process.env.PORT || 8007;

app.use(express.json());
app.use('/session', routes);

module.exports = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

