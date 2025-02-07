const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// Middleware to verify JWT
const authenticate = (req, res, next) => {
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
// Upgrade subscription to paid
router.post('/upgrade-subscription', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (user.subscriptionType === 'paid') {
            return res.status(400).json({ error: 'User already has a paid subscription' });
        }

        user.subscriptionType = 'paid';
        await user.save();

        res.json({ message: 'Subscription upgraded to paid successfully', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) throw new Error('User not found');

        const isMatch = await user.comparePassword(password);
        if (!isMatch) throw new Error('Invalid credentials');

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, username: user.username, subscriptionType: user.subscriptionType, isAdmin: user.isAdmin } });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;