const db = require('../../db/models/index.js');

const winston = require('winston');
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

const createUser = async (req, res) => {
    try {
        logger.log("info",`create user: ${req.body}`);
        await db.User.create(req.body);
        return res.status(201).json({});
    } catch (error) {
        logger.log("info", `fail ${error}`);
        return res.status(500).json({message: error.message})
    }
};

const getUserByName = async (req, res) => {
    try {
        logger.log("info",`Searching name: ${req.params.name}`);

        const data = await db.User.findOne({
            where: {
                name: req.params.name
            }
        });

        if (data) {
            logger.log("info", `ok ${data}`);
            return res.status(200).json(data);
        } else {
            logger.log("info", `fail ${error}`);
            return res.sendStatus(500);
        }

    } catch (error) {
        logger.log("info", `fail ${error}`);
        return res.status(500).json({error: error.message})
    }
};

const getUsers = async (req, res) => {
    try {
        const data = await db.User.findAll();
        logger.log("info",`Success Message and variables: getAllUsers ${data}`);
        return res.status(200).json(data);
    } catch (error) {
        logger.log("info", `fail ${error}`);
        return res.status(500).json({error: error.message})
    }
};

const getUsersSlice = async (req, res) => {
    try {
        const data = await db.User.findAll();
        let {
            from,
            to
        } = req.params;

        if (from < 0) {
            from = 0;
        }
        if (to > data.length) {
            to = data.length;
        }
        logger.log("info", `getting user from ${from}, to ${to}`);

        return res.status(200).json(data.slice(from, to));
    } catch (error) {
        logger.log("info", `fail ${error}`);
        return res.status(500).json({error: error.message})
    }
};

module.exports = {
    getUserByName,
    createUser,
    getUsers,
    getUsersSlice
};
