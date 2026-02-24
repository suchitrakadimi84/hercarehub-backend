const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const auth = require('../middleware/auth');

// GET /api/analytics - Admin only
router.get('/', auth, async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalCategories = await Category.countDocuments();
        const featuredCount = await Product.countDocuments({ isFeatured: true });
        const trendingCount = await Product.countDocuments({ isTrending: true });
        const outOfStock = await Product.countDocuments({ inStock: false });

        const byCategory = await Product.aggregate([
            { $group: { _id: '$categoryName', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.json({ totalProducts, totalCategories, featuredCount, trendingCount, outOfStock, byCategory });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
