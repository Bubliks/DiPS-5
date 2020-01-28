const { Router } = require('express');
const router = Router();
const controllers = require('../controllers');

const privateMiddleware = async (req, res, next) => {
    const service = 'users';
    console.log(`key: ${req.query.key }, secret: ${req.query.secret} token: ${req.query.token}`);
    console.log(`envKey: ${process.env.KEY} envSecret: ${process.env.SECRET}`);

    if (req.query.key === process.env.KEY && req.query.secret === process.env.SECRET) {
        if (req.query.token && req.query.token !== "undefined") {
            const result = await fetch(`http://localhost:3007/token/${req.query.token}/service/${service}`, {
                method: "get",
                headers: {'Content-Type': 'application/json'},
            });

            if (result.status === 200) {
                return next();
            } else {
                console.log('expired token');
                return res
                    .status(401)
                    .send(JSON.stringify({message: 'expired token'}));
            }
        } else {
            console.log(self);
            const result = await fetch(`http://localhost:3007/token/${self.name}`, {
                method: "post",
                headers: {'Content-Type': 'application/json'}
            });

            const response = await result.json();
            if (result.status === 201) {
                return res.status(449).send(response)
            }

            return res.status(401).send();
        }
    } else {
        return res.sendStatus(401).send();
    }
};

router.get('/user/:name', (req, res) => (controllers.getUserByName(req, res)));
router.post('/create', (req, res) => (controllers.createUser(req, res)));
router.get('/all', (req, res) => (controllers.getUsers(req, res)));
router.get('/all/from/:from/to/:to', (req, res) => (controllers.getUsersSlice(req, res)));
router.post('/ping', (req, res) => (res.status(200).json({})));

module.exports = router;
