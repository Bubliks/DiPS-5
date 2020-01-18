const fetch = require("node-fetch");

const joinArgs = queryArgs => {
    return queryArgs ? `?${Object.entries(queryArgs).join('&').split(',').join('=')}`: '';
};

const post = (url, body) => (
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        if (res.status >= 200 && res.status <= 299) {
            console.log(`${url} - ok`);
            try {
                return res.json();
            } catch(err) {
                console.log('ERR', err);
                return {};
            }

        } else {
            console.log(`${url} - fail`);
            throw new Error('error');
        }
    }).catch(err => {
        console.log(`${url} - fail`);
        throw new Error('server not response..');
    })
);

const get = (url, quertArgs) => (
    fetch(url + joinArgs(quertArgs), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=utf8'
        }
    }).then(res => {
        if (res.status >= 200 && res.status <= 299) {
            console.log(`${url} - ok`);
            return res.json();
        } else {
            return Promise.reject(`${res.status} error`);
        }
    })
);

module.exports = {
    post,
    get
};
