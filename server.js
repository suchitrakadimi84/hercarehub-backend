const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL,        // e.g. https://hercarehub.com
].filter(Boolean);

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files for local image uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/settings', require('./routes/settings'));

// Health check
app.get('/api/health', (req, res) => {
    const { isCloudinaryConfigured } = require('./utils/cloudinary');
    res.json({
        status: 'ok',
        message: 'HerCare Hub API is running',
        storage: isCloudinaryConfigured() ? 'Cloudinary (Cloud)' : 'Local Disk (Warning: Ephemeral Storage)',
        cloudinary: isCloudinaryConfigured()
    });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('✅ MongoDB connected');

        // Seed admin user if not exists
        await require('./utils/seedAdmin')();
    })
    .catch(err => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 HerCare Hub server running on port ${PORT}`);
});
