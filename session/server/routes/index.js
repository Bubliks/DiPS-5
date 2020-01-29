const { Router } = require('express');
const router = Router();
const controllers = require('../controllers');

// router.post('/code', controllers.createCode);
// router.post('/code', controllers.createCode);

router.get("/user/:userId/token/:token", controllers.checkUserToken);
router.post("/user/:userId/token/update", controllers.updateUserToken);
router.post("/user/:userId/token/create", controllers.createUserToken);

router.get("/token/:token/service/:serviceName", controllers.checkServiceToken);
router.post("/token/:token/service/:serviceName", controllers.updateServiceToken);
router.post("/token/:serviceName", controllers.createServiceToken);

router.post("/code", controllers.createCode);
router.get("/code", controllers.checkCodeToken);
router.post("/code/:code/", controllers.createCodeToken);
router.post("/refreshToken/:refreshToken/", controllers.updateCodeToken);


// router.delete('/delete', (req, res) => (controllers.deleteTask(req, res)));

module.exports = router;
