const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router(); 

router.post('/tasks', auth, async (req, res) => {
    //const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        userId: req.user._id
    })
    try {
        const saved = await task.save();
        res.status(201).send(saved)
    } catch(e) {
        res.status(400).send(e)
    }
})

// filterign /tasks?completed=
// pagination limit skip /tasks?limit=10&skip=0
// sorting /tasks?sortBy=createdAt_desc
router.get('/tasks', auth, async (req, res) => {
    const match = {};
    const sort = {};

    if(req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    if(req.query.sortBy) {
        const [field, value] = req.query.sortBy.split('_');
        sort[field] = value === 'desc' ? -1 : 1;
    }

    try {
        // const tasks = await Task.find({ userId: req.user._id});
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip:  parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        
        // const task = await Task.findById(id);
        const task = await Task.findOne({ _id, userId: req.user._id})
        if(!task) {
            return res.status(404).send({
                status: 404,
                error: 'Task not found',
                message: 'Not found'
            })
        }
        res.send(task);
    } catch(e) {
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdate = ['descritpion', 'completed'];
    const isValid = updates.every(field => allowUpdate.includes(field));

    if(!isValid) {
        return res.status(400).send({ error: 'Field to update is invalid' });
    }

    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        // const task = await Task.findById(req.params.id);
        const task = await Task.findOne({ _id: req.params.id, userId: req.user._id })
        
        if(!task) {
            return res.status(404).send({
                status: 404,
                error: 'Task not found',
                message: 'not found'
            })
        }
        updates.forEach(update => task[update] = req.body[update]);
        await task.save();

        res.send(task);
    } catch(e) {
        res.status(400).send(e);
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        // const deleted = await Task.findByIdAndDelete(req.params.id);
        const deleted = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
        if(!deleted) {
            return res.status(404).send({
                error: 'Task not found',
                message: 'Not found',
                status: 404
            })
        }
        res.send(deleted);
    } catch(e) {
        res.status(500).send(e);
    }
})

module.exports = router;