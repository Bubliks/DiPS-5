const { Router } = require('express');
const router = Router();
const controllers = require('../controllers');

router.get('/all/user/:id', (req, res) => (controllers.getAllEvents(req, res)));
router.post('/create', (req, res) => (controllers.createEvent(req, res)));
router.post('/delete/event/:id', (req, res) => (controllers.deleteEvent(req, res)));
router.post('/ping', (req, res) => (res.status(200).json({})));

module.exports = router;
