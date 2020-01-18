const request = require('supertest');
const app = require('../server/app');

describe('main-app', () => {
    it('should return main page', async () => {
        const res = await request(app)
            .get('/');

        expect(res.statusCode).toEqual(200);
    });

    it('should return not found', async () => {
        const res = await request(app)
            .get('/sadsmaldmlasmkldamkdsmad/sdasda');

        expect(res.statusCode).toEqual(404);
    });
});


describe('api users', () => {
    it('should create user', async () => {
        const res = await request(app)
            .post('/api/user')
            .send(JSON.stringify({
                name: 'test',
                age: 18,
                mail: 'test@test.test',
                password: 'test'
            }));
        expect(res.status).toEqual(201);
    });

    it('should return all users', async () => {
        const res = await request(app)
            .get('/api/users');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.length).toEqual(1);
    });

    it('should return user by id', async () => {
        const res = await request(app)
            .get('/api/user/1');

        expect(res.statusCode).toEqual(200);
        expect(res.body.data.id).toEqual(1);
    });

    it('should del user by id', async () => {
        const res = await request(app)
            .get('/api/user/1');

        expect(res.statusCode).toEqual(200);
    });

    afterAll(async done => {
        done();
        setTimeout(() => process.exit(), 1000);
    });
});
