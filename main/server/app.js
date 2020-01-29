const express = require('express');
const routes = require('./routes/index.js');
const app = express();

const enableCors = true;

if (enableCors) {
    const cors = require('cors');
    const bodyParser = require('body-parser');

    app.use(bodyParser.urlencoded({ extended: true }));
    // Then use it before your routes are set up:
    app.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    });

    // Set up a whitelist and check against it:
    var whitelist = ['http://localhost:3000', 'http://localhost:3000/login', 'http://localhost:3000/register', 'http://localhost:3000/home', 'http://localhost:3000/tasks', 'http://localhost:3000/tasksevents'];
    var corsOptions = {
        origin: function (origin, callback) {
            if (whitelist.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        }
    };

    // Then pass them to cors:
    app.use(cors(corsOptions));
}

const port = process.env.PORT || 8000;

app.use(express.json());
app.use('/api', routes);

app.get('/', function (req, res) {
    res.send('Homepage');
});

module.exports = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

