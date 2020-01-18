const api = require('./api');

class CircuitBreaker {
    constructor(url, limit, timeout = 20000) {
        this.url = url;
        this.limit = limit;
        this.timeout = timeout;
        this.countRequests = 0;
        this.timer = null;
    }

    updateCountRequests = () => {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            console.log('updateRequests');
            this.countRequests = 0;
        }, this.timeout)
    };

    request = async () => {
        console.log(this.countRequests);
        if (this.countRequests > this.limit) {
            this.updateCountRequests();
            console.log('false');
            return Promise.reject();
        }

        return await api.post(this.url)
            .then(() => {
                clearTimeout(this.timer);
                this.countRequests = 0;
                console.log('true');
                return Promise.resolve();
            })
            .catch(() => {
                this.countRequests++;
                console.log('false');
                if (this.countRequests > this.limit) {
                    this.updateCountRequests();
                }
                return Promise.reject();
            })
    };
}

exports.CircuitBreaker = CircuitBreaker;
