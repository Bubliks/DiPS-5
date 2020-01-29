const api = require('../libs/api');
const USER_DB = 'http://localhost:8001/users';

const getUrl = (path) => `${USER_DB}${path}`;

const all = async (req, res) => {
    console.log('getting Users');
    await api.get(getUrl(`/all?key=${process.env.user_key}&secret=${process.env.user_secret}`))
    .then((data) => (
        res.status(200).json(data)
    ))
    .catch(() => (
        res.status(500, 'some error')
    ));
};

const allFromTo = async(req, res) => {
    let {
        from,
        to
    } = req.params;
    console.log(`getting Users from:${from} to:${to}`);
    await api.get(getUrl(`/all/from/${from}/to/${to}?key=${process.env.user_key}&secret=${process.env.user_secret}`))
        .then((data) => {
            return res.status(200).json(data)
        })
        .catch(() => (
            res.status(500).json({message: 'some error'})
        ));
};

const userByName = async (name) => {
    return await api.get(getUrl(`/user/${name}`))
};

module.exports = {
    userByName,
    all,
    allFromTo
};
