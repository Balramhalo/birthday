const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userCount = await User.countDocuments();
    const newUser  = new User({ username, password: hashedPassword, uniqueId: userCount + 1 });
    await newUser .save();
    res.status(201).json({ message: 'User  registered', uniqueId: newUser .uniqueId });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
    res.json({ token, uniqueId: user.uniqueId });
});

module.exports = router;