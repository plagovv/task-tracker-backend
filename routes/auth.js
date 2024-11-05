const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Регистрация пользователя
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error registering user' });
    }
});

// Аутентификация пользователя с выданием access и refresh токенов
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Генерация access токена
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Генерация refresh токена
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

    // Сохраняем refresh токен в базе данных (если это необходимо, в противном случае можете пропустить этот шаг)
    user.refreshToken = refreshToken; // Убедитесь, что вы добавили поле refreshToken в модель пользователя
    await user.save();

    res.json({ accessToken, refreshToken });
});

// Получение данных текущего пользователя
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password'); // Убираем пароль из ответа
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user data' });
    }
});

// Обновление access токена с использованием refresh токена
router.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token required' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

        // Проверка, существует ли пользователь с данным id и его refreshToken
        const user = await User.findOne({ _id: decoded.id })

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        // Генерация нового access токена
        const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Генерация refresh токена
        const newRefreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

        // Сохраняем refresh токен в базе данных (если это необходимо, в противном случае можете пропустить этот шаг)
        user.refreshToken = newRefreshToken; // Убедитесь, что вы добавили поле refreshToken в модель пользователя
        await user.save();

        res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        return res.status(403).json({ message: 'Invalid refresh token' });
    }
});

module.exports = router;