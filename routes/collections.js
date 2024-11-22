const express = require('express');
const Collection = require('../models/Collection');
const auth = require("../middleware/auth");
const router = express.Router();

async function checkPermissions(_id, userId) {
    const collection = await Collection.findOne({_id, user: userId})
    if (!collection) {
        throw new Error("permission_err");
    }
}

// Получение всех коллекций пользователя
router.get('/', auth, async (req, res) => {
    try {
        const collections = await Collection.find({user: req.userId});
        res.json(collections);
    } catch (error) {
        res.status(500).json({message: 'Error fetching collections'});
    }
});

// Создание коллекции
router.post('/', auth, async (req, res) => {
    const {name, color, icon} = req.body;

    try {
        const collection = new Collection({
            name,
            color,
            icon,
            user: req.userId
        });
        await collection.save();
        res.status(201).json(collection);
    } catch (error) {
        res.status(400).json({message: 'Error creating collection'});
    }
});

// Обновление коллекции
router.put('/:id', auth, async (req, res) => {
    const {name, color, icon} = req.body;

    try {
        await checkPermissions(req.params.id, req.userId);
        const collection = await Collection.findByIdAndUpdate(
            req.params.id,
            {
                name,
                color,
                icon
            },
            {new: true}
        ); // Популяция для отображения статуса
        res.json(collection);
    } catch (error) {
        if (error.message === 'permission_err') res.status(404).json({message: 'Collection not found'});
        else res.status(400).json({message: 'Error updating collection'});
    }
});

// Удаление коллекции
router.delete('/:id', auth, async (req, res) => {
    try {
        await checkPermissions(req.params.id, req.userId);
        await Collection.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        if (error.message === 'permission_err') res.status(404).json({message: 'Collection not found'});
        else res.status(500).json({message: 'Error deleting collection'});
    }
});

module.exports = router;