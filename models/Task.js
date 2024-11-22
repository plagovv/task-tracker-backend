const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Status',
        required: true,
        default: "620b5f66b5e5c7f5f2bc84b0"
    },
    collection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection'
    },
    priority: {
        type: Number,
        min: 1,
        max: 3,
        default: 1, // 1 - низкий, 2 - средний, 3 - высокий
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;