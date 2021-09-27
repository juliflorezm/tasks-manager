const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    descritpion: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    }
}, { //seting timestamps createdAt & updatedAt
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema); 

module.exports = Task;