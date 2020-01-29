const { Router } = require('express');
const router = Router();
const controllers = require('../controllers');

const middleware = async (req, res, next) => {
    console.log(`key: ${req.query.key }, secret: ${req.query.secret} token: ${req.query.token}`);
    console.log(`envKey: ${process.env.KEY} envSecret: ${process.env.SECRET}`);

    if (req.query.key === process.env.KEY && req.query.secret === process.env.SECRET) {
        next();
    } else {
        return res.status(401).json({});
    }
};

router.get('/all', middleware, controllers.getUsers);
router.get('/all/from/:from/to/:to', middleware, controllers.getUsersSlice);
router.post('/ping', (req, res) => (res.status(200).json({})));

module.exports = router;
