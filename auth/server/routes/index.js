const { Router } = require('express');
const router = Router();
const controllers = require('../controllers');

router.post('/auth', controllers.authUser);
router.post('/oauth', controllers.createCode);
router.post('/oauth/token', controllers.getToken);

module.exports = router;
