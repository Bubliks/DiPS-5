const api = require('../libs/api');
const EVENT_DB = 'http://localhost:8003/events';

const getUrl = (path) => `${EVENT_DB}${path}`;

const createEvent = async (body) => {
    return await api.post(getUrl('/create'), body)
};

const getAllEvents = async (id) => {
    return await api.get(getUrl(`/all/user/${id}`))
};

const deleteEventById = async (id) => {
    return await api.post(getUrl(`/delete/event/${id}`))
};

module.exports = {
    createEvent,
    getAllEvents,
    deleteEventById
};

