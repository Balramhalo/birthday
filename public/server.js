const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const translatorRoutes = require('./routes/translator');
const { authenticate } = require('./middleware/authMiddleware');
require('dotenv').config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

app.use('/api/auth', authRoutes);
app.use('/api/translator', authenticate, translatorRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));