const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['todo', 'process', 'done'],
        default: 'todo',
    }
}, {
    timestamps: true,
});

const Status = mongoose.model('Status', statusSchema);
module.exports = Status;