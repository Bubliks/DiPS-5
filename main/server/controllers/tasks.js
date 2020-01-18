const api = require('../libs/api');
const TASK_DB = 'http://localhost:8002/tasks';

const getUrl = (path) => `${TASK_DB}${path}`;

const createTask = async (body) => {
    return await api.post(getUrl('/create'), body)
};

const getAllTasks = async (id) => {
    return await api.get(getUrl(`/all/user/${id}`))
};

const deleteTaskById = async (id) => {
    return await api.post(getUrl(`/delete/task/${id}`))
};

module.exports = {
    createTask,
    getAllTasks,
    deleteTaskById
};
