const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const { userOne, userOneId, userTwo, taskOne, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

test('should create taske for user', async () => {
    const response = await request(app)
                            .post('/tasks')
                            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                            .send({
                                "descritpion": "Node task"
                            })
                            .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull();
    expect(task.completed).toEqual(false);
})

test('should get task for use one', async () => {
    const response = await request(app)
                                .get('/tasks')
                                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                                .send()
                                .expect(200);                        
    expect(response.body.length).toEqual(2);
})

test('second user should not delete first task', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404);

    const task = Task.findById(taskOne._id);
    expect(task).not.toBeNull()
})

//here othe ideas to test application
//
// Task Test Ideas
//
// Should not create task with invalid description/completed
// Should not update task with invalid description/completed
// Should delete user task
// Should not delete task if unauthenticated
// Should not update other users task
// Should fetch user task by id
// Should not fetch user task by id if unauthenticated
// Should not fetch other users task by id
// Should fetch only completed tasks
// Should fetch only incomplete tasks
// Should sort tasks by description/completed/createdAt/updatedAt
// Should fetch page of tasks