const request = require('supertest');
const app = require('../server/app');

describe('api users', () => {
    it('should create new user', async () => {
        await request(app)
            .post('/users/create')
            .send({
                name: 'test',
                mail: 'test@test.test',
                password: 'test'
            })
            .expect(201)
    });

    it('should get test user', async () => {
        await request(app)
            .get('/users/user/test')
            .expect(200)
    });

    it('should get 500', async () => {
        await request(app)
            .get('/users/user/ksdasasda')
            .expect(500)
    });

    it('should return all users', async () => {
        await request(app)
            .get('/users/all')
            .expect(200)
    });

    afterAll(async done => {
        done();
        setTimeout(() => process.exit(), 1000);
    });
});
