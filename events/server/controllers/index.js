const db = require('../../db/models/index.js');

const winston = require('winston');
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

const createEvent = async (req, res) => {
    try {
        logger.log("info",`create event for userId: ${req.body.userId}`);
        await db.Event.create({...req.body})
            .then(data => {
                logger.log("info", `data created: ${data}`);
                return res.status(201).json(data);
            })
            .catch(error => {
                logger.log("info", `fail ${error}`);
                return res.status(500).json({error: error})
            });
    } catch (error) {
        logger.log("info", `fail ${error}`);
        return res.status(500).json({error: error.message})
    }
};

const getAllEvents = async (req, res) => {
    try {
        logger.log("info",`create event for userId: ${req.params.id}`);
        const data = await db.Event.findAll({
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

const deleteEvent = async (req, res) => {
    try {
        logger.log("info",`delete event for userId: ${req.params.id}`);
        const data = await db.Event.findByPk(req.params.id);
        await db.Event.destroy({
            where: {
                id: req.params.id
            }
        });
        return res.status(200).json(data);
    } catch (error) {
        logger.log("info", `fail ${error}`);
        return res.status(500).json({error: error.message})
    }
};

module.exports = {
    createEvent,
    getAllEvents,
    deleteEvent
};
