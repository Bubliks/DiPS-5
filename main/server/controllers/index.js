const users = require('./users');
const tasks = require('./tasks');
const events = require('./events');
const {Bull, defaultBullOptions} = require('./../libs/bull');
const requestsQueue = new Bull('requests-queue', defaultBullOptions);
const fetch = require("node-fetch");

let userToken;
let eventsToken;
let tasksToken;


requestsQueue.process(async (job, done) => {
    let request;

    switch (job.data.type) {
        case 'create:task':
            request = tasks.createTask;
            break;
        case 'delete:event':
            request = events.deleteEventById;
            break;
    }

    return await request(job.data.value)
        .then(() => {
            console.log(`completed\n action: ${job.data.action}`);
            done();
        })
        .catch(error => {
            console.log(`failed\n action: ${job.data.action}\n error: ${error}`);
            done(new Error(error));
        });
});

const isValidStatus = status => (!(status === 'rejected' || Number.isFinite(status) && status !== 200));

const getEventsAndTasks = async (req, res) => {
    const {
        name
    } = req.body;

    if (!name) {
        return res.status(400).json({message: 'username is empty'});
    }

    users.userByName(name)
        .then(user => {
            const allFetch = [
                tasks.getAllTasks(user.id),
                events.getAllEvents(user.id)
            ];
            const names = ['tasks', 'events'];

            Promise
                .allSettled(allFetch)
                .then((results) => {
                    const data = {
                        errors: {}
                    };

                    for (let i = 0; i < names.length; i++) {
                        if (results[i].status === 'rejected' || Number.isFinite(results.status) && results[i].status !== 200) {
                            data.errors[names[i]] = 'server not response';
                            data[names[i]] = [];
                        } else {
                            data[names[i]] = results[i].value;
                        }
                    }

                    if (Object.keys(data.errors).length === names.length) {
                        return res.status(500).json({message: 'server not response'});
                    } else {
                        return res.status(200).json(data);
                    }
                })
        })
        .catch(error => {
            return res.status(500).json({message: error});
        });
};

const getAllTasks = async (req, res) => {
    const {
        id
    } = req.params;

    if (!id) {
        return res.status(400).json({message: 'id is empty'});
    }
    console.log('!KEY_____SECRET!', process.env.task_key, process.env.task_secret);

    await fetch(`http://localhost:8002/tasks/all/user/${id}?key=${process.env.task_key}&secret=${process.env.task_secret}&token=${tasksToken}`, {
        method: 'get',
        headers: {'Content-Type': 'application/json'}})
        .then(async response => {
            console.log('first response status', response.status);
            if (response.status === 449) {
                console.log('response');
                await response.json().then(async body => {
                    console.log('first response body', body);
                    tasksToken = body.token;
                    console.log('token is ', tasksToken);

                    await fetch(`http://localhost:8002/tasks/all/user/${id}?key=${process.env.task_key}&secret=${process.env.task_secret}&token=${tasksToken}`, {
                        method: 'get',
                        headers: {'Content-Type': 'application/json'}})
                        .then(response => {
                            const status = response.status;
                            response.json().then(body => res.status(status).json(body));
                        })
                    }
                );
            } else {
                console.log('second');
                response.json().then(async body => {
                    console.log('second response message', body.message);
                    if (body.message === "expired token") {
                        await fetch("http://localhost:8007/session/token/" + tasksToken + "/service/Tasks", {
                            method: "post",
                            headers: {'Content-Type': 'application/json'},
                        }).then(response => {
                            const status = response.status;

                            response.json().then(async body => {
                                tasksToken = body.token;

                                await fetch(`http://localhost:8002/tasks/all/user/${id}?key=${process.env.task_key}&secret=${process.env.task_secret}&token=${tasksToken}`, {
                                    method: 'get',
                                    headers: {'Content-Type': 'application/json'}})
                                    .then(response => {
                                        const status = response.status;
                                        response.json().then(body => res.status(status).json(body));
                                    });

                                res.status(status).json(body)
                            });
                        });
                    }
                });
            }
            // const status = response.status;
            // response.json().then(body => (
            //     res.status(status).json(body)
            // ));
        })
        .catch((error) => {
            return res.status(400).send(error.message);
        });

//     const body = await response.json();
//     if (response.status === 449) {
//         story_token = body.token;
//         const response2 = await getStories(pageNo, size, story_token);
//         const body2 = await response2.json();
//         return res
//             .status(response2.status)
//             .send(body2);
//     }
//
//     if (body.message === "expired token") {
//         const result_refresh = await fetch("http://localhost:3007/token/" + story_token + "/service/Story", {
//             method: "patch",
//             headers: {'Content-Type': 'application/json'},
//         });
//         const body_refresh = await result_refresh.json();
//         story_token = body_refresh.token;
//         const response2 = await getStories(pageNo, size, story_token);
//         const body2 = await response2.json();
//         return res
//             .status(response2.status)
//             .send(body2);
//     }
//
//     winston_logger.info(winston_messages.OK);
//     return res
//         .status(response.status)
//         .send(body);
//
// } catch (error) {
//     winston_logger.error(winston_messages.CATCH + error.message);
//     winston_logger.error(winston_messages.ERROR);
//
//     return res
//         .status(400)
//         .send(createError(error.message));
// }

    // tasks.getAllTasks(id)
    //     .then((tasks) =>{
    //         console.log(tasks);
    //         return res.status(200).json(tasks)
    //     })
    //     .catch(() => (res.status(500).json({message: 'something error'})));
};

const getAllEvents = async (req, res) => {
    const {
        name
    } = req.body;

    if (!name) {
        return res.status(400).json({message: 'username is empty'});
    }

    users.userByName(name)
        .then(user => {
            console.log('user', user);
            events.getAllEvents(user.id)
                .then((events) => {
                    console.log(events);
                    return res.status(200).json(events)
                })
                .catch(() => (res.status(500).json({message: 'something error'})));
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({message: 'something error'});
        });
};

const createTask = async (req, res) => {
    const {
        title,
        description,
        name
    } = req.body;

    if (!title || !description || !name) {
        return res.sendStatus(400);
    }

    console.log('ok', title, description, name);

    users.userByName(name)
        .then(user => {
            console.log(user);
            tasks.createTask({
                userId: user.id,
                title,
                description
            })
                .then(() => {
                    console.log('ok');
                    return res.sendStatus(201)
                })
                .catch((error) => {
                    console.log('fail2');
                    return res.sendStatus(500)
                });
        })
        .catch(error => {
            console.log('fail');
            return res.sendStatus(500)
        });
};

const createEvent = async (req, res) => {
    const {
        title,
        description,
        name,
        date,
        startTime,
        endTime,
    } = req.body;

    if (!title || !description || !name || !date || !startTime || !endTime) {
        return res.status(400).json({message: 'One of a data is empty!'});
    }

    console.log('ok', title, description, name);

    users.userByName(name)
        .then(user => {
            console.log(user);
            events.createEvent({
                userId: user.id,
                title,
                description,
                date,
                startTime,
                endTime
            })
            .then(() => {
                console.log('ok');
                return res.sendStatus(201)
            })
            .catch((error) => {
                console.log('fail2');
                return res.status(500).json({message: "something error"});
            });
        })
        .catch(error => {
            console.log('fail');
            return res.status(500).json({message: "something error"});
        });
};

const convertTaskToEvent = async (req, res) => {
    const {
        title,
        description,
        id,
        name
    } = req.body;

    if (!title || !description || !id || !name) {
        return res.status(400).json({message: 'One of a data is empty!'});
    }

    users.userByName(name)
        .then(user => {
            const allFetch = [
                tasks.deleteTaskById(id),
                events.createEvent({
                    userId: user.id,
                    title,
                    description,
                    date: "2020-01-11T01:16:37.519Z",
                    startTime: "2020-01-11T01:16:37.519Z",
                    endTime: "2020-01-11T01:16:37.519Z"
                })
            ];

            Promise
                .allSettled(allFetch)
                .then(results => {
                    const [task, event] = results;
                    const isValidStatusTasks = isValidStatus(task.status);
                    const isValidStatusEvents = isValidStatus(event.status);

                    if (!isValidStatusTasks && isValidStatusEvents) {
                        events
                            .deleteEventById(event.value.id)
                            .catch(error => (
                                res.status(500).json({message: error})
                            ));
                    } else if (isValidStatusTasks && !isValidStatusEvents) {
                        tasks
                            .createTask({
                                userId: user.id,
                                title,
                                description
                            })
                            .catch(error => (
                                res.status(500).json({message: error})
                            ));
                    } else if (!isValidStatusTasks && !isValidStatusEvents) {
                        return res.status(500).json({message: 'server not response'});
                    }

                    return res.status(200).json({});
                });
        })
        .catch(error => {
            console.log('error', error);
            return res.status(500).json({message: error});
        });
};

const convertEventToTask = async (req, res) => {
    const {
        title,
        description,
        id,
        name
    } = req.body;

    if (!title || !description || !id || !name) {
        return res.status(400).json({message: 'One of a data is empty!'});
    }

    users.userByName(name)
        .then(user => {
            const allFetch = [
                events.deleteEventById(id),
                tasks.createTask({
                    userId: user.id,
                    title,
                    description
                })
            ];

            Promise
                .allSettled(allFetch)
                .then(results => {
                    const [event, task] = results;
                    const isValidStatusTasks = isValidStatus(task.status);
                    const isValidStatusEvents = isValidStatus(event.status);

                    if (!isValidStatusEvents) {
                        requestsQueue.add({
                            value: id,
                            action: `delete event for user: ${user.id} by id: ${id}`,
                            type: `delete:event`
                        },{
                            attempts: Number.MAX_SAFE_INTEGER,
                            backoff: 5000
                        });
                    }

                    if (!isValidStatusTasks) {
                        requestsQueue.add({
                            value: {
                                userId: user.id,
                                title,
                                description
                            },
                            action: `create tasks for user: ${user.id}`,
                            type: `create:task`
                        },{
                            attempts: Number.MAX_SAFE_INTEGER,
                            backoff: 5000
                        });
                    }

                    return res.sendStatus(200);

                });
        })
        .catch(error => {
            return res.status(500).json({message: error})
        });
};


module.exports = {
    users,
    tasks,
    createTask,
    getAllTasks,
    getAllEvents,
    createEvent,
    getEventsAndTasks,
    convertTaskToEvent,
    convertEventToTask
};

