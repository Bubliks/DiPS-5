const { Router } = require('express');
const router = Router();
const controllers = require('../controllers');
const fetch = require("node-fetch");

const privateMiddleware = async (req, res, next) => {
    console.log(req.query.key, req.query.secret, req.query.token);
    console.log(process.env.KEY, process.env.SECRET);
    if (req.query.key === process.env.KEY && req.query.secret === process.env.SECRET) {
        console.log('key and secret equal');
        if (req.query.token && req.query.token !== "undefined") {
            console.log('get');
            await fetch("http://localhost:8007/session/token/" + req.query.token + "/service/Tasks", {
                method: "get",
                headers: {'Content-Type': 'application/json'},
            }).then(result => {
                if (result.status === 200) {
                    return next();
                } else {
                    console.log('expired token');
                    return res
                        .status(401)
                        .json({message: 'expired token'});
                }
            });
        } else {
            console.log('create');
            await fetch("http://localhost:8007/session/token/Tasks", {
                method: "post",
                headers: {'Content-Type': 'application/json'}
            }).then(response => {
                if (response.status === 201) {
                    console.log('201 - ok');
                    response
                        .json()
                        .then(body => {
                            console.log('body', body);
                            return res.status(449).json(body)
                        })
                        .catch(error => {
                            console.log('some error 401', error);
                            return res.status(401).json(error);
                        })
                }
            });
        }
    } else {
        console.log('fail token');
        return res.sendStatus(401).json({});
    }
};

router.get('/all/user/:id', privateMiddleware, controllers.allTasks);
router.post('/create', privateMiddleware, controllers.createTask);
router.post('/delete/task/:id', privateMiddleware, controllers.deleteTask);
router.post('/ping', (req, res) => (res.status(200).json({})));

module.exports = router;
