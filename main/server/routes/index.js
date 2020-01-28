const { Router } = require('express');
const router = Router();
const controllers = require('../controllers');
const {CircuitBreaker} = require('../libs/circuitBreaker');
const fetch = require("node-fetch");

const circuitBreakerUser = new CircuitBreaker('http://localhost:8001/users/ping', 4);
const circuitBreakerTask = new CircuitBreaker('http://localhost:8002/tasks/ping', 4);
const circuitBreakerEvent = new CircuitBreaker('http://localhost:8003/events/ping', 4);

function circuitBreakerUserMiddleware(_, res, next) {
    circuitBreakerUser
        .request()
        .then(() => {
            next();
        })
        .catch(() => (
            res.status(500).json({message: 'server not response'})
        ));
}

function circuitBreakerTaskMiddleware(_, res, next) {
    circuitBreakerTask
        .request()
        .then(() => {
            next();
        })
        .catch(() => (
            res.status(500).json({message: 'server not response'})
        ));
}

function circuitBreakerEventMiddleware(_, res, next) {
    circuitBreakerEvent
        .request()
        .then(() => {
            next();
        })
        .catch(() => (
            res.status(500).json({message: 'server not response'})
        ));
}

const publicMiddleware = async (req, res, next) => {
    const token = /<(.*?)>/.exec(req.header('authorization'))[1];
    const {
        id
    } = req.params;
    const {
        appId
    } = req.query;
    console.log('token: ', token, ' ', 'id: ', id, ' appId:', appId);

    if (token && id) {
        console.log('check token: ', token);
        if (appId) {
            console.log('for app');
            await fetch(`http://localhost:8007/code/?userId=${req.params.id}&token=${token}`, {
                method: "get",
                headers: {'Content-Type': 'application/json'}
            }).then(response => {
                if (response.status === 200) {
                    return next();
                } else {
                    return res.sendStatus(401).json({});
                }
            })
        } else {
            console.log('for user');
            await fetch(`http://localhost:8007/session/user/${id}/token/${token}`, {
                method: "get",
                headers: {'Content-Type': 'application/json'}
            }).then(response => {
                if (response.status === 200) {
                    return next();
                } else {
                    return res.sendStatus(401).json({});
                }
            });
        }
    } else {
        console.log('token or id indefined');
        return res.status(401).json({});
    }
};

// router.post('/login', circuitBreakerUserMiddleware, controllers.users.login);
// router.post('/register', circuitBreakerUserMiddleware, controllers.users.register);
router.get('/all/from/:from/to/:to', circuitBreakerUserMiddleware, controllers.users.allFromTo);

router.get('/all', publicMiddleware, circuitBreakerUserMiddleware, controllers.users.all);
router.post('/user/:id/allTasks', publicMiddleware, circuitBreakerTaskMiddleware, controllers.getAllTasks);
router.post('/user/:id/allEvents', publicMiddleware, circuitBreakerEventMiddleware, controllers.getAllEvents);

router.post('/createTask', circuitBreakerUserMiddleware, circuitBreakerTaskMiddleware, controllers.createTask);
router.post('/createEvent', circuitBreakerUserMiddleware, circuitBreakerEventMiddleware, controllers.createEvent);

// tasks 3, 6, 7
router.post('/allEventsAndTasks', controllers.getEventsAndTasks);
router.post('/convertTaskToEvent', controllers.convertTaskToEvent);
router.post('/convertEventToTask', controllers.convertEventToTask);

module.exports = router;
