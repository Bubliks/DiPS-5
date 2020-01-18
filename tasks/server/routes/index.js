const { Router } = require('express');
const router = Router();
const controllers = require('../controllers');

router.get('/all/user/:id', (req, res) => (controllers.allTasks(req, res)));
router.post('/create', (req, res) => (controllers.createTask(req, res)));
router.post('/delete/task/:id', (req, res) => (controllers.deleteTask(req, res)));
router.post('/ping', (req, res) => (res.status(200).json({})));

// router.delete('/delete', (req, res) => (controllers.deleteTask(req, res)));

module.exports = router;
