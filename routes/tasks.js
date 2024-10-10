const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const router = express.Router();

// Создание задачи
router.post('/', auth, async (req, res) => {
    const { title, description, status, priority } = req.body;

    try {
        const task = new Task({ title, description, status, priority, user: req.userId });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: 'Error creating task' });
    }
});

// Получение задач для текущего пользователя
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.userId }).populate('status'); // Популяция для отображения статуса
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
});

// Обновление задачи
router.put('/:id', auth, async (req, res) => {
    const { title, description, status, priority } = req.body;

    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { title, description, status, priority },
            { new: true }
        ).populate('status'); // Популяция для отображения статуса
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: 'Error updating task' });
    }
});

// Удаление задачи
router.delete('/:id', auth, async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task' });
    }
});

module.exports = router;