const request = require('supertest');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app');
const User = require('../src/models/user');
const { userOne, userOneId, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

test('should singup new user', async () => {
    const response = await request(app).post('/users').send({
        name: "Juliana",
        email: "julianamaria304@gmail.com",
        password: "julianamaria!"
    }).expect(201)

    //assert that database has changed correctly
    const user = await User.findById(response.body.saved._id)
    expect(user).not.toBeNull()

    //assertions about the responses or objects
    expect(response.body).toMatchObject({
        token: user.tokens[0]['token'],
        saved: {
            name: 'Juliana',
            email: 'julianamaria304@gmail.com',
        }       
    })
    expect(user.password).not.toBe('julianamaria!')
})

test('Sould login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    //assert that token is added to tokens on database
    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Sould login non existent user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: "julianamaria!"
    }).expect(400)
})

test('should get profile for user', async () => {
    await request(app)
            .get('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0]['token']}`)
            .send()
            .expect(200)
})

test('should not get profile for unauthenticate user', async () => {
    await request(app)
            .get('/users/me')
            // .set('Authorization', `Bearer ${jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)}`)
            .send()
            .expect(401)
})

test('should delete account for user', async () => {
    await request(app)
            .delete('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0]['token']}`)
            .send()
            .expect(200);
    
    const user = await User.findById(userOneId);
    expect(user).toBeNull()
})

test('should not delete account of unauthenticate user', async () => {
    await request(app)
            .delete('/users/me')
            .send()
            .expect(401)
})

test('should upload avatar image', async () => {
    await request(app)
            .post('/users/me/avatar')
            .set('Authorization', `Bearer ${userOne.tokens[0]['token']}`)
            .attach('avatar', 'tests/fixtures/profile-pic.jpg')
            .expect(200)

    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('should update valid user fields', async () => {
    const response = await request(app)
                                .patch('/users/me')
                                .set('Authorization', `Bearer ${userOne.tokens[0]['token']}`)
                                .send({
                                    name: 'Juliana María',
                                })
                                .expect(200);
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Juliana María');
})

test('should not update invalid user fields', async () => {
    await request(app)
                .patch('/users/me')
                .set('Authorization', `Bearer ${userOne.tokens[0]['token']}`)
                .send({
                    location: 'Medellín'
                })
                .expect(400);

})

//here othe ideas to test application
//
// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated