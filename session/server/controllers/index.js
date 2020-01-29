const TokenGenerator = require( "uuid-token-generator");
const db = require('../../db/models/index.js');
const tokenGen = new TokenGenerator(256, TokenGenerator.BASE62);
const winston = require('winston');
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

const createDate = db => {
    let date = new Date();

    if (db) {
        date.setMinutes(date.getMinutes() + 30);
    }

    return date;
};

const createUserToken = async (req, res) => {
    try {
        const {
            userId
        } = req.params;
        console.log('create user token', userId);
        await db.Session.findOne({
            where: {
                userId,
                code: null
            }
        }).then(async foundItem => {
            console.log(foundItem);

            if (!foundItem) {
                console.log('create item');
                await db.Session.create({
                    token: tokenGen.generate(),
                    date: String(createDate(true)),
                    userId
                }).then(data => (
                    res.status(201).json(data)
                )).catch(err => (res.status(201).json(err)))
            } else {
                console.log('update item');
                await db.Session.update({
                    token: tokenGen.generate(),
                    date: String(createDate(true)),
                    userId
                }, {
                    where: {
                        userId,
                        code: null
                    }
                }).then(async () => {
                    await db.Session.findOne({
                        where: {
                            userId,
                            code: null
                        }
                    }).then(data => {
                        console.log('user token updated', data.dataValues);
                        return res.status(201).json(data.dataValues);
                    });
                }).catch(err => {
                    console.log('fail updated service token', err);
                    return res.status(500).json(err);
                })
            }
        });
    }
    catch (err) {
        console.log('fail!!!!', err);
        return res.status(500).json(err);
    }
};

const updateUserToken = async (req, res) => {
    try {
        console.log('update userToken');
        const {
            userId
        } = req.params;
        await db.Session.findOne({where: {
                userId,
                code: null
            }}).then(async session => {
            console.log('finded', session);
            if (session) {
                console.log('try update');
                await db.Session.update({
                    token: tokenGen.generate(),
                    date: String(createDate(true)),
                    userId
                }, {
                    where: {
                        userId,
                        code: null
                    }
                }).then(async () => {
                    await db.Session.findOne({
                        where: {
                            userId,
                            code: null
                        }
                    }).then(data => {
                        console.log('user token updated', data.dataValues);
                        return res.status(200).json(data.dataValues);
                    });
                }).catch(err => {
                    console.log('fail', err);
                    return res.status(500).json(err);
                });
            } else {
                return res.status(500).json({});
            }
        }).catch(async err => (res.status(500).json(err)));
    } catch (err) {
        console.log('fail!!!!', err);
        return res.status(500).json(err);
    }
};


const checkUserToken = async (req, res) => {
    try {
        const {
            token,
            userId
        } = req.params;
        console.log(`\nCheck userId: ${userId}, token: ${token}`);
        await db.Session.findOne({
            where: {
                token,
                userId,
                code: null
            }
        }).then(async data => {
            console.log('userdata', data);
            const lastCheck = new Date(data.date);
            const curCheck = createDate();
            console.log(lastCheck, curCheck);

            if (curCheck.getTime() < lastCheck.getTime()) {
                await db.Session.update({
                    date: String(createDate(true)),
                    token,
                    userId,
                    code: null

                }, {
                    where: {
                        token,
                        userId,
                        code: null
                    }
                });

                console.log('update');
                return res.status(200).json({checked: true});
            }

            console.log('older');
            return res.status(400).json({checked: false});
        });
    } catch (err) {
        console.log('error!!', err);
        return res.status(500).json(err);
    }
};

const createServiceToken = async (req, res) => {
    try {
        console.log('create service token for service:', req.params.serviceName);
        const {
            serviceName
        } = req.params;

        await db.Session.findOne({
            where: {
                serviceName
            }
        }).then(async service => {
            if (service) {
                console.log('service finded');
                await db.Session.update({
                    serviceName,
                    token: tokenGen.generate(),
                    date: String(createDate(true)),
                }, {
                    where: {
                        serviceName
                    }
                }).then(async () => {
                    await db.Session.findOne({
                        where: {
                            serviceName
                        }
                    }).then(data => {
                        console.log('service updated', data.dataValues);
                        return res.status(201).json(data.dataValues);
                    });
                }).catch(err => {
                    console.log('fail updated service token', err);
                    return res.status(500).json(err);
                })
            } else {
                await db.Session.create({
                    serviceName,
                    token: tokenGen.generate(),
                    date: String(createDate(true)),
                }).then(async () => {
                    await db.Session.findOne({
                        where: {
                            serviceName
                        }
                    }).then(data => {
                        console.log('service updated', data.dataValues);
                        return res.status(201).json(data.dataValues);
                    });
                }).catch(err => {
                    console.log('fail created service token', err);
                    return res.status(500).json(err);
                })
            }
        }).catch(err => {
            console.log('fail created service token', err);
            return res.status(500).json(err);
        })
    } catch (err) {
        console.log('some error', err);
        return res.status(500).json(err);
    }
};

const checkServiceToken = async (req, res) => {
    try {
        const {
            token,
            serviceName
        } = req.params;
        console.log('check service token');

        await db.Session.findOne({
            where: {
                token,
                serviceName
            }
        }).then(data => {
            console.log('finded token', data.dataValues);
            const lastCheck = new Date(data.dataValues.date);
            const curCheck = createDate();

            const isValid = curCheck.getTime() < lastCheck.getTime();

            if (isValid) {
                return res.status(200).json({checked: true});
            } else {
                console.log('old token');
                return res.status(400).json({});
            }
        }).catch(err => {
            console.log('some error: ', err);
            return res.status(500).json(err)
        });

    } catch (err) {
        console.log('some err', err);
        return res.status(500).json(err);
    }
};

const checkCodeToken = async (req, res) => {
    try {
        const {
            userId,
            token
        } = req.query;

        console.log(`check code token userId: ${userId}, token: ${token}`);
        const data = await db.Session.findOne({
            where: {
                token: token,
                userId: userId
            }
        });
        console.log('finded data: ', data);

        const lastCheck = new Date(data.date);
        const curCheck = createDate();
        const isValid = curCheck.getTime() < lastCheck.getTime();

        if (isValid) {
            console.log('success check code token');
            return res.status(200).json({checked: true});
        } else {
            console.log('fail check code token');
            return res.status(400).json({});
        }
    } catch (err) {
        console.log('fail check code token');
        return res.status(500).json(err);
    }
};

const updateServiceToken = async (req, res) => {
    const {
        serviceName
    } = req.params;
    console.log('update service token', serviceName);

    try {
        await db.Session.findOne({
            where: {
                serviceName
            }
        }).then(async session => {
            console.log('find service');
            if (session) {
                await db.Session.update({
                    token: tokenGen.generate(),
                    date: String(createDate(true)),
                }, {
                    where: {
                        serviceName
                    }
                });

                await db.Session.findOne({
                    where: {
                        serviceName
                    }
                }).then(data => {
                    console.log('ok', data.dataValues);
                    return res.status(200).json(data.dataValues);
                }).catch(err => {
                    return res.status(500).json(err);
                });
            } else {
                return res.status(500).json({});
            }
        });
    } catch (err) {
        return res.status(500).json(err);
    }
};

const createCode = async (req, res) => {
    const {
        userId,
        token,
        appId,
        appSecret
    } = req.query;
    console.log('req', req);
    console.log(`create code userId: ${userId}, appId: ${appId}, appSecret: ${appSecret}, token: ${token}`);

    try {
        const code = await db.Session.findOne({
            where: {
                userId,
                token,
                code: null
            }
        });

        console.log('code finded', code);

        if (code) {
            await db.Session.create({
                userId,
                appId,
                appSecret,
                code: tokenGen.generate()
            })
            .then(data => {
                console.log('succes create code');
                return res.status(200).json(data);
            })
            .catch(err => {
                console.log('fail', err);
                return res.status(500).json({});
            })
        }
    } catch (err) {
        console.log('fail', err);
        return res.status(500).json({});
    }
};

const createCodeToken = async (req, res) => {
    try {
        const {
            code
        } = req.params;
        const {
            appId,
            appSecret
        } = req.query;
        console.log(`create codeTOKEN code: ${code}, appId: ${appId}, appSecret: ${appSecret}`);

        const data = await db.Session.findOne({
            where: {
                code,
                appId,
                appSecret
            }
        });
        console.log('finded', data);

        if (data) {
            db.Session.update({
                token: tokenGen.generate(),
                refreshToken: tokenGen.generate(),
                date: String(createDate(true))
            }, {
                where: {
                    code,
                    appId,
                    appSecret
                }
            }).then(async () => {
                await db.Session.findOne({
                    where: {
                        code,
                        appId,
                        appSecret
                    }
                }).then(data => {
                    console.log('success create token for code', data);
                    return res.status(200).json(data.dataValues);
                }).catch(err => {
                    return res.status(500).json(err);
                });
            }).catch(err => {
                console.log('fail create token for code', err);
                return res.status(500).json(err)
            });
        } else {
            return res.status(500).json({});
        }
    } catch (err) {
        return res.status(500).json(err);
    }
};

const updateCodeToken = async (req, res) => {
    try {
        const {
            appId,
            appSecret
        } = req.query;
        const {
            refreshToken
        } = req.params;

        console.log(`refresh token refreshToken: ${refreshToken}, appId: ${appId}, appSecret: ${appSecret}`);
        const data = db.Session.findOne({
            where: {
                refreshToken,
                appId,
                appSecret
            }
        });

        console.log('finded', data);
        if (data) {
            const refreshTokenUpd = tokenGen.generate();
            await db.Session.update({
                token: tokenGen.generate(),
                refreshToken: refreshTokenUpd,
                date: String(createDate(true)),
            }, {
                where: {
                    refreshToken,
                    appId,
                    appSecret
                }
            }).then(async () => {
                await db.Session.findOne({
                    where: {
                        refreshToken: refreshTokenUpd,
                        appId,
                        appSecret
                    }
                }).then(data => {
                    console.log('success refresh codeTOKEN', data);
                    return res.status(200).json(data.dataValues);
                }).catch(err => {
                    console.log('fail refresh codeToken', err);
                    return res.status(500).json(err);
                });
            })
        } else {
            return res.status(500).json({});
        }

        return res.status(200).json({});
    } catch (err) {
        console.log('fail refresh codeToken', err);
        return res.status(500).json(err);
    }

};

module.exports = {
    createUserToken,
    checkUserToken,
    updateUserToken,
    createServiceToken,
    checkServiceToken,
    updateServiceToken,
    createCode,
    checkCodeToken,
    createCodeToken,
    updateCodeToken
};
