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

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'HerCare Hub API is running' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('✅ MongoDB connected');

        // --- TEMPORARY MIGRATION: Merge Jewellery & Remove Ethnic ---
        try {
            const Category = require('./models/Category');
            const Product = require('./models/Product');

            let jewelleryCat = await Category.findOne({ slug: 'jewellery' });
            if (!jewelleryCat) {
                jewelleryCat = await Category.create({
                    name: 'Jewellery',
                    slug: 'jewellery',
                    description: 'Stunning jewellery sets',
                    order: 2
                });
                console.log('✅ Created Jewellery category');
            }

            const oldCats = await Category.find({ slug: { $in: ['bridal-jewellery', 'daily-wear-jewellery'] } });
            if (oldCats.length > 0) {
                const oldCatIds = oldCats.map(c => c._id);

                // Update products
                await Product.updateMany(
                    { category: { $in: oldCatIds } },
                    { $set: { category: jewelleryCat._id, categoryName: 'Jewellery' } }
                );

                // Delete old categories
                await Category.deleteMany({ _id: { $in: oldCatIds } });
                console.log('✅ Migrated products and deleted old Bridal/Daily Wear categories');
            }

            // Remove Ethnic Sets
            const ethnicCat = await Category.findOne({ slug: 'ethnic-sets' });
            if (ethnicCat) {
                await Product.deleteMany({ category: ethnicCat._id });
                await Category.deleteOne({ _id: ethnicCat._id });
                console.log('✅ Removed Ethnic Sets category and its products');
            }

            // Ensure Footwear exists
            let footwearCat = await Category.findOne({ slug: 'footwear' });
            if (!footwearCat) {
                await Category.create({
                    name: 'Footwear',
                    slug: 'footwear',
                    description: 'Stylish ladies and girls footwear',
                    order: 4
                });
                console.log('✅ Created Footwear category');
            }

            // Ensure Fashion exists
            let fashionCat = await Category.findOne({ slug: 'fashion' });
            if (!fashionCat) {
                await Category.create({
                    name: 'Fashion',
                    slug: 'fashion',
                    description: 'Trendy dresses and fashion wear for women',
                    order: 3
                });
                console.log('✅ Created Fashion category');
            }

        } catch (err) {
            console.error('Migration error:', err);
        }
        // -------------------------------------------------

        // Seed admin user if not exists
        await require('./utils/seedAdmin')();
        // Seed sample products if none
        await require('./utils/seedProducts')();
    })
    .catch(err => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 HerCare Hub server running on port ${PORT}`);
});
