const { Router } = require('express');
const router = Router();
const controllers = require('../controllers');

router.get('/user/:name', (req, res) => (controllers.getUserByName(req, res)));
router.post('/create', (req, res) => (controllers.createUser(req, res)));
router.get('/all', (req, res) => (controllers.getUsers(req, res)));
router.get('/all/from/:from/to/:to', (req, res) => (controllers.getUsersSlice(req, res)));
router.post('/ping', (req, res) => (res.status(200).json({})));

module.exports = router;
