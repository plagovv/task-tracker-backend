const express = require('express');
const Status = require('../models/Status');
const router = express.Router();

// Получение всех статусов
router.get('/', async (req, res) => {
    try {
        const statuses = await Status.find();
        res.json(statuses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching statuses' });
    }
});

// Создание статуса
router.post('/', async (req, res) => {
    const { name } = req.body;

    try {
        const status = new Status({ name });
        await status.save();
        res.status(201).json(status);
    } catch (error) {
        res.status(400).json({ message: 'Error creating status' });
    }
});

module.exports = router;