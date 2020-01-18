const express = require('express');
const routes = require('./routes/index.js');
const app = express();

const port = process.env.PORT || 8003;

app.use(express.json());
app.use('/events', routes);

module.exports = app.listen(port, () => console.log(`Example app listening on port ${port}!`));
