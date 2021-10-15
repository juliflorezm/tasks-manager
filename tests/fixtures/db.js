const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'Juliana',
    email:'julianaflorez@gmail.com',
    password: '1234567890!!',
    tokens: [
        {
            token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
        }
    ]
}

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: 'Sara',
    email:'sara@gmail.com',
    password: '3243454!!',
    tokens: [
        {
            token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
        }
    ]
}

const taskOneId = new mongoose.Types.ObjectId();
const taskOne = {
    _id: taskOneId,
    descritpion: 'Redis task',
    completed: false,
    userId: userOne._id
}

const taskTwoId = new mongoose.Types.ObjectId();
const taskTwo = {
    _id: taskTwoId,
    descritpion: 'Python task',
    completed: true,
    userId: userOne._id
}

const taskThreeId = new mongoose.Types.ObjectId();
const taskThree = {
    _id: taskThreeId,
    descritpion: 'Mongo task',
    completed: true,
    userId: userTwo._id
}

const setupDatabase = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
}

module.exports = {
    userOneId,
    userOne,
    userTwo,
    taskOne,
    setupDatabase
}