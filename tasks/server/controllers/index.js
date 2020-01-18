const db = require('../../db/models/index.js');
const winston = require('winston');
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

const createTask = async (req, res) => {
    try {
        logger.log("info",`create tasks for userId: ${req.body.userId}`);
        const data = await db.Task.create({...req.body});
        logger.log("info",`data created: ${data}`);
        return res.status(201).json({});
    } catch (error) {
        logger.log("info", `fail ${error}`);
        return res.status(500).json({error: error.message})
    }
};

const allTasks = async (req, res) => {
    try {
        const data = await db.Task.findAll({
            where: {
                userId: req.params.id
            }
        });
        return res.status(200).json(data);
    } catch (error) {
        logger.log("info", `fail ${error}`);
        return res.status(500).json({error: error.message})
    }
};

const deleteTask = async (req, res) => {
    try {
        const data = await db.Task.destroy({
            where: {
                id: req.params.id
            }
        });
        return res.status(200).json({});
    } catch (error) {
        logger.log("info", `fail ${error}`);
        return res.status(500).json({error: error.message})
    }
};


module.exports = {
    createTask,
    allTasks,
    deleteTask
};
