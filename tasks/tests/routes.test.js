const request = require('supertest');
const app = require('../server/app');

describe('api tasks', () => {
    it('should create new task', async () => {
        await request(app)
            .post('/tasks/create')
            .send({
                title: 'test-title',
                description: 'test-description',
                userId: 1
            })
            .expect(201)
    });

    it('should get tasks for test user', async () => {
        await request(app)
            .get('/tasks/all/user/1')
            .expect(200)
    });

    it('should delete by id', async () => {
        await request(app)
            .post('/tasks/delete/task/1')
            .expect(200)
    });

    afterAll(async done => {
        done();
        setTimeout(() => process.exit(), 1000);
    });
});
