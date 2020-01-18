const { Router } = require('express');
const router = Router();
const controllers = require('../controllers');
const {CircuitBreaker} = require('../libs/circuitBreaker');

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

router.post('/login', circuitBreakerUserMiddleware, (req, res) => (controllers.users.login(req, res)));
router.post('/register', circuitBreakerUserMiddleware, (req, res) => (controllers.users.register(req, res)));
router.get('/all/from/:from/to/:to', circuitBreakerUserMiddleware, (req, res) => (controllers.users.allFromTo(req, res)));
router.get('/all', circuitBreakerUserMiddleware, (req, res) => (controllers.users.all(req, res)));

router.post('/allTasks', circuitBreakerUserMiddleware, circuitBreakerTaskMiddleware, (req, res) => (controllers.getAllTasks(req, res)));
router.post('/createTask', circuitBreakerUserMiddleware, circuitBreakerTaskMiddleware, (req, res) => (controllers.createTask(req, res)));

router.post('/allEvents', circuitBreakerUserMiddleware, circuitBreakerEventMiddleware, (req, res) => (controllers.getAllEvents(req, res)));
router.post('/createEvent', circuitBreakerUserMiddleware, circuitBreakerEventMiddleware, (req, res) => (controllers.createEvent(req, res)));

// tasks 3, 6, 7
router.post('/allEventsAndTasks', (req, res) => (controllers.getEventsAndTasks(req, res)));
router.post('/convertTaskToEvent', (req, res) => (controllers.convertTaskToEvent(req, res)));
router.post('/convertEventToTask', (req, res) => (controllers.convertEventToTask(req, res)));

module.exports = router;
