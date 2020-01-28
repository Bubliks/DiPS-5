const db = require('../../db/models/index.js');
const fetch = require("node-fetch");
const {createHmac} = require("crypto");

const winston = require('winston');
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

const auth = async data => {
    const {
        name,
        password
    } = data;

    const user = await db.Auth.findOne({where: {name}});

    if (!user) {
        const user = await db.Auth.create({
            name,
            password: createHmac('sha256', password).digest('hex')
        });
        return {
            userId: user.id,
            type: 'create'
        };
    }

    if (user.password !== createHmac('sha256', password).digest('hex')) {
        throw Error("invalid password");
    }

    return {
        userId: user.id,
        type: 'login'
    };
};

const authUser = async (req, res) => {
    try {
        const {
            name,
            password
        } = req.body;
        console.log(`name: ${name}, password: ${password}`);

        if (password && name) {
            auth({name, password}).then(async user => {
                console.log('user:', user);

                if (user.type === 'create') {
                    console.log(`create`);
                    await fetch(`http://localhost:8007/session/user/${user.userId}/token/create`, {
                        method: "post",
                        headers: {'Content-Type': 'application/json'}
                    })
                        .then(sessionResp => {
                            if (sessionResp.status >= 400) {
                                throw new Error('some error');
                            }
                            console.log('created');
                            return sessionResp.json();
                        })
                        .then(session => (
                            res.status(200).json({userId: user.userId, session})
                        ))
                        .catch(err => {
                            console.log(`fail create: ${err}`);
                            return res.status(500).json(err);
                        });
                } else {
                    console.log(`update`);
                    await fetch(`http://localhost:8007/session/user/${user.userId}/token/update`, {
                        method: "post",
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            userId: user.userId
                        })
                    })
                        .then(sessionResp => {
                            if (sessionResp.status >= 400) {
                                throw new Error('some error');
                            }
                            console.log('updated');
                            return sessionResp.json();
                        })
                        .then(session => (
                            res.status(200).json({userId: user.userId, session})
                        ))
                        .catch(err => {
                            console.log(`fail update: ${err}`);
                            return res.status(503).json({err});
                        });
                }
            });
        } else {
            return res
                .status(400)
                .json({message: 'Invalid password'});
        }
    } catch (err) {
        return res.status(500).json(err);
    }
};

const createCode = async (req, res) => {
    const {
        clientId,
        clientSecret,
        userId
    } = req.body;
    const token = /<(.*?)>/.exec(req.header('authorization'))[1];
    console.log('create code', clientId, clientSecret, userId, token);

    await fetch(`http://localhost:8007/session/code/?appId=${clientId}&appSecret=${clientSecret}&userId=${userId}&token=${token}`, {
        method: "post",
        headers: {'Content-Type': 'application/json'}
    }).then(response => {
        console.log('ok', response);
        res.status(response.status).json(response)
    }).catch(err => {
        console.log('fail');
        return res.status(500).json(err);
    });
};

const getToken = async (req, res) => {
    try {
        const {
            clientId,
            clientSecret,
            type
        } = req.query;

        if (type === 'auth_code') {
            const code = req.query.code;
            const response = await fetch(`http://localhost:3007/code/${code}/?clientId=${clientId}&clientSecret=${clientSecret}`, {
                method: "post",
                headers: {'Content-Type': 'application/json'}
            });

            return res
                .status(response.status)
                .json(response)
        }

        if (type === 'refresh_token') {
            const refreshToken = req.query.refreshToken;
            const response = await fetch(`http://localhost:3007/refreshToken/${refreshToken}/?clientId=${clientId}&clientSecret=${clientSecret}`, {
                method: "post",
                headers: {'Content-Type': 'application/json'}
            });

            return res
                .status(response.status)
                .json(response)
        }
    } catch (err) {
        return res.status(500).json(error);
    }
};

module.exports = {
    authUser,
    createCode,
    getToken
};
