const db = require('../../db/models/index.js');

const winston = require('winston');
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

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
    getUsers,
    getUsersSlice
};
