const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT and check if user is admin
const authenticateAdmin = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

// POST: Add a new game (Admin only)
router.post('/games', authenticateAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user || !user.isAdmin) return res.status(403).json({ error: 'Access denied' });

        const { name, link, type, image, category } = req.body;
        const game = new Game({ name, link, type, image, category });
        await game.save();

        res.status(201).json(game);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;