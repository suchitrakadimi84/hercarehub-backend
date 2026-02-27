const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const { upload, getFileUrl, deleteFromCloudinary } = require('../utils/cloudinary');

// GET /api/products - Public
router.get('/', async (req, res) => {
    try {
        const { category, featured, trending, search, minPrice, maxPrice, sort, page = 1, limit = 20 } = req.query;
        const query = {};

        if (category) query.categoryName = { $regex: category, $options: 'i' };
        if (featured === 'true') query.isFeatured = true;
        if (trending === 'true') query.isTrending = true;
        if (search) query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { tags: { $in: [new RegExp(search, 'i')] } }
        ];
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        let sortOption = { order: 1, createdAt: -1 };
        if (sort === 'price_asc') sortOption = { price: 1 };
        if (sort === 'price_desc') sortOption = { price: -1 };
        if (sort === 'newest') sortOption = { createdAt: -1 };

        const skip = (Number(page) - 1) * Number(limit);
        const [total, products] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
                .populate('category', 'name slug')
                .sort(sortOption)
                .skip(skip)
                .limit(Number(limit))
                .lean()
        ]);

        res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/products/:id - Public
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name slug')
            .lean();
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/products - Admin only
router.post('/', auth, upload.array('images', 5), async (req, res) => {
    try {
        const {
            name, description, price, originalPrice,
            categoryId, categoryName, meeshoLink,
            tags, isFeatured, isTrending, badge, rating, order
        } = req.body;

        // Resolve image URLs — Cloudinary returns full HTTPS URLs; local returns /uploads/... paths
        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map(f => getFileUrl(f));
        } else if (req.body.images) {
            images = typeof req.body.images === 'string' ? JSON.parse(req.body.images) : req.body.images;
        }

        const product = new Product({
            name, description,
            price: Number(price),
            originalPrice: Number(originalPrice) || 0,
            category: categoryId,
            categoryName,
            images,
            meeshoLink,
            tags: tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : [],
            isFeatured: isFeatured === 'true' || isFeatured === true,
            isTrending: isTrending === 'true' || isTrending === true,
            badge: badge || '',
            rating: Number(rating) || 4.5,
            order: Number(order) || 0
        });

        await product.save();
        res.status(201).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/products/:id - Admin only
router.put('/:id', auth, upload.array('images', 5), async (req, res) => {
    try {
        const {
            name, description, price, originalPrice,
            categoryId, categoryName, meeshoLink,
            tags, isFeatured, isTrending, inStock, badge, rating, order
        } = req.body;

        const updateData = { name, description, meeshoLink, badge };

        if (price !== undefined) updateData.price = Number(price);
        if (originalPrice !== undefined) updateData.originalPrice = Number(originalPrice);
        if (categoryId) updateData.category = categoryId;
        if (categoryName) updateData.categoryName = categoryName;
        if (tags) updateData.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
        if (isFeatured !== undefined) updateData.isFeatured = isFeatured === 'true' || isFeatured === true;
        if (isTrending !== undefined) updateData.isTrending = isTrending === 'true' || isTrending === true;
        if (inStock !== undefined) updateData.inStock = inStock === 'true' || inStock === true;
        if (rating !== undefined) updateData.rating = Number(rating);
        if (order !== undefined) updateData.order = Number(order);

        // Image update: only replace images if a new file was uploaded or an explicit URL list was sent
        if (req.files && req.files.length > 0) {
            // Delete old Cloudinary images before replacing
            const existing = await Product.findById(req.params.id).select('images').lean();
            if (existing?.images) {
                await Promise.all(existing.images.map(url => deleteFromCloudinary(url)));
            }
            updateData.images = req.files.map(f => getFileUrl(f));
        } else if (req.body.images) {
            const parsed = typeof req.body.images === 'string' ? JSON.parse(req.body.images) : req.body.images;
            if (Array.isArray(parsed) && parsed.length > 0) {
                updateData.images = parsed;
            }
        }
        // No new upload and no body.images → existing images preserved as-is

        const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/products/admin/reorder - Admin only
router.put('/admin/reorder', auth, async (req, res) => {
    try {
        const { items } = req.body;
        await Promise.all(items.map(item => Product.findByIdAndUpdate(item.id, { order: item.order })));
        res.json({ message: 'Reordered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/products/:id - Admin only
router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Also delete images from Cloudinary to free storage
        if (product.images && product.images.length > 0) {
            await Promise.all(product.images.map(url => deleteFromCloudinary(url)));
        }

        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
