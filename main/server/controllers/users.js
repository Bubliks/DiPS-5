const api = require('../libs/api');
const USER_DB = 'http://localhost:8001/users';

const getUrl = (path) => `${USER_DB}${path}`;

const login = async (req, res) => {
    const {
        name,
        password
    } = req.body;

    if (!name || !password) {
        return res.status(400).json({message: 'Login or password is empty!'});
    }

    console.log(`checkUserLogin: ${name}`);

    await api.get(getUrl(`/user/${name}`))
        .then(user => {
            console.log(`get to UserDB: ${name}`);

            console.log(user.password === password, user.password, password);
            if (user.password === password) {
                console.log(`User login ok ${name}`);
                return res.status(200).json({
                    name
                });
            } else {
                console.log('password incorrect');
                return res.status(403).json({message: 'Incorrect login or password'});
            }
        }).catch(() => {
            console.log('error user db');
            return res.status(403).json({message: 'Incorrect login or password'});
        });
};

const register = async (req, res) => {
    const {
        name,
        password,
        mail
    } = req.body;

    if (!name || !password || !mail) {
        return res.status(400).json({message: 'Name, password or mail is empty!'});
    }

    await api.post(getUrl('/create'), {
        name,
        password,
        mail
    })
    .then(() => (
        res.sendStatus(201)
    ))
    .catch(() => (
        res.status(500).json({message: 'Name was exist!'})
    ));
};

const all = async (req, res) => {
    console.log('getting Users');
    await api.get(getUrl('/all'))
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
    await api.get(getUrl(`/all/from/${from}/to/${to}`))
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
    login,
    register,
    userByName,
    all,
    allFromTo
};
