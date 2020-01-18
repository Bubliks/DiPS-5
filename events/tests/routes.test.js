const request = require('supertest');
const app = require('../server/app');

describe('api tasks', () => {
    it('should create new user', async () => {
        await request(app)
            .post('/events/create')
            .send({
                title: 'test-title',
                description: 'test-description',
                userId: 1,
                date: '2020-01-11T01:16:37.519Z',
                startTime: '2020-01-11T01:16:37.519Z',
                endTime: '2020-01-11T01:16:37.519Z'
            })
            .expect(201)
    });

    it('should get tasks for test user', async () => {
        await request(app)
            .get('/events/all/user/1')
            .expect(200)
    });

    it('should delete by id', async () => {
        await request(app)
            .post('/events/delete/event/1')
            .expect(200)
    });

    afterAll(async done => {
        done();
        setTimeout(() => process.exit(), 1000);
    });
});
