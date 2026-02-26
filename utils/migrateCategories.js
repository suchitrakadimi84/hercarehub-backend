require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hercareHub');
        console.log('Connected to DB');

        // Create or find Jewellery category
        let jewelleryCat = await Category.findOne({ slug: 'jewellery' });
        if (!jewelleryCat) {
            jewelleryCat = await Category.create({
                name: 'Jewellery',
                slug: 'jewellery',
                description: 'Elegant jewellery sets and daily wear',
                order: 2
            });
            console.log('Created new Jewellery category');
        }

        // Find old categories
        const oldCats = await Category.find({
            slug: { $in: ['bridal-jewellery', 'daily-wear-jewellery'] }
        });
        const oldCatIds = oldCats.map(c => c._id);

        if (oldCatIds.length > 0) {
            // Update products pointing to old categories
            const result = await Product.updateMany(
                { category: { $in: oldCatIds } },
                {
                    $set: {
                        category: jewelleryCat._id,
                        categoryName: 'Jewellery'
                    }
                }
            );
            console.log(`Updated ${result.modifiedCount} products to use new Jewellery category`);

            // Optionally, delete old categories
            await Category.deleteMany({ _id: { $in: oldCatIds } });
            console.log('Deleted old Bridal and Daily Wear categories');
        } else {
            console.log('No old categories found to migrate.');
        }

        console.log('Migration complete');
        process.exit(0);
    } catch (err) {
        console.error('Migration error:', err);
        process.exit(1);
    }
}

migrate();
