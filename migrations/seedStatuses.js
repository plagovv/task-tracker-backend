const mongoose = require('mongoose');
const Status = require('../models/Status');
require('dotenv').config();

// Устанавливаем одинаковые идентификаторы для статусов
const statuses = [
    { _id: new mongoose.Types.ObjectId('620b5f66b5e5c7f5f2bc84b0'), name: 'К выполнению' },
    { _id: new mongoose.Types.ObjectId('620b5f66b5e5c7f5f2bc84b1'), name: 'В работе' },
    { _id: new mongoose.Types.ObjectId('620b5f66b5e5c7f5f2bc84b2'), name: 'Готово' },
];

async function seedStatuses() {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connected');

        // Очистка коллекции статусов перед добавлением (опционально)
        await Status.deleteMany({});

        // Добавление статусов
        await Status.insertMany(statuses);
        console.log('Statuses were added successfully');

        // Закрытие подключения
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding statuses:', error);
    }
}

seedStatuses();